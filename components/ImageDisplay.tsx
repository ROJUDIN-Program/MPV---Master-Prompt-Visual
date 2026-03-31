import React from 'react';

interface ImageDisplayProps {
  image: string | null;
  isLoading: boolean;
  error: string | null;
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ image, isLoading, error }) => {
  return (
    <div className="bg-stone-800/50 p-6 rounded-lg border border-stone-700 aspect-w-3 aspect-h-4">
      <div className="w-full h-full flex items-center justify-center">
        {isLoading && (
          <div className="text-center text-blue-300">
            <div className="w-12 h-12 border-4 border-t-transparent border-blue-400 rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 font-semibold">Generating infographic...</p>
            <p className="text-sm text-stone-400">This may take a moment.</p>
          </div>
        )}
        {error && (
            <div className="text-center text-red-400 bg-red-900/50 p-4 rounded-md">
                <h3 className="font-bold">Error Generating Image</h3>
                <p className="text-sm mt-1">{error}</p>
            </div>
        )}
        {!isLoading && !error && image && (
          <img src={image} alt="Generated Infographic" className="object-contain max-w-full max-h-full rounded-md shadow-lg" />
        )}
        {!isLoading && !error && !image && (
          <div className="text-center text-stone-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            <p className="mt-2">Your generated image will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};