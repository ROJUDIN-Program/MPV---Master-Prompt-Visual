import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Info, 
  Heart, 
  CheckCircle2,
  ChevronRight,
  MessageCircle,
  Instagram,
  Globe,
  Mail
} from 'lucide-react';

interface SidebarOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

type MenuSection = 'main' | 'about' | 'thanks' | 'verified';

export const SidebarOverlay: React.FC<SidebarOverlayProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState<MenuSection>('main');
  const [verifiedUser, setVerifiedUser] = useState<{name: string, phone: string, dialCode: string} | null>(null);

  useEffect(() => {
    if (isOpen) {
      const isVerified = localStorage.getItem('infographic_account_verified') === 'true';
      if (isVerified) {
        const name = localStorage.getItem('infographic_profile_name') || 'Pengguna';
        const phone = localStorage.getItem('infographic_profile_phone') || '';
        const countryCode = localStorage.getItem('infographic_profile_country') || 'ID';
        
        const COUNTRIES = [
          { code: 'ID', dialCode: '+62' },
          { code: 'MY', dialCode: '+60' },
          { code: 'SG', dialCode: '+65' },
          { code: 'SA', dialCode: '+966' },
          { code: 'PS', dialCode: '+970' },
          { code: 'CN', dialCode: '+86' },
          { code: 'JP', dialCode: '+81' },
          { code: 'US', dialCode: '+1' },
          { code: 'DE', dialCode: '+49' },
          { code: 'GB', dialCode: '+44' },
        ];
        const dialCode = COUNTRIES.find(c => c.code === countryCode)?.dialCode || '+62';
        
        setVerifiedUser({ name, phone, dialCode });
      } else {
        setVerifiedUser(null);
      }
    }
  }, [isOpen]);

  const menuItems = [
    { id: 'about', label: 'Tentang Aplikasi', icon: <Info className="w-5 h-5" />, color: 'text-blue-400', desc: 'Informasi detail tentang aplikasi ini' },
    { id: 'thanks', label: 'Thanks To', icon: <Heart className="w-5 h-5" />, color: 'text-pink-400', desc: 'Apresiasi untuk alat & teknologi pendukung' },
    { id: 'verified', label: 'Pengguna Terverifikasi', icon: <CheckCircle2 className="w-5 h-5" />, color: 'text-green-400', desc: 'Daftar pengguna yang telah terverifikasi' },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'about':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <button 
              onClick={() => setActiveSection('main')}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4 text-xs"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              <span>Kembali</span>
            </button>
            <h3 className="text-xl font-bold text-white">Tentang Aplikasi</h3>
            
            <div className="space-y-6 text-gray-400 text-sm leading-relaxed">
              {/* 1. Tentang Aplikasi */}
              <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700/50">
                <h4 className="font-bold text-gray-200 mb-3 text-sm flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs">1</span>
                  Tentang Aplikasi
                </h4>
                <ul className="space-y-3 text-xs text-gray-400">
                  <li><span className="text-gray-300 font-medium block mb-1">Nama:</span> MASTER PROMPT VISUAL</li>
                  <li><span className="text-gray-300 font-medium block mb-1">Tujuan:</span> Platform AI untuk Produksi Prompt Visual Terstruktur & Profesional.</li>
                  <li><span className="text-gray-300 font-medium block mb-1">Deskripsi:</span> Master Prompt Visual adalah tools otomatisasi cerdas dalam menganalisis berbagai topik secara mendalam untuk menghasilkan draf struktur prompt visual (Infografis, Timelapse, Carousel) secara instan. Dirancang untuk mengakselerasi produktivitas dan kualitas desain, platform ini memberdayakan Content Creator, Desainer, Dosen, Mahasiswa, hingga Institusi dan Lembaga dalam menyusun arahan visual yang efektif dengan presisi tinggi.</li>
                </ul>
                <div className="mt-4 bg-gray-900/50 p-3 rounded-lg border border-gray-700/50">
                  <h4 className="font-bold text-gray-200 mb-2 text-sm">Versi 1.0.0</h4>
                  <ul className="list-disc list-inside space-y-1 text-xs text-gray-400">
                    <li>Peningkatan Analisis Kompleks</li>
                    <li>Sistem Section Dinamis</li>
                    <li>Optimasi Prompt untuk Nano Banana & Veo 3.1</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
      case 'thanks':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <button 
              onClick={() => setActiveSection('main')}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4 text-xs"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              <span>Kembali</span>
            </button>
            <h3 className="text-xl font-bold text-white">Thanks To</h3>
            <div className="space-y-4">
              <div className="grid gap-3">
                {[
                  { 
                    name: '۞ Allah SWT', 
                    desc: 'Terima kasih kepada Dzat pengatur nafas kehidupan dan pemenuh segalaku. Only Allah SWT is the almighty most powerfull, my important than everything for my life and my first love in my life',
                    color: 'text-emerald-400'
                  },
                  { 
                    name: '۞ Nabi Muhammad SAW', 
                    desc: 'Terima kasih wahai pembawa risalah agama yang sempurna, serta penerang mata hati dengan nur Ilahi hingga akhir zaman.',
                    color: 'text-emerald-400'
                  },
                  { 
                    name: '۞ Keluarga Besar', 
                    desc: 'Terima kasih atas segala hal yang bermakna. Bagi saya kalian adalah penjaga api kehidupan saya agar tidak padam. Terima kasih sudah memberikan sebuah kehidupan yang diliputi dengan cinta, support dan persahabatan. Thanks for the gen...!',
                    color: 'text-amber-400'
                  },
                  { 
                    name: '۞ Wajah Penyayang', 
                    desc: 'Terima kasih kepada wajah penyayangmu, dan atas segala lamunan itu. Dalam setiap do\'a, ku harap kau tetap ke lurus. Karya ini terlahir atas sebab izinmu.\n\n#14Februari',
                    color: 'text-rose-400'
                  },
                  { 
                    name: '۞ Lainnya', 
                    desc: 'Terimakasih untuk kalian semua :\n\n• Keluarga Besar Alumni SMP Islam Al-Karimah Tahun 2012\n• Keluarga Besar Alumni SMK Mahardika Tahun 2015\n• Nur Iskandar\n• M. Rifa\'i\n• Rendi Sasmita\n• Ade Hidayat\n• Anggi Supriyatna\n• Suryadi\n• Dede Kurniawan\n• M. Imam Turmudzi\n• M. Ridwan\n• Wildan Saputra\n• Bagus Budiyarsa\n• M. Juna\n• Heri Bachtiar\n• Algiono\n• Aldiansyah\n• Eli Santi\n• Vhia Nuraeni\n• Rosita\n• Ade Firmansyah\n• Yosep Andrian\n\nKalian seperti baja yang keras, yang mendorong lokomotif kehidupan saya agar terus berjalan. Thanks my bro & sist, keep solid...!',
                    color: 'text-blue-400'
                  }
                ].map((item, i) => (
                  <div key={i} className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/30">
                    <h4 className={`font-bold text-sm mb-1 ${item.color || 'text-blue-400'}`}>{item.name}</h4>
                    {item.desc && <p className="text-xs text-gray-300 whitespace-pre-wrap leading-relaxed">{item.desc}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'verified':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <button 
              onClick={() => setActiveSection('main')}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4 text-xs"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              <span>Kembali</span>
            </button>
            <div className="bg-gray-800/20 p-6 rounded-xl border border-green-500/30">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <h3 className="text-lg font-bold text-white">Pengguna Terverifikasi</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xs">
                      DV
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-200">Developer</p>
                      <p className="text-[10px] text-green-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        +62 813-2946-6856
                      </p>
                    </div>
                  </div>
                  <div className="px-2 py-1 bg-green-500/10 text-green-400 text-[9px] font-bold rounded-full border border-green-500/20">
                    VERIFIED
                  </div>
                </div>
                
                {verifiedUser && (
                  <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-xs">
                        {verifiedUser.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-200">{verifiedUser.name}</p>
                        <p className="text-[10px] text-green-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                          {verifiedUser.dialCode} {verifiedUser.phone}
                        </p>
                      </div>
                    </div>
                    <div className="px-2 py-1 bg-green-500/10 text-green-400 text-[9px] font-bold rounded-full border border-green-500/20">
                      VERIFIED
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            <div className="grid gap-3">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as MenuSection)}
                  className="w-full flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-700/50 hover:border-blue-500/50 hover:bg-gray-800/50 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2.5 bg-gray-900 rounded-lg ${item.color} group-hover:scale-105 transition-transform`}>
                      {item.icon}
                    </div>
                    <div className="text-left">
                      <span className="block text-sm font-bold text-gray-200">{item.label}</span>
                      <span className="text-[10px] text-gray-500">{item.desc}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
                </button>
              ))}
            </div>
          </div>
        );
    }
  };

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
          {/* Header - Styled like StatisticsModal */}
          <header className="bg-gray-900 border-b border-gray-800 p-4 shadow-lg sticky top-0 z-10">
            <div className="max-w-2xl mx-auto flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Info className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Tentang Kami</h2>
                  <p className="text-[10px] text-gray-400">Informasi & Detail Aplikasi</p>
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
            <div className="max-w-2xl mx-auto">
              {renderContent()}
            </div>
          </main>

          {/* Footer */}
          <footer className="bg-gray-900 border-t border-gray-800 py-6">
            <div className="max-w-2xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-gray-500 text-[10px] font-bold animate-pulse">
                Copyright © 2026 R_besar.id | All rights reserved.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-[10px] text-gray-500 hover:text-white transition-colors font-medium">Privacy Policy</a>
                <a href="#" className="text-[10px] text-gray-500 hover:text-white transition-colors font-medium">Terms of Service</a>
              </div>
            </div>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
