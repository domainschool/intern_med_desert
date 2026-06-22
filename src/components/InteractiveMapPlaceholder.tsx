import React, { useRef, useState } from 'react';
import { X, Navigation, Info } from 'lucide-react';

import { ComputedTract, Pharmacy, ClinicCheckpoint, Persona } from '../types';

interface InteractiveMapPlaceholderProps {
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
  };
}

export const InteractiveMapPlaceholder: React.FC<InteractiveMapPlaceholderProps> = ({
  computedTracts,
  pharmacies,
  mobileClinics,
  selectedTract,
  setSelectedTract,
  onAddClinicCoordinate,
  onRemoveClinic,
  activePersona,
  filters
}) => {
  const mapRef = useRef<SVGSVGElement>(null);
  const [hoveredTract, setHoveredTract] = useState<ComputedTract | null>(null);
  const [clickCoord, setClickCoord] = useState<{ x: number; y: number } | null>(null);
  const [newClinicLabel, setNewClinicLabel] = useState('');

  // Handle map click to place simulated mobile clinics
  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (activePersona !== 'Regional Director') return;

    // Check if clicking a tract directly to prevent conflict
    const target = e.target as SVGElement;
    if (target.closest('.tract-node') || target.closest('.clinic-marker') || target.closest('.pharm-marker')) {
      return;
    }

    if (mapRef.current) {
      const rect = mapRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      setClickCoord({ x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 });
      setNewClinicLabel(`Simulated Clinic #${mobileClinics.length + 1}`);
    }
  };

  const submitClinicPlacement = () => {
    if (clickCoord && newClinicLabel.trim()) {
      onAddClinicCoordinate(clickCoord.x, clickCoord.y, newClinicLabel.trim());
      setClickCoord(null);
      setNewClinicLabel('');
    }
  };

  const getRiskColor = (score: number) => {
    if (score > 60) return 'rgba(244, 63, 94, 0.85)'; // Rose Red
    if (score > 30) return 'rgba(245, 158, 11, 0.85)'; // Amber Orange
    return 'rgba(16, 185, 129, 0.85)'; // Emerald Green
  };

  const getRiskBorderColor = (score: number) => {
    if (score > 60) return '#f43f5e';
    if (score > 30) return '#f59e0b';
    return '#10b981';
  };

  return (
    <div className="relative w-full h-full bg-slate-950 flex flex-col overflow-hidden">
      
      {/* Map Sub-Header Controls */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 shadow-lg backdrop-blur text-xs flex items-center gap-2">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Low AGS (&lt;30)</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Med AGS (30-60)</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> High AGS (&gt;60)</span>
        </div>
      </div>

      <div className="absolute top-4 right-4 z-10">
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 shadow-lg backdrop-blur text-xs max-w-xs space-y-1">
          <p className="font-semibold text-slate-200 flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-teal-400" />
            Tactical Map Console
          </p>
          {activePersona === 'Regional Director' ? (
            <p className="text-slate-400 text-[10px]">
              Click anywhere on the map grid to place a new **Simulated Mobile Clinic Checkpoint**.
            </p>
          ) : (
            <p className="text-slate-500 text-[10px] italic">
              Switch to Regional Director to simulate checkpoints.
            </p>
          )}
        </div>
      </div>

      {/* SVG Canvas Map Container */}
      <div className="flex-1 w-full h-full relative cursor-crosshair">
        <svg
          ref={mapRef}
          className="w-full h-full select-none"
          onClick={handleMapClick}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* Subtle Grid Lines */}
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(51, 65, 85, 0.15)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Background Map Shapes (representing rivers, highways, bounds) */}
          {/* River */}
          <path
            d="M -10,40 Q 20,45 40,65 T 110,60"
            fill="none"
            stroke="rgba(30, 41, 59, 0.4)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M -10,40 Q 20,45 40,65 T 110,60"
            fill="none"
            stroke="rgba(14, 165, 233, 0.08)"
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* Highway */}
          <path
            d="M 50,-10 L 50,110"
            fill="none"
            stroke="rgba(71, 85, 105, 0.15)"
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />
          <path
            d="M -10,50 L 110,50"
            fill="none"
            stroke="rgba(71, 85, 105, 0.15)"
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />

          {/* Clinic Coverage Radii (Draw first so markers are overlayed on top) */}
          {mobileClinics.map((clinic) => (
            <g key={`radius-${clinic.id}`}>
              {/* Coverage circle: 15% radius on canvas */}
              <circle
                cx={clinic.x}
                cy={clinic.y}
                r="15"
                fill="rgba(20, 184, 166, 0.08)"
                stroke="rgba(20, 184, 166, 0.25)"
                strokeWidth="1"
                strokeDasharray="3 2"
                className="animate-pulse-glow"
              />
            </g>
          ))}

          {/* Pharmacy Coverage Radii (15-minute travel buffers = 20 units) */}
          {pharmacies.map((pharm) => (
            <g key={`radius-pharm-${pharm.id}`}>
              <circle
                cx={pharm.x}
                cy={pharm.y}
                r="20"
                fill="none"
                stroke="rgba(148, 163, 184, 0.06)"
                strokeWidth="0.75"
              />
            </g>
          ))}

          {/* Census Tract Nodes */}
          {computedTracts.map((tract) => {
            // Apply filtering highlights
            const isFilteredOut = 
              tract.povertyRate < filters.minPoverty ||
              tract.noVehicleRate < filters.minNoVehicle ||
              tract.elderlyRate < filters.minElderly;

            const isSelected = selectedTract?.id === tract.id;

            return (
              <g
                key={tract.id}
                className="tract-node cursor-pointer transition-all duration-300"
                onClick={() => setSelectedTract(tract)}
                onMouseEnter={() => setHoveredTract(tract)}
                onMouseLeave={() => setHoveredTract(null)}
                style={{ opacity: isFilteredOut ? 0.2 : 1 }}
              >
                {/* Outer selection ring */}
                {isSelected && (
                  <circle
                    cx={tract.x}
                    cy={tract.y}
                    r="5.5"
                    fill="none"
                    stroke="#2dd4bf"
                    strokeWidth="0.75"
                    className="animate-spin"
                    style={{ transformOrigin: `${tract.x}px ${tract.y}px`, animationDuration: '6s' }}
                  />
                )}

                {/* Main tract circle */}
                <circle
                  cx={tract.x}
                  cy={tract.y}
                  r={isSelected ? 4.5 : 3.5}
                  fill={getRiskColor(tract.ags)}
                  stroke={isSelected ? '#ffffff' : getRiskBorderColor(tract.ags)}
                  strokeWidth={isSelected ? 1.5 : 1}
                  className="hover:scale-110 transition-transform duration-200"
                />

                {/* Text Label for Tract Score */}
                <text
                  x={tract.x}
                  y={tract.y + 0.8}
                  fill="#ffffff"
                  fontSize="2"
                  fontWeight="bold"
                  textAnchor="middle"
                  className="pointer-events-none"
                >
                  {Math.round(tract.ags)}
                </text>

                {/* Mini Desert Badge Indicator */}
                {tract.isDesert && (
                  <circle
                    cx={tract.x + 2.5}
                    cy={tract.y - 2.5}
                    r="0.8"
                    fill="#f43f5e"
                    className="animate-pulse-glow-red"
                  />
                )}

                {/* Name Label underneath */}
                <text
                  x={tract.x}
                  y={tract.y + 6.5}
                  fill={isSelected ? '#5eead4' : '#94a3b8'}
                  fontSize="1.8"
                  fontWeight={isSelected ? 'bold' : 'normal'}
                  textAnchor="middle"
                  className="pointer-events-none bg-slate-950"
                >
                  {tract.name.split(' ')[0] + ' ' + tract.name.split(' ')[1]}
                </text>
              </g>
            );
          })}

          {/* Pharmacy Markers */}
          {pharmacies.map((pharm) => (
            <g
              key={pharm.id}
              className="pharm-marker cursor-help"
            >
              <title>{`${pharm.name} - ${pharm.address}`}</title>

              {/* Outer halo */}
              <circle
                cx={pharm.x}
                cy={pharm.y}
                r="3"
                fill="none"
                stroke="rgba(20, 184, 166, 0.4)"
                strokeWidth="0.5"
              />

              {/* Glowing core */}
              <circle
                cx={pharm.x}
                cy={pharm.y}
                r="1.5"
                fill="#14b8a6"
                className="animate-ping"
                style={{ animationDuration: '3s' }}
              />

              {/* Cross symbol */}
              <rect x={pharm.x - 0.5} y={pharm.y - 1.5} width="1" height="3" fill="#14b8a6" />
              <rect x={pharm.x - 1.5} y={pharm.y - 0.5} width="3" height="1" fill="#14b8a6" />
            </g>
          ))}

          {/* Active/Simulated Mobile Clinic Pins */}
          {mobileClinics.map((clinic) => (
            <g
              key={clinic.id}
              className="clinic-marker cursor-pointer"
              onClick={() => setSelectedTract(null)}
            >
              {/* Base coordinate dot */}
              <circle cx={clinic.x} cy={clinic.y} r="1" fill="#f59e0b" />
              
              {/* Pulsing ring */}
              <circle
                cx={clinic.x}
                cy={clinic.y}
                r="3.5"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="0.5"
                className="animate-ping"
                style={{ animationDuration: '2s' }}
              />

              {/* Clinic Icon pin */}
              <path
                d={`M ${clinic.x} ${clinic.y} L ${clinic.x - 1.5} ${clinic.y - 3.5} A 1.8 1.8 0 1 1 ${clinic.x + 1.5} ${clinic.y - 3.5} Z`}
                fill="#f59e0b"
                stroke="#1e293b"
                strokeWidth="0.25"
              />
              <circle cx={clinic.x} cy={clinic.y - 3.5} r="0.6" fill="#1e293b" />

              {/* Delete Button on Hover/Select (if Director) */}
              {activePersona === 'Regional Director' && (
                <g 
                  className="cursor-pointer opacity-70 hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveClinic(clinic.id);
                  }}
                >
                  <circle cx={clinic.x + 3.5} cy={clinic.y - 5.5} r="1" fill="#f43f5e" />
                  <line x1={clinic.x + 2.8} y1={clinic.y - 6.2} x2={clinic.x + 4.2} y2={clinic.y - 4.8} stroke="#ffffff" strokeWidth="0.3" />
                  <line x1={clinic.x + 4.2} y1={clinic.y - 6.2} x2={clinic.x + 2.8} y2={clinic.y - 4.8} stroke="#ffffff" strokeWidth="0.3" />
                </g>
              )}
            </g>
          ))}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredTract && (
          <div
            className="absolute bg-slate-900/95 border border-slate-800 rounded-lg p-3 shadow-xl text-xs space-y-1.5 pointer-events-none z-20 backdrop-blur-sm"
            style={{
              left: `${Math.min(80, hoveredTract.x)}%`,
              top: `${Math.min(80, hoveredTract.y)}%`,
              transform: 'translate(10px, 10px)'
            }}
          >
            <p className="font-bold text-slate-100">{hoveredTract.name}</p>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 font-medium text-slate-400">
              <span>AGS Score:</span>
              <span className={`font-bold ${hoveredTract.ags > 60 ? 'text-rose-400' : hoveredTract.ags > 30 ? 'text-amber-400' : 'text-emerald-400'}`}>{hoveredTract.ags}</span>
              <span>Population:</span>
              <span className="text-slate-200">{hoveredTract.population}</span>
              <span>Poverty Rate:</span>
              <span className="text-slate-200">{hoveredTract.povertyRate}%</span>
              <span>No Vehicle:</span>
              <span className="text-slate-200">{hoveredTract.noVehicleRate}%</span>
              <span>Nearest Rx:</span>
              <span className="text-slate-200">{hoveredTract.distanceToNearestPharmacy} units</span>
            </div>
            {hoveredTract.isDesert && (
              <span className="mt-1 block text-[10px] text-rose-400 font-bold bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20 text-center animate-pulse">
                Medication Desert Zone
              </span>
            )}
            {hoveredTract.isMitigated && (
              <span className="mt-1 block text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 text-center">
                Mitigated by Clinic
              </span>
            )}
          </div>
        )}

        {/* Clinic Creation Modal Overlay (Map-Click) */}
        {clickCoord && (
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-30">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl max-w-sm w-full mx-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                  <Navigation className="w-4 h-4 text-teal-400" />
                  Place Mobile Clinic Checkpoint
                </h4>
                <button
                  onClick={() => setClickCoord(null)}
                  className="text-slate-500 hover:text-slate-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1.5">
                <p className="text-xs text-slate-400">
                  Coordinates selected: <span className="font-mono text-slate-200">X: {clickCoord.x}%, Y: {clickCoord.y}%</span>
                </p>
                <p className="text-[10px] text-slate-500 italic">
                  This deployment will cover all census tracts within a 15-unit radius.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 block font-medium">Checkpoint Label</label>
                <input
                  type="text"
                  placeholder="e.g. Mobile Site A"
                  value={newClinicLabel}
                  onChange={(e) => setNewClinicLabel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                  autoFocus
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  onClick={() => setClickCoord(null)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-800 text-xs font-semibold text-slate-400 hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submitClinicPlacement}
                  className="px-4 py-1.5 rounded-lg bg-teal-500 text-slate-950 font-bold hover:bg-teal-400 text-xs shadow-md shadow-teal-500/10 transition-colors"
                >
                  Deploy Clinic
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
