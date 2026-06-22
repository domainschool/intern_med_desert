import React, { useMemo } from 'react';
import { MapContainer as LeafletMap, TileLayer, GeoJSON, Marker, Circle, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ComputedTract, Pharmacy, ClinicCheckpoint, Persona } from '../types';
import { RefreshCw, Navigation, Map as MapIcon } from 'lucide-react';
import { FeatureCollection, Feature, Geometry } from 'geojson';

// Fix default leaflet icon issues in Vite
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom DivIcons for modern glowing dashboard look
const pharmacyIcon = L.divIcon({
  html: `<div class="w-6 h-6 rounded-full bg-teal-500/20 border-2 border-teal-400 flex items-center justify-center shadow-lg shadow-teal-500/30 animate-pulse-glow">
           <div class="w-1.5 h-3 bg-teal-400 rounded-sm absolute"></div>
           <div class="h-1.5 w-3 bg-teal-400 rounded-sm absolute"></div>
         </div>`,
  className: 'custom-pharm-icon',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const clinicIcon = L.divIcon({
  html: `<div class="w-8 h-8 flex items-center justify-center">
           <div class="relative w-6 h-6 bg-amber-500 border-2 border-slate-900 rounded-full flex items-center justify-center shadow-xl shadow-amber-500/40">
             <div class="w-2.5 h-2.5 bg-slate-950 rounded-full"></div>
           </div>
         </div>`,
  className: 'custom-clinic-icon',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

interface MapContainerProps {
  computedTracts: ComputedTract[];
  pharmacies: Pharmacy[];
  mobileClinics: ClinicCheckpoint[];
  selectedTract: ComputedTract | null;
  setSelectedTract: (tract: ComputedTract | null) => void;
  onAddClinicCoordinate: (x: number, y: number, label: string) => void;
  onRemoveClinic: (id: string) => void;
  activePersona: Persona;
  filters: {
    minPoverty: number;
    minNoVehicle: number;
    minElderly: number;
    povertyWeight: number;
    noVehicleWeight: number;
    elderlyWeight: number;
  };
  isLoading: boolean;
}

// Sub-component to capture map clicks
const MapClickHandler: React.FC<{
  onMapClick: (lat: number, lng: number) => void;
  activePersona: Persona;
}> = ({ onMapClick, activePersona }) => {
  useMapEvents({
    click(e) {
      if (activePersona !== 'Regional Director') return;
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

export const MapContainer: React.FC<MapContainerProps> = ({
  computedTracts,
  pharmacies,
  mobileClinics,
  selectedTract,
  setSelectedTract,
  onAddClinicCoordinate,
  activePersona,
  filters,
  isLoading,
}) => {
  const [clickLatLng, setClickLatLng] = React.useState<{ lat: number; lng: number } | null>(null);
  const [newClinicLabel, setNewClinicLabel] = React.useState('');

  const detroitCenter: [number, number] = [42.3314, -83.0458]; // Detroit Lat, Lng

  // Convert computedTracts array to GeoJSON FeatureCollection
  const tractsGeojson = useMemo((): FeatureCollection<Geometry, ComputedTract> => {
    return {
      type: 'FeatureCollection',
      features: computedTracts.map((tract) => ({
        type: 'Feature',
        geometry: tract.geometry,
        properties: tract,
        id: tract.id,
      })),
    };
  }, [computedTracts]);

  // Dynamic choropleth color styling
  const styleTractFeature = (feature: Feature<Geometry, ComputedTract> | undefined) => {
    if (!feature) return {};

    const props = feature.properties;
    
    // Check if filtered out
    const isFilteredOut =
      props.povertyRate < filters.minPoverty ||
      props.noVehicleRate < filters.minNoVehicle ||
      props.elderlyRate < filters.minElderly;

    if (isFilteredOut) {
      return {
        fillColor: '#1e293b',
        fillOpacity: 0.05,
        color: '#334155',
        weight: 0.5,
      };
    }

    const ags = props.ags;
    let color = '#10b981'; // Green
    if (ags > 60) {
      color = '#f43f5e'; // Red
    } else if (ags > 30) {
      color = '#f59e0b'; // Orange
    }

    const isSelected = selectedTract?.id === props.id;

    return {
      fillColor: color,
      fillOpacity: isSelected ? 0.6 : props.isMitigated ? 0.15 : 0.35,
      color: isSelected ? '#5eead4' : props.isMitigated ? '#475569' : '#0f172a',
      weight: isSelected ? 2.5 : 1,
    };
  };

  const handleMapClick = (lat: number, lng: number) => {
    setClickLatLng({ lat, lng });
    setNewClinicLabel(`Simulated Site #${mobileClinics.length + 1}`);
  };

  const submitClinicPlacement = () => {
    if (clickLatLng && newClinicLabel.trim()) {
      // Pass coordinates as [lng, lat] to align with Turf [x, y] coordinates
      onAddClinicCoordinate(clickLatLng.lng, clickLatLng.lat, newClinicLabel.trim());
      setClickLatLng(null);
      setNewClinicLabel('');
    }
  };

  const onEachTractFeature = (feature: Feature<Geometry, ComputedTract>, layer: L.Layer) => {
    layer.on({
      click: () => {
        setSelectedTract(feature.properties);
      },
      mouseover: (e) => {
        const lyr = e.target as L.Path;
        lyr.setStyle({ fillOpacity: 0.75 });
      },
      mouseout: (e) => {
        const lyr = e.target as L.Path;
        // Re-apply original styles
        const originalStyle = styleTractFeature(feature);
        lyr.setStyle(originalStyle);
      },
    });
  };

  // Generate a key that updates on filter weight changes to force Leaflet re-rendering
  const mapKey = useMemo(() => {
    const weightsHash = `${filters.povertyWeight}-${filters.noVehicleWeight}-${filters.elderlyWeight}`;
    const thresholdsHash = `${filters.minPoverty}-${filters.minNoVehicle}-${filters.minElderly}`;
    const selectionHash = selectedTract ? selectedTract.id : 'none';
    const clinicCount = mobileClinics.length;
    return `${weightsHash}-${thresholdsHash}-${selectionHash}-${clinicCount}-${computedTracts.length}`;
  }, [filters, selectedTract, mobileClinics, computedTracts]);

  return (
    <div className="relative w-full h-full bg-slate-950 flex flex-col overflow-hidden">
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-3 shadow-2xl">
            <RefreshCw className="w-5 h-5 text-teal-400 animate-spin" />
            <span className="text-xs font-bold text-slate-200 tracking-wider">hydrating geospatial demographics...</span>
          </div>
        </div>
      )}

      {/* Map Legend (Top Left) */}
      <div className="absolute top-4 left-4 z-[1000] pointer-events-none">
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 shadow-lg backdrop-blur text-xs flex flex-wrap gap-x-3 gap-y-1 text-slate-300">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-500/80 border border-emerald-400"></span> Low AGS (&lt;30)</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-amber-500/80 border border-amber-400"></span> Med AGS (30-60)</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-rose-500/80 border border-rose-400"></span> High AGS (&gt;60)</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-slate-800 border border-slate-700"></span> Filtered / Out of Range</span>
        </div>
      </div>

      {/* Action Prompt (Top Right) */}
      <div className="absolute top-4 right-4 z-[1000] pointer-events-none">
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 shadow-lg backdrop-blur text-xs max-w-xs space-y-1 text-slate-300">
          <p className="font-semibold text-slate-200 flex items-center gap-1">
            <MapIcon className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
            Live Map Controls
          </p>
          {activePersona === 'Regional Director' ? (
            <p className="text-slate-400 text-[10px]">
              Click anywhere on the map boundary to drop a simulated mobile clinic checkpoint.
            </p>
          ) : (
            <p className="text-slate-500 text-[10px] italic">
              * Switch to Regional Director to simulate checkpoints.
            </p>
          )}
        </div>
      </div>

      {/* Leaflet MapContainer */}
      <div className="flex-1 w-full h-full z-10">
        <LeafletMap
          center={detroitCenter}
          zoom={11}
          minZoom={10}
          maxZoom={15}
          className="w-full h-full"
          preferCanvas={true} // Renders polygons as a single canvas layer for rapid execution
        >
          {/* Map Tile Layer: CartoDB Dark */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {/* Map Event Click Handler */}
          <MapClickHandler onMapClick={handleMapClick} activePersona={activePersona} />

          {/* Census Tract GeoJSON Layer */}
          {computedTracts.length > 0 && (
            <GeoJSON
              key={mapKey}
              data={tractsGeojson}
              style={styleTractFeature}
              onEachFeature={onEachTractFeature}
            />
          )}

          {/* Pharmacies point markers */}
          {pharmacies.map((pharm) => (
            <React.Fragment key={pharm.id}>
              {/* Point Marker */}
              <Marker position={[pharm.coordinates[1], pharm.coordinates[0]]} icon={pharmacyIcon}>
                <title>{`${pharm.name}\n${pharm.address}`}</title>
              </Marker>
              
              {/* Pharmacy 1.5-mile service buffer circle */}
              <Circle
                center={[pharm.coordinates[1], pharm.coordinates[0]]}
                radius={2414.02} // 1.5 miles in meters
                pathOptions={{
                  fillColor: 'rgba(148, 163, 184, 0.05)',
                  fillOpacity: 0.05,
                  color: 'rgba(148, 163, 184, 0.15)',
                  weight: 0.75,
                }}
              />
            </React.Fragment>
          ))}

          {/* Simulated Mobile Clinics markers */}
          {mobileClinics.map((clinic) => (
            <React.Fragment key={clinic.id}>
              {/* Point Marker */}
              <Marker position={[clinic.coordinates[1], clinic.coordinates[0]]} icon={clinicIcon}>
                <title>{clinic.label}</title>
              </Marker>

              {/* Clinic 1.2-mile coverage buffer circle */}
              <Circle
                center={[clinic.coordinates[1], clinic.coordinates[0]]}
                radius={1931.21} // 1.2 miles in meters
                pathOptions={{
                  fillColor: 'rgba(245, 158, 11, 0.05)',
                  fillOpacity: 0.05,
                  color: '#f59e0b',
                  weight: 1,
                  dashArray: '3, 4',
                }}
              />
            </React.Fragment>
          ))}
        </LeafletMap>
      </div>

      {/* Clinic Placement Input Modal Dialog */}
      {clickLatLng && (
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-[2000]">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl max-w-sm w-full mx-4 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                <Navigation className="w-4 h-4 text-teal-400 animate-pulse" />
                Place Mobile Clinic Checkpoint
              </h4>
              <button
                onClick={() => setClickLatLng(null)}
                className="text-slate-500 hover:text-slate-300 transition-colors"
              >
                &times;
              </button>
            </div>

            <div className="space-y-1.5 text-xs">
              <p className="text-slate-400">
                Coordinates selected: <span className="font-mono text-slate-200">{clickLatLng.lat.toFixed(5)}° N, {clickLatLng.lng.toFixed(5)}° E</span>
              </p>
              <p className="text-[10px] text-slate-500 italic">
                * Deploying here will cover all census tracts within a 1.2-mile radius.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 block font-medium">Checkpoint Name</label>
              <input
                type="text"
                placeholder="e.g. Mobile Site Alpha"
                value={newClinicLabel}
                onChange={(e) => setNewClinicLabel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                autoFocus
              />
            </div>

            <div className="flex gap-2 justify-end pt-2 text-xs">
              <button
                onClick={() => setClickLatLng(null)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-800 font-semibold text-slate-400 hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitClinicPlacement}
                className="px-4 py-1.5 rounded-lg bg-teal-500 text-slate-950 font-bold hover:bg-teal-400 shadow-md shadow-teal-500/10 transition-colors"
              >
                Deploy Clinic
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
