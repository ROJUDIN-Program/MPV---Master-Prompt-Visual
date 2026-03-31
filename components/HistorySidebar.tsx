import React, { useState, useMemo } from 'react';
import type { HistoryItem } from '../types';
import { Button } from './FormControls';

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onLoad: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({ 
  isOpen, 
  onClose, 
  history, 
  onLoad, 
  onDelete,
  onClear
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHistory = useMemo(() => {
    if (!searchQuery.trim()) return history;
    
    const query = searchQuery.toLowerCase();
    return history.filter(item => {
      const matchName = item.name.toLowerCase().includes(query);
      const dateStr = new Date(item.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).toLowerCase();
      const matchDate = dateStr.includes(query);
      return matchName || matchDate;
    });
  }, [history, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gray-950 text-gray-100 flex flex-col animate-in slide-in-from-bottom-4 fade-in duration-300">
      
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 p-4 shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="bg-blue-600/20 p-2 rounded-lg">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                </div>
                <div className="flex-1">
                    <h2 className="text-xl font-bold text-white">Riwayat Proyek</h2>
                    <p className="text-xs text-gray-400">Pilih proyek tersimpan untuk dimuat kembali</p>
                </div>
                <button 
                    onClick={onClose} 
                    className="sm:hidden px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg transition-colors border border-gray-700 text-xs font-medium"
                >
                    Tutup
                </button>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Cari nama proyek atau tanggal..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 pl-9 pr-3 text-xs sm:text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500 placeholder:text-xs sm:placeholder:text-sm"
                    />
                    {searchQuery && (
                        <button 
                            onClick={() => setSearchQuery('')}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
                {history.length > 0 && (
                    <button 
                        onClick={() => {
                            if(window.confirm('Apakah Anda yakin ingin menghapus semua riwayat?')) {
                                onClear();
                            }
                        }}
                        className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors border border-transparent hover:border-red-900/50"
                        title="Hapus Semua Riwayat"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                        <span className="hidden md:inline">Hapus Semua</span>
                    </button>
                )}
                <button 
                    onClick={onClose} 
                    className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg transition-colors border border-gray-700"
                >
                    <span className="text-sm font-medium">Tutup</span>
                </button>
            </div>
        </div>
      </header>

      {/* Content Grid */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gray-950 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
        <div className="max-w-7xl mx-auto">
            {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4 border-2 border-dashed border-gray-800 rounded-2xl bg-gray-900/30">
                     <div className="bg-gray-800 p-4 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12 text-gray-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                     </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-300">Belum ada riwayat tersimpan</h3>
                        <p className="text-[10px] text-gray-500 mt-1 max-w-sm mx-auto">Prompt yang Anda simpan akan muncul di sini agar mudah diakses kembali.</p>
                    </div>
                    <Button onClick={onClose} variant="secondary">Mulai Desain Baru</Button>
                </div>
            ) : filteredHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[40vh] text-center space-y-4">
                     <div className="bg-gray-800 p-4 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                     </div>
                    <div>
                        <h3 className="text-lg font-medium text-gray-300">Pencarian tidak ditemukan</h3>
                        <p className="text-gray-500 mt-1">Tidak ada riwayat yang cocok dengan "{searchQuery}"</p>
                    </div>
                    <Button onClick={() => setSearchQuery('')} variant="secondary">Hapus Pencarian</Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredHistory.map((item) => (
                    <div 
                        key={item.id} 
                        className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-900/10 transition-all duration-200 group flex flex-col h-full"
                    >
                        <div className="flex justify-between items-start mb-4">
                             <div className="bg-blue-900/20 text-blue-400 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                                {item.aspectRatio}
                             </div>
                             <span className="text-xs text-gray-500 font-mono">
                                {new Date(item.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                             </span>
                        </div>

                        <h3 className="text-lg font-bold text-gray-100 line-clamp-2 mb-2 group-hover:text-blue-400 transition-colors">
                            {item.name}
                        </h3>
                        
                        <div className="flex-1 space-y-2 mb-6">
                             <div className="flex items-center gap-2 text-sm text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-600">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.156 6.388a15.995 15.995 0 0 0-4.647 4.763m0 0c-.399-.078-.78-.22-1.128-.22a3 3 0 0 0-1.128 5.78" />
                                </svg>
                                <span className="truncate">{item.visualStyle}</span>
                             </div>
                             <div className="flex items-center gap-2 text-sm text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-600">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
                                </svg>
                                <span>{item.data.sections.length} Seksi Konten</span>
                             </div>
                        </div>

                        <div className="grid grid-cols-4 gap-2 pt-4 border-t border-gray-800">
                            <button 
                                onClick={() => onLoad(item)}
                                className="col-span-3 flex justify-center items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                </svg>
                                Muat Data
                            </button>
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(item.id);
                                }}
                                className="col-span-1 flex justify-center items-center px-2 py-2.5 bg-gray-800 text-gray-400 hover:text-red-400 hover:bg-red-900/10 border border-gray-700 hover:border-red-900/30 rounded-lg transition-all"
                                title="Hapus Permanen"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    ))}
                </div>
            )}
        </div>
      </main>

      {/* Mobile Footer for Clear All (only if not empty and on small screens) */}
      {history.length > 0 && (
        <div className="sm:hidden p-4 bg-gray-900 border-t border-gray-800">
             <Button variant="secondary" fullWidth onClick={() => {
                 if(window.confirm('Apakah Anda yakin ingin menghapus semua riwayat?')) {
                     onClear();
                 }
             }}>
                Hapus Semua Riwayat
            </Button>
        </div>
      )}
    </div>
  );
};