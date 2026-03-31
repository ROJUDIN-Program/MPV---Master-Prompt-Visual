import React, { useState, useRef, useEffect } from 'react';
import { Layers, Lock, Shield, Star, Sparkles, Copy, Check, LayoutGrid, Wand2, ChevronDown, ChevronUp, Cpu, Image as ImageIcon, Type as TypeIcon, RefreshCw, MessageSquare, Target, Megaphone, SlidersHorizontal, Download, Edit2, Save } from 'lucide-react';
import { Input, Textarea, Select, Button } from './FormControls';
import { GoogleGenAI, Type } from "@google/genai";

interface CarouselData {
  topic: string;
  visual_style: string;
  aspect_ratio: string;
  font_type: string;
  slide_count: number;
  tone_of_voice: string;
  target_audience: string;
  cta_goal: string;
  color_palette: string;
}

const INITIAL_CAROUSEL_DATA: CarouselData = {
  topic: '',
  visual_style: '3D Realistis',
  aspect_ratio: '4:5',
  font_type: 'Bold & Modern (Montserrat/Poppins)',
  slide_count: 9,
  tone_of_voice: 'Profesional & Edukatif',
  target_audience: '',
  cta_goal: '',
  color_palette: 'Sesuai Topik (Auto)'
};

const COLOR_PALETTES = [
  { value: 'Sesuai Topik (Auto)', label: 'Sesuai Topik (Auto)' },
  { value: 'Monokrom (Hitam & Putih)', label: 'Monokrom (Hitam & Putih)' },
  { value: 'Warm & Earthy (Coklat, Krem, Hijau)', label: 'Warm & Earthy' },
  { value: 'Neon Cyberpunk (Ungu, Biru, Pink)', label: 'Neon Cyberpunk' },
  { value: 'Pastel Lembut (Pink, Biru Muda, Kuning)', label: 'Pastel Lembut' },
  { value: 'Corporate Blue (Biru, Putih, Abu-abu)', label: 'Corporate Blue' },
  { value: 'Vibrant & Pop (Warna Cerah & Mencolok)', label: 'Vibrant & Pop' }
];

interface CarouselResult {
  slideNumber: number;
  type: 'title' | 'content' | 'cta';
  imagePrompt: string;
  textOverlay: string;
}

const VISUAL_STYLES = [
  { value: '3D Simulasi Realistis', label: '3D Simulasi Realistis' },
  { value: '3D Loaded View', label: '3D Loaded View' },
  { value: '3D Realistis', label: '3D Realistis (Blender/Unreal Engine)' },
  { value: 'Minimalis & Elegan', label: 'Minimalis & Elegan' },
  { value: 'Corporate Professional', label: 'Corporate Professional' },
  { value: 'Flat Illustration', label: 'Flat Illustration (Vector)' },
  { value: 'Watercolor / Artistic', label: 'Watercolor / Artistic' },
  { value: 'Cinematic Photography', label: 'Cinematic Photography' }
];

const FONT_TYPES = [
  { value: 'Bold & Modern (Montserrat/Poppins)', label: 'Bold & Modern' },
  { value: 'Elegant Serif (Playfair/Merriweather)', label: 'Elegant Serif' },
  { value: 'Playful & Casual (Comic/Rounded)', label: 'Playful & Casual' },
  { value: 'Classic & Clean (Helvetica/Arial)', label: 'Classic & Clean' },
  { value: 'Handwritten / Script', label: 'Handwritten / Script' }
];

const ASPECT_RATIOS = [
  { value: '1:1', label: '1:1 (Square)' },
  { value: '4:5', label: '4:5 (Portrait)' }
];

const TONE_OF_VOICE = [
  { value: 'Profesional & Edukatif', label: 'Profesional & Edukatif' },
  { value: 'Santai & Gaul (Gen-Z)', label: 'Santai & Gaul (Gen-Z)' },
  { value: 'Inspiratif & Memotivasi', label: 'Inspiratif & Memotivasi' },
  { value: 'Humoris & Menghibur', label: 'Humoris & Menghibur' },
  { value: 'Storytelling (Bercerita)', label: 'Storytelling (Bercerita)' }
];

interface CarouselModuleProps {
  onOpenSupport: () => void;
}

export const CarouselModule: React.FC<CarouselModuleProps> = ({ onOpenSupport }) => {
  const [data, setData] = useState<CarouselData>(INITIAL_CAROUSEL_DATA);
  const [isGenerating, setIsGenerating] = useState(false);
  const [regeneratingSlide, setRegeneratingSlide] = useState<number | null>(null);
  const [result, setResult] = useState<CarouselResult[] | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  
  const [isStyleOpen, setIsStyleOpen] = useState(false);
  const [isAspectRatioOpen, setIsAspectRatioOpen] = useState(false);
  const [isFontOpen, setIsFontOpen] = useState(false);
  const [isToneOpen, setIsToneOpen] = useState(false);
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [activeTab, setActiveTab] = useState<'form' | 'history'>('form');
  const [isTopicDisabled, setIsTopicDisabled] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [showPresetInput, setShowPresetInput] = useState(false);
  const [history, setHistory] = useState<Array<{ id: string, date: string, data: CarouselData, result: CarouselResult[] }>>([]);
  const [presets, setPresets] = useState<Array<{ id: string, name: string, data: CarouselData }>>([]);
  const [referenceImage, setReferenceImage] = useState<{ data: string, mimeType: string } | null>(null);
  const [generateImages, setGenerateImages] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<Record<number, string>>({});
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);

  useEffect(() => {
    const savedHistory = localStorage.getItem('carousel_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    
    const savedPresets = localStorage.getItem('carousel_presets');
    if (savedPresets) setPresets(JSON.parse(savedPresets));
  }, []);

  const saveToHistory = (res: CarouselResult[], currentData: CarouselData) => {
    const newHistory = [
      { id: Date.now().toString(), date: new Date().toLocaleString('id-ID'), data: currentData, result: res },
      ...history
    ].slice(0, 20); // Keep last 20
    setHistory(newHistory);
    localStorage.setItem('carousel_history', JSON.stringify(newHistory));
  };

  const savePreset = () => {
    if (!presetName.trim()) return;
    const newPreset = {
      id: Date.now().toString(),
      name: presetName,
      data: { ...data }
    };
    const newPresets = [...presets, newPreset];
    setPresets(newPresets);
    localStorage.setItem('carousel_presets', JSON.stringify(newPresets));
    setPresetName('');
    setShowPresetInput(false);
  };

  const deletePreset = (id: string) => {
    const newPresets = presets.filter(p => p.id !== id);
    setPresets(newPresets);
    localStorage.setItem('carousel_presets', JSON.stringify(newPresets));
  };

  const loadPreset = (presetData: CarouselData) => {
    setData(presetData);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        setReferenceImage({ data: base64Data, mimeType: file.type });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const styleRef = useRef<HTMLDivElement>(null);
  const aspectRatioRef = useRef<HTMLDivElement>(null);
  const fontRef = useRef<HTMLDivElement>(null);
  const toneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (styleRef.current && !styleRef.current.contains(event.target as Node)) setIsStyleOpen(false);
      if (aspectRatioRef.current && !aspectRatioRef.current.contains(event.target as Node)) setIsAspectRatioOpen(false);
      if (fontRef.current && !fontRef.current.contains(event.target as Node)) setIsFontOpen(false);
      if (toneRef.current && !toneRef.current.contains(event.target as Node)) setIsToneOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAll = () => {
    if (!result) return;
    const allText = result.map(res => 
      `Slide ${res.slideNumber} (${res.type.toUpperCase()})\n` +
      `Text Overlay: ${res.textOverlay}\n` +
      `Image Prompt: ${res.imagePrompt}`
    ).join('\n\n');
    navigator.clipboard.writeText(allText);
    setCopiedIndex('all');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleDownloadTxt = () => {
    if (!result) return;
    const allText = result.map(res => 
      `Slide ${res.slideNumber} (${res.type.toUpperCase()})\n` +
      `Text Overlay: ${res.textOverlay}\n` +
      `Image Prompt: ${res.imagePrompt}`
    ).join('\n\n');
    
    const blob = new Blob([allText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Carousel_Prompt_${new Date().getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadCSV = () => {
    if (!result) return;
    const headers = ['Slide Number', 'Type', 'Text Overlay', 'Image Prompt'];
    const rows = result.map(res => [
      res.slideNumber,
      res.type,
      `"${res.textOverlay.replace(/"/g, '""')}"`,
      `"${res.imagePrompt.replace(/"/g, '""')}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Carousel_Prompt_${new Date().getTime()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'Rojudin' && password === '024434') {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Username atau Password salah.');
    }
  };

  const generateCarousel = async () => {
    if (!data.topic) {
        alert("Mohon isi topik carousel Anda terlebih dahulu.");
        return;
    }

    setIsGenerating(true);
    setGeneratedImages({});
    
    try {
        const customApiKey = localStorage.getItem('infographic_api_key');
        const apiKey = customApiKey || process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("API Key tidak ditemukan. Mohon hubungi administrator.");
        }
        const ai = new GoogleGenAI({ apiKey });
        
        let promptText = `
            You are an expert Instagram Carousel Designer, Copywriter, and Information Architect.
            Your task is to generate a ${data.slide_count}-slide Instagram carousel prompt package based on the given topic.
            
            STRUCTURE & CONTENT DEPTH:
            - Slide 1: Title (Catchy hook, main title, and a brief intriguing subtitle).
            - Slide 2 to ${data.slide_count - 1}: Content/Material. THESE MUST BE HIGHLY DETAILED AND IN-DEPTH. Do not just provide a title. Provide complex explanations, data points, or step-by-step breakdowns. Think of it like a detailed infographic split into carousel slides. Each slide MUST have a sub-heading and a comprehensive explanatory paragraph or multiple bullet points. The content must be deep, educational, and thoroughly explain the topic. Include statistics, actionable tips, or deep-dive analysis. The textOverlay should be long and informative, resembling a mini-blog post or a dense infographic section.
            - Slide ${data.slide_count}: CTA (Call to Action). Must encourage engagement (Save, Share, Like/Love) and include specific footer branding.
            
            STRICT OUTPUT FORMAT:
            Return a JSON array of exactly ${data.slide_count} objects.
            
            JSON Structure:
            [
              {
                "slideNumber": 1,
                "type": "title",
                "imagePrompt": "Highly detailed image generation prompt for Midjourney v6/DALL-E 3 describing the background/visuals. Must match the visual style perfectly. Include typography instructions if applicable.",
                "textOverlay": "The actual text to be written on the slide (in Indonesian)"
              },
              ...
            ]
            
            CONTENT RULES:
            - Topic: ${data.topic}
            - Target Audience: ${data.target_audience || 'General audience'}
            - Tone of Voice: ${data.tone_of_voice}
            - CTA Goal: ${data.cta_goal || 'General engagement (Save, Share, Like)'}
            - Visual Style: ${data.visual_style}. The image prompts must reflect this style strongly (e.g., if 3D Realistis, describe isometric 3D scenes, detailed textures, etc., similar to high-end infographics).
            - Color Palette: ${data.color_palette}. Ensure the image prompts strictly follow this color scheme.
            - Aspect Ratio: ${data.aspect_ratio} (Include --ar ${data.aspect_ratio} in the image prompts)
            - Font Type Preference: ${data.font_type} (CRITICAL: Explicitly instruct the image generator to use this EXACT same font family consistently across ALL slides from slide 1 to ${data.slide_count}).
            - Typography Hierarchy: Instruct the AI that the main title on Slide 1 MUST be significantly larger and bolder than the body text on the other slides.
            - The textOverlay MUST be in Indonesian, highly informative, deep, and structured (suitable for an educational Instagram carousel).
            - ZERO TYPOS RULE: Ensure perfect Indonesian spelling, grammar, and punctuation. The text must be 100% free of typos or spelling mistakes to ensure it is comfortable for netizens to read.
            - The imagePrompt MUST be in English, highly detailed, photorealistic (if 3D/Cinematic), and specify the visual style requested. Use professional prompt engineering terms (e.g., 8k, highly detailed, masterpiece, volumetric lighting, isometric view if applicable). Instruct the AI to render complex visual elements like charts, diagrams, or detailed 3D models relevant to the text.
            - AVOID AT ALL COSTS: Cyberpunk, Futuristic, Sci-Fi, Neon-cityscapes. These are strictly forbidden.
            - Maintain visual consistency across all ${data.slide_count} slides.
            
            ALL SLIDES (1-${data.slide_count}) SPECIFIC RULES:
            - The textOverlay for EVERY slide MUST include this exact footer branding at the very bottom, formatted as a single horizontal line:
              "r_besar.id   +6281329466856   Rojudin   https://lynk.id/r_besar.id"
            - The imagePrompt for EVERY slide MUST instruct the AI to render these branding elements as small, neat icons next to the text in a single row at the bottom of the image: Include an official Instagram icon next to the text "r_besar.id", an official WhatsApp icon next to the text "+6281329466856", an official Facebook icon next to the text "Rojudin", and a globe icon next to the text "https://lynk.id/r_besar.id". Do NOT write the words "Instagram", "WhatsApp", or "Facebook".

            SLIDE ${data.slide_count} (CTA) SPECIFIC RULES:
            - The textOverlay MUST include a strong Call to Action based on the CTA Goal: "${data.cta_goal || 'Simpan postingan ini agar tidak lupa!, Bagikan ke temanmu yang butuh info ini!, Tap 2x jika bermanfaat!'}".
            - The imagePrompt MUST explicitly instruct the generation of UI icons for engagement: a Heart/Love icon, a Share/Paper Plane icon, and a Save/Bookmark icon prominently displayed.
        `;

        const parts: any[] = [{ text: promptText }];
        if (referenceImage) {
            parts.push({
                inlineData: {
                    data: referenceImage.data,
                    mimeType: referenceImage.mimeType
                }
            });
            parts.push({ text: "Use the provided image as a strong visual reference for the style, composition, and mood of the generated prompts." });
        }

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
                            slideNumber: { type: Type.INTEGER },
                            type: { type: Type.STRING },
                            imagePrompt: { type: Type.STRING },
                            textOverlay: { type: Type.STRING }
                        },
                        required: ["slideNumber", "type", "imagePrompt", "textOverlay"]
                    }
                }
            }
        });

        const jsonStr = response.text?.trim() || "[]";
        const parsedResult = JSON.parse(jsonStr);
        setResult(parsedResult);
        saveToHistory(parsedResult, data);

        if (generateImages) {
            setIsGeneratingImages(true);
            try {
                const newGeneratedImages: Record<number, string> = {};
                for (let i = 0; i < parsedResult.length; i++) {
                    const slide = parsedResult[i];
                    const imgResponse = await ai.models.generateContent({
                        model: 'gemini-3.1-flash-image-preview',
                        contents: {
                            parts: [{ text: slide.imagePrompt }]
                        },
                        config: {
                            imageConfig: {
                                aspectRatio: data.aspect_ratio === '1:1' ? '1:1' : '3:4', // Map 4:5 to 3:4 as 4:5 might not be supported directly
                                imageSize: "1K"
                            }
                        }
                    });
                    
                    for (const part of imgResponse.candidates?.[0]?.content?.parts || []) {
                        if (part.inlineData) {
                            newGeneratedImages[slide.slideNumber] = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                            break;
                        }
                    }
                }
                setGeneratedImages(newGeneratedImages);
            } catch (imgError) {
                console.error("Error generating images:", imgError);
                alert("Berhasil generate prompt, tetapi gagal generate gambar otomatis.");
            } finally {
                setIsGeneratingImages(false);
            }
        }
    } catch (error: any) {
        console.error("Error generating Carousel:", error);
        alert(`Terjadi kesalahan saat generate: ${error.message || "Mohon coba lagi."}`);
    } finally {
        setIsGenerating(false);
    }
  };

  const regenerateSingleSlide = async (slideIndex: number) => {
    if (!result) return;
    setRegeneratingSlide(slideIndex);
    
    try {
        const customApiKey = localStorage.getItem('infographic_api_key');
        const apiKey = customApiKey || process.env.GEMINI_API_KEY;
        if (!apiKey) throw new Error("API Key tidak ditemukan.");
        
        const ai = new GoogleGenAI({ apiKey });
        const slideToRegenerate = result[slideIndex];
        
        let promptText = `
            You are an expert Instagram Carousel Designer.
            Regenerate ONLY slide number ${slideToRegenerate.slideNumber} of a ${data.slide_count}-slide carousel.
            
            Context:
            - Topic: ${data.topic}
            - Target Audience: ${data.target_audience || 'General audience'}
            - Tone of Voice: ${data.tone_of_voice}
            - Visual Style: ${data.visual_style}
            - Color Palette: ${data.color_palette}
            - Aspect Ratio: ${data.aspect_ratio}
            - Font Type Preference: ${data.font_type} (CRITICAL: Explicitly instruct the image generator to use this EXACT same font family consistently).
            - Slide Type: ${slideToRegenerate.type}
            
            Make it highly detailed, informative, and engaging.
            - Typography Hierarchy: If this is Slide 1 (title), the main title MUST be significantly larger and bolder than body text.
            - ZERO TYPOS RULE: Ensure perfect Indonesian spelling, grammar, and punctuation. The text must be 100% free of typos or spelling mistakes to ensure it is comfortable for netizens to read.
            
            Return a JSON object:
            {
              "slideNumber": ${slideToRegenerate.slideNumber},
              "type": "${slideToRegenerate.type}",
              "imagePrompt": "Highly detailed image generation prompt...",
              "textOverlay": "The actual text to be written on the slide (in Indonesian)"
            }
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: [{ parts: [{ text: promptText }] }],
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        slideNumber: { type: Type.INTEGER },
                        type: { type: Type.STRING },
                        imagePrompt: { type: Type.STRING },
                        textOverlay: { type: Type.STRING }
                    },
                    required: ["slideNumber", "type", "imagePrompt", "textOverlay"]
                }
            }
        });

        const jsonStr = response.text?.trim() || "{}";
        const parsedResult = JSON.parse(jsonStr);
        
        const newResult = [...result];
        newResult[slideIndex] = parsedResult;
        setResult(newResult);
    } catch (error: any) {
        console.error("Error regenerating slide:", error);
        alert(`Terjadi kesalahan: ${error.message}`);
    } finally {
        setRegeneratingSlide(null);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto mt-10 animate-in fade-in zoom-in duration-500">
        <div className="bg-[#0a0f1d] border border-blue-900/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-pink-500/10 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-orange-500/10 blur-[100px] pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center">
            <form onSubmit={handleLogin} className="w-full space-y-6 mt-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-bold text-pink-400 uppercase tracking-widest">
                  <Cpu className="w-3 h-3" />
                  Nama Pengguna
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Nama Pengguna"
                    className="w-full bg-[#0d1425] border border-blue-900/40 rounded-xl p-3.5 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all placeholder-gray-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-bold text-pink-400 uppercase tracking-widest">
                  <Lock className="w-3 h-3" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full bg-[#0d1425] border border-blue-900/40 rounded-xl p-3.5 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all placeholder-gray-600"
                  />
                </div>
              </div>

              {loginError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2">
                  <Shield className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-red-400">{loginError}</p>
                </div>
              )}

              {username === 'Rojudin' && password === '024434' ? (
                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-pink-600 to-orange-600 hover:from-pink-500 hover:to-orange-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-pink-500/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  Masuk
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onOpenSupport}
                  className="w-full bg-gray-800/50 hover:bg-gray-800 border border-gray-700 text-gray-300 font-bold py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 relative"
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-700">
      <div className="space-y-6">
        <div className="bg-[#0a0f1d] border border-blue-900/30 rounded-2xl shadow-xl overflow-hidden relative flex flex-col h-[calc(100vh-120px)]">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-orange-500" />
          
          <div className="p-5 border-b border-blue-900/30 bg-[#0d1425]/50 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-pink-500/10 rounded-lg">
                <Layers className="w-5 h-5 text-pink-400" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-100">Carousel Generator</h2>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setActiveTab('form')}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'form' ? 'bg-pink-500/20 text-pink-400' : 'text-gray-500 hover:text-gray-300'}`}
              >
                Form
              </button>
              <button 
                onClick={() => setActiveTab('history')}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'history' ? 'bg-pink-500/20 text-pink-400' : 'text-gray-500 hover:text-gray-300'}`}
              >
                Riwayat
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-5">
            {activeTab === 'form' ? (
              <>
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
                            className="text-xs text-pink-400 hover:text-pink-300 font-medium"
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
                          className="bg-[#111827] border border-blue-900/40 rounded px-2 py-1 text-xs text-gray-200 w-24 focus:outline-none focus:border-pink-500"
                          autoFocus
                        />
                        <button onClick={savePreset} className="text-xs bg-pink-500/20 text-pink-400 px-2 py-1 rounded hover:bg-pink-500/30">Simpan</button>
                        <button onClick={() => setShowPresetInput(false)} className="text-xs text-gray-500 px-1 hover:text-gray-300">&times;</button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setShowPresetInput(true)}
                        className="text-[10px] font-bold bg-blue-900/30 text-pink-400 px-3 py-1.5 rounded-lg hover:bg-blue-900/50 transition-colors"
                      >
                        + Simpan Preset
                      </button>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-medium text-pink-300">Topik / Materi</label>
                    <div className="flex items-center gap-2">
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
                  </div>
                  <Textarea
                    value={data.topic}
                    onChange={(e) => setData({ ...data, topic: e.target.value })}
                    disabled={isTopicDisabled}
                    placeholder="Contoh: 5 Cara Mengatur Keuangan untuk Freelancer..."
                    className={`h-24 bg-[#0d1425] border-blue-900/40 text-gray-200 focus:ring-pink-500 focus:border-pink-500 transition-all ${isTopicDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-medium text-pink-300">Gambar Referensi (Opsional)</label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload}
                    className="w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-pink-500/10 file:text-pink-400 hover:file:bg-pink-500/20"
                  />
                  {referenceImage && <p className="text-[10px] text-green-400">Gambar berhasil dimuat.</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2 relative" ref={styleRef}>
                <label className="block text-xs font-medium text-pink-300">Gaya Visual</label>
                <div 
                  className="w-full bg-[#0d1425] border border-blue-900/40 rounded-lg p-2.5 flex justify-between items-center cursor-pointer hover:border-pink-500/50 transition-colors"
                  onClick={() => setIsStyleOpen(!isStyleOpen)}
                >
                  <span className="text-xs text-gray-200 truncate pr-2">{data.visual_style}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isStyleOpen ? 'rotate-180' : ''}`} />
                </div>
                
                {isStyleOpen && (
                  <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-[#0a0f1d] border border-blue-900/50 rounded-lg shadow-xl overflow-hidden">
                    <div className="max-h-48 overflow-y-auto custom-scrollbar">
                      {VISUAL_STYLES.map((style) => (
                        <div 
                          key={style.value}
                          className={`px-3 py-2 text-xs cursor-pointer hover:bg-blue-900/30 transition-colors ${data.visual_style === style.value ? 'bg-pink-500/10 text-pink-400' : 'text-gray-300'}`}
                          onClick={() => {
                            setData({ ...data, visual_style: style.value });
                            setIsStyleOpen(false);
                          }}
                        >
                          {style.label}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2 relative" ref={fontRef}>
                <label className="block text-xs font-medium text-pink-300">Jenis Font</label>
                <div 
                  className="w-full bg-[#0d1425] border border-blue-900/40 rounded-lg p-2.5 flex justify-between items-center cursor-pointer hover:border-pink-500/50 transition-colors"
                  onClick={() => setIsFontOpen(!isFontOpen)}
                >
                  <span className="text-xs text-gray-200 truncate pr-2">{data.font_type}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isFontOpen ? 'rotate-180' : ''}`} />
                </div>
                
                {isFontOpen && (
                  <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-[#0a0f1d] border border-blue-900/50 rounded-lg shadow-xl overflow-hidden">
                    <div className="max-h-48 overflow-y-auto custom-scrollbar">
                      {FONT_TYPES.map((font) => (
                        <div 
                          key={font.value}
                          className={`px-3 py-2 text-xs cursor-pointer hover:bg-blue-900/30 transition-colors ${data.font_type === font.value ? 'bg-pink-500/10 text-pink-400' : 'text-gray-300'}`}
                          onClick={() => {
                            setData({ ...data, font_type: font.value });
                            setIsFontOpen(false);
                          }}
                        >
                          {font.label}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2 relative" ref={aspectRatioRef}>
                <label className="block text-xs font-medium text-pink-300">Rasio Aspek</label>
                <div 
                  className="w-full bg-[#0d1425] border border-blue-900/40 rounded-lg p-2.5 flex justify-between items-center cursor-pointer hover:border-pink-500/50 transition-colors"
                  onClick={() => setIsAspectRatioOpen(!isAspectRatioOpen)}
                >
                  <span className="text-xs text-gray-200">{data.aspect_ratio}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isAspectRatioOpen ? 'rotate-180' : ''}`} />
                </div>
                
                {isAspectRatioOpen && (
                  <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-[#0a0f1d] border border-blue-900/50 rounded-lg shadow-xl overflow-hidden">
                    {ASPECT_RATIOS.map((ratio) => (
                      <div 
                        key={ratio.value}
                        className={`px-3 py-2 text-xs cursor-pointer hover:bg-blue-900/30 transition-colors ${data.aspect_ratio === ratio.value ? 'bg-pink-500/10 text-pink-400' : 'text-gray-300'}`}
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

              <div className="space-y-2 relative">
                <label className="block text-xs font-medium text-pink-300">Tema Warna</label>
                <select
                  value={data.color_palette}
                  onChange={(e) => setData({ ...data, color_palette: e.target.value })}
                  className="w-full bg-[#0d1425] border border-blue-900/40 rounded-lg p-2.5 text-xs text-gray-200 focus:outline-none focus:border-pink-500/50 appearance-none"
                >
                  {COLOR_PALETTES.map((palette) => (
                    <option key={palette.value} value={palette.value}>
                      {palette.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-500 absolute right-2.5 top-8 pointer-events-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 relative" ref={toneRef}>
                <label className="block text-xs font-medium text-pink-300">Tone of Voice</label>
                <div 
                  className="w-full bg-[#0d1425] border border-blue-900/40 rounded-lg p-2.5 flex justify-between items-center cursor-pointer hover:border-pink-500/50 transition-colors"
                  onClick={() => setIsToneOpen(!isToneOpen)}
                >
                  <span className="text-xs text-gray-200 truncate pr-2">{data.tone_of_voice}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isToneOpen ? 'rotate-180' : ''}`} />
                </div>
                
                {isToneOpen && (
                  <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-[#0a0f1d] border border-blue-900/50 rounded-lg shadow-xl overflow-hidden">
                    <div className="max-h-48 overflow-y-auto custom-scrollbar">
                      {TONE_OF_VOICE.map((tone) => (
                        <div 
                          key={tone.value}
                          className={`px-3 py-2 text-xs cursor-pointer hover:bg-blue-900/30 transition-colors ${data.tone_of_voice === tone.value ? 'bg-pink-500/10 text-pink-400' : 'text-gray-300'}`}
                          onClick={() => {
                            setData({ ...data, tone_of_voice: tone.value });
                            setIsToneOpen(false);
                          }}
                        >
                          {tone.label}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-pink-300 flex justify-between">
                  <span>Jumlah Slide</span>
                  <span className="text-pink-400 font-bold">{data.slide_count}</span>
                </label>
                <div 
                  className="relative w-full h-6 flex items-center cursor-pointer" 
                  onPointerDown={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const updateValue = (clientX: number) => {
                      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
                      const percentage = x / rect.width;
                      const value = Math.round(4 + percentage * (10 - 4));
                      setData(prev => ({ ...prev, slide_count: value }));
                    };
                    
                    updateValue(e.clientX);
                    
                    const handlePointerMove = (moveEvent: PointerEvent) => {
                      updateValue(moveEvent.clientX);
                    };
                    
                    const handlePointerUp = () => {
                      window.removeEventListener('pointermove', handlePointerMove);
                      window.removeEventListener('pointerup', handlePointerUp);
                    };
                    
                    window.addEventListener('pointermove', handlePointerMove);
                    window.addEventListener('pointerup', handlePointerUp);
                  }}
                  style={{ touchAction: 'none' }}
                >
                  <div className="w-full h-2 bg-blue-900/40 rounded-lg overflow-hidden">
                    <div 
                      className="h-full bg-pink-500 transition-all duration-75" 
                      style={{ width: `${((data.slide_count - 4) / 6) * 100}%` }}
                    />
                  </div>
                  <div 
                    className="absolute w-4 h-4 bg-white rounded-full shadow cursor-grab active:cursor-grabbing transition-all duration-75"
                    style={{ 
                      left: `calc(${((data.slide_count - 4) / 6) * 100}% - 8px)`,
                      top: '50%',
                      transform: 'translateY(-50%)'
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-medium text-pink-300">Target Audience</label>
                <Input
                  value={data.target_audience}
                  onChange={(e) => setData({ ...data, target_audience: e.target.value })}
                  placeholder="Contoh: Pemula, Mahasiswa..."
                  className="bg-[#0d1425] border-blue-900/40 text-gray-200 focus:ring-pink-500 focus:border-pink-500 text-xs"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-medium text-pink-300">CTA Goal</label>
                <Input
                  value={data.cta_goal}
                  onChange={(e) => setData({ ...data, cta_goal: e.target.value })}
                  placeholder="Contoh: Follow akun, Klik link..."
                  className="bg-[#0d1425] border-blue-900/40 text-gray-200 focus:ring-pink-500 focus:border-pink-500 text-xs"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <input 
                type="checkbox" 
                id="generateImages" 
                checked={generateImages} 
                onChange={(e) => setGenerateImages(e.target.checked)}
                className="w-4 h-4 accent-pink-500 bg-[#0d1425] border-blue-900/40 rounded cursor-pointer"
              />
              <label htmlFor="generateImages" className="text-xs font-medium text-pink-300 cursor-pointer">
                Generate Gambar Langsung (Membutuhkan waktu lebih lama)
              </label>
            </div>

            <Button 
              onClick={generateCarousel} 
              disabled={isGenerating || !data.topic}
              className="w-full mt-4 bg-gradient-to-r from-pink-600 to-orange-600 hover:from-pink-500 hover:to-orange-500 text-white border-0 py-3 shadow-lg shadow-pink-900/20"
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Menyusun Carousel...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Wand2 className="w-4 h-4" />
                  Generate Crousel
                </span>
              )}
            </Button>
            </>
            ) : (
              <div className="space-y-4">
                {history.length === 0 ? (
                  <p className="text-xs text-gray-500 text-center py-10">Belum ada riwayat generate.</p>
                ) : (
                  history.map((item) => (
                    <div key={item.id} className="bg-[#0d1425] border border-blue-900/30 rounded-xl p-4 space-y-2 hover:border-pink-500/30 transition-colors">
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs font-bold text-gray-200 line-clamp-1 flex-1">{item.data.topic}</h4>
                        <span className="text-[10px] text-gray-500 ml-2 whitespace-nowrap">{item.date}</span>
                      </div>
                      <p className="text-[10px] text-gray-400">Style: {item.data.visual_style} • {item.data.slide_count} Slides</p>
                      <button 
                        onClick={() => {
                          setResult(item.result);
                          setData(item.data);
                          setActiveTab('form');
                        }}
                        className="text-[10px] font-bold text-pink-400 hover:text-pink-300 flex items-center gap-1 mt-2"
                      >
                        <RefreshCw className="w-3 h-3" /> Muat Ulang Hasil Ini
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="bg-[#0a0f1d] border border-blue-900/30 rounded-2xl shadow-xl h-full flex flex-col overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-pink-500" />
          
          <div className="p-4 border-b border-blue-900/30 bg-[#0d1425]/50 flex justify-between items-center">
            <h3 className="text-sm font-bold text-gray-200 flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-pink-400" />
              Hasil Generate
            </h3>
            {result && (
              <div className="flex gap-2">
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
                <button
                  onClick={handleCopyAll}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 rounded-lg text-xs font-medium transition-colors border border-pink-500/20"
                >
                  {copiedIndex === 'all' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedIndex === 'all' ? 'Tersalin!' : 'Salin Semua'}
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
            <div className="p-4 sm:p-6">
              {isGenerating ? (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-pink-500/20 border-t-pink-500 rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-orange-400 animate-pulse" />
                    </div>
                  </div>
                </div>
              ) : result ? (
                <div className="space-y-6">
                  {result.map((slide, index) => (
                    <div key={index} className="bg-[#0d1425] border border-blue-900/40 rounded-xl overflow-hidden group hover:border-pink-500/30 transition-colors">
                      <div className="bg-[#111827] px-4 py-3 border-b border-blue-900/40 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="bg-gradient-to-r from-pink-600 to-orange-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            SLIDE {slide.slideNumber}
                          </span>
                          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                            {slide.type === 'title' ? 'Judul Utama' : slide.type === 'cta' ? 'Call to Action' : 'Materi Konten'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => regenerateSingleSlide(index)}
                            disabled={regeneratingSlide === index}
                            className="text-gray-500 hover:text-orange-400 transition-colors p-1.5 flex items-center gap-1"
                            title="Regenerate Slide Ini"
                          >
                            <RefreshCw className={`w-4 h-4 ${regeneratingSlide === index ? 'animate-spin text-orange-400' : ''}`} />
                          </button>
                          <button
                            onClick={() => handleCopy(`Text Overlay:\n${slide.textOverlay}\n\nImage Prompt:\n${slide.imagePrompt}`, `slide-${index}`)}
                            className="text-gray-500 hover:text-pink-400 transition-colors p-1.5"
                            title="Salin Slide Ini"
                          >
                            {copiedIndex === `slide-${index}` ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    
                    <div className="p-4 space-y-4">
                      <div className="space-y-2">
                        <label className="flex items-center gap-1.5 text-[10px] font-bold text-orange-400 uppercase tracking-wider">
                          <LayoutGrid className="w-3 h-3" />
                          Teks pada Slide (Text Overlay)
                        </label>
                        <div className="bg-[#0a0f1d] p-3 rounded-lg border border-blue-900/20 text-sm text-gray-200 font-medium leading-relaxed">
                          {slide.textOverlay}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="flex items-center gap-1.5 text-[10px] font-bold text-pink-400 uppercase tracking-wider">
                          <ImageIcon className="w-3 h-3" />
                          Prompt Gambar (Midjourney/DALL-E)
                        </label>
                        <div className="bg-[#0a0f1d] p-3 rounded-lg border border-blue-900/20 text-xs text-gray-400 font-mono leading-relaxed">
                          {slide.imagePrompt}
                        </div>
                      </div>

                      {/* Generated Image Display */}
                      {(isGeneratingImages || generatedImages[slide.slideNumber]) && (
                        <div className="mt-4 border-t border-blue-900/30 pt-4">
                          <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2 mb-3">
                            <ImageIcon className="w-4 h-4" />
                            Generated Image
                          </h4>
                          <div className="bg-[#111827] p-2 rounded-lg border border-blue-900/30 flex justify-center items-center min-h-[200px]">
                            {isGeneratingImages && !generatedImages[slide.slideNumber] ? (
                              <div className="flex flex-col items-center gap-2">
                                <RefreshCw className="w-6 h-6 text-emerald-400 animate-spin" />
                                <span className="text-xs text-gray-400">Generating image...</span>
                              </div>
                            ) : generatedImages[slide.slideNumber] ? (
                              <img 
                                src={generatedImages[slide.slideNumber]} 
                                alt={`Generated for slide ${slide.slideNumber}`} 
                                className="max-w-full max-h-[400px] object-contain rounded-md"
                              />
                            ) : null}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-[#0d1425] border border-blue-900/40 border-dashed rounded-2xl opacity-50">
                <Layers className="w-16 h-16 text-pink-500/50 mb-4" />
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};
