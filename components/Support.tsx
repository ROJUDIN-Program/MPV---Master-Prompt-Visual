import React, { useState } from 'react';
import { Sparkles, User, Copy, Check, Smartphone, Github, Instagram, MessageCircle, Globe, Upload, Send, Wallet } from 'lucide-react';

interface SupportProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Support: React.FC<SupportProps> = ({ isOpen, onClose }) => {
  const [customNominal, setCustomNominal] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [showProofSection, setShowProofSection] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('081329466856');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSendWhatsApp = () => {
    const message = encodeURIComponent("Assalamu'alaikum...\n\nHalo, saya ingin mengirimkan bukti transfer untuk upgrade fitur aplikasi MPV dari R_BESAR.ID.\n\nTerimakasih...");
    window.open(`https://wa.me/6281329466856?text=${message}`, '_blank');
  };

  const isValidNominal = parseInt(customNominal || '0') >= 50000;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-gray-950 animate-in fade-in duration-300">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 p-4 shadow-lg sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Sparkles className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Support</h2>
              <p className="text-[10px] sm:text-xs text-gray-400">Dukung pengembangan dan pemeliharaan aplikasi ini</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-200 text-sm font-medium transition-colors border border-gray-700 ml-4 shadow-sm"
          >
            Tutup
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto bg-gray-950 p-4 sm:p-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <p className="text-gray-400 text-[11px] sm:text-xs text-center leading-relaxed px-4">
            Kontribusi Anda memungkinkan kami untuk terus mengembangkan dan memelihara aplikasi ini. Setiap bentuk support, sekecil apa pun, sangat berarti bagi keberlanjutan layanan. Jazakumullah khairan...! 🙏
          </p>

          <div className="flex flex-col items-center gap-2 py-4 w-full">
            <img src="https://upload.wikimedia.org/wikipedia/commons/7/72/Logo_dana_blue.svg" alt="Logo DANA" className="h-8 mb-2" />
            <div className="flex flex-row items-center justify-between w-full gap-2">
              <div className="flex-1 flex items-center justify-center gap-2 text-white font-bold tracking-widest text-sm border border-blue-500/50 bg-blue-500/10 rounded-xl px-2 py-3">
                <User className="w-4 h-4 text-blue-400" />
                <p className="truncate">ROJUDIN</p>
              </div>
              <div className="flex-1 flex items-center justify-center gap-2 text-white font-bold tracking-widest text-sm border border-blue-500/50 bg-blue-500/10 rounded-xl px-2 py-3">
                <Smartphone className="w-4 h-4 text-blue-400" />
                <p className="truncate">081329466856</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-transparent border border-emerald-500/50 rounded-xl space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => setCustomNominal('50000')}
                className="py-2 px-1 bg-gray-800/50 hover:bg-emerald-500/20 border border-gray-700 hover:border-emerald-500/50 rounded-lg text-white text-xs font-bold transition-colors"
              >
                Rp. 50.000
              </button>
              <button 
                onClick={() => setCustomNominal('75000')}
                className="py-2 px-1 bg-gray-800/50 hover:bg-emerald-500/20 border border-gray-700 hover:border-emerald-500/50 rounded-lg text-white text-xs font-bold transition-colors"
              >
                Rp. 75.000
              </button>
              <button 
                onClick={() => setCustomNominal('100000')}
                className="py-2 px-1 bg-gray-800/50 hover:bg-emerald-500/20 border border-gray-700 hover:border-emerald-500/50 rounded-lg text-white text-xs font-bold transition-colors"
              >
                Rp. 100.000
              </button>
            </div>
            
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">Rp.</span>
              <input 
                type="number" 
                placeholder=""
                value={customNominal}
                onChange={(e) => setCustomNominal(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700 focus:border-emerald-500/50 rounded-lg py-2 pl-10 pr-4 text-white text-sm focus:outline-none transition-colors"
              />
            </div>
            {!isValidNominal && customNominal !== '' && (
              <p className="text-red-400 text-xs text-center">Minimal input nominal adalah Rp. 50.000</p>
            )}

            <div className="flex flex-col sm:flex-row gap-2">
              <button 
                onClick={() => window.open('https://link.dana.id/', '_blank')}
                disabled={!isValidNominal}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 font-bold rounded-lg transition-colors ${
                  isValidNominal 
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Wallet className="w-4 h-4" />
                Transfer
              </button>
              <button 
                onClick={handleCopy}
                disabled={!isValidNominal}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 font-bold rounded-lg transition-colors ${
                  isValidNominal 
                    ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {isCopied ? 'Tersalin!' : 'Copy'}
              </button>
              <button 
                onClick={() => setShowProofSection(!showProofSection)}
                disabled={!isValidNominal}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 font-bold rounded-lg transition-colors ${
                  isValidNominal 
                    ? 'bg-purple-500 hover:bg-purple-600 text-white' 
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Upload className="w-4 h-4" />
                Bukti
              </button>
            </div>
          </div>

          {showProofSection && (
            <div className="p-4 bg-gray-900/50 border border-purple-500/30 rounded-xl space-y-4 animate-in fade-in slide-in-from-top-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-purple-400" />
                Kirim Bukti Transfer
              </h3>

              <button 
                onClick={handleSendWhatsApp}
                className="w-full flex items-center justify-center gap-2 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-colors"
              >
                <Send className="w-4 h-4" />
                Kirim via WhatsApp
              </button>
              <p className="text-[10px] text-gray-500 text-center">
                Anda akan diarahkan ke WhatsApp. Jangan lupa lampirkan foto bukti transfer yang sudah Anda siapkan.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
