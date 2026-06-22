import React, { useState, useMemo, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { MapContainer } from './components/MapContainer';
import { DataGrid } from './components/DataGrid';
import { useAGSCalculator } from './hooks/useAGSCalculator';
import { SDoHFilters, ClinicCheckpoint, ComputedTract, Persona, CensusTract, Pharmacy } from './types';
import { Sun, Moon, LayoutDashboard } from 'lucide-react';
import { centroid } from '@turf/turf';

export const App: React.FC = () => {
  // Theme state: default is dark
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  
  // Persona state: default is Field Operator
  const [activePersona, setActivePersona] = useState<Persona>('Field Operator');
  
  // Search query
  const [searchQuery, setSearchQuery] = useState('');
  
  // Navigation tabs in sidebar
  const [activeTab, setActiveTab] = useState<'map' | 'ai-planner'>('map');

  // SDoH weights and thresholds state
  const [filters, setFilters] = useState<SDoHFilters>({
    povertyWeight: 0.4,
    noVehicleWeight: 0.4,
    elderlyWeight: 0.2,
    minPoverty: 0,
    minNoVehicle: 0,
    minElderly: 0
  });

  // Selected tract state
  const [selectedTractId, setSelectedTractId] = useState<string | null>(null);

  // Active simulated mobile clinics list
  const [mobileClinics, setMobileClinics] = useState<ClinicCheckpoint[]>([]);

  // Core datasets fetched from live APIs
  const [tracts, setTracts] = useState<CensusTract[]>([]);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // AI report states
  const [aiReport, setAiReport] = useState('');
  const [aiStreaming, setAiStreaming] = useState(false);

  // Hydrate Census demographics and pharmacy coordinates from live REST APIs
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [povertyRes, vehicleRes, seniorRes, pharmaciesRes] = await Promise.all([
          // 1. Geometries & Poverty demographics
          fetch(
            "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/ACS_Poverty_by_Age_Boundaries/FeatureServer/2/query?where=GEOID+LIKE+%2726163%25%27&outFields=GEOID,NAME,B17020_001E,B17020_002E&returnGeometry=true&f=geojson"
          ).then((r) => {
            if (!r.ok) throw new Error("Poverty API failure");
            return r.json();
          }),
          // 2. Vehicle ownership demographics
          fetch(
            "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/ACS_Vehicle_Availability_Boundaries/FeatureServer/2/query?where=GEOID+LIKE+%2726163%25%27&outFields=GEOID,B08201_001E,B08201_002E&returnGeometry=false&f=json"
          ).then((r) => {
            if (!r.ok) throw new Error("Vehicle API failure");
            return r.json();
          }),
          // 3. Elderly demographics
          fetch(
            "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/ACS_Highlights_Senior_Well_Being_Boundaries/FeatureServer/2/query?where=GEOID+LIKE+%2726163%25%27&outFields=GEOID,B01001_001E,B01001_calc_numGE65E&returnGeometry=false&f=json"
          ).then((r) => {
            if (!r.ok) throw new Error("Senior API failure");
            return r.json();
          }),
          // 4. Pharmacy Points (OSM Nominatim API)
          fetch(
            "https://nominatim.openstreetmap.org/search?q=pharmacy+in+Wayne+County+Michigan&format=geojson&limit=50"
          ).then((r) => {
            if (!r.ok) throw new Error("Nominatim Pharmacy API failure");
            return r.json();
          })
        ]);

        // Map and lookup datasets
        const vehicleLookup = new Map<string, any>();
        if (vehicleRes.features) {
          vehicleRes.features.forEach((feat: any) => {
            const attr = feat.attributes;
            vehicleLookup.set(attr.GEOID, attr);
          });
        }

        const seniorLookup = new Map<string, any>();
        if (seniorRes.features) {
          seniorRes.features.forEach((feat: any) => {
            const attr = feat.attributes;
            seniorLookup.set(attr.GEOID, attr);
          });
        }

        // Join Demographics and compile CensusTract objects
        const loadedTracts: CensusTract[] = [];
        if (povertyRes.features) {
          povertyRes.features.forEach((feat: any) => {
            const geoid = feat.properties.GEOID;
            const rawName = feat.properties.NAME || `Tract ${geoid.substring(5)}`;
            const name = rawName.includes("Tract") ? rawName : `Tract ${rawName}`;

            // Demographics mapping
            const povPop = feat.properties.B17020_002E || 0;
            const povTotal = feat.properties.B17020_001E || 0;
            const povertyRate = povTotal > 0 ? (povPop / povTotal) * 100 : 0;

            const vehicleData = vehicleLookup.get(geoid) || {};
            const vehNo = vehicleData.B08201_002E || 0;
            const vehTotal = vehicleData.B08201_001E || 0;
            const noVehicleRate = vehTotal > 0 ? (vehNo / vehTotal) * 100 : 0;

            const seniorData = seniorLookup.get(geoid) || {};
            const elderlyCount = seniorData.B01001_calc_numGE65E || 0;
            const population = seniorData.B01001_001E || 0;
            const elderlyRate = population > 0 ? (elderlyCount / population) * 100 : 0;

            // Generate centroid coordinates via Turf.js
            try {
              if (feat.geometry && population > 0) {
                const cent = centroid(feat);
                const [lng, lat] = cent.geometry.coordinates;

                loadedTracts.push({
                  id: geoid,
                  name,
                  population,
                  povertyRate: Math.round(povertyRate * 10) / 10,
                  noVehicleRate: Math.round(noVehicleRate * 10) / 10,
                  elderlyRate: Math.round(elderlyRate * 10) / 10,
                  centroid: [lng, lat],
                  geometry: feat.geometry
                });
              }
            } catch (err) {
              console.error("Centroid extraction failure for tract:", geoid, err);
            }
          });
        }

        // Map OSM pharmacies features
        const loadedPharmacies: Pharmacy[] = [];
        if (pharmaciesRes.features) {
          pharmaciesRes.features.forEach((feat: any, idx: number) => {
            const name = feat.properties.name || feat.properties.display_name.split(",")[0] || "Community Pharmacy";
            const address = feat.properties.display_name;
            const [lng, lat] = feat.geometry.coordinates;

            loadedPharmacies.push({
              id: feat.properties.place_id ? String(feat.properties.place_id) : `pharm-${idx}`,
              name,
              address,
              coordinates: [lng, lat]
            });
          });
        }

        setTracts(loadedTracts);
        setPharmacies(loadedPharmacies);
      } catch (error) {
        console.error("Geospatial demographic hydration failure:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Dynamic SDoH score calculator custom hook (Turf-integrated)
  const computedTracts = useAGSCalculator(tracts, pharmacies, mobileClinics, filters);

  // Selected tract profile memoized lookup
  const selectedTract = useMemo(() => {
    if (!selectedTractId) return null;
    return computedTracts.find(t => t.id === selectedTractId) || null;
  }, [selectedTractId, computedTracts]);

  // Handle adding mobile clinics via sidebar button or map-click
  const handleAddClinic = (lng: number, lat: number, label: string) => {
    const newClinic: ClinicCheckpoint = {
      id: `clinic-${Date.now()}`,
      label,
      coordinates: [lng, lat],
      isSimulated: true,
      createdAt: new Date().toISOString()
    };
    setMobileClinics(prev => [...prev, newClinic]);
  };

  const handleSimulateClinicForTract = (tract: ComputedTract) => {
    // Place simulated clinic directly at the tract's center coordinates
    handleAddClinic(tract.centroid[0], tract.centroid[1], `Site: ${tract.name.split(' (')[0]}`);
  };

  const handleRemoveClinic = (id: string) => {
    setMobileClinics(prev => prev.filter(c => c.id !== id));
  };

  // Compute live KPI metrics
  const kpiStats = useMemo(() => {
    const highRiskCount = computedTracts.filter(t => t.ags > 60 && t.isDesert).length;
    
    // Readmission penalty savings: Sum of penalties saved for all mitigated tracts
    const totalSavings = computedTracts
      .filter(t => t.isMitigated)
      .reduce((sum, t) => {
        const tractPenalty = Math.round(t.population * (t.povertyRate / 100) * 0.04 * 15000);
        return sum + tractPenalty;
      }, 0);

    return {
      highRiskCount,
      totalSavings,
      activeRoutes: mobileClinics.length
    };
  }, [computedTracts, mobileClinics]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    if (nextTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  // AI Deployment Plan generator (incorporating live state)
  const handleGenerateAIPlan = async () => {
    setAiStreaming(true);
    setAiReport('');

    // Fetch the top 3 highest-risk tracts currently unmitigated
    const topRiskyTracts = [...computedTracts]
      .filter(t => t.isDesert)
      .sort((a, b) => b.ags - a.ags)
      .slice(0, 3);

    let planContent = '';

    if (topRiskyTracts.length === 0) {
      planContent = `### AEGISMAP SYSTEM DIAGNOSTIC STATUS
All indexed census tracts are currently mitigated or fall under acceptable SDoH safety thresholds.

RECOMMENDATION:
1. Maintain existing mobile outreach clinic locations.
2. Review demographic weights in the Regional Director dashboard.
3. Conduct periodic local health registry checks to update poverty and age parameters.`;
      
      // Simulate typing
      for (let i = 0; i < planContent.length; i += 3) {
        await new Promise(resolve => setTimeout(resolve, 10));
        setAiReport(planContent.substring(0, i + 3));
      }
      setAiStreaming(false);
      return;
    }

    const tractDetailsText = topRiskyTracts.map((t, idx) => 
      `${idx + 1}. ${t.name}: Population=${t.population}, Poverty=${t.povertyRate}%, Vehicle-less=${t.noVehicleRate}%, Elderly=${t.elderlyRate}%, AGS Score=${t.ags}`
    ).join('\n');

    // Check for API key (use type cast to avoid compiler errors on import.meta)
    const apiKey = (import.meta as { env?: Record<string, string> }).env?.VITE_AI_API_KEY;

    if (apiKey) {
      try {
        const prompt = `Act as an expert Healthcare Enterprise Product Consultant and Spatial SDoH Optimization Planner.
Review the following top 3 medication desert census tracts currently lacking pharmacy access:
${tractDetailsText}

Provide a structured optimization report including:
1. Recommended distribution route for 1 mobile health clinic targeting these areas (with coordinates justification).
2. Estimated monthly operational cost budget calculation (staff, fuel, vehicle upkeep).
3. A highly tailored community outreach outreach text/script for health workers communicating in these locations.

Keep the tone clinical, professional, and actionable. Output in valid Markdown.`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
            }),
          }
        );

        if (!response.ok) {
          throw new Error('Gemini API call failed');
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
        
        // Stream the text via typewriter effect
        for (let i = 0; i < text.length; i += 5) {
          await new Promise(resolve => setTimeout(resolve, 15));
          setAiReport(text.substring(0, i + 5));
        }

      } catch (err) {
        console.error('Failed calling Gemini API. Falling back to local generation.', err);
      }
    }

    // If API call fails or no API key, execute a beautiful custom local model draft
    if (!planContent) {
      const firstTract = topRiskyTracts[0];
      const secondTract = topRiskyTracts[1] || firstTract;
      const thirdTract = topRiskyTracts[2] || secondTract;

      planContent = `# STRATEGIC DEPLOYMENT OPTIMIZATION PLAN
Generated on: ${new Date().toLocaleDateString()}
Target Region: Wayne County, Detroit, MI
High-Risk Focus Zones: 
* ${firstTract.name} (AGS: ${firstTract.ags})
* ${secondTract.name} (AGS: ${secondTract.ags})
* ${thirdTract.name} (AGS: ${thirdTract.ags})

---

### 1. MOBILE HEALTH CLINIC OPTIMIZED ROUTE
To maximize population coverage and mitigate the high SDoH penalties, we recommend deploying a single mobile unit on a split-weekly rotation:

* **Mondays & Wednesdays: Eastern Corridor Loop**
  * Primary Node: Centered near ${firstTract.name} (Centroid: ${firstTract.centroid[1].toFixed(4)}° N, ${firstTract.centroid[0].toFixed(4)}° E).
  * Justification: High density of elderly populations (${firstTract.elderlyRate}%) who lack vehicular travel options. Focus on chronic medication prescription distribution.
  
* **Tuesdays & Thursdays: Southern Border Corridor**
  * Primary Node: Centered near ${secondTract.name} (Centroid: ${secondTract.centroid[1].toFixed(4)}° N, ${secondTract.centroid[0].toFixed(4)}° E).
  * Justification: Extreme poverty rates (${secondTract.povertyRate}%) combined with severe vehicle deficits (${secondTract.noVehicleRate}%).
  
* **Fridays: Community Center Outreach**
  * Secondary Node: Centered near ${thirdTract.name} (Centroid: ${thirdTract.centroid[1].toFixed(4)}° N, ${thirdTract.centroid[0].toFixed(4)}° E).
  * Justification: General SDoH relief, vaccination clinics, and telemedicine signup support.

---

### 2. ESTIMATED MONTHLY OPERATIONAL BUDGET
Recommended budget configuration for a 1-vehicle mobile clinic program:

| Expense Category | Description | Monthly Cost (Est.) |
| :--- | :--- | :--- |
| **Clinical Staffing** | 1 Nurse Practitioner, 1 Community Health Specialist | $14,500 |
| **Fuel & Transit** | Clean diesel/electric hybrid fuel allocation | $1,200 |
| **Medical Inventory** | Baseline generic therapeutics, SDoH supplies, vaccines | $4,800 |
| **Admin & Telehealth** | Satellite connectivity, software licenses, EHR integration | $950 |
| **Maintenance** | Vehicle wear/tear, generator checks, calibration | $650 |
| **TOTAL BUDGET** | | **$22,100 / month** |

*Note: With an estimated readmissions cost save of ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(kpiStats.totalSavings || 150000)} simulated, this clinic achieves positive net health system savings within 30 days of deployment.*

---

### 3. HEALTH WORKER COMMUNITY OUTREACH SCRIPT
Use this tailored outreach template during on-site visits to encourage pharmacy delivery sign-ups:

> *"Hi there, my name is [Name] from Aegis Outreach. We are here today at the mobile clinic to make sure you have easy access to your daily medications. We know that getting to the nearest pharmacy is a long journey. 
> 
> Today, we can help you register for the free Home Medication Delivery Program. This program delivers your prescription refills right to your front door at no extra charge, so you never have to worry about finding a ride. Let's get you set up so you don't miss a dose."*`;

      // Typewriter streaming
      for (let i = 0; i < planContent.length; i += 6) {
        await new Promise(resolve => setTimeout(resolve, 8));
        setAiReport(planContent.substring(0, i + 6));
      }
    }

    setAiStreaming(false);
  };

  return (
    <div className={`flex flex-col h-screen ${theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Top Navigation Bar */}
      <header className="h-14 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 flex items-center justify-between select-none shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-teal-600 dark:text-teal-400 font-extrabold text-base tracking-wider">
            <LayoutDashboard className="w-5 h-5" />
            AEGISMAP CONSOLE
          </div>
          <span className="h-4 w-[1px] bg-slate-300 dark:bg-slate-700"></span>
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-950 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
            SDoH Optimization Platform v1.1
          </span>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-800 dark:hover:text-slate-100 transition-colors"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            id="theme-toggle-btn"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Panel split screen layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
        {/* Left Sidebar (1/3 Width) */}
        <Sidebar
          filters={filters}
          setFilters={setFilters}
          selectedTract={selectedTract}
          computedTracts={computedTracts}
          onSimulateClinic={handleSimulateClinicForTract}
          activePersona={activePersona}
          setActivePersona={setActivePersona}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          kpiStats={kpiStats}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          aiStreaming={aiStreaming}
          aiReport={aiReport}
          onGenerateAIPlan={handleGenerateAIPlan}
        />

        {/* Right Panel Layout (2/3 Width) - Map & Data Grid stack */}
        <main className="flex-1 flex flex-col overflow-hidden min-h-0 bg-slate-950">
          {/* Map display */}
          <div className="flex-1 min-h-0 relative">
            <MapContainer
              computedTracts={computedTracts}
              pharmacies={pharmacies}
              mobileClinics={mobileClinics}
              selectedTract={selectedTract}
              setSelectedTract={(t) => setSelectedTractId(t ? t.id : null)}
              onAddClinicCoordinate={handleAddClinic}
              onRemoveClinic={handleRemoveClinic}
              activePersona={activePersona}
              filters={filters}
              isLoading={isLoading}
            />
          </div>

          {/* Census Tract Demographic Data Grid */}
          <DataGrid
            computedTracts={computedTracts}
            selectedTract={selectedTract}
            setSelectedTract={(t) => setSelectedTractId(t ? t.id : null)}
            searchQuery={searchQuery}
          />
        </main>
      </div>

    </div>
  );
};
