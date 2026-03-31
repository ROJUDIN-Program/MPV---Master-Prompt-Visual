import React, { useState } from 'react';
import { createPortal } from 'react-dom';

interface Option {
  value: string;
  label: string;
  desc: string;
  colors?: string[];
  icon?: React.ReactNode;
}

interface ModalSelectorProps {
  label: string;
  options: Option[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  labelClassName?: string;
}

export const ModalSelector: React.FC<ModalSelectorProps> = ({ label, options, value, onChange, placeholder = 'Pilih...', labelClassName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentOption = options.find(o => o.value === value);

  return (
    <>
      <div className="relative">
        <label className={labelClassName || "block text-sm font-medium text-blue-300 mb-1"}>{label}</label>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`relative w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm px-3 pr-10 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-[42px] flex items-center gap-3 transition-colors hover:border-blue-500/50 ${!currentOption ? 'text-gray-500' : 'text-gray-200'}`}
        >
          <span className="block truncate text-xs sm:text-sm">{currentOption?.label || placeholder}</span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </span>
        </button>
      </div>

      {isOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[99999] flex flex-col bg-gray-950 animate-in slide-in-from-bottom-10 fade-in duration-300">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900 shadow-md">
            <div className="max-w-3xl mx-auto w-full flex justify-between items-center">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white">{label}</h3>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-200 text-sm font-medium transition-colors border border-gray-700 shadow-sm"
              >
                Tutup
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto bg-gray-950 p-4 sm:p-6">
            <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
              {options.map((opt) => {
                const isSelected = value === opt.value;
                return (
                  <div
                    key={opt.value}
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    className={`
                      cursor-pointer rounded-xl p-3 flex items-start gap-3 transition-all duration-200 border-2 min-h-[100px] h-auto overflow-hidden
                      ${isSelected 
                        ? 'bg-gray-900 border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.3)]' 
                        : 'bg-gray-900/50 border-gray-800 hover:border-gray-600 hover:bg-gray-800'
                      }
                    `}
                  >
                    {/* Icon Placeholder */}
                    <div className={`flex-shrink-0 mt-1 ${isSelected ? 'text-blue-400' : 'text-gray-400'}`}>
                      {opt.icon ? opt.icon : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                        </svg>
                      )}
                    </div>
                    
                    <div className="flex-grow min-w-0">
                      <h4 className={`font-bold text-sm mb-0.5 ${isSelected ? 'text-white' : 'text-gray-200'}`}>
                        {opt.label}
                      </h4>
                      <p className="text-xs text-gray-500 leading-snug">
                        {opt.desc}
                      </p>
                      
                      {opt.colors && (
                        <div className="flex gap-1.5 mt-1.5">
                          {opt.colors.map((colorClass, idx) => (
                            <div key={idx} className={`w-4 h-4 rounded-full ${colorClass} border border-gray-700`}></div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
