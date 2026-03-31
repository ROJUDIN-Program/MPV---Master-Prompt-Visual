import React, { useRef } from 'react';

const MAX_FILE_SIZE_MB = 50;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

interface PdfUploadProps {
  pdfData: string | null;
  fileName: string | null;
  onUpload: (base64: string, fileName: string) => void;
  onRemove: () => void;
}

export const PdfUpload: React.FC<PdfUploadProps> = ({ pdfData, fileName, onUpload, onRemove }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validasi ukuran file
    if (file.size > MAX_FILE_SIZE_BYTES) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      alert(`Gagal mengunggah: Ukuran file PDF Anda (${fileSizeMB} MB) melebihi batas maksimal yang diizinkan yaitu ${MAX_FILE_SIZE_MB} MB. Mohon kompres file Anda atau pilih file yang lebih kecil.`);
      if (fileInputRef.current) fileInputRef.current.value = ""; // Reset input
      return;
    }

    if (file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // Robust way to get base64: split by comma and take the second part
        const base64Clean = result.split(',')[1];
        if (base64Clean) {
            onUpload(base64Clean, file.name);
        } else {
            alert("Gagal memproses file PDF.");
        }
      };
      reader.readAsDataURL(file);
    } else {
      alert("Mohon upload file dengan format PDF.");
      if (fileInputRef.current) fileInputRef.current.value = ""; // Reset input
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mt-3">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="application/pdf" 
        className="hidden" 
      />
      
      {!pdfData ? (
        <button
          onClick={triggerFileInput}
          className="flex flex-col items-center gap-3 text-sm font-medium text-blue-400 hover:text-blue-300 transition-all border-2 border-dashed border-blue-500/30 hover:border-blue-500/60 rounded-xl py-8 w-full justify-center bg-blue-900/5 hover:bg-blue-900/20 group"
        >
          <div className="p-3 bg-blue-500/10 rounded-full group-hover:scale-110 transition-transform duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
          </div>
          <div className="text-center">
             <span className="block font-semibold">Upload File PDF</span>
             <span className="text-xs text-blue-400/70 mt-1">Maks. {MAX_FILE_SIZE_MB}MB</span>
          </div>
        </button>
      ) : (
        <div className="flex items-center justify-between bg-blue-900/20 border border-blue-500/30 rounded px-3 py-2">
          <div className="flex items-center gap-2 overflow-hidden">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-red-400 flex-shrink-0">
                <path fillRule="evenodd" d="M5.625 1.5H9a3.75 3.75 0 0 1 3.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 0 1 3.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 0 1-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875ZM12.75 12a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V18a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V12Z" clipRule="evenodd" />
                <path d="M14.25 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 16.5 7.5h-1.875a.375.375 0 0 1-.375-.375V5.25Z" />
             </svg>
             <span className="text-xs text-blue-200 truncate font-medium">{fileName}</span>
          </div>
          <button 
            onClick={onRemove}
            className="text-gray-400 hover:text-red-400 ml-2 transition-colors"
            title="Hapus PDF"
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