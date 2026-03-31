import React, { useState } from 'react';

interface LoginPageProps {
  onLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [googleError, setGoogleError] = useState('');

  const handleAccessCodeLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessCode === '024434') {
      onLogin();
    } else {
      setError('Kode akses tidak valid.');
    }
  };

  const handleGoogleLogin = () => {
    setGoogleError('Login dengan Google saat ini belum tersedia. Silakan gunakan Access Code.');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-10">
          <h1 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-2 whitespace-nowrap">
            MPV - MASTER PROMPT VISUAL
          </h1>
          <p className="text-[10px] sm:text-xs text-gray-400 font-medium tracking-wide whitespace-nowrap">
            Platform AI untuk Produksi Prompt Visual Terstruktur & Profesional
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-8">
          
          {/* Google Login Panel */}
          <div>
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 hover:bg-gray-100 px-4 py-2.5 rounded-lg text-xs font-medium transition-colors shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </button>
            {googleError && <p className="text-red-400 text-[9px] sm:text-[10px] mt-2 text-center whitespace-nowrap overflow-hidden text-ellipsis">{googleError}</p>}
          </div>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-gray-800"></div>
            <span className="flex-shrink-0 mx-4 text-gray-500 text-xs uppercase tracking-wider">Atau</span>
            <div className="flex-grow border-t border-gray-800"></div>
          </div>

          {/* Access Code Panel */}
          <div>
            <form onSubmit={handleAccessCodeLogin} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Enter The Access Code"
                  value={accessCode}
                  onChange={(e) => {
                    setAccessCode(e.target.value);
                    setError('');
                  }}
                  style={{ WebkitTextSecurity: 'disc' } as React.CSSProperties}
                  className={`w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-xs sm:text-sm text-center focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder:text-xs sm:placeholder:text-sm placeholder-gray-500 tracking-widest font-bold ${
                    accessCode.length === 0 
                      ? 'text-gray-200' 
                      : '024434'.startsWith(accessCode) 
                        ? 'text-green-500' 
                        : 'text-red-500'
                  }`}
                />
                {error && <p className="text-red-400 text-xs mt-2 ml-1 text-center">{error}</p>}
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-xs font-medium transition-colors shadow-lg shadow-blue-900/20"
              >
                Go To Access
              </button>
            </form>
          </div>

          {/* Warning Panel */}
          <div className="bg-yellow-900/40 border border-yellow-500/30 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-yellow-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                  <h3 className="font-bold text-yellow-300">WARNING</h3>
              </div>
              <p className="text-[9px] sm:text-[10px] text-yellow-300/80 leading-relaxed">
                  It is strictly prohibited to sell, distribute, or utilise these tools for commercial purposes in any form without written permission from the Developer.
                  <br />
                  Any violations will be processed in accordance with applicable regulations.
              </p>
          </div>

        </div>
      </div>
    </div>
  );
};
