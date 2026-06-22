import React from 'react';
import { 
  ShieldAlert, 
  TrendingUp, 
  MapPin, 
  Sliders, 
  Search, 
  Users, 
  Car, 
  Activity, 
  Sparkles,
  RefreshCw,
  UserCheck
} from 'lucide-react';
import { ComputedTract, SDoHFilters, Persona } from '../types';

interface SidebarProps {
  filters: SDoHFilters;
  setFilters: React.Dispatch<React.SetStateAction<SDoHFilters>>;
  selectedTract: ComputedTract | null;
  computedTracts: ComputedTract[];
  onSimulateClinic: (tract: ComputedTract) => void;
  activePersona: Persona;
  setActivePersona: (persona: Persona) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  kpiStats: {
    highRiskCount: number;
    totalSavings: number;
    activeRoutes: number;
  };
  activeTab: 'map' | 'ai-planner';
  setActiveTab: (tab: 'map' | 'ai-planner') => void;
  aiStreaming: boolean;
  aiReport: string;
  onGenerateAIPlan: () => void;
  zipQuery: string;
  setZipQuery: (zip: string) => void;
  onSearchZip: () => void;
  onClearZip: () => void;
  activeZip: string | null;
  isSearchingZip: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  filters,
  setFilters,
  selectedTract,
  computedTracts,
  onSimulateClinic,
  activePersona,
  setActivePersona,
  searchQuery,
  setSearchQuery,
  kpiStats,
  activeTab,
  setActiveTab,
  aiStreaming,
  aiReport,
  onGenerateAIPlan,
  zipQuery,
  setZipQuery,
  onSearchZip,
  onClearZip,
  activeZip,
  isSearchingZip
}) => {


  const handleWeightChange = (key: 'povertyWeight' | 'noVehicleWeight' | 'elderlyWeight', val: number) => {
    setFilters(prev => {
      const next = { ...prev, [key]: val };
      return next;
    });
  };

  const handleFilterChange = (key: 'minPoverty' | 'minNoVehicle' | 'minElderly', val: number) => {
    setFilters(prev => ({ ...prev, [key]: val }));
  };

  // Format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Estimate uncompensated readmission penalty for selected tract
  const calculateSelectedPenalty = (tract: ComputedTract) => {
    // Formula: population * poverty_factor * readmission_prob * readmission_cost
    return Math.round(tract.population * (tract.povertyRate / 100) * 0.04 * 15000);
  };

  return (
    <aside className="w-full lg:w-96 bg-slate-900 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col h-full overflow-hidden">
      {/* Product Header */}
      <div className="p-5 border-b border-slate-800 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-teal-500/10 rounded-lg text-teal-400 border border-teal-500/20">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white">AegisMap</h1>
              <p className="text-xs text-slate-400">SDoH Optimization Engine</p>
            </div>
          </div>
          {/* Persona Switcher Toggle */}
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mb-1">Access Persona</span>
            <button
              onClick={() => setActivePersona(activePersona === 'Field Operator' ? 'Regional Director' : 'Field Operator')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all duration-200 ${
                activePersona === 'Regional Director' 
                  ? 'bg-purple-500/10 text-purple-400 border-purple-500/30 shadow-sm shadow-purple-500/10' 
                  : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
              }`}
              title="Toggle application role permission level"
              id="persona-toggle-btn"
            >
              <UserCheck className="w-3.5 h-3.5" />
              {activePersona}
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-2 gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800/80">
          <button
            onClick={() => setActiveTab('map')}
            className={`py-1.5 px-3 rounded-md text-xs font-medium transition-all ${
              activeTab === 'map' 
                ? 'bg-slate-800 text-teal-400 shadow-sm' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tactical Map
          </button>
          <button
            onClick={() => setActiveTab('ai-planner')}
            className={`py-1.5 px-3 rounded-md text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'ai-planner' 
                ? 'bg-slate-800 text-teal-400 shadow-sm' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3 h-3 text-yellow-400" />
            AI Resource Planner
          </button>
        </div>
      </div>

      {/* Main Sidebar Contents */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        
        {/* KPI Summaries */}
        <div className="grid grid-cols-1 gap-3">
          {/* KPI 1 */}
          <div className="glass-panel p-3.5 rounded-xl flex items-center gap-3">
            <div className="p-2.5 bg-rose-500/10 rounded-lg text-rose-400 border border-rose-500/20">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">High-Risk Deserts</p>
              <h3 className="text-xl font-bold text-slate-100">{kpiStats.highRiskCount} <span className="text-xs font-normal text-slate-400">Tracts</span></h3>
            </div>
          </div>

          {/* KPI 2 */}
          <div className="glass-panel p-3.5 rounded-xl flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Preventable Penalties Saved</p>
              <h3 className="text-xl font-bold text-emerald-400">{formatCurrency(kpiStats.totalSavings)}</h3>
            </div>
          </div>

          {/* KPI 3 */}
          <div className="glass-panel p-3.5 rounded-xl flex items-center gap-3">
            <div className="p-2.5 bg-teal-500/10 rounded-lg text-teal-400 border border-teal-500/20">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Active Mobile Sites</p>
              <h3 className="text-xl font-bold text-slate-100">{kpiStats.activeRoutes} <span className="text-xs font-normal text-slate-400">Deployments</span></h3>
            </div>
          </div>
        </div>

        {/* Selected Tract Detail Card */}
        {selectedTract ? (
          <div className="border border-teal-500/30 bg-slate-900/90 rounded-xl p-4.5 shadow-lg shadow-teal-500/5 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="px-2 py-0.5 bg-slate-800 text-[10px] rounded text-teal-400 border border-slate-700 font-semibold tracking-wide">
                  TRACT PROFILE
                </span>
                <h4 className="text-sm font-bold text-white mt-1.5">{selectedTract.name}</h4>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase font-medium">AGS Score</span>
                <span className={`text-base font-extrabold ${
                  selectedTract.ags > 60 ? 'text-rose-400' : selectedTract.ags > 30 ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {selectedTract.ags} / 100
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-800 text-center">
              <div>
                <span className="text-[9px] text-slate-400 uppercase font-semibold flex items-center justify-center gap-0.5">
                  <Users className="w-2.5 h-2.5 text-blue-400" /> Pov %
                </span>
                <p className="text-xs font-bold text-slate-200 mt-0.5">{selectedTract.povertyRate}%</p>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 uppercase font-semibold flex items-center justify-center gap-0.5">
                  <Car className="w-2.5 h-2.5 text-purple-400" /> No Veh
                </span>
                <p className="text-xs font-bold text-slate-200 mt-0.5">{selectedTract.noVehicleRate}%</p>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 uppercase font-semibold flex items-center justify-center gap-0.5">
                  Age 65+
                </span>
                <p className="text-xs font-bold text-slate-200 mt-0.5">{selectedTract.elderlyRate}%</p>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Est. Readmission Risk Value:</span>
              <span className="font-semibold text-rose-400">{formatCurrency(calculateSelectedPenalty(selectedTract))}</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Nearest Pharmacy Distance:</span>
              <span className="font-semibold text-slate-200">{selectedTract.distanceToNearestPharmacy} miles</span>
            </div>


            {selectedTract.isMitigated ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs py-2 px-3 rounded-lg text-center font-medium">
                Clinic Deployed here (Mitigated)
              </div>
            ) : (
              <button
                onClick={() => onSimulateClinic(selectedTract)}
                disabled={activePersona !== 'Regional Director'}
                className={`w-full text-xs font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  activePersona === 'Regional Director'
                    ? 'bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-md shadow-teal-500/20 active:translate-y-[1px]'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                Simulate Clinic Placement
              </button>
            )}
            {activePersona !== 'Regional Director' && !selectedTract.isMitigated && (
              <p className="text-[9px] text-slate-500 text-center italic">
                * Director persona required to simulate clinic deployments.
              </p>
            )}
          </div>
        ) : (
          <div className="border border-dashed border-slate-800 rounded-xl p-6 text-center text-slate-500">
            <MapPin className="w-8 h-8 mx-auto mb-2 text-slate-600 animate-bounce" />
            <p className="text-xs font-medium text-slate-400">Select a census tract on the map to analyze demographics and simulate clinics</p>
          </div>
        )}

        {/* Tab Contents: Overview Map Sliders */}
        {activeTab === 'map' && (
          <div className="space-y-6">
            
            {/* Filter Search */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5" /> Search Census Tracts
                </label>
                <input
                  type="text"
                  placeholder="Search by tract number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-teal-500/50"
                />
              </div>

              {/* ZIP Code Search */}
              <div className="space-y-2 pt-2 border-t border-slate-800/40">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-teal-400" /> ZIP Code Area Search
                  </label>
                  <span className="text-[9px] text-slate-500 font-mono">Wayne County, MI</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={5}
                    placeholder="e.g. 48201 (Detroit)"
                    value={zipQuery}
                    onChange={(e) => setZipQuery(e.target.value.replace(/\D/g, ''))}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-teal-500/50"
                  />
                  <button
                    onClick={onSearchZip}
                    disabled={isSearchingZip || zipQuery.length !== 5}
                    className="px-3 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSearchingZip ? "..." : "Search"}
                  </button>
                </div>
                {activeZip && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[11px] py-1 px-2.5 rounded-lg">
                      <span>Filtering: ZIP <b>{activeZip}</b></span>
                      <button
                        onClick={onClearZip}
                        className="text-teal-400 hover:text-teal-200 font-bold ml-2 underline"
                      >
                        Clear
                      </button>
                    </div>
                    
                    {/* Warning if ZIP code geocoded to an area with no tracts (i.e. outside Detroit/Wayne County) */}
                    {computedTracts.length === 0 && (
                      <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs p-2.5 rounded-lg space-y-1">
                        <p className="font-bold flex items-center gap-1">
                          <ShieldAlert className="w-3.5 h-3.5" /> Outside Coverage Area
                        </p>
                        <p className="text-[10px] leading-relaxed text-rose-300">
                          ZIP <b>{activeZip}</b> is outside the Detroit/Wayne County active data region. No census tracts found in this area.
                        </p>
                        <p className="text-[10px] leading-relaxed text-slate-400">
                          Please try a Detroit ZIP code (e.g. <b>48201</b>, <b>48202</b>, <b>48206</b>, or <b>48208</b>).
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>


            {/* SDoH Formula Weights Slider (Only Regional Director edits weights) */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-teal-400" /> SDoH Risk Weights
                </label>
                {activePersona !== 'Regional Director' && (
                  <span className="text-[9px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                    READ ONLY
                  </span>
                )}
              </div>

              {/* Weight 1: Poverty */}
              <div className="space-y-1 bg-slate-950/40 p-3 rounded-lg border border-slate-900">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-400">Poverty Weight</span>
                  <span className="text-teal-400 font-mono">{(filters.povertyWeight * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={filters.povertyWeight}
                  disabled={activePersona !== 'Regional Director'}
                  onChange={(e) => handleWeightChange('povertyWeight', parseFloat(e.target.value))}
                  className="w-full accent-teal-500 bg-slate-800 h-1 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Weight 2: Vehicle */}
              <div className="space-y-1 bg-slate-950/40 p-3 rounded-lg border border-slate-900">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-400">No Vehicle Weight</span>
                  <span className="text-teal-400 font-mono">{(filters.noVehicleWeight * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={filters.noVehicleWeight}
                  disabled={activePersona !== 'Regional Director'}
                  onChange={(e) => handleWeightChange('noVehicleWeight', parseFloat(e.target.value))}
                  className="w-full accent-teal-500 bg-slate-800 h-1 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Weight 3: Elderly */}
              <div className="space-y-1 bg-slate-950/40 p-3 rounded-lg border border-slate-900">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-400">Elderly Age (65+) Weight</span>
                  <span className="text-teal-400 font-mono">{(filters.elderlyWeight * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={filters.elderlyWeight}
                  disabled={activePersona !== 'Regional Director'}
                  onChange={(e) => handleWeightChange('elderlyWeight', parseFloat(e.target.value))}
                  className="w-full accent-teal-500 bg-slate-800 h-1 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Demographics Filters */}
            <div className="space-y-4 pt-2 border-t border-slate-800/60">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-blue-400" /> Filter Tract Highlight
              </label>

              {/* Min Poverty Rate */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-400">Min Poverty Rate</span>
                  <span className="text-slate-200 font-mono">{filters.minPoverty}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  value={filters.minPoverty}
                  onChange={(e) => handleFilterChange('minPoverty', parseInt(e.target.value))}
                  className="w-full accent-blue-500 bg-slate-800 h-1 rounded-lg cursor-pointer"
                />
              </div>

              {/* Min No-Vehicle */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-400">Min No-Vehicle Rate</span>
                  <span className="text-slate-200 font-mono">{filters.minNoVehicle}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="90"
                  value={filters.minNoVehicle}
                  onChange={(e) => handleFilterChange('minNoVehicle', parseInt(e.target.value))}
                  className="w-full accent-blue-500 bg-slate-800 h-1 rounded-lg cursor-pointer"
                />
              </div>

              {/* Min Elderly */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-400">Min Elderly (65+) Rate</span>
                  <span className="text-slate-200 font-mono">{filters.minElderly}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={filters.minElderly}
                  onChange={(e) => handleFilterChange('minElderly', parseInt(e.target.value))}
                  className="w-full accent-blue-500 bg-slate-800 h-1 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab Contents: AI Resource Planner */}
        {activeTab === 'ai-planner' && (
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-yellow-400" /> SDoH Deployment AI Plan
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Analyze current high-risk medication deserts and generate optimization deployment plans, budgets, and scripts.
              </p>
            </div>

            <button
              onClick={onGenerateAIPlan}
              disabled={aiStreaming}
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-1.5 shadow-md shadow-yellow-500/10 transition-all text-xs"
            >
              {aiStreaming ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating Plan...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Deployment Optimization Plan
                </>
              )}
            </button>

            {aiReport ? (
              <div className="bg-slate-950 border border-slate-800/80 rounded-lg p-3.5 mt-2 h-72 overflow-y-auto font-mono text-[11px] leading-relaxed text-slate-300 space-y-4 whitespace-pre-wrap select-all selection:bg-yellow-500 selection:text-slate-950">
                {aiReport}
              </div>
            ) : (
              <div className="border border-dashed border-slate-800/80 rounded-lg p-8 text-center text-slate-500 text-xs">
                Click the button above to run diagnostic prompts and generate strategic recommendations.
              </div>
            )}
          </div>
        )}

      </div>
    </aside>
  );
};
