import React, { useState } from 'react';
import type { Preset } from '../types';

interface PresetSelectorProps {
  presets: Preset[];
  onSelect: (preset: Preset) => void;
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({ presets, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-6 bg-gray-800/30 border border-gray-700 rounded-lg overflow-hidden transition-all duration-300">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-800/50 transition-colors group"
      >
        <h3 className="text-lg font-semibold text-blue-400 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
            </svg>
            Preset
        </h3>
        <button className="text-gray-400 group-hover:text-blue-300 transition-colors">
            {isOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5-7.5" />
                </svg>
            )}
        </button>
      </div>

      {isOpen && (
        <div className="px-4 pb-4 animate-in slide-in-from-top-2 fade-in duration-200">
            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-700/50">
                {presets.map(preset => (
                <button
                    key={preset.id}
                    onClick={() => {
                        onSelect(preset);
                        setIsOpen(false); // Optional: Close after selection to keep UI clean
                    }}
                    className="px-3 py-1 text-sm bg-gray-700 text-gray-200 rounded-full hover:bg-gray-600 hover:text-blue-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                    title={preset.description}
                >
                    {preset.label}
                </button>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};