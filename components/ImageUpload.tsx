import React, { useRef } from 'react';
import { Button } from './FormControls';

interface ImageUploadProps {
  image: string | null;
  onUpload: (base64: string, mimeType: string) => void;
  onRemove: () => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ image, onUpload, onRemove }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onUpload(base64String, file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-blue-300">
        Referensi Visual (Opsional)
      </label>
      
      {!image ? (
        <div 
          onClick={triggerFileInput}
          className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-gray-800/50 transition-all group"
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
          <div className="flex flex-col items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-400 group-hover:text-blue-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            <p className="text-sm text-gray-400 group-hover:text-gray-200">
              Klik untuk upload gambar referensi gaya/layout
            </p>
          </div>
        </div>
      ) : (
        <div className="relative bg-gray-800 border border-gray-700 rounded-lg p-2 flex items-center gap-4">
          <div className="h-16 w-16 flex-shrink-0 bg-gray-900 rounded overflow-hidden border border-gray-600">
            <img src={image} alt="Reference" className="h-full w-full object-cover" />
          </div>
          <div className="flex-grow min-w-0">
            <p className="text-sm text-gray-200 truncate">Gambar Referensi Terpasang</p>
            <p className="text-xs text-gray-500">Akan digunakan sebagai panduan visual.</p>
          </div>
          <button 
            onClick={onRemove}
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-full transition-colors"
            title="Hapus gambar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};
