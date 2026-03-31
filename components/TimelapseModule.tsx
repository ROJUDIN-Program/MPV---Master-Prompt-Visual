
import React, { useState, useRef, useEffect } from 'react';
import { Zap, MapPin, Clock, Palette, Camera, RefreshCw, Copy, Check, LayoutGrid, Film, Sparkles, Users, Layers, Wand2, Star, Zap as ViralIcon, Image as ImageIcon, ChevronDown, ChevronUp, Cpu, Lock, Infinity, Shield, LogOut, MonitorPlay, Download, Edit2, Save } from 'lucide-react';
import { Input, Textarea, Select, Button } from './FormControls';
import { VISUAL_STYLES } from '../constants';
import { GoogleGenAI, Type } from "@google/genai";

interface TimelapseData {
  vision: string;
  project_type: string;
  workers: number;
  scenes: number;
  generate_mode: 'cinematic' | 'viral' | 'ultra_detail' | 'fast';
  aspect_ratio: string;
  tone_of_voice: string;
  target_audience: string;
  color_palette: string;
}

const INITIAL_TIMELAPSE_DATA: TimelapseData = {
  vision: '',
  project_type: '',
  workers: 1,
  scenes: 4,
  generate_mode: 'cinematic',
  aspect_ratio: '9:16',
  tone_of_voice: 'Profesional & Edukatif',
  target_audience: '',
  color_palette: 'Sesuai Topik (Auto)'
};

const TONE_OF_VOICE = [
  { value: 'Profesional & Edukatif', label: 'Profesional & Edukatif' },
  { value: 'Santai & Gaul (Gen-Z)', label: 'Santai & Gaul (Gen-Z)' },
  { value: 'Inspiratif & Memotivasi', label: 'Inspiratif & Memotivasi' },
  { value: 'Humoris & Menghibur', label: 'Humoris & Menghibur' },
  { value: 'Storytelling (Bercerita)', label: 'Storytelling (Bercerita)' }
];

const COLOR_PALETTES = [
  { value: 'Sesuai Topik (Auto)', label: 'Sesuai Topik (Auto)' },
  { value: 'Monokrom (Hitam & Putih)', label: 'Monokrom (Hitam & Putih)' },
  { value: 'Warm & Earthy (Coklat, Krem, Hijau)', label: 'Warm & Earthy' },
  { value: 'Neon Cyberpunk (Ungu, Biru, Pink)', label: 'Neon Cyberpunk' },
  { value: 'Pastel Lembut (Pink, Biru Muda, Kuning)', label: 'Pastel Lembut' },
  { value: 'Corporate Blue (Biru, Putih, Abu-abu)', label: 'Corporate Blue' },
  { value: 'Vibrant & Pop (Warna Cerah & Mencolok)', label: 'Vibrant & Pop' }
];

interface PanelResult {
  image: string;
  video: string;
  description: string;
}

const PROJECT_TYPES = [
  // Restorasi & Bangunan Bersejarah
  { value: 'Restorasi Kastil Abad Pertengahan', label: 'Restorasi Kastil Abad Pertengahan' },
  { value: 'Renovasi Mansion Klasik', label: 'Renovasi Mansion Klasik' },
  { value: 'Pemugaran Candi / Kuil Kuno', label: 'Pemugaran Candi / Kuil Kuno' },
  { value: 'Restorasi Kincir Angin Tradisional', label: 'Restorasi Kincir Angin Tradisional' },
  { value: 'Renovasi Katedral / Gereja Tua', label: 'Renovasi Katedral / Gereja Tua' },
  { value: 'Restorasi Masjid Kuno', label: 'Restorasi Masjid Kuno' },
  
  // Hunian & Komersial Unik
  { value: 'Pembangunan Villa Tepi Pantai', label: 'Pembangunan Villa Tepi Pantai' },
  { value: 'Konversi Pabrik Menjadi Apartemen', label: 'Konversi Pabrik Menjadi Apartemen' },
  { value: 'Pembangunan Rumah Pohon Raksasa', label: 'Pembangunan Rumah Pohon Raksasa' },
  { value: 'Pembuatan Bunker Bawah Tanah', label: 'Pembuatan Bunker Bawah Tanah' },
  { value: 'Pembangunan Resor Pegunungan', label: 'Pembangunan Resor Pegunungan' },
  
  // Infrastruktur & Bangunan Publik Skala Besar
  { value: 'Konstruksi Gedung Pencakar Langit', label: 'Konstruksi Gedung Pencakar Langit' },
  { value: 'Pembangunan Stadion Megah', label: 'Pembangunan Stadion Megah' },
  { value: 'Renovasi Museum Seni', label: 'Renovasi Museum Seni' },
  { value: 'Pembangunan Perpustakaan Klasik', label: 'Pembangunan Perpustakaan Klasik' },
  { value: 'Konstruksi Stasiun Kereta Api', label: 'Konstruksi Stasiun Kereta Api' },
  { value: 'Pembangunan Masjid Agung', label: 'Pembangunan Masjid Agung' },
  
  // Bangunan Spesifik / Tematik
  { value: 'Pembuatan Menara Jam', label: 'Pembuatan Menara Jam' },
  { value: 'Pembangunan Rumah Kaca Botani', label: 'Pembangunan Rumah Kaca Botani' }
];

interface TimelapseModuleProps {
  onOpenSupport?: () => void;
}

export const TimelapseModule: React.FC<TimelapseModuleProps> = ({ onOpenSupport }) => {
  const [data, setData] = useState<TimelapseData>(INITIAL_TIMELAPSE_DATA);
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<PanelResult[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [expandedScenes, setExpandedScenes] = useState<Record<number, boolean>>({});
  const [isProjectTypeOpen, setIsProjectTypeOpen] = useState(false);
  const [isAspectRatioOpen, setIsAspectRatioOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const projectTypeRef = useRef<HTMLDivElement>(null);
  const aspectRatioRef = useRef<HTMLDivElement>(null);

  // History and Presets State
  const [history, setHistory] = useState<Array<{ id: string, date: string, data: TimelapseData, result: PanelResult[] }>>([]);
  const [presets, setPresets] = useState<Array<{ id: string, name: string, data: Partial<TimelapseData> }>>([]);
  const [activeTab, setActiveTab] = useState<'form' | 'history'>('form');
  const [isTopicDisabled, setIsTopicDisabled] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [showPresetInput, setShowPresetInput] = useState(false);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [generateImages, setGenerateImages] = useState(false);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<Record<number, string>>({});

  useEffect(() => {
    // Load history and presets from localStorage on mount
    const savedHistory = localStorage.getItem('timelapseHistory');
    if (savedHistory) setHistory(JSON.parse(savedHistory));

    const savedPresets = localStorage.getItem('timelapsePresets');
    if (savedPresets) setPresets(JSON.parse(savedPresets));
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Extract just the base64 data part
        const base64Data = base64String.split(',')[1];
        setReferenceImage(base64Data);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveToHistory = (newData: TimelapseData, newResult: PanelResult[]) => {
    const newHistoryItem = {
      id: Date.now().toString(),
      date: new Date().toLocaleString('id-ID'),
      data: newData,
      result: newResult
    };
    const updatedHistory = [newHistoryItem, ...history].slice(0, 20); // Keep last 20
    setHistory(updatedHistory);
    localStorage.setItem('timelapseHistory', JSON.stringify(updatedHistory));
  };

  const savePreset = () => {
    if (!presetName.trim()) return;
    const newPreset = {
      id: Date.now().toString(),
      name: presetName,
      data: {
        project_type: data.project_type,
        generate_mode: data.generate_mode,
        aspect_ratio: data.aspect_ratio,
        tone_of_voice: data.tone_of_voice,
        color_palette: data.color_palette,
        workers: data.workers,
        scenes: data.scenes
      }
    };
    const updatedPresets = [...presets, newPreset];
    setPresets(updatedPresets);
    localStorage.setItem('timelapsePresets', JSON.stringify(updatedPresets));
    setPresetName('');
    setShowPresetInput(false);
  };

  const loadPreset = (presetData: Partial<TimelapseData>) => {
    setData(prev => ({ ...prev, ...presetData }));
  };

  const deletePreset = (id: string) => {
    const updatedPresets = presets.filter(p => p.id !== id);
    setPresets(updatedPresets);
    localStorage.setItem('timelapsePresets', JSON.stringify(updatedPresets));
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (projectTypeRef.current && !projectTypeRef.current.contains(event.target as Node)) {
        setIsProjectTypeOpen(false);
      }
      if (aspectRatioRef.current && !aspectRatioRef.current.contains(event.target as Node)) {
        setIsAspectRatioOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAllVideos = () => {
    const allVideos = results.map((res, idx) => `Transisi ${idx + 1}:\n${res.video}`).join('\n\n');
    navigator.clipboard.writeText(allVideos);
    setCopiedIndex('all-videos');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleDownloadTxt = () => {
    if (!results || results.length === 0) return;
    const allText = results.map((res, idx) => 
      `Transisi ${idx + 1}\n` +
      `Image Prompt: ${res.image}\n` +
      `Video Prompt: ${res.video}\n` +
      `Description: ${res.description}`
    ).join('\n\n');
    
    const blob = new Blob([allText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Timelapse_Prompt_${new Date().getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadCSV = () => {
    if (!results || results.length === 0) return;
    
    // Create CSV header
    const headers = ['Transisi', 'Image Prompt', 'Video Prompt', 'Description'];
    
    // Create CSV rows
    const rows = results.map((res, idx) => {
      // Escape quotes and wrap in quotes to handle commas and newlines in content
      const escapeCsv = (text: string) => `"${text.replace(/"/g, '""')}"`;
      
      return [
        `Transisi ${idx + 1}`,
        escapeCsv(res.image),
        escapeCsv(res.video),
        escapeCsv(res.description)
      ].join(',');
    });
    
    const csvContent = [headers.join(','), ...rows].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Timelapse_Prompt_${new Date().getTime()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleScene = (index: number) => {
    setExpandedScenes(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const generateTimelapse = async () => {
    if (!data.vision) {
        alert("Mohon isi deskripsi visi Anda terlebih dahulu.");
        return;
    }

    setIsGenerating(true);
    
    try {
        const customApiKey = localStorage.getItem('infographic_api_key');
        const apiKey = customApiKey || process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("API Key tidak ditemukan. Mohon hubungi administrator.");
        }
        const ai = new GoogleGenAI({ apiKey });
        
        const parts: any[] = [];
        
        if (referenceImage) {
          parts.push({
            inlineData: {
              data: referenceImage,
              mimeType: "image/jpeg"
            }
          });
        }

        let promptText = `
            You are a professional AI Prompt Engineer specializing in cinematic timelapse sequences for construction, restoration, and environmental transformation.
            Your task is to generate a sequential ${data.scenes}-panel timelapse story.
            
            STRICT OUTPUT FORMAT:
            You must return a JSON array of exactly ${data.scenes} objects. Each object must have "image", "video", and "description" keys.
            
            JSON Structure:
            [
              {
                "image": "Detailed image prompt for stage 1",
                "video": "Detailed video prompt for stage 1",
                "description": "A highly detailed, infographic-style explanation of what is happening in this stage. Provide in-depth analysis, facts, or step-by-step breakdowns of the construction/restoration process."
              },
              ...
              {
                "image": "Detailed image prompt for stage ${data.scenes}",
                "video": "Detailed video prompt for stage ${data.scenes}",
                "description": "A highly detailed, infographic-style explanation of what is happening in this final stage. Provide in-depth analysis, facts, or step-by-step breakdowns of the completed project."
              }
            ]
            
            CONTENT RULES:
            - The vision is: ${data.vision}
            - Project Type: ${data.project_type || 'General Transformation'}
            - Number of Workers: ${data.workers} (Incorporate these workers into the scenes, showing them active)
            - Total Scenes: ${data.scenes}
            - Generation Mode: ${data.generate_mode} (If cinematic, focus on lighting and atmosphere. If viral, focus on dramatic before/after hooks. If ultra detail, focus on textures and small changes. If fast, focus on clear progression)
            - Aspect Ratio: ${data.aspect_ratio} (Ensure the image prompts specify this aspect ratio, e.g., "--ar ${data.aspect_ratio}" for Midjourney or mention it in the prompt)
            - Target Audience: ${data.target_audience || 'General audience'}
            - Tone of Voice: ${data.tone_of_voice}
            - Color Palette: ${data.color_palette}. Ensure the image prompts strictly follow this color scheme.
            - CRITICAL TIMELAPSE CONSISTENCY: Every scene MUST be perfectly consistent with the previous one. The camera angle, lighting, environment, core structures, and background MUST remain exactly the same to create a seamless, connected transition from the first scene to the last. Instruct the AI to maintain a fixed camera position.
            ${referenceImage ? '- REFERENCE IMAGE PROVIDED: Use the provided image as the absolute baseline for the first scene. The environment, lighting, and core structure MUST match this image perfectly.' : ''}
            - Prompts must be in English for the AI generators.
            - The "description" MUST be in Indonesian, highly informative, deep, and structured (suitable for an educational infographic or detailed voiceover/caption). The description should match the requested Tone of Voice and Target Audience.
        `;

        parts.push({ text: promptText });

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: [{ parts }],
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            image: { type: Type.STRING },
                            video: { type: Type.STRING },
                            description: { type: Type.STRING }
                        },
                        required: ["image", "video", "description"]
                    }
                }
            }
        });

        const jsonStr = response.text.trim();
        const parsedResults = JSON.parse(jsonStr);
        setResults(parsedResults);
        saveToHistory(data, parsedResults);

        if (generateImages) {
            setIsGeneratingImages(true);
            try {
                const newGeneratedImages: Record<number, string> = {};
                for (let i = 0; i < parsedResults.length; i++) {
                    const scene = parsedResults[i];
                    const imgResponse = await ai.models.generateContent({
                        model: 'gemini-3.1-flash-image-preview',
                        contents: {
                            parts: [{ text: scene.image }]
                        },
                        config: {
                            imageConfig: {
                                aspectRatio: data.aspect_ratio === '9:16' ? '9:16' : 
                                             data.aspect_ratio === '16:9' ? '16:9' : 
                                             data.aspect_ratio === '4:5' ? '3:4' : '1:1',
                                imageSize: "1K"
                            }
                        }
                    });
                    
                    for (const part of imgResponse.candidates[0].content.parts) {
                        if (part.inlineData) {
                            newGeneratedImages[i] = `data:image/jpeg;base64,${part.inlineData.data}`;
                            break;
                        }
                    }
                }
                setGeneratedImages(newGeneratedImages);
            } catch (imgError) {
                console.error("Error generating images:", imgError);
                alert("Gagal menghasilkan gambar. Prompt teks tetap tersimpan.");
            } finally {
                setIsGeneratingImages(false);
            }
        }

    } catch (error: any) {
        console.error("Error generating timelapse:", error);
        alert(`Terjadi kesalahan saat generate: ${error.message || "Mohon coba lagi."}`);
    } finally {
        setIsGenerating(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'Rojudin' && password === '024434') {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Username atau Kata Sandi salah.');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto mt-10 animate-in fade-in zoom-in duration-500">
        <div className="bg-[#0a0f1d] border border-blue-900/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle Glows */}
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-cyan-500/10 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500/10 blur-[100px] pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center">
            {/* Form */}
            <form onSubmit={handleLogin} className="w-full space-y-6 mt-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
                  <Cpu className="w-3 h-3" />
                  Nama Pengguna
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Nama Pengguna"
                    className="w-full bg-[#0d1425] border border-blue-900/40 rounded-xl p-3.5 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all placeholder-gray-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
                  <Lock className="w-3 h-3" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full bg-[#0d1425] border border-blue-900/40 rounded-xl p-3.5 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all placeholder-gray-600"
                  />
                </div>
                {loginError && <p className="text-red-400 text-xs mt-1">{loginError}</p>}
              </div>

              {username === 'Rojudin' && password === '024434' ? (
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-bold py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.3)] mt-4"
                >
                  <Lock className="w-4 h-4" />
                  Masuk
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onOpenSupport}
                  className="w-full bg-gray-800/50 hover:bg-gray-800 border border-gray-700 text-gray-300 font-bold py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 mt-4 relative"
                >
                  <Lock className="w-4 h-4" />
                  Unlock Access
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <span className="text-[9px] font-bold bg-amber-500/10 text-amber-400 px-2 py-1 rounded-full border border-amber-500/50 flex items-center justify-center gap-1">
                      <Star className="w-2.5 h-2.5" />
                      PRO
                    </span>
                  </div>
                </button>
              )}
            </form>

            {/* Footer */}
            <div className="mt-8 flex items-center justify-center gap-2 text-gray-500 text-xs">
              <Shield className="w-3 h-3" />
              1 Device = 1 Account
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in duration-500 pb-12">
      <div className="bg-[#0a0f1d] border border-blue-900/30 rounded-2xl shadow-xl overflow-hidden relative flex flex-col mb-6">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-500" />
        
        <div className="p-5 border-b border-blue-900/30 bg-[#0d1425]/50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 rounded-lg">
              <Film className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-100">Timelapse Generator</h2>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('form')}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'form' ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Form
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'history' ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Riwayat
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'form' ? (
      <div className="bg-[#0a0f1d] border border-blue-900/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        {/* Subtle Glows */}
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-500/5 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500/5 blur-[100px] pointer-events-none" />

        <div className="space-y-6 relative z-10">
          {/* Presets Section */}
          <div className="flex items-center justify-between bg-[#0d1425] p-3 rounded-xl border border-blue-900/30">
            <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar flex-1 mr-4">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">Presets:</span>
              {presets.length === 0 ? (
                <span className="text-xs text-gray-600 italic">Belum ada preset</span>
              ) : (
                presets.map(preset => (
                  <div key={preset.id} className="flex items-center gap-1 bg-blue-900/20 px-2 py-1 rounded-md border border-blue-900/40 whitespace-nowrap">
                    <button 
                      onClick={() => loadPreset(preset.data)}
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-medium"
                    >
                      {preset.name}
                    </button>
                    <button 
                      onClick={() => deletePreset(preset.id)}
                      className="text-gray-500 hover:text-red-400 ml-1"
                    >
                      &times;
                    </button>
                  </div>
                ))
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {showPresetInput ? (
                <div className="flex items-center gap-1">
                  <input 
                    type="text" 
                    value={presetName}
                    onChange={(e) => setPresetName(e.target.value)}
                    placeholder="Nama Preset"
                    className="bg-[#111827] border border-blue-900/40 rounded px-2 py-1 text-xs text-gray-200 w-24 focus:outline-none focus:border-cyan-500"
                    autoFocus
                  />
                  <button onClick={savePreset} className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded hover:bg-cyan-500/30">Simpan</button>
                  <button onClick={() => setShowPresetInput(false)} className="text-xs text-gray-500 px-1 hover:text-gray-300">&times;</button>
                </div>
              ) : (
                <button 
                  onClick={() => setShowPresetInput(true)}
                  className="text-[10px] font-bold bg-blue-900/30 text-cyan-400 px-3 py-1.5 rounded-lg hover:bg-blue-900/50 transition-colors"
                >
                  + Simpan Preset
                </button>
              )}
            </div>
          </div>

          {/* Vision Input */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                  <label className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Deskripsikan Visi Anda</label>
                  {isTopicDisabled ? (
                      <button
                          onClick={() => setIsTopicDisabled(false)}
                          className="flex items-center gap-1 text-[10px] text-yellow-400 hover:text-yellow-300 transition-colors bg-yellow-500/10 px-2 py-1 rounded-full border border-yellow-500/20"
                          title="Edit Topik"
                      >
                          <Edit2 className="w-3 h-3" />
                      </button>
                  ) : (
                      <button
                          onClick={() => setIsTopicDisabled(true)}
                          className="flex items-center gap-1 text-[10px] text-green-400 hover:text-green-300 transition-colors bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20"
                          title="Simpan Topik"
                      >
                          <Save className="w-3 h-3" />
                      </button>
                  )}
              </div>
              <button
                onClick={() => setIsLoggedIn(false)}
                className="text-xs font-medium bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-1 rounded-full border border-red-500/50 transition-colors cursor-pointer flex items-center justify-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                KELUAR
              </button>
            </div>
            <textarea
              className={`w-full bg-[#0d1425] border border-blue-900/40 rounded-2xl p-4 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all min-h-[100px] placeholder-gray-600 resize-none ${isTopicDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              placeholder="Deskripsikan Timelapse Anda"
              value={data.vision}
              onChange={(e) => setData({ ...data, vision: e.target.value })}
              disabled={isTopicDisabled}
            />
          </div>

          {/* Reference Image Input */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Gambar Referensi (Opsional)</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload}
              className="w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-cyan-500/10 file:text-cyan-400 hover:file:bg-cyan-500/20"
            />
            {referenceImage && <p className="text-[10px] text-green-400">Gambar berhasil dimuat.</p>}
          </div>

          {/* Project Type & Aspect Ratio */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3 relative" ref={projectTypeRef}>
              <label className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Pilih Tipe Proyek</label>
              <div 
                className="w-full bg-[#0d1425] border border-blue-900/40 rounded-xl p-3 text-xs text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer flex justify-between items-center"
                onClick={() => {
                  setIsProjectTypeOpen(!isProjectTypeOpen);
                  setIsAspectRatioOpen(false);
                }}
              >
                <span>{data.project_type ? PROJECT_TYPES.find(t => t.value === data.project_type)?.label : 'Pilih Tipe Proyek'}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isProjectTypeOpen ? 'rotate-180' : ''}`} />
              </div>
              
              {isProjectTypeOpen && (
                <div className="absolute z-50 w-full mt-1 bg-[#0d1425] border border-blue-900/40 rounded-xl shadow-2xl max-h-48 overflow-y-auto">
                  <div 
                    className="px-3 py-2 text-xs text-gray-400 hover:bg-blue-900/30 cursor-pointer transition-colors"
                    onClick={() => {
                      setData({ ...data, project_type: '' });
                      setIsProjectTypeOpen(false);
                    }}
                  >
                    Pilih Tipe Proyek
                  </div>
                  {PROJECT_TYPES.map(type => (
                    <div 
                      key={type.value} 
                      className={`px-3 py-2 text-xs cursor-pointer transition-colors ${data.project_type === type.value ? 'bg-blue-900/50 text-cyan-400' : 'text-gray-300 hover:bg-blue-900/30'}`}
                      onClick={() => {
                        setData({ ...data, project_type: type.value });
                        setIsProjectTypeOpen(false);
                      }}
                    >
                      {type.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="space-y-3 relative" ref={aspectRatioRef}>
              <label className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Aspek Rasio</label>
              <div 
                className="w-full bg-[#0d1425] border border-blue-900/40 rounded-xl p-3 text-xs text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer flex justify-between items-center"
                onClick={() => {
                  setIsAspectRatioOpen(!isAspectRatioOpen);
                  setIsProjectTypeOpen(false);
                }}
              >
                <span>
                  {data.aspect_ratio === '9:16' ? '9:16 (Vertical / Reels / TikTok)' :
                   data.aspect_ratio === '16:9' ? '16:9 (Horizontal / YouTube)' :
                   data.aspect_ratio === '1:1' ? '1:1 (Square / Instagram Post)' :
                   '4:5 (Portrait / Instagram)'}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isAspectRatioOpen ? 'rotate-180' : ''}`} />
              </div>

              {isAspectRatioOpen && (
                <div className="absolute z-50 w-full mt-1 bg-[#0d1425] border border-blue-900/40 rounded-xl shadow-2xl overflow-hidden">
                  {[
                    { value: '9:16', label: '9:16 (Vertical / Reels / TikTok)' },
                    { value: '16:9', label: '16:9 (Horizontal / YouTube)' },
                    { value: '1:1', label: '1:1 (Square / Instagram Post)' },
                    { value: '4:5', label: '4:5 (Portrait / Instagram)' }
                  ].map(ratio => (
                    <div 
                      key={ratio.value} 
                      className={`px-3 py-2 text-xs cursor-pointer transition-colors ${data.aspect_ratio === ratio.value ? 'bg-blue-900/50 text-cyan-400' : 'text-gray-300 hover:bg-blue-900/30'}`}
                      onClick={() => {
                        setData({ ...data, aspect_ratio: ratio.value });
                        setIsAspectRatioOpen(false);
                      }}
                    >
                      {ratio.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>



          {/* Sliders */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-gray-300 text-xs">
                  <Users className="w-3 h-3 text-cyan-400" />
                  Pekerja
                </div>
                <span className="text-cyan-400 font-bold text-sm">{data.workers}</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={data.workers}
                onChange={(e) => setData({ ...data, workers: parseInt(e.target.value) })}
                className="w-full h-1.5 bg-blue-900/30 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-gray-300 text-xs">
                  <Layers className="w-3 h-3 text-cyan-400" />
                  Scene
                </div>
                <span className="text-cyan-400 font-bold text-sm">{data.scenes}</span>
              </div>
              <input
                type="range"
                min="4"
                max="15"
                value={data.scenes}
                onChange={(e) => setData({ ...data, scenes: parseInt(e.target.value) })}
                className="w-full h-1.5 bg-blue-900/30 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>
            
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Target Audience</label>
              <Input
                value={data.target_audience}
                onChange={(e) => setData({ ...data, target_audience: e.target.value })}
                placeholder="Contoh: Arsitek, Kontraktor, Masyarakat Umum..."
                className="bg-[#0d1425] border-blue-900/40 text-gray-200 focus:ring-cyan-500 focus:border-cyan-500 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-3 relative">
                <label className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Tone of Voice</label>
                <select
                  value={data.tone_of_voice}
                  onChange={(e) => setData({ ...data, tone_of_voice: e.target.value })}
                  className="w-full bg-[#0d1425] border border-blue-900/40 rounded-xl p-3 text-xs text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none"
                >
                  {TONE_OF_VOICE.map((tone) => (
                    <option key={tone.value} value={tone.value}>
                      {tone.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-9 pointer-events-none" />
              </div>

              <div className="space-y-3 relative">
                <label className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Tema Warna</label>
                <select
                  value={data.color_palette}
                  onChange={(e) => setData({ ...data, color_palette: e.target.value })}
                  className="w-full bg-[#0d1425] border border-blue-900/40 rounded-xl p-3 text-xs text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none"
                >
                  {COLOR_PALETTES.map((palette) => (
                    <option key={palette.value} value={palette.value}>
                      {palette.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-9 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#0d1425] border border-blue-900/20 rounded-xl p-3 text-center space-y-1">
              <div className="text-xl font-bold text-cyan-400">{data.scenes}</div>
              <div className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Scene</div>
            </div>
            <div className="bg-[#0d1425] border border-blue-900/20 rounded-xl p-3 text-center space-y-1">
              <div className="text-xl font-bold text-purple-400">{data.workers}</div>
              <div className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Pekerja</div>
            </div>
            <div className="bg-[#0d1425] border border-blue-900/20 rounded-xl p-3 text-center space-y-1">
              <div className="text-xl font-bold text-emerald-400">{data.scenes * 2}</div>
              <div className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Total Prompt</div>
            </div>
          </div>

          {/* Mode Generate */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mode Generate</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'cinematic', label: 'Sinematik', icon: <Film className="w-3.5 h-3.5" />, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                { id: 'viral', label: 'Viral', icon: <ViralIcon className="w-3.5 h-3.5" />, color: 'text-orange-400', bg: 'bg-orange-500/10' },
                { id: 'ultra_detail', label: 'Ultra Detail', icon: <Star className="w-3.5 h-3.5" />, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
                { id: 'fast', label: 'Cepat', icon: <Layers className="w-3.5 h-3.5" />, color: 'text-emerald-400', bg: 'bg-emerald-500/10' }
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setData({ ...data, generate_mode: mode.id as any })}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all ${
                    data.generate_mode === mode.id 
                    ? `bg-[#131b2e] border-blue-500 ring-1 ring-blue-500/50` 
                    : 'bg-[#0d1425] border-blue-900/20 hover:border-blue-900/40'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg ${mode.bg} ${mode.color}`}>
                    {mode.icon}
                  </div>
                  <span className={`text-[11px] font-bold ${data.generate_mode === mode.id ? 'text-white' : 'text-gray-400'}`}>{mode.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="generateImages"
              checked={generateImages}
              onChange={(e) => setGenerateImages(e.target.checked)}
              className="w-4 h-4 rounded border-blue-900/40 bg-[#0d1425] text-cyan-500 focus:ring-cyan-500/50"
            />
            <label htmlFor="generateImages" className="text-xs text-gray-300 cursor-pointer">
              Generate Gambar Langsung (AI Image)
            </label>
          </div>

          {/* Generate Button */}
          <button
            onClick={generateTimelapse}
            disabled={isGenerating}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-3 transition-all shadow-lg shadow-purple-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Sparkles className="w-5 h-5" />
            )}
            Generate Prompt
          </button>
        </div>
      </div>
      ) : (
        <div className="bg-[#0a0f1d] border border-blue-900/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden min-h-[400px]">
          <div className="space-y-4">
            {history.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-10">Belum ada riwayat generate.</p>
            ) : (
              history.map((item) => (
                <div key={item.id} className="bg-[#0d1425] border border-blue-900/30 rounded-xl p-4 space-y-2 hover:border-cyan-500/30 transition-colors">
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-bold text-gray-200 line-clamp-1 flex-1">{item.data.vision}</h4>
                    <span className="text-[10px] text-gray-500 ml-2 whitespace-nowrap">{item.date}</span>
                  </div>
                  <p className="text-[10px] text-gray-400">Mode: {item.data.generate_mode} • {item.data.scenes} Scenes</p>
                  <button 
                    onClick={() => {
                      setResults(item.result);
                      setData(item.data);
                      setActiveTab('form');
                    }}
                    className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 mt-2"
                  >
                    <RefreshCw className="w-3 h-3" /> Muat Ulang Hasil Ini
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Results Section */}
      {activeTab === 'form' && results.length > 0 && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          <div className="flex justify-end gap-2">
            <button
              onClick={handleDownloadCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg text-xs font-medium transition-colors border border-green-500/20"
            >
              <Download className="w-3.5 h-3.5" />
              Unduh CSV
            </button>
            <button
              onClick={handleDownloadTxt}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg text-xs font-medium transition-colors border border-blue-500/20"
            >
              <Download className="w-3.5 h-3.5" />
              Unduh TXT
            </button>
          </div>

          {/* Section 1: Image Prompts (Scenes) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <ImageIcon className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Prompt Image</h3>
              <span className="bg-blue-900/50 text-cyan-400 text-xs px-2 py-0.5 rounded-full">{results.length}</span>
            </div>
            <div className="space-y-3">
              {results.map((res, idx) => {
                const isLast = idx === results.length - 1;
                const title = isLast ? "Hasil Akhir" : `Scene ${idx + 1}`;
                const badgeText = isLast ? "F" : `${idx + 1}`;
                const badgeColor = isLast ? "bg-emerald-500/20 text-emerald-400" : "bg-cyan-500/20 text-cyan-400";
                const isExpanded = expandedScenes[idx];

                return (
                  <div key={idx} className="bg-[#0a0f1d] border border-blue-900/30 rounded-2xl overflow-hidden shadow-lg">
                    <div 
                      className="px-4 py-4 flex items-center justify-between cursor-pointer hover:bg-blue-900/10 transition-colors"
                      onClick={() => toggleScene(idx)}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${badgeColor}`}>
                          {badgeText}
                        </div>
                        <span className="text-sm font-medium text-gray-200">{title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleCopy(res.image, `img-${idx}`); }}
                          className="p-2 hover:bg-blue-900/30 rounded-lg transition-colors text-gray-400 hover:text-white"
                          title="Salin Prompt"
                        >
                          {copiedIndex === `img-${idx}` ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                        {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                      </div>
                    </div>
                    {isExpanded && (
                      <div className="p-4 border-t border-blue-900/20 bg-[#0d1425] space-y-4">
                        <div>
                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Deskripsi Infografis</h4>
                          <p className="text-sm text-gray-200 leading-relaxed">{res.description}</p>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2">Image Prompt</h4>
                          <p className="text-sm text-gray-300 font-mono leading-relaxed bg-[#0a0f1d] p-3 rounded-lg border border-blue-900/30">{res.image}</p>
                        </div>
                        
                        {generateImages && (
                          <div className="mt-4">
                            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2">AI Generated Image</h4>
                            {isGeneratingImages ? (
                              <div className="flex items-center justify-center h-48 bg-[#0a0f1d] rounded-lg border border-blue-900/30 animate-pulse">
                                <div className="flex flex-col items-center gap-2 text-cyan-500">
                                  <RefreshCw className="w-6 h-6 animate-spin" />
                                  <span className="text-xs font-medium">Generating Image...</span>
                                </div>
                              </div>
                            ) : generatedImages[idx] ? (
                              <div className="relative group rounded-lg overflow-hidden border border-blue-900/30">
                                <img 
                                  src={generatedImages[idx]} 
                                  alt={`Generated Scene ${idx + 1}`} 
                                  className="w-full h-auto object-cover"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <a 
                                    href={generatedImages[idx]} 
                                    download={`Scene_${idx + 1}.jpg`}
                                    className="px-4 py-2 bg-cyan-500 text-white text-xs font-bold rounded-lg flex items-center gap-2 hover:bg-cyan-400 transition-colors"
                                  >
                                    <Download className="w-4 h-4" />
                                    Download Image
                                  </a>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center h-48 bg-[#0a0f1d] rounded-lg border border-blue-900/30 text-gray-500 text-xs">
                                Gagal memuat gambar
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Video Prompts (Transitions) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Film className="w-4 h-4 text-purple-400" />
                </div>
                <h3 className="text-sm font-bold text-purple-400 uppercase tracking-widest">Prompt Video</h3>
                <span className="bg-purple-900/50 text-purple-400 text-xs px-2 py-0.5 rounded-full">{results.length}</span>
              </div>
              <button 
                onClick={handleCopyAllVideos}
                className="p-2 hover:bg-purple-900/30 rounded-lg transition-colors text-gray-400 hover:text-white flex items-center gap-2"
                title="Salin Semua Prompt Video"
              >
                {copiedIndex === 'all-videos' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            
            <div className="space-y-4">
              {results.map((res, idx) => (
                <div key={idx} className="bg-[#0a0f1d] border border-blue-900/30 rounded-2xl p-4 space-y-4 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-[10px] font-bold text-purple-400">
                        {idx + 1}
                      </div>
                      <span className="text-sm font-medium text-gray-200">Transisi {idx + 1}</span>
                    </div>
                    <button 
                      onClick={() => handleCopy(res.video, `vid-${idx}`)}
                      className="p-2 hover:bg-blue-900/30 rounded-lg transition-colors text-gray-400 hover:text-white"
                      title="Salin Prompt"
                    >
                      {copiedIndex === `vid-${idx}` ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="bg-[#131b2e] rounded-xl p-4 border border-blue-900/20">
                    <p className="text-xs text-gray-300 font-mono leading-relaxed">{res.video}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Tutorial */}
          <div className="mt-12 bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/20 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[100px] pointer-events-none" />
            
            <div className="flex items-center gap-3 mb-8 relative z-10">
              <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                <Sparkles className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-wide">Tutorial: Menyatukan Scene Timelapse</h3>
                <p className="text-xs text-gray-400 mt-1">Panduan langkah demi langkah untuk hasil sinematik</p>
              </div>
            </div>
            
            <div className="space-y-6 text-gray-300 text-sm leading-relaxed relative z-10">
              <div className="flex gap-4 group">
                <div className="w-10 h-10 rounded-full bg-[#0a0f1d] border border-blue-500/30 flex items-center justify-center text-cyan-400 font-black shrink-0 shadow-[0_0_10px_rgba(59,130,246,0.1)] group-hover:scale-110 group-hover:border-cyan-400 transition-all duration-300">1</div>
                <div className="pt-1">
                  <h4 className="font-bold text-white text-base mb-2 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-cyan-400" />
                    Generate Gambar & Video
                  </h4>
                  <p className="text-gray-400">Gunakan prompt gambar di atas pada AI Image Generator (seperti Midjourney, DALL-E, atau Stable Diffusion) untuk menghasilkan gambar statis untuk setiap scene. Kemudian, gunakan prompt video pada AI Video Generator (seperti Luma Dream Machine, Runway Gen-3, atau Kling AI) dengan menggunakan gambar yang dihasilkan sebagai frame awal (image-to-video).</p>
                </div>
              </div>
              
              <div className="flex gap-4 group">
                <div className="w-10 h-10 rounded-full bg-[#0a0f1d] border border-blue-500/30 flex items-center justify-center text-cyan-400 font-black shrink-0 shadow-[0_0_10px_rgba(59,130,246,0.1)] group-hover:scale-110 group-hover:border-cyan-400 transition-all duration-300">2</div>
                <div className="pt-1">
                  <h4 className="font-bold text-white text-base mb-2 flex items-center gap-2">
                    <MonitorPlay className="w-4 h-4 text-purple-400" />
                    Impor ke Editor Video
                  </h4>
                  <p className="text-gray-400">Buka aplikasi editor video pilihan Anda (CapCut, Premiere Pro, DaVinci Resolve, dll). Impor semua klip video yang telah di-generate. Susun klip-klip tersebut di timeline secara berurutan dari Transisi 1 hingga selesai.</p>
                </div>
              </div>

              <div className="flex gap-4 group">
                <div className="w-10 h-10 rounded-full bg-[#0a0f1d] border border-blue-500/30 flex items-center justify-center text-cyan-400 font-black shrink-0 shadow-[0_0_10px_rgba(59,130,246,0.1)] group-hover:scale-110 group-hover:border-cyan-400 transition-all duration-300">3</div>
                <div className="pt-1">
                  <h4 className="font-bold text-white text-base mb-2 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-400" />
                    Tambahkan Transisi
                  </h4>
                  <p className="text-gray-400">Agar perpindahan antar scene terlihat mulus dan berkesinambungan, tambahkan efek transisi di antara setiap klip. Gunakan transisi <strong className="text-cyan-400 font-semibold">Cross Dissolve</strong> (Pudar Silang) atau <strong className="text-cyan-400 font-semibold">Morph</strong> dengan durasi singkat (sekitar 0.5 - 1 detik). Ini akan menyamarkan potongan antar klip dan menciptakan ilusi timelapse yang mengalir.</p>
                </div>
              </div>

              <div className="flex gap-4 group">
                <div className="w-10 h-10 rounded-full bg-[#0a0f1d] border border-blue-500/30 flex items-center justify-center text-cyan-400 font-black shrink-0 shadow-[0_0_10px_rgba(59,130,246,0.1)] group-hover:scale-110 group-hover:border-cyan-400 transition-all duration-300">4</div>
                <div className="pt-1">
                  <h4 className="font-bold text-white text-base mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    Speed Ramp & SFX
                  </h4>
                  <p className="text-gray-400">Untuk efek timelapse yang lebih dramatis, gunakan fitur <strong className="text-amber-400 font-semibold">Speed Ramp</strong> untuk mempercepat keseluruhan video menjadi 2x atau 4x lipat di bagian tengah transisi. Tambahkan efek suara (SFX) konstruksi atau alam yang dipercepat, serta musik latar yang sinematik untuk menyempurnakan hasilnya.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
