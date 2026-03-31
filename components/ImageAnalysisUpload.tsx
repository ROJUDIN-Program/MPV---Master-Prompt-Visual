import React, { useRef } from 'react';

const MAX_FILE_SIZE_MB = 25;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

interface ImageAnalysisUploadProps {
  imageData: { data: string; name: string } | null;
  onUpload: (base64: string, mimeType: string, fileName: string) => void;
  onRemove: () => void;
}

export const ImageAnalysisUpload: React.FC<ImageAnalysisUploadProps> = ({ imageData, onUpload, onRemove }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validasi ukuran file
    if (file.size > MAX_FILE_SIZE_BYTES) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      alert(`Gagal mengunggah: Ukuran file gambar Anda (${fileSizeMB} MB) melebihi batas maksimal yang diizinkan yaitu ${MAX_FILE_SIZE_MB} MB. Mohon kompres gambar Anda atau pilih file yang lebih kecil.`);
      if (fileInputRef.current) fileInputRef.current.value = ""; // Reset input
      return;
    }

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // Robust way to get base64: split by comma and take the second part
        const base64Clean = result.split(',')[1];
        if (base64Clean) {
            onUpload(base64Clean, file.type, file.name);
        } else {
            alert("Gagal memproses gambar.");
        }
      };
      reader.readAsDataURL(file);
    } else {
      alert("Mohon upload file gambar (JPG, PNG, WEBP).");
      if (fileInputRef.current) fileInputRef.current.value = ""; // Reset input
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mt-2">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
      
      {!imageData ? (
        <button
          onClick={triggerFileInput}
          className="flex flex-col items-center gap-3 text-sm font-medium text-green-400 hover:text-green-300 transition-all border-2 border-dashed border-green-500/30 hover:border-green-500/60 rounded-xl py-8 w-full justify-center bg-green-900/5 hover:bg-green-900/20 group"
        >
          <div className="p-3 bg-green-500/10 rounded-full group-hover:scale-110 transition-transform duration-200">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
          </div>
          <div className="text-center">
             <span className="block font-semibold">Upload Gambar Referensi</span>
             <span className="text-xs text-green-400/70 mt-1">Maks. {MAX_FILE_SIZE_MB}MB</span>
          </div>
        </button>
      ) : (
        <div className="flex items-center justify-between bg-green-900/20 border border-green-500/30 rounded px-3 py-2">
          <div className="flex items-center gap-2 overflow-hidden">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-green-400 flex-shrink-0">
                <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clipRule="evenodd" />
             </svg>
             <span className="text-xs text-green-200 truncate font-medium">{imageData.name}</span>
          </div>
          <button 
            onClick={onRemove}
            className="text-gray-400 hover:text-red-400 ml-2 transition-colors"
            title="Hapus Gambar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};