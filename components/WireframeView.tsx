import React from 'react';
import type { FormData } from '../types';

interface WireframeViewProps {
  formData: FormData;
  aspectRatio: string;
}

export const WireframeView: React.FC<WireframeViewProps> = ({ formData, aspectRatio }) => {
  // Convert "9:16" to "9/16" for CSS aspect-ratio
  const ratioStyle = { aspectRatio: aspectRatio.replace(':', '/') };

  return (
    <div className="flex justify-center bg-gray-900/50 p-4 rounded-lg border border-gray-700 overflow-hidden">
      <div 
        className="w-full max-w-[350px] bg-gray-200 text-gray-900 p-4 flex flex-col gap-3 shadow-2xl relative"
        style={ratioStyle}
      >
        {/* Guide Lines overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-10 grid grid-cols-2 grid-rows-4 gap-4 p-4">
             <div className="border border-gray-900 border-dashed"></div>
             <div className="border border-gray-900 border-dashed"></div>
             <div className="border border-gray-900 border-dashed"></div>
             <div className="border border-gray-900 border-dashed"></div>
             <div className="border border-gray-900 border-dashed"></div>
             <div className="border border-gray-900 border-dashed"></div>
             <div className="border border-gray-900 border-dashed"></div>
             <div className="border border-gray-900 border-dashed"></div>
        </div>

        {/* Header */}
        <div className="border-2 border-gray-800 p-2 text-center bg-white/50 z-10 flex flex-col gap-1">
          <div className="h-4 bg-gray-800 w-3/4 mx-auto mb-1"></div>
          <p className="text-[10px] font-bold uppercase tracking-widest leading-tight">{formData.title || "JUDUL UTAMA"}</p>
          <p className="text-[8px] italic text-gray-600 leading-tight">{formData.subtitle || "Subjudul Penjelas"}</p>
          
           <div className="w-full mt-1 pt-1 border-t border-gray-300">
                <p className="text-[5px] text-gray-500 font-mono text-center">
                    Sumber: {formData.sources || "Sumber Data"}
                </p>
           </div>
        </div>

        {/* Hero Visual */}
        <div className="flex-grow-[2] border-2 border-dashed border-blue-600 bg-blue-100/50 flex flex-col items-center justify-center p-2 relative z-10">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-blue-600 mb-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
          <span className="text-[8px] font-mono text-blue-800 text-center px-2 line-clamp-3">
            {formData.main_subject ? `HERO: ${formData.main_subject.substring(0, 50)}...` : "HERO IMAGE"}
          </span>
          {formData.main_attribute && (
             <span className="text-[7px] bg-blue-200 px-1 rounded mt-1">Attr: {formData.main_attribute}</span>
          )}
        </div>

        {/* Sections Grid */}
        <div className="flex-grow-[3] grid grid-cols-1 gap-2 z-10">
            {formData.sections.length > 0 ? (
                formData.sections.map((section, idx) => (
                    <div key={section.id} className="flex gap-2 items-start border border-gray-400 p-1 bg-white">
                        <div className="w-6 h-6 bg-gray-300 flex-shrink-0 flex items-center justify-center">
                            <span className="text-[8px]">{idx + 1}</span>
                        </div>
                        <div className="min-w-0">
                            <div className="h-2 bg-gray-600 w-12 mb-1"></div>
                            <div className="h-1 bg-gray-400 w-full mb-0.5"></div>
                            <div className="h-1 bg-gray-400 w-2/3"></div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="border border-gray-400 border-dashed p-4 text-center text-[8px]">No Sections Added</div>
            )}
        </div>

        {/* Side Panels */}
        <div className="flex flex-wrap gap-1 justify-center z-10">
            {formData.enable_timeline && <div className="bg-blue-100 border border-blue-400 px-2 py-0.5 text-[7px] text-blue-800 rounded">Timeline</div>}
            {formData.enable_map && <div className="bg-green-100 border border-green-400 px-2 py-0.5 text-[7px] text-green-800 rounded">Map</div>}
            {formData.enable_factbox && <div className="bg-yellow-100 border border-yellow-400 px-2 py-0.5 text-[7px] text-yellow-800 rounded">Facts</div>}
            {formData.enable_statistics && <div className="bg-red-100 border border-red-400 px-2 py-0.5 text-[7px] text-red-800 rounded">Stats</div>}
            {formData.enable_quote && <div className="bg-purple-100 border border-purple-400 px-2 py-0.5 text-[7px] text-purple-800 rounded">Quote</div>}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-400 pt-2 flex justify-center items-end z-10">
             <div className="text-[6px] font-mono bg-gray-800 text-gray-200 px-1">
                {formData.brand_url || "BRAND_URL"}
             </div>
        </div>

      </div>
    </div>
  );
};