import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info, Mail, Instagram, Globe, ChevronRight } from 'lucide-react';

interface DeveloperProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeveloperProfileModal: React.FC<DeveloperProfileModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-[200] bg-gray-950 flex flex-col text-gray-300"
        >
          {/* Header */}
          <header className="bg-gray-900 border-b border-gray-800 p-4 shadow-lg sticky top-0 z-10">
            <div className="max-w-2xl mx-auto flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Info className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Profil Developer</h2>
                  <p className="text-[10px] text-gray-400">Informasi & Kontak Komunitas</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-200 text-sm font-medium transition-colors border border-gray-700 shadow-sm"
              >
                Tutup
              </button>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-8 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
            <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              
              {/* 1. Profil */}
              <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700/50">
                <h4 className="font-bold text-gray-200 mb-3 text-sm flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs">1</span>
                  Profil
                </h4>
                <ul className="space-y-2 text-xs text-gray-400">
                  <li><span className="text-gray-300 font-medium">Nama:</span> Rojudin</li>
                  <li><span className="text-gray-300 font-medium">User ID:</span> R_BESAR.ID</li>
                  <li><span className="text-gray-300 font-medium">Peran Utama:</span> Developer & Kreator</li>
                  <li><span className="text-gray-300 font-medium">Lokasi:</span> Cibinong, Bogor</li>
                </ul>
              </div>

              {/* 2. Bio */}
              <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700/50">
                <h4 className="font-bold text-gray-200 mb-3 text-sm flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs">2</span>
                  Bio
                </h4>
                <p className="text-xs italic text-gray-400 border-l-2 border-blue-500/50 pl-3">
                  "Seorang pengembang perangkat lunak yang berfokus pada penciptaan tools produktivitas yang intuitif dan cepat. Saya suka mengubah masalah kompleks menjadi antarmuka yang sederhana."
                </p>
              </div>

              {/* 3. Keahlian Utama */}
              <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700/50">
                <h4 className="font-bold text-gray-200 mb-3 text-sm flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs">3</span>
                  Keahlian Utama
                </h4>
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      {['React', 'Node.js', 'Python', 'UI/UX Design'].map(tech => (
                        <span key={tech} className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded-md border border-blue-500/20">{tech}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Kontak & Komunitas */}
              <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700/50">
                <h4 className="font-bold text-gray-200 mb-3 text-sm flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs">4</span>
                  Kontak & Komunitas
                </h4>
                <div className="space-y-3 text-xs">
                  <a href="mailto:rojudin.developer@gmail.com" className="flex items-center gap-3 text-red-500 hover:text-red-400 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                      <Mail className="w-4 h-4 text-red-500" />
                    </div>
                    <span>rojudin.developer@gmail.com</span>
                  </a>
                  <a href="https://wa.me/6281329466856" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-green-500 hover:text-green-400 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-green-500">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                    </div>
                    <span>+6281329466856</span>
                  </a>
                  <a href="https://instagram.com/r_besar.id" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-pink-500 hover:text-pink-400 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-pink-500/10 flex items-center justify-center">
                      <Instagram className="w-4 h-4 text-pink-500" />
                    </div>
                    <span>r_besar.id</span>
                  </a>
                  <a href="https://lynk.id/r_besar.id" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-blue-500 hover:text-blue-400 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <Globe className="w-4 h-4 text-blue-500" />
                    </div>
                    <span>https://lynk.id/r_besar.id</span>
                  </a>
                </div>
              </div>

            </div>
          </main>

          {/* Footer */}
          <footer className="bg-gray-900 border-t border-gray-800 py-6">
            <div className="max-w-2xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-gray-500 text-[10px] font-bold">
                Copyright © 2026 R_besar.id | All rights reserved.
              </p>
            </div>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
