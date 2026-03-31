import React, { useState, useRef, useEffect } from 'react';
import { Lock, Save, Edit2 } from 'lucide-react';

interface ProfilePageProps {
  isOpen: boolean;
  onClose: () => void;
}

const COUNTRIES = [
  { code: 'ID', dialCode: '+62', flag: '🇮🇩', name: 'Indonesia' },
  { code: 'MY', dialCode: '+60', flag: '🇲🇾', name: 'Malaysia' },
  { code: 'SG', dialCode: '+65', flag: '🇸🇬', name: 'Singapura' },
  { code: 'SA', dialCode: '+966', flag: '🇸🇦', name: 'Arab Saudi' },
  { code: 'PS', dialCode: '+970', flag: '🇵🇸', name: 'Palestina' },
  { code: 'CN', dialCode: '+86', flag: '🇨🇳', name: 'China' },
  { code: 'JP', dialCode: '+81', flag: '🇯🇵', name: 'Jepang' },
  { code: 'US', dialCode: '+1', flag: '🇺🇸', name: 'Amerika Serikat' },
  { code: 'DE', dialCode: '+49', flag: '🇩🇪', name: 'Jerman' },
  { code: 'GB', dialCode: '+44', flag: '🇬🇧', name: 'Inggris' },
];

export const ProfilePage: React.FC<ProfilePageProps> = ({ isOpen, onClose }) => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userName, setUserName] = useState('Pengguna Infographic Tools');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [instagram, setInstagram] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isApiKeyDisabled, setIsApiKeyDisabled] = useState(false);
  const [isNameDisabled, setIsNameDisabled] = useState(false);
  const [isPhoneDisabled, setIsPhoneDisabled] = useState(false);
  const [isIgDisabled, setIsIgDisabled] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedImage = localStorage.getItem('infographic_profile_image');
    if (savedImage) setProfileImage(savedImage);
    
    const savedName = localStorage.getItem('infographic_profile_name');
    if (savedName) {
        setUserName(savedName);
        setIsNameDisabled(true);
    }
    
    const savedPhone = localStorage.getItem('infographic_profile_phone');
    if (savedPhone) {
        setPhoneNumber(savedPhone);
        setIsPhoneDisabled(true);
    }
    
    const savedIg = localStorage.getItem('infographic_profile_ig');
    if (savedIg) {
        setInstagram(savedIg);
        setIsIgDisabled(true);
    }

    const savedApiKey = localStorage.getItem('infographic_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setIsApiKeyDisabled(true);
    }

    const savedVerified = localStorage.getItem('infographic_account_verified');
    if (savedVerified === 'true') setIsVerified(true);

    const savedCountry = localStorage.getItem('infographic_profile_country');
    if (savedCountry) {
      const country = COUNTRIES.find(c => c.code === savedCountry);
      if (country) setSelectedCountry(country);
    }
  }, []);

  const isDeveloper = phoneNumber === '81329466856' || phoneNumber === '081329466856' || phoneNumber === '+6281329466856';
  const displayVerified = isVerified || isDeveloper;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setUserName(e.target.value);
  };

  const handleSaveName = () => {
      localStorage.setItem('infographic_profile_name', userName);
      setIsNameDisabled(true);
  };

  const handleEditName = () => {
      setIsNameDisabled(false);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let val = e.target.value;
      val = val.replace(/^0+/, ''); // Remove leading zeros
      setPhoneNumber(val);
  };

  const handleSavePhone = () => {
      localStorage.setItem('infographic_profile_phone', phoneNumber);
      setIsPhoneDisabled(true);
  };

  const handleEditPhone = () => {
      setIsPhoneDisabled(false);
  };

  const handleIgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInstagram(e.target.value);
  };

  const handleSaveIg = () => {
      localStorage.setItem('infographic_profile_ig', instagram);
      setIsIgDisabled(true);
  };

  const handleEditIg = () => {
      setIsIgDisabled(false);
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setApiKey(e.target.value);
  };

  const handleSaveApiKey = () => {
      localStorage.setItem('infographic_api_key', apiKey);
      setIsApiKeyDisabled(true);
  };

  const handleEditApiKey = () => {
      setIsApiKeyDisabled(false);
  };

  const handleVerifyWhatsapp = () => {
      const message = `Assalamu'alaikum...\nHalo, Saya ingin memverifikasi Account saya.\n\nNama: ${userName}\nNo WA: ${selectedCountry.dialCode}${phoneNumber}`;
      const waUrl = `https://wa.me/6281329466856?text=${encodeURIComponent(message)}`;
      window.open(waUrl, '_blank');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setProfileImage(result);
        localStorage.setItem('infographic_profile_image', result);
        // Dispatch custom event to notify other components
        window.dispatchEvent(new Event('profileImageUpdated'));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-gray-950 text-gray-300 animate-in slide-in-from-bottom-10 fade-in duration-300">
      {/* Header - Styled like StatisticsModal */}
      <header className="bg-gray-900 border-b border-gray-800 p-4 shadow-lg sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Profil Pengguna</h2>
              <p className="text-[10px] text-gray-400">Pengaturan & Informasi Akun</p>
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
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 sm:p-10 text-center flex flex-col items-center justify-center">
                
                {/* Profile Picture Area */}
                <div className="relative mb-8">
                    <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-gray-800 shadow-2xl bg-gray-800 flex items-center justify-center text-gray-400 relative">
                        {profileImage ? (
                            <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16">
                              <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                            </svg>
                        )}
                    </div>
                    
                    <button 
                        onClick={handleCameraClick}
                        className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-full border-4 border-gray-900 shadow-lg transition-all hover:scale-110 cursor-pointer"
                        title="Ganti Foto Profil"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                        </svg>
                    </button>

                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageChange} 
                        accept="image/*" 
                        className="hidden" 
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                    <div className="bg-gray-800/30 p-3 rounded-xl border border-gray-700/50 text-left">
                        <div className="flex items-center justify-between mb-1">
                            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Nama Lengkap</p>
                            <div className="flex items-center gap-2">
                                {isNameDisabled ? (
                                    <button
                                        onClick={handleEditName}
                                        className="flex items-center gap-1 text-[10px] text-yellow-400 hover:text-yellow-300 transition-colors bg-yellow-500/10 px-2 py-1 rounded-full border border-yellow-500/20"
                                        title="Edit Nama"
                                    >
                                        <Edit2 className="w-3 h-3" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleSaveName}
                                        className="flex items-center gap-1 text-[10px] text-green-400 hover:text-green-300 transition-colors bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20"
                                        title="Simpan Nama"
                                    >
                                        <Save className="w-3 h-3" />
                                    </button>
                                )}
                            </div>
                        </div>
                        <input 
                            type="text" 
                            value={userName} 
                            onChange={handleNameChange}
                            disabled={isNameDisabled}
                            placeholder="Nama Lengkap"
                            className={`w-full bg-gray-950/50 border border-gray-700 rounded-lg px-3 py-2 text-xs text-gray-200 font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-700 ${isNameDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        />
                    </div>
                    <div className="bg-gray-800/30 p-3 rounded-xl border border-gray-700/50 text-left">
                        <p className="text-[10px] text-gray-500 mb-1 font-medium uppercase tracking-wider">Status</p>
                        {displayVerified ? (
                            <div className="w-full bg-gray-950/50 border border-gray-700 rounded-lg px-3 py-2 text-xs text-green-400 font-bold flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                Aktif
                            </div>
                        ) : (
                            <div className="w-full bg-gray-950/50 border border-gray-700 rounded-lg px-3 py-2 text-xs text-red-400 font-bold flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                                Tidak Aktif
                            </div>
                        )}
                    </div>
                    <div className="bg-gray-800/30 p-3 rounded-xl border border-gray-700/50 text-left">
                        <div className="flex items-center justify-between mb-1">
                            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Whatsapp</p>
                            <div className="flex items-center gap-2">
                                {isPhoneDisabled ? (
                                    <button
                                        onClick={handleEditPhone}
                                        className="flex items-center gap-1 text-[10px] text-yellow-400 hover:text-yellow-300 transition-colors bg-yellow-500/10 px-2 py-1 rounded-full border border-yellow-500/20"
                                        title="Edit Whatsapp"
                                    >
                                        <Edit2 className="w-3 h-3" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleSavePhone}
                                        className="flex items-center gap-1 text-[10px] text-green-400 hover:text-green-300 transition-colors bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20"
                                        title="Simpan Whatsapp"
                                    >
                                        <Save className="w-3 h-3" />
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <div className="relative">
                                <button 
                                    onClick={() => !isPhoneDisabled && setIsDropdownOpen(!isDropdownOpen)}
                                    disabled={isPhoneDisabled}
                                    className={`flex items-center gap-1 bg-gray-950/50 border border-gray-700 rounded-lg px-2 py-2 text-xs text-gray-200 font-medium hover:bg-gray-800 transition-colors h-full ${isPhoneDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <span>{selectedCountry.flag}</span>
                                    <span>{selectedCountry.dialCode}</span>
                                </button>
                                {isDropdownOpen && !isPhoneDisabled && (
                                    <>
                                        <div 
                                            className="fixed inset-0 z-40" 
                                            onClick={() => setIsDropdownOpen(false)}
                                        />
                                        <div className="absolute top-full left-0 mt-1 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700">
                                            {COUNTRIES.map(country => (
                                                <button
                                                    key={country.code}
                                                    onClick={() => {
                                                        setSelectedCountry(country);
                                                        setIsDropdownOpen(false);
                                                        localStorage.setItem('infographic_profile_country', country.code);
                                                    }}
                                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:bg-gray-800 hover:text-white transition-colors text-left"
                                                >
                                                    <span>{country.flag}</span>
                                                    <span className="w-10">{country.dialCode}</span>
                                                    <span className="truncate">{country.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                            <input 
                                type="text" 
                                value={phoneNumber} 
                                onChange={handlePhoneChange}
                                disabled={isPhoneDisabled}
                                placeholder="81234567890"
                                className={`w-full bg-gray-950/50 border border-gray-700 rounded-lg px-3 py-2 text-xs text-gray-200 font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-700 ${isPhoneDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                            />
                        </div>
                        <button 
                            onClick={handleVerifyWhatsapp}
                            className="w-full mt-2 bg-green-600 hover:bg-green-500 text-white text-[10px] font-bold py-1.5 px-3 rounded-lg transition-colors flex items-center justify-center gap-1"
                        >
                            Verifikasi WhatsApp.
                        </button>
                    </div>
                    <div className="bg-gray-800/30 p-3 rounded-xl border border-gray-700/50 text-left">
                        <div className="flex items-center justify-between mb-1">
                            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Instagram</p>
                            <div className="flex items-center gap-2">
                                {isIgDisabled ? (
                                    <button
                                        onClick={handleEditIg}
                                        className="flex items-center gap-1 text-[10px] text-yellow-400 hover:text-yellow-300 transition-colors bg-yellow-500/10 px-2 py-1 rounded-full border border-yellow-500/20"
                                        title="Edit Instagram"
                                    >
                                        <Edit2 className="w-3 h-3" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleSaveIg}
                                        className="flex items-center gap-1 text-[10px] text-green-400 hover:text-green-300 transition-colors bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20"
                                        title="Simpan Instagram"
                                    >
                                        <Save className="w-3 h-3" />
                                    </button>
                                )}
                            </div>
                        </div>
                        <input 
                            type="text" 
                            value={instagram} 
                            onChange={handleIgChange}
                            disabled={isIgDisabled}
                            placeholder="@username"
                            className={`w-full bg-gray-950/50 border border-gray-700 rounded-lg px-3 py-2 text-xs text-gray-200 font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-700 ${isIgDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        />
                    </div>
                    <div className="bg-gray-800/30 p-3 rounded-xl border border-gray-700/50 text-left sm:col-span-2">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">API KEY</p>
                            <div className="flex items-center gap-2">
                                {isApiKeyDisabled ? (
                                    <button
                                        onClick={handleEditApiKey}
                                        className="flex items-center gap-1 text-[10px] text-yellow-400 hover:text-yellow-300 transition-colors bg-yellow-500/10 px-2 py-1 rounded-full border border-yellow-500/20"
                                        title="Edit API Key"
                                    >
                                        <Edit2 className="w-3 h-3" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleSaveApiKey}
                                        className="flex items-center gap-1 text-[10px] text-green-400 hover:text-green-300 transition-colors bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20"
                                        title="Simpan API Key"
                                    >
                                        <Save className="w-3 h-3" />
                                    </button>
                                )}
                                <a 
                                    href="https://aistudio.google.com/app/apikey" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/10 px-2 py-1 rounded-full border border-blue-500/20"
                                    title="Dapatkan API Key"
                                >
                                    <Lock className="w-3 h-3" />
                                </a>
                            </div>
                        </div>
                        <input 
                            type="password" 
                            value={apiKey} 
                            onChange={handleApiKeyChange}
                            disabled={isApiKeyDisabled}
                            placeholder=""
                            className={`w-full bg-gray-950/50 border border-gray-700 rounded-lg px-3 py-2 text-xs text-gray-200 font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-700 ${isApiKeyDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        />
                        <p className="text-[9px] text-gray-500 mt-2 whitespace-pre-line">
                            Silakan input API KEY terlebih dahulu untuk menggunakan aplikasi ini...!{"\n"}API KEY tersimpan di local storage, dan tidak pernah di kirim ke server kami
                        </p>
                    </div>
                </div>
                
                <div className="mt-10 pt-8 border-t border-gray-800 w-full flex justify-center">
                    <button 
                        onClick={() => {
                            localStorage.removeItem('infographic_logged_in');
                            window.location.reload();
                        }}
                        className="px-6 py-2 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white text-xs font-bold rounded-xl transition-all border border-red-600/20 flex items-center gap-2 group"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:scale-110 transition-transform">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                        </svg>
                        KELUAR
                    </button>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};
