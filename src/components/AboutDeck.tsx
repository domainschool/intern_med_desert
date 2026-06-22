import React, { useState } from 'react';
import { 
  HelpCircle, 
  X, 
  BookOpen, 
  Layers, 
  Users, 
  DollarSign, 
  Award, 
  Terminal, 
  PlusCircle, 
  Copy, 
  Check,
  ArrowRight,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

interface AboutDeckProps {
  onClose: () => void;
}

type TabType = 
  | 'problem' 
  | 'knowledge' 
  | 'architecture' 
  | 'stakeholders' 
  | 'valuations' 
  | 'strategy' 
  | 'prompts' 
  | 'enhancements';

export const AboutDeck: React.FC<AboutDeckProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('problem');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const menuItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'problem', label: '1. Problem & Core Concept', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'knowledge', label: '2. Required Domain Knowledge', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'architecture', label: '3. Data Pipeline & Joins', icon: <Layers className="w-4 h-4" /> },
    { id: 'stakeholders', label: '4. Stakeholders & Personas', icon: <Users className="w-4 h-4" /> },
    { id: 'valuations', label: '5. Commercial Valuations', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'strategy', label: '6. College & Resume Strategy', icon: <Award className="w-4 h-4" /> },
    { id: 'prompts', label: '7. AI Vibe-Coding Prompts', icon: <Terminal className="w-4 h-4" /> },
    { id: 'enhancements', label: '8. Further Enhancements', icon: <PlusCircle className="w-4 h-4" /> },
  ];

  const promptRunways = [
    {
      id: 'p1_1',
      title: 'Prompt 1.1: Project Scaffolding & Theme Setup',
      tier: 'Tier 1: MVP',
      text: `Act as an expert Frontend Engineer. Build the initial layout and theme for a "Medication Desert Locator" application using React, Tailwind CSS, and Lucide React icons. 

Create a split-screen dashboard design layout:
1. Left Panel (1/3 width): A sidebar containing a product header ("AegisMap: SDoH Optimization"), KPI summary cards for "High-Risk Tracts Identified", "Estimated Preventable Readmissions Cost Saved", and "Active Mobile Routes", followed by an interactive filter panel (sliders for Poverty Rate, No Vehicle Availability, and Age 65+).
2. Right Panel (2/3 width): A clean mockup placeholder container for our map interface. For now, render an SVG or styled CSS grid pretending to be a stylized tactical map with a dark, modern dashboard aesthetic.

Implement a unified, highly professional Dark Mode theme using Slate/Zinc neutrals as the background, Emerald/Teal accents for active infrastructure elements, and Amber/Rose for high-accessibility-gap indicators. Ensure all components are modular, responsive, and render immediately with zero-config required. Use local state for the filter sliders.`
    },
    {
      id: 'p1_2',
      title: 'Prompt 1.2: Mock Spatial GeoJSON & Pharmacy Arrays',
      tier: 'Tier 1: MVP',
      text: `We need to wire up the dashboard with comprehensive local mock data arrays to test our visual layers without hitting external networks. Append a structured data file or internal state array containing:
1. An array of 10 'Census Tracts' objects. Each tract must have: ID, Name (e.g., "Tract 402.01"), Population, Poverty Rate (%), No-Vehicle Rate (%), Elderly Rate (%), and a center coordinate offset (X, Y percentage mapping for our visual container).
2. An array of 4 'Existing Pharmacies' objects with names (e.g., "Community Care Pharmacy", "County Health Rx") and explicit layout coordinates.

Write a frontend calculation engine using React \`useMemo\` that processes these arrays. Calculate a localized Accessibility Gap Score (AGS) for each tract using the formula: AGS = (Poverty * 0.4) + (NoVehicle * 0.4) + (Elderly * 0.2). If a tract's coordinate is far from all pharmacy coordinates, multiply its score by an additional 'Distance Friction Penalty' factor of 1.5. Output the calculated tracts into a data grid table directly underneath our map container.`
    },
    {
      id: 'p1_3',
      title: 'Prompt 1.3: Interactive Visual Canvas & Tract Selection State',
      tier: 'Tier 1: MVP',
      text: `Replace the static map placeholder container on the right side with an interactive SVG/HTML5 absolute canvas container. 
1. Render the 10 mock Census Tracts as interactive HTML/SVG bounding blocks or circles placed dynamically based on their mock spatial coordinates.
2. Color-code each tract block based on its calculated Accessibility Gap Score (AGS) using a step-color gradient scale: Low Risk (<30) = Green, Medium Risk (30-60) = Orange, High Risk (>60) = Red.
3. Render the 4 existing pharmacies as distinct, bright glowing teal cross icons overlaid on top of the tracts.
4. Implement interactive hover states and an onClick handler on each tract block. Clicking a tract must populate a 'Selected Tract Detail Card' at the top of the sidebar, displaying its exact demographic breakdown, estimated uncompensated readmission risk penalty ($ value), and a prominent action button labeled "Simulate Resource Allocation".`
    },
    {
      id: 'p2_1',
      title: 'Prompt 2.1: Live Geospatial Leaflet Engine Integration',
      tier: 'Tier 2: MVP 2',
      text: `We are graduating from mock UI coordinates to real-world spatial physics. Integrate \`react-leaflet\` and \`leaflet\` into the map container panel. Set the initial map view to center over a known real-world vulnerable region (e.g., Detroit, Michigan or rural Appalachian county coordinates). 

Write an asynchronous \`useEffect\` data fetching routine that loads a live public GeoJSON file containing real census tracts (or use a public API endpoint) along with a mock fetch mimicking the HIFLD Pharmacy point locations dataset. Replace the SVG canvas layout with real Leaflet TileLayers and GeoJSON polygon vectors. Ensure the polygons are dynamically colored using an inline choropleth styling function keyed to your calculated SDoH accessibility gaps. Add a loading state skeleton animation spinner overlaying the map while the asynchronous data components settle.`
    },
    {
      id: 'p2_2',
      title: 'Prompt 2.2: True Routing Isochrones & Proximity Intersects',
      tier: 'Tier 2: MVP 2',
      text: `Upgrade the distance logic from straight-line approximations to true pedestrian walking/driving friction using spatial mathematics. Integrate \`turf\` (or native geographic bounding box calculation methods). 

Write an asynchronous network function that simulates calling a routing matrix or Isochrone API. For each point in our pharmacy layer, generate or load a 15-minute geographic travel boundary ring polygon. Write a client-side spatial intersection processing routine that evaluates whether the center point (centroid) of each real Census Tract polygon sits inside *any* pharmacy's 15-minute travel polygon. If a tract falls entirely outside all pharmacy travel boundaries, flag its metadata attribute \`is_desert: true\`. Update the frontend dashboard metrics cards to dynamically count and display the absolute number of residents living within these strict \`is_desert\` boundaries.`
    },
    {
      id: 'p2_3',
      title: 'Prompt 2.3: AI Deployment Architect (Gemini/OpenAI Integration)',
      tier: 'Tier 2: MVP 2',
      text: `Integrate an interactive, automated LLM diagnostic panel into the dashboard sidebar utilizing modern edge runtime handling. When a user clicks the "Generate Deployment Optimization Plan" button, gather the current state data of the top 3 highest-risk medication desert tracts (including their exact population, poverty levels, lack of vehicles, and calculated accessibility gap scores).

Construct a structured JSON payload prompt and securely dispatch it to an LLM provider endpoint using environment variables (\`process.env.VITE_AI_API_KEY\`). Prompt the model to act as an expert Healthcare Enterprise Product Consultant and output a structured operational response:
1. A recommended distribution route for 1 mobile health clinic.
2. An estimated monthly operational cost budget calculation.
3. A highly tailored outreach script for community health workers.

Stream or transition this text response cleanly inside a typewriter-style animation container block inside a new tab in the sidebar named "AI Resource Planner".`
    },
    {
      id: 'p3_1',
      title: 'Prompt 3.1: Supabase/PostgreSQL Data Pipeline & State Hydration',
      tier: 'Tier 3: Enterprise Scale',
      text: `Transition the application state from local runtime volatility to an enterprise-grade backend infrastructure layer using Supabase (PostgreSQL with PostGIS extensions logic). 

1. Write a complete SQL database schema initialization script to execute in Supabase. Create a \`census_tracts\` table, a \`pharmacies\` table, and a \`mobile_deployments\` tracking table. Ensure columns utilize optimal indexing rules for rapid retrieval.
2. Replace all local initial state variables with standard asynchronous async/await client calls to fetch live data directly from your Supabase tables.
3. Implement an interactive workflow feature where a user can click on the map to manually place a new "Proposed Mobile Health Clinic Checkpoint". Write a database write mutation that automatically saves this point coordinate, along with a timestamp and user ID metadata payload, into the \`mobile_deployments\` database table, maintaining instant optimistic UI state reactivity.`
    },
    {
      id: 'p3_2',
      title: 'Prompt 3.2: Enterprise Access Controls & Secure Route Guards',
      tier: 'Tier 3: Enterprise Scale',
      text: `Implement robust enterprise authorization architecture patterns to ensure compliance with strict health administrative standards. Configure a secure routing layout framework (such as React Router Dom or Next.js middleware guards). 

Create two distinct application workspace user profiles:
1. "Field Operator": Can only view accessibility heatmaps, see scheduled mobile clinic routes, and input deployment tracking updates.
2. "Regional Director": Has complete access to sensitive financial penalty tracking statistics, write access to allocate new community budgets, and administrative permission to modify weighting criteria sliders.

Wrap the primary analytics panels inside secure authentication checks. If an unauthenticated user attempts to access administrative components, redirect them to a polished enterprise login portal screen with error boundary alerts.`
    },
    {
      id: 'p3_3',
      title: 'Prompt 3.3: Production Analytics Dashboards, Recharts Integration & Dark Toggle',
      tier: 'Tier 3: Enterprise Scale',
      text: `Elevate the product to a enterprise-ready application by embedding a robust performance visualization framework and system-wide design consistency:
1. Integrate \`recharts\` inside the lower analytical dashboard interface. Render a dual-axis composite chart: a Bar Chart displaying the absolute number of high-risk elderly residents per tract, overlaid with a Line Chart plotting the corresponding calculated Accessibility Gap Score. 
2. Add a beautifully animated horizontal horizontal bar chart showing a financial projection breakdown of "Penalties Avoided vs. Cost of Mobile Clinic Deployment" across 6 months.
3. Implement a flawless system-wide Dark/Light theme toggle switcher utilizing Tailwind CSS configuration strategies (\`darkMode: 'class'\`). Ensure all components, borders, charts, maps, and sidebar text transitions perfectly between crisp high-contrast professional daytime layout standards and deep slate nighttime monitoring modes without visual clipping or state resets.`
    }
  ];

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-[9000] p-4 lg:p-10 animate-fade-in select-none">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-6xl h-[85vh] flex flex-col overflow-hidden shadow-2xl">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900 shrink-0">
          <div className="flex items-center gap-2.5 text-slate-100">
            <HelpCircle className="w-5 h-5 text-teal-400 animate-pulse" />
            <h2 className="text-sm font-bold uppercase tracking-wider">
              Aegis SDoH Learning Deck &amp; Systems Architecture
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Main Split Panels */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
          
          {/* Left Panel: Tabs Selector */}
          <div className="w-full md:w-80 bg-slate-950/40 border-b md:border-b-0 md:border-r border-slate-800 p-4 overflow-y-auto space-y-1.5 shrink-0">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2.5 mb-2">Learning Syllabus</p>
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all text-left ${
                  activeTab === item.id
                    ? 'bg-teal-500/10 text-teal-400 border-teal-500/30 shadow-md shadow-teal-500/5'
                    : 'bg-transparent text-slate-400 border-transparent hover:bg-slate-800/40 hover:text-slate-200'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>

          {/* Right Panel: Content Card */}
          <div className="flex-1 p-6 lg:p-8 overflow-y-auto bg-slate-900/30">
            
            {/* TAB 1: Problem & Concept */}
            {activeTab === 'problem' && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-teal-400">
                  <BookOpen className="w-5 h-5" />
                  <h3 className="text-base font-bold text-slate-100">The Business Problem: Preventing Medication Non-Adherence</h3>
                </div>
                
                <p className="text-xs leading-relaxed text-slate-300">
                  Non-profit medical networks, regional hospital outreach systems, and state health departments lose millions of dollars annually due to the inefficient allocation of mobile clinics, pop-up pharmacies, and vaccine drives.
                </p>

                {/* Problem Flow Map */}
                <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">The Problem Flow</p>
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-2 text-center text-xs">
                    <div className="w-full sm:w-1/3 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg font-bold">
                      Vulnerable Neighborhood
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-600 rotate-90 sm:rotate-0" />
                    <div className="w-full sm:w-1/3 p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg font-bold">
                      Prescription Non-Adherence
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-600 rotate-90 sm:rotate-0" />
                    <div className="w-full sm:w-1/3 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg font-bold">
                      Emergency Room Re-Admissions
                    </div>
                  </div>
                </div>

                <p className="text-xs leading-relaxed text-slate-300">
                  Under the <b>Affordable Care Act (ACA)</b>, hospitals face heavy financial penalties for high 30-day readmission rates. When vulnerable patients (elderly, low-income, non-drivers) live in isolated zones, they skip critical medications. This leads to preventable health crises that flood Emergency Departments, resulting in uncompensated emergency care costs.
                </p>
                
                <p className="text-xs leading-relaxed text-slate-300">
                  <b>The Solution</b>: By spatial-mapping these medication deserts, planners can accurately deploy mobile clinics, volunteer shuttles, or pharmacy home-delivery signups directly where accessibility gaps are highest.
                </p>
              </div>
            )}

            {/* TAB 2: Required Domain Knowledge */}
            {activeTab === 'knowledge' && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-teal-400">
                  <HelpCircle className="w-5 h-5" />
                  <h3 className="text-base font-bold text-slate-100">Required Domain Knowledge &amp; Concepts</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-950/40 border border-slate-800 p-4 rounded-xl space-y-2">
                    <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wide">Social Determinants of Health (SDoH)</h4>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Non-medical factors that influence health outcomes. In AegisMap, we prioritize <b>Poverty rates</b> (financial barriers), <b>No-Vehicle rates</b> (transportation barriers), and <b>Age 65+</b> (mobility and chronic disease barriers).
                    </p>
                  </div>

                  <div className="bg-slate-950/40 border border-slate-800 p-4 rounded-xl space-y-2">
                    <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wide">Medication Desert Thresholds</h4>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      A geographic tract is classified as a medication desert if its centroid sits further than <b>1.5 miles</b> from the nearest physical pharmacy, making daily medication collection walking/driving prohibitive.
                    </p>
                  </div>

                  <div className="bg-slate-950/40 border border-slate-800 p-4 rounded-xl space-y-2 md:col-span-2">
                    <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wide">Accessibility Gap Score (AGS) Mathematical Formula</h4>
                    <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
                      We calculate vulnerability by summing weighted SDoH rates. If a tract lacks nearby pharmacy access, a <b>1.5x Distance Friction Penalty</b> is multiplied:
                    </p>
                    <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg text-center font-mono text-[11px] text-teal-400">
                      AGS = (Poverty * Wp + NoVehicle * Wv + Elderly * We) * (IsDesert ? 1.5 : 1.0)
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Data Pipeline & Joins */}
            {activeTab === 'architecture' && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-teal-400">
                  <Layers className="w-5 h-5" />
                  <h3 className="text-base font-bold text-slate-100">Live GIS Data Pipeline &amp; Systems Architecture</h3>
                </div>

                <p className="text-xs leading-relaxed text-slate-300">
                  AegisMap functions as an enterprise-grade client-side WebGIS dashboard connecting directly to public rest endpoints:
                </p>

                {/* Architecture Flow */}
                <div className="bg-slate-950/60 border border-slate-800 p-4.5 rounded-xl space-y-4 text-xs">
                  <div className="border-l-2 border-teal-500 pl-3.5 space-y-1">
                    <h4 className="font-bold text-slate-200">1. Spatial Bounding Box Geocoding</h4>
                    <p className="text-[11px] text-slate-400">Nominatim API geocodes the 5-digit ZIP query and returns its geographic envelope.</p>
                  </div>

                  <div className="border-l-2 border-teal-500 pl-3.5 space-y-1">
                    <h4 className="font-bold text-slate-200">2. Esri FeatureServer Geometry Queries</h4>
                    <p className="text-[11px] text-slate-400">Poverty tract polygons and demographic indexes are queried dynamically using the geocoded bbox parameter.</p>
                  </div>

                  <div className="border-l-2 border-teal-500 pl-3.5 space-y-1">
                    <h4 className="font-bold text-slate-200">3. Chunked Demographics Queries</h4>
                    <p className="text-[11px] text-slate-400">GEOIDs are batched into groups of 100 to query the Vehicle and Senior demographic tables via <code className="bg-slate-900 px-1 py-0.5 rounded text-[10px] text-teal-400">GEOID IN (...)</code>, avoiding URL length bounds.</p>
                  </div>

                  <div className="border-l-2 border-teal-500 pl-3.5 space-y-1">
                    <h4 className="font-bold text-slate-200">4. Turf.js Client-Side Spatial Computation</h4>
                    <p className="text-[11px] text-slate-400">Calculates tract centroids using Turf's centroid algorithm, finds closest pharmacies using geodesic distance calculations, and checks if mobile clinic overlays mitigate the desert status.</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: Stakeholders & Personas */}
            {activeTab === 'stakeholders' && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-teal-400">
                  <Users className="w-5 h-5" />
                  <h3 className="text-base font-bold text-slate-100">Stakeholders &amp; User Personas</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-blue-500/20 bg-blue-500/5 rounded-xl p-4.5 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
                      <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wide">Field Operator</h4>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      <b>Role</b>: Dispatchers, outreach workers, community coordinators.
                    </p>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      <b>Access Level</b>: Read-Only. Can view SDoH risk heatmaps, inspect tract demographics, see pharmacy and mobile clinic locations, and follow active deployment plans.
                    </p>
                  </div>

                  <div className="border border-purple-500/20 bg-purple-500/5 rounded-xl p-4.5 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
                      <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wide">Regional Director</h4>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      <b>Role</b>: Healthcare executives, chief medical officers, county planners.
                    </p>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      <b>Access Level</b>: Full Admin. Can modify formula weighting parameters, review uncompensated care penalties, and drop simulated mobile clinics to immediately mitigate deserts and calculate ROI.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: Commercial Valuations */}
            {activeTab === 'valuations' && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-teal-400">
                  <DollarSign className="w-5 h-5" />
                  <h3 className="text-base font-bold text-slate-100">Commercial Valuations &amp; Disruptive Economics</h3>
                </div>

                {/* Value Disrupted Banner */}
                <div className="border border-amber-500/20 bg-amber-500/5 rounded-xl p-5 text-center space-y-2.5 shadow-lg shadow-amber-500/5 relative overflow-hidden">
                  {/* Subtle decorative background glow */}
                  <div className="absolute -inset-10 bg-gradient-to-r from-amber-500/0 via-amber-500/5 to-amber-500/0 blur-2xl pointer-events-none"></div>
                  
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    Value Disrupted
                  </span>
                  
                  <p className="text-[11px] text-slate-400 max-w-lg mx-auto leading-relaxed">
                    By leveraging deep Domain Knowledge in the <span className="text-slate-200 font-semibold underline decoration-amber-500/40">General SaaS</span> sector, you are disrupting a corporate value of:
                  </p>
                  
                  <h4 className="text-3xl font-extrabold tracking-tight text-amber-400 font-mono">
                    $571,950
                  </h4>
                </div>

                {/* Cost Comparison Cards Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Consulting Cost Card */}
                  <div className="border border-rose-500/20 bg-rose-500/5 rounded-xl p-5 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-rose-400 flex items-center gap-1.5 uppercase tracking-wide">
                          <ShieldAlert className="w-4 h-4" /> IT Consulting Agency Cost
                        </h4>
                        <span className="text-[9px] bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded font-bold border border-rose-500/20">
                          Premium Delivery Agency
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-relaxed">
                        Sourced using standard rates from Deloitte, TCS, Accenture, IBM, and Infosys. Assumes corporate middleware overheads, QA cycles, and service level support agreements.
                      </p>
                    </div>

                    {/* Consulting Metrics */}
                    <div className="grid grid-cols-3 gap-2 bg-slate-950/40 border border-slate-800 p-3 rounded-lg text-center">
                      <div>
                        <span className="text-[8px] text-slate-500 uppercase font-bold block">Total Budget</span>
                        <span className="text-xs font-extrabold text-rose-400 font-mono">$572,400</span>
                      </div>
                      <div>
                        <span className="text-[8px] text-slate-500 uppercase font-bold block">Effort Hours</span>
                        <span className="text-xs font-extrabold text-slate-200 font-mono">4,800h</span>
                      </div>
                      <div>
                        <span className="text-[8px] text-slate-500 uppercase font-bold block">Delivery Time</span>
                        <span className="text-xs font-extrabold text-slate-200 font-mono">24 wks</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[10px] pt-1 text-slate-500">
                      <span>Blended Hourly Billing Rate:</span>
                      <span className="font-mono text-slate-400">$119/hr</span>
                    </div>
                  </div>

                  {/* Vibe-Coded Cost Card */}
                  <div className="border border-emerald-500/20 bg-emerald-500/5 rounded-xl p-5 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wide">
                          <Sparkles className="w-4 h-4" /> Vibe-Coded MVP Cost
                        </h4>
                        <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-bold border border-emerald-500/20">
                          Domain School MVP
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-relaxed font-normal">
                        Assumes code built using AI-driven orchestration, modern serverless templates (Vercel/Supabase), and high-intensity agile build loops.
                      </p>
                    </div>

                    {/* Vibe-Coded Metrics */}
                    <div className="grid grid-cols-3 gap-2 bg-slate-950/40 border border-slate-800 p-3 rounded-lg text-center">
                      <div>
                        <span className="text-[8px] text-slate-500 uppercase font-bold block">Infrastructure</span>
                        <span className="text-xs font-extrabold text-emerald-400 font-mono">$450</span>
                      </div>
                      <div>
                        <span className="text-[8px] text-slate-500 uppercase font-bold block">Capital Saved</span>
                        <span className="text-xs font-extrabold text-teal-400 font-mono">$571,950</span>
                      </div>
                      <div>
                        <span className="text-[8px] text-slate-500 uppercase font-bold block">Build Phase</span>
                        <span className="text-xs font-extrabold text-slate-200 font-mono">5 wks</span>
                      </div>
                    </div>

                    <p className="text-[10px] leading-relaxed text-slate-450">
                      By leveraging vibe-coded frontends, robust serverless platforms like Vercel/Supabase, and advanced AI code generation, the Domain School framework streamlines development, eliminating corporate bureaucracy and extensive overhead. This approach delivers a fully functional MVP in just 5 weeks at a direct cost of around $450 for cloud services and APIs, saving over 99% of traditional consulting costs while proving value and disrupting hundreds of thousands of dollars of traditional spend.
                    </p>
                  </div>
                </div>

                {/* Role/Resource Cost Table */}
                <div className="space-y-2 pt-2 border-t border-slate-800/40">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">IT Consulting Resource Allocation Details</p>
                  <div className="bg-slate-950/60 border border-slate-800 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-950 border-b border-slate-850 text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                          <th className="py-2.5 px-4">Resource / Role</th>
                          <th className="py-2.5 px-4 text-center">Rate / HR</th>
                          <th className="py-2.5 px-4 text-center">Allocated Hours</th>
                          <th className="py-2.5 px-4 text-right">Subtotal</th>
                          <th className="py-2.5 px-4 hidden xl:table-cell">Delivery Focus</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50 text-[11px] text-slate-300">
                        <tr>
                          <td className="py-2.5 px-4 font-semibold text-slate-200">Delivery Manager / Scrum Master</td>
                          <td className="py-2.5 px-4 text-center font-mono">$130/hr</td>
                          <td className="py-2.5 px-4 text-center font-mono">480h</td>
                          <td className="py-2.5 px-4 text-right font-mono font-semibold text-amber-400">$62,400</td>
                          <td className="py-2.5 px-4 text-slate-400 hidden xl:table-cell">Oversees project delivery, manages scrum processes, facilitates stakeholder communication, and coordinates the offshore team for optimal execution.</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 font-semibold text-slate-200">Lead Systems Architect</td>
                          <td className="py-2.5 px-4 text-center font-mono">$150/hr</td>
                          <td className="py-2.5 px-4 text-center font-mono">480h</td>
                          <td className="py-2.5 px-4 text-right font-mono font-semibold text-amber-400">$72,000</td>
                          <td className="py-2.5 px-4 text-slate-400 hidden xl:table-cell">Designs the microservices architecture, ensures HIPAA compliance, defines the spatial database strategy, and architects the LLM orchestration layer.</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 font-semibold text-slate-200">Senior Full-Stack Developer (Backend Focus)</td>
                          <td className="py-2.5 px-4 text-center font-mono">$120/hr</td>
                          <td className="py-2.5 px-4 text-center font-mono">960h</td>
                          <td className="py-2.5 px-4 text-right font-mono font-semibold text-amber-400">$115,200</td>
                          <td className="py-2.5 px-4 text-slate-400 hidden xl:table-cell">Develops robust microservices, implements complex PostGIS queries, integrates external data APIs (HIFLD, ACS), and builds the LLM orchestration logic.</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 font-semibold text-slate-200">Senior Full-Stack Developer (Frontend Focus)</td>
                          <td className="py-2.5 px-4 text-center font-mono">$120/hr</td>
                          <td className="py-2.5 px-4 text-center font-mono">960h</td>
                          <td className="py-2.5 px-4 text-right font-mono font-semibold text-amber-400">$115,200</td>
                          <td className="py-2.5 px-4 text-slate-400 hidden xl:table-cell">Builds the React/TypeScript frontend, implements advanced Mapbox/Leaflet geospatial visualizations, and integrates Recharts for dynamic data display.</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 font-semibold text-slate-200">UI/UX Designer</td>
                          <td className="py-2.5 px-4 text-center font-mono">$100/hr</td>
                          <td className="py-2.5 px-4 text-center font-mono">240h</td>
                          <td className="py-2.5 px-4 text-right font-mono font-semibold text-amber-400">$24,000</td>
                          <td className="py-2.5 px-4 text-slate-400 hidden xl:table-cell">Creates wireframes, mockups, and prototypes for the geospatial interface and data visualizations, focusing on intuitive user experience and accessibility.</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 font-semibold text-slate-200">QA / Testing Engineer</td>
                          <td className="py-2.5 px-4 text-center font-mono">$100/hr</td>
                          <td className="py-2.5 px-4 text-center font-mono">840h</td>
                          <td className="py-2.5 px-4 text-right font-mono font-semibold text-amber-400">$84,000</td>
                          <td className="py-2.5 px-4 text-slate-400 hidden xl:table-cell">Develops comprehensive test plans, executes functional, integration, and performance tests, ensuring data accuracy, geospatial precision, and HIPAA compliance.</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 font-semibold text-slate-200">DevOps &amp; Cloud Engineer</td>
                          <td className="py-2.5 px-4 text-center font-mono">$125/hr</td>
                          <td className="py-2.5 px-4 text-center font-mono">480h</td>
                          <td className="py-2.5 px-4 text-right font-mono font-semibold text-amber-400">$60,000</td>
                          <td className="py-2.5 px-4 text-slate-400 hidden xl:table-cell">Sets up secure, highly available microservices infrastructure on cloud, configures CI/CD pipelines, and monitors system performance and security.</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 font-semibold text-slate-200">Business Analyst</td>
                          <td className="py-2.5 px-4 text-center font-mono">$110/hr</td>
                          <td className="py-2.5 px-4 text-center font-mono">360h</td>
                          <td className="py-2.5 px-4 text-right font-mono font-semibold text-amber-400">$39,600</td>
                          <td className="py-2.5 px-4 text-slate-400 hidden xl:table-cell">Gathers and refines requirements for SDoH metrics, resource allocation logic, RBAC, and ensures alignment with business objectives and regulatory needs.</td>
                        </tr>
                        <tr className="bg-slate-950 font-bold text-slate-100">
                          <td className="py-3 px-4">Project Estimation Total</td>
                          <td className="py-3 px-4 text-center font-mono">-</td>
                          <td className="py-3 px-4 text-center font-mono">4800h</td>
                          <td className="py-3 px-4 text-right font-mono text-emerald-400">$572,400</td>
                          <td className="py-3 px-4 text-slate-400 hidden xl:table-cell">Value disrupted for a $450 vibe-coded MVP build.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: College & Resume Strategy */}
            {activeTab === 'strategy' && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-teal-400">
                  <Award className="w-5 h-5" />
                  <h3 className="text-base font-bold text-slate-100">College Application &amp; Resume Strategy</h3>
                </div>

                <p className="text-xs leading-relaxed text-slate-300">
                  Top-tier colleges and recruiters look for projects that solve concrete societal issues. Highlighting **AegisMap** on your profile demonstrates practical capability in WebGIS engineering, spatial statistics, and data integration:
                </p>

                <div className="space-y-3.5">
                  <div className="bg-slate-950/40 border border-slate-800 p-4 rounded-xl space-y-2">
                    <p className="text-xs font-bold text-slate-200">Suggested Resume Bullet Points:</p>
                    <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-1.5 leading-relaxed pl-1">
                      <li>Built a client-side WebGIS dashboard that dynamically evaluates SDoH metrics (poverty, age, transit access) to locate unserved medication deserts.</li>
                      <li>Integrated US Census Esri ArcGIS REST layers and OSM Nominatim to execute geocoded bounding box searches and live demographic joins.</li>
                      <li>Leveraged Turf.js to compute tract centroids and spatial distances on-the-fly, enabling instant simulated clinic coverage evaluations.</li>
                      <li>Optimized Leaflet.js vectors by enabling HTML5 Canvas rendering (<code className="bg-slate-900 px-1 py-0.5 rounded text-teal-400 text-[10px]">preferCanvas</code>), achieving zero-lag polygon renders.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 7: AI Vibe-Coding Prompts */}
            {activeTab === 'prompts' && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-teal-400">
                  <Terminal className="w-5 h-5" />
                  <h3 className="text-base font-bold text-slate-100">AI Vibe-Coding Prompt Runway</h3>
                </div>
                
                <p className="text-xs leading-relaxed text-slate-300">
                  Review and copy the exact prompts used to build this application across its 3 maturity tiers:
                </p>

                <div className="space-y-4">
                  {promptRunways.map((p) => (
                    <div key={p.id} className="bg-slate-950/60 border border-slate-800 rounded-xl overflow-hidden">
                      <div className="bg-slate-950/80 px-4 py-2 flex items-center justify-between border-b border-slate-850">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold bg-slate-850 text-slate-400 px-2 py-0.5 rounded uppercase font-mono">
                            {p.tier}
                          </span>
                          <span className="text-xs font-bold text-slate-200">{p.title}</span>
                        </div>
                        <button
                          onClick={() => handleCopy(p.text, p.id)}
                          className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                          title="Copy prompt to clipboard"
                        >
                          {copiedId === p.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <pre className="p-4 overflow-x-auto text-[10px] font-mono leading-relaxed text-slate-300 bg-slate-950/40 whitespace-pre-wrap">
                        {p.text}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 8: Further Enhancements */}
            {activeTab === 'enhancements' && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-teal-400">
                  <PlusCircle className="w-5 h-5" />
                  <h3 className="text-base font-bold text-slate-100">Future Enhancements Roadmap</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-950/40 border border-slate-800 p-4 rounded-xl space-y-2">
                    <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wide">Road Routing Matrices</h4>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Integrate with OSRM (Open Source Routing Machine) or Valhalla to evaluate walking/driving route time vectors instead of geodesic straight-line distance approximations.
                    </p>
                  </div>

                  <div className="bg-slate-950/40 border border-slate-800 p-4 rounded-xl space-y-2">
                    <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wide">Realtime Collaborative Editing</h4>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Implement Supabase Realtime changes to sync mobile clinic simulations and locations across multiple dispatch screens instantaneously.
                    </p>
                  </div>

                  <div className="bg-slate-950/40 border border-slate-800 p-4 rounded-xl space-y-2">
                    <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wide">County Comparison Dashboard</h4>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Expand the lookup selector to support side-by-side comparisons of different counties, states, or health networks.
                    </p>
                  </div>

                  <div className="bg-slate-950/40 border border-slate-800 p-4 rounded-xl space-y-2">
                    <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wide">Machine Learning Intersects</h4>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Train models on regional health registries to forecast uncompensated readmission rate probabilities based on real-world SDoH values.
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
