import React from 'react';

interface CardOption {
  value: string;
  label: string;
  desc: string;
  colors?: string[];
  icon?: React.ReactNode;
}

interface CardSelectorProps {
  label: string;
  options: CardOption[];
  value: string;
  onChange: (val: string) => void;
}

export const CardSelector: React.FC<CardSelectorProps> = ({ label, options, value, onChange }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <label className="block text-lg font-bold text-cyan-400">{label}</label>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
      </div>
      <div className="flex flex-col gap-3">
        {options.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <div
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={`
                cursor-pointer rounded-xl p-4 flex items-center gap-4 transition-all duration-200 border-2
                ${isSelected 
                  ? 'bg-gray-900 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.2)]' 
                  : 'bg-gray-900/50 border-gray-800 hover:border-gray-600 hover:bg-gray-800'
                }
              `}
            >
              {/* Optional Icon Placeholder */}
              {opt.icon ? (
                <div className={`flex-shrink-0 ${isSelected ? 'text-cyan-400' : 'text-gray-400'}`}>
                  {opt.icon}
                </div>
              ) : (
                <div className={`flex-shrink-0 ${isSelected ? 'text-cyan-400' : 'text-gray-500'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                  </svg>
                </div>
              )}
              
              <div className="flex-grow">
                <h4 className={`font-bold text-base mb-1 ${isSelected ? 'text-white' : 'text-gray-200'}`}>
                  {opt.label}
                </h4>
                <p className="text-sm text-gray-500">
                  {opt.desc}
                </p>
                
                {opt.colors && (
                  <div className="flex gap-2 mt-2">
                    {opt.colors.map((colorClass, idx) => (
                      <div key={idx} className={`w-5 h-5 rounded-full ${colorClass} border border-gray-700`}></div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
