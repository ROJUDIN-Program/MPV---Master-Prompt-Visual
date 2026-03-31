import React, { useMemo } from 'react';
import { HistoryItem } from '../types';

interface StatisticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  generateStats: Record<string, number>;
  totalGenerates: number;
  history: HistoryItem[];
}

export const StatisticsModal: React.FC<StatisticsModalProps> = ({ isOpen, onClose, generateStats, totalGenerates, history }) => {
  const chartData = useMemo(() => {
    // Convert Record<string, number> to array of objects for recharts
    // Sort by date ascending
    const data = Object.entries(generateStats)
      .map(([date, count]) => ({
        date,
        count,
        // Format date for display (e.g., "27 Feb")
        displayDate: new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // If no data, provide some empty structure or just return empty array
    return data;
  }, [generateStats]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-gray-950 text-gray-300 animate-in slide-in-from-bottom-10 fade-in duration-300">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 p-4 shadow-lg sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                </svg>
            </div>
            <div>
                <h2 className="text-xl font-bold text-white">Statistik Generate</h2>
                <p className="text-[10px] sm:text-xs text-gray-400">Ringkasan aktivitas pembuatan prompt Anda</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-200 text-sm font-medium transition-colors border border-gray-700 ml-4 shadow-sm"
          >
            Tutup
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
        <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg py-1.5 px-3 flex flex-col items-center justify-center text-center">
                    <span className="text-[9px] uppercase tracking-wider font-medium text-gray-400 mb-0.5">Total Generate</span>
                    <span className="text-xl font-bold text-blue-400">{totalGenerates.toLocaleString('id-ID')}</span>
                </div>
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg py-1.5 px-3 flex flex-col items-center justify-center text-center">
                    <span className="text-[9px] uppercase tracking-wider font-medium text-gray-400 mb-0.5">Hari Ini</span>
                    <span className="text-xl font-bold text-green-400">
                        {(() => {
                            const today = new Date();
                            const dateKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                            return (generateStats[dateKey] || 0).toLocaleString('id-ID');
                        })()}
                    </span>
                </div>
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg py-1.5 px-3 flex flex-col items-center justify-center text-center">
                    <span className="text-[9px] uppercase tracking-wider font-medium text-gray-400 mb-0.5">Hari Aktif</span>
                    <span className="text-xl font-bold text-purple-400">{chartData.length}</span>
                </div>
            </div>

            {/* Level Achievement */}
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-3 sm:p-4">
                <h3 className="text-sm font-semibold text-gray-200 mb-3">Achievement</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
                    {[
                        { name: 'Bronze', min: 0, max: 10000, color: 'text-orange-400', border: 'border-orange-400/30', bg: 'bg-orange-400/10', icon: '🥉' },
                        { name: 'Silver', min: 10001, max: 15000, color: 'text-gray-300', border: 'border-gray-300/30', bg: 'bg-gray-300/10', icon: '🥈' },
                        { name: 'Gold', min: 15001, max: 20000, color: 'text-yellow-400', border: 'border-yellow-400/30', bg: 'bg-yellow-400/10', icon: '🥇' },
                        { name: 'Platinum', min: 20001, max: 25000, color: 'text-cyan-400', border: 'border-cyan-400/30', bg: 'bg-cyan-400/10', icon: '🛡️' },
                        { name: 'Diamond', min: 25001, max: Infinity, color: 'text-purple-400', border: 'border-purple-400/30', bg: 'bg-purple-400/10', icon: '💎' }
                    ].map((level, index) => {
                        const isAchieved = totalGenerates >= level.min;
                        const isCurrent = totalGenerates >= level.min && totalGenerates <= (level.max === Infinity ? Infinity : level.max);
                        
                        let progress = 0;
                        if (totalGenerates >= level.max) {
                            progress = 100;
                        } else {
                            progress = (totalGenerates / level.max) * 100;
                        }
                        if (level.max === Infinity) {
                            progress = totalGenerates >= level.min ? 100 : (totalGenerates / level.min) * 100;
                        }

                        const radius = 14;
                        const circumference = 2 * Math.PI * radius;
                        const strokeDashoffset = circumference - (progress / 100) * circumference;

                        const range = level.max === Infinity 
                            ? `${level.min.toLocaleString('id-ID')}+` 
                            : `${level.min.toLocaleString('id-ID')} - ${level.max.toLocaleString('id-ID')}`;
                        let progressText = range;
                        if (isCurrent) {
                            const maxDisplay = level.max === Infinity ? '∞' : level.max.toLocaleString('id-ID');
                            progressText = `${totalGenerates.toLocaleString('id-ID')} - ${maxDisplay}`;
                        } else if (totalGenerates >= level.max) {
                            const maxDisplay = level.max === Infinity ? '∞' : level.max.toLocaleString('id-ID');
                            progressText = `${level.max.toLocaleString('id-ID')} - ${maxDisplay}`;
                        }

                        return (
                            <div key={level.name} className={`p-2 rounded-lg border ${isCurrent ? level.border + ' ' + level.bg : 'border-gray-700/50 bg-gray-800/30'} flex items-center gap-2 transition-colors`}>
                                <div className="relative w-8 h-8 flex-shrink-0">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2.5" fill="transparent" className="text-gray-700" />
                                        <circle 
                                            cx="16" cy="16" r="14" 
                                            stroke="currentColor" 
                                            strokeWidth="2.5" 
                                            fill="transparent" 
                                            className="text-green-500 transition-all duration-1000 ease-out" 
                                            strokeDasharray={circumference} 
                                            strokeDashoffset={strokeDashoffset} 
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className={`absolute inset-0 flex items-center justify-center text-xs ${!isAchieved && 'opacity-50 grayscale'}`}>
                                        {level.icon}
                                    </div>
                                </div>
                                <div className="flex flex-col text-left">
                                    <span className={`text-xs font-bold ${isAchieved ? level.color : 'text-gray-500'}`}>{level.name}</span>
                                    <span className="text-[9px] text-gray-400 leading-tight">{progressText}</span>
                                    {isCurrent && (
                                        <span className="mt-0.5 text-[8px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded-full w-fit leading-none">Level Saat Ini</span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Detailed List */}
            {chartData.length > 0 && (
                <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl overflow-hidden">
                    <div className="px-4 py-2.5 border-b border-gray-700/50 bg-gray-800/50">
                        <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Riwayat Harian</h3>
                    </div>
                    <div className="divide-y divide-gray-700/50 max-h-[300px] overflow-y-auto">
                        {[...chartData].reverse().map((data, index) => (
                            <div key={index} className="px-4 py-2 flex justify-between items-center hover:bg-gray-700/20 transition-colors">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                    <span className="text-gray-300 font-medium text-xs">
                                        {new Date(data.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </span>
                                </div>
                                <span className="text-blue-400 font-bold bg-blue-900/30 px-2 py-0.5 rounded-full text-[10px]">
                                    {data.count.toLocaleString('id-ID')}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
      </main>
    </div>
  );
};
