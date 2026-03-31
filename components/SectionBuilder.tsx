import React from 'react';
import type { Section } from '../types';
import { Input, Textarea, Button } from './FormControls';

interface SectionBuilderProps {
  sections: Section[];
  onChange: (index: number, field: keyof Omit<Section, 'id'>, value: string) => void;
  onAdd: () => void;
  onRemove: (id: number) => void;
}

export const SectionBuilder: React.FC<SectionBuilderProps> = ({ sections, onChange, onAdd, onRemove }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-blue-500 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 17.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
        </svg>
        Bagian Informasi
      </h3>
      {sections.map((section, index) => (
        <div key={section.id} className="p-4 border border-gray-700 rounded-lg space-y-3 bg-gray-800/50 relative">
          <button
            type="button"
            onClick={() => onRemove(section.id)}
            className="absolute top-2 right-2 text-gray-500 hover:text-red-500 transition-colors"
            aria-label="Remove section"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <Input 
            id={`section_title_${index}`}
            label={`Judul Seksi ${index + 1}`} 
            value={section.title}
            onChange={(e) => onChange(index, 'title', e.target.value)}
          />
          <Textarea 
            id={`section_text_${index}`}
            label="Poin Ringkas (pisahkan dengan ; )" 
            value={section.text}
            onChange={(e) => onChange(index, 'text', e.target.value)}
            rows={2}
          />
          <Input
            id={`section_visual_${index}`}
            label="Visual Pendukung (kata kunci)" 
            value={section.visual_hint}
            onChange={(e) => onChange(index, 'visual_hint', e.target.value)}
          />
        </div>
      ))}
      <Button onClick={onAdd} variant="primary" className="text-xs py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm transition-colors flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Tambah Seksi
      </Button>
    </div>
  );
};