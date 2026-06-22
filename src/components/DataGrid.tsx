import React, { useState } from 'react';
import { ChevronUp, ChevronDown, CheckCircle, AlertTriangle, Eye } from 'lucide-react';
import { ComputedTract } from '../types';

interface DataGridProps {
  computedTracts: ComputedTract[];
  selectedTract: ComputedTract | null;
  setSelectedTract: (tract: ComputedTract | null) => void;
  searchQuery: string;
}

type SortField = 'name' | 'population' | 'povertyRate' | 'noVehicleRate' | 'elderlyRate' | 'distanceToNearestPharmacy' | 'ags';
type SortOrder = 'asc' | 'desc';

export const DataGrid: React.FC<DataGridProps> = ({
  computedTracts,
  selectedTract,
  setSelectedTract,
  searchQuery
}) => {
  const [sortField, setSortField] = useState<SortField>('ags');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc'); // default desc
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />;
  };

  // Filter tracts by search query
  const filteredTracts = computedTracts.filter(tract =>
    tract.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tract.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort tracts
  const sortedTracts = [...filteredTracts].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];

    if (valA === undefined) valA = 0;
    if (valB === undefined) valB = 0;

    if (typeof valA === 'string' && typeof valB === 'string') {
      return sortOrder === 'asc' 
        ? valA.localeCompare(valB) 
        : valB.localeCompare(valA);
    } else {
      return sortOrder === 'asc'
        ? (valA as number) - (valB as number)
        : (valB as number) - (valA as number);
    }
  });

  return (
    <div className="w-full bg-slate-900 border-t border-slate-800 flex flex-col h-72 min-h-[18rem]">
      {/* Grid Header */}
      <div className="px-5 py-3 border-b border-slate-800 flex justify-between items-center bg-slate-900/80">
        <div>
          <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Geospatial Demographics Index</h2>
          <p className="text-[10px] text-slate-400">Total tracts indexed: {filteredTracts.length}</p>
        </div>
        <div className="text-[10px] text-slate-500 font-medium">
          Click column headers to sort by SDoH indicators
        </div>
      </div>

      {/* Grid Table Container */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-950/80 sticky top-0 text-slate-400 font-semibold select-none border-b border-slate-800 z-10">
            <tr>
              <th className="py-2.5 px-4 w-12 text-center">Analyze</th>
              <th className="py-2.5 px-4 cursor-pointer hover:bg-slate-800 hover:text-slate-100 transition-colors" onClick={() => handleSort('name')}>
                <div className="flex items-center gap-1">Census Tract {getSortIcon('name')}</div>
              </th>
              <th className="py-2.5 px-4 cursor-pointer hover:bg-slate-800 hover:text-slate-100 transition-colors" onClick={() => handleSort('population')}>
                <div className="flex items-center gap-1 justify-end">Population {getSortIcon('population')}</div>
              </th>
              <th className="py-2.5 px-4 cursor-pointer hover:bg-slate-800 hover:text-slate-100 transition-colors" onClick={() => handleSort('povertyRate')}>
                <div className="flex items-center gap-1 justify-end">Poverty % {getSortIcon('povertyRate')}</div>
              </th>
              <th className="py-2.5 px-4 cursor-pointer hover:bg-slate-800 hover:text-slate-100 transition-colors" onClick={() => handleSort('noVehicleRate')}>
                <div className="flex items-center gap-1 justify-end">No Vehicle % {getSortIcon('noVehicleRate')}</div>
              </th>
              <th className="py-2.5 px-4 cursor-pointer hover:bg-slate-800 hover:text-slate-100 transition-colors" onClick={() => handleSort('elderlyRate')}>
                <div className="flex items-center gap-1 justify-end">Age 65+ % {getSortIcon('elderlyRate')}</div>
              </th>
              <th className="py-2.5 px-4 cursor-pointer hover:bg-slate-800 hover:text-slate-100 transition-colors" onClick={() => handleSort('distanceToNearestPharmacy')}>
                <div className="flex items-center gap-1 justify-end">Nearest Rx (mi) {getSortIcon('distanceToNearestPharmacy')}</div>
              </th>

              <th className="py-2.5 px-4 cursor-pointer hover:bg-slate-800 hover:text-slate-100 transition-colors" onClick={() => handleSort('ags')}>
                <div className="flex items-center gap-1 justify-end">Calculated AGS {getSortIcon('ags')}</div>
              </th>
              <th className="py-2.5 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-850 bg-slate-900/30">
            {sortedTracts.length > 0 ? (
              sortedTracts.map((tract) => {
                const isSelected = selectedTract?.id === tract.id;
                
                return (
                  <tr
                    key={tract.id}
                    className={`hover:bg-slate-800/40 transition-colors cursor-pointer ${
                      isSelected ? 'bg-teal-500/5 text-slate-100' : 'text-slate-300'
                    }`}
                    onClick={() => setSelectedTract(tract)}
                  >
                    <td className="py-2 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTract(tract);
                        }}
                        className={`p-1.5 rounded-lg border transition-all ${
                          isSelected 
                            ? 'bg-teal-500/10 text-teal-400 border-teal-500/30 shadow' 
                            : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                    <td className="py-2 px-4 font-bold">
                      {tract.name}
                    </td>
                    <td className="py-2 px-4 text-right font-mono text-slate-200">
                      {tract.population.toLocaleString()}
                    </td>
                    <td className="py-2 px-4 text-right font-mono">
                      {tract.povertyRate}%
                    </td>
                    <td className="py-2 px-4 text-right font-mono">
                      {tract.noVehicleRate}%
                    </td>
                    <td className="py-2 px-4 text-right font-mono">
                      {tract.elderlyRate}%
                    </td>
                    <td className="py-2 px-4 text-right font-mono text-slate-400">
                      {tract.distanceToNearestPharmacy}
                    </td>
                    <td className="py-2 px-4 text-right font-mono font-bold">
                      <span className={`px-2 py-0.5 rounded text-[11px] ${
                        tract.ags > 60 
                          ? 'bg-rose-500/15 text-rose-400 border border-rose-500/25' 
                          : tract.ags > 30 
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25' 
                            : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                      }`}>
                        {tract.ags}
                      </span>
                    </td>
                    <td className="py-2 px-4">
                      {tract.isMitigated ? (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/15 w-fit">
                          <CheckCircle className="w-3 h-3" /> Mitigated
                        </span>
                      ) : tract.isDesert ? (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-500/5 px-2 py-0.5 rounded border border-rose-500/15 w-fit animate-pulse">
                          <AlertTriangle className="w-3 h-3" /> SDoH Desert
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700 w-fit">
                          Covered
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-500 italic">
                  No census tracts match the current search query.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
