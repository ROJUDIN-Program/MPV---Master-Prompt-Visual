import React, { useState } from 'react';
import { Button } from './FormControls';

interface VeoPromptViewProps {
  prompt: string;
}

export const VeoPromptView: React.FC<VeoPromptViewProps> = ({ prompt }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-blue-500/30 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
            <h2 className="text-xl font-semibold text-blue-400">Prompt Veo 3.1 (Video)</h2>
        </div>
        <Button
          onClick={handleCopy}
          variant="primary"
          className="text-sm py-1 px-3"
        >
          {copied ? 'Tersalin!' : 'Salin Prompt Video'}
        </Button>
      </div>
      
      <div className="bg-gray-900/90 p-4 rounded-md border border-gray-700 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-2 opacity-50 group-hover:opacity-100 transition-opacity">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-blue-600">
                <path d="M4.5 4.5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h8.25a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3H4.5ZM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06Z" />
            </svg>
        </div>
        <p className="text-gray-300 whitespace-pre-wrap break-words font-mono text-sm leading-relaxed">
            {prompt}
        </p>
      </div>

      <div className="mt-4 text-xs text-gray-500 flex items-start gap-2 bg-gray-800 p-2 rounded">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
        <p>
            Prompt ini dioptimalkan untuk <strong>Google Veo 3.1</strong>. Gunakan prompt ini setelah Anda menghasilkan aset gambar utama (Image-to-Video) atau gunakan langsung (Text-to-Video) untuk hasil visual bergerak yang konsisten dengan gaya infografis Anda.
        </p>
      </div>
    </div>
  );
};