
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { PROMPT_CONFIG, VISUAL_STYLES, PURPOSE_OPTIONS, ARCHITECTURE_OPTIONS, LAYOUT_FLOW_OPTIONS, VISUAL_ELEMENT_OPTIONS, COLOR_PALETTE_OPTIONS } from './constants';
import type { FormData, Section, HistoryItem } from './types';
import { Input, Textarea, Select, Checkbox, Button } from './components/FormControls';
import { SectionBuilder } from './components/SectionBuilder';
import { PromptPreview } from './components/PromptPreview';
import { ModalSelector } from './components/ModalSelector';
import { HistorySidebar } from './components/HistorySidebar';
import { Support } from './components/Support';
import { 
  BookOpen, ListOrdered, ArrowRightLeft, Target, BarChart2, Layers, RefreshCw, GitBranch,
  Grid, Box, CircleDot, ChevronsDown, MoveRight, Columns, LayoutDashboard, Newspaper,
  PieChart, Circle, ArrowRight, Square, User, Type, Scissors, Smartphone,
  Camera, Layout, Aperture, Globe, Cpu, Zap, Droplet, PenTool, Compass, Hexagon,
  MessageSquare, Edit3, Gamepad2, Smile, Activity, Shirt, Palette, Image as ImageIcon,
  Briefcase, Diamond, Minus, Sparkles, Menu, Headphones, Shield, LogOut, Edit2, Save
} from 'lucide-react';
import { PdfUpload } from './components/PdfUpload';
import { ImageAnalysisUpload } from './components/ImageAnalysisUpload';
import { ProfilePage } from './components/ProfilePage';
import { StatisticsModal } from './components/StatisticsModal';
import { SidebarOverlay } from './components/SidebarOverlay';
import { DeveloperProfileModal } from './components/DeveloperProfileModal';
import { LoginPage } from './components/LoginPage';
import { TimelapseModule } from './components/TimelapseModule';
import { CarouselModule } from './components/CarouselModule';

const PERMANENT_BRAND_URL = 'https://lynk.id/r_besar.id';

const INITIAL_DATA: FormData = {
  purpose: '',
  architecture_type: '',
  layout_flow: '',
  visual_element: '',
  color_palette: '',
  title: '',
  subtitle: '',
  main_subject: '',
  main_attribute: '',
  sections: [],
  enable_timeline: false,
  enable_map: false,
  enable_factbox: false,
  enable_statistics: false,
  enable_quote: false,
  enable_qr_code: false,
  enable_carousel: false,
  enable_face_fix: false, 
  enable_veo: false,
  sources: '',
  brand_url: PERMANENT_BRAND_URL,
  instagram: 'r_besar.id',
  whatsapp: '+6281329466856',
  facebook: 'Rojudin'
};

type AutoGenMode = 'text' | 'pdf' | 'image';
type AppModule = 'infographic' | 'timelapse' | 'carousel';

const ModuleSwitcher = ({ active, onChange }: { active: AppModule, onChange: (m: AppModule) => void }) => {
  return (
    <div className="flex justify-center mb-8 overflow-x-auto pb-4 sm:pb-0">
      <div className="relative bg-gray-900 p-1 rounded-xl border border-gray-800 flex shadow-2xl overflow-hidden min-w-max">
        {/* Sliding Background */}
        <div 
          className={`absolute top-1 bottom-1 transition-all duration-500 ease-out rounded-lg bg-gradient-to-r ${
            active === 'infographic' ? 'left-1 w-[120px] from-blue-600 to-blue-500' : 
            active === 'timelapse' ? 'left-[125px] w-[120px] from-emerald-600 to-emerald-500' :
            'left-[249px] w-[120px] from-pink-600 to-orange-500'
          }`}
        />
        
        <button 
          onClick={() => onChange('infographic')}
          className={`relative z-10 w-[120px] py-2.5 text-[10px] font-black tracking-widest transition-colors duration-300 flex flex-col items-center justify-center gap-1 ${active === 'infographic' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <Layout className="w-4 h-4" />
          INFOGRAPHIC
        </button>
        <button 
          onClick={() => onChange('timelapse')}
          className={`relative z-10 w-[120px] py-2.5 text-[10px] font-black tracking-widest transition-colors duration-300 flex flex-col items-center justify-center gap-1 ${active === 'timelapse' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <Zap className="w-4 h-4" />
          TIMELAPSE
        </button>
        <button 
          onClick={() => onChange('carousel')}
          className={`relative z-10 w-[120px] py-2.5 text-[10px] font-black tracking-widest transition-colors duration-300 flex flex-col items-center justify-center gap-1 ${active === 'carousel' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <Layers className="w-4 h-4" />
          CAROUSEL
        </button>
      </div>
    </div>
  );
};

const DateTimeWidget = ({ onShowProfile, onShowSupport, onShowSidebar, onShowDeveloperProfile }: { onShowProfile: () => void, onShowSupport: () => void, onShowSidebar: () => void, onShowDeveloperProfile: () => void }) => {
  const [date, setDate] = useState(new Date());
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadProfileImage = () => {
        const savedImage = localStorage.getItem('infographic_profile_image');
        setProfileImage(savedImage);
    };
    
    // Load initially
    loadProfileImage();

    // Listen for changes from other components (like ProfilePage)
    window.addEventListener('storage', loadProfileImage);
    
    // Custom event for same-window updates
    window.addEventListener('profileImageUpdated', loadProfileImage);

    return () => {
        window.removeEventListener('storage', loadProfileImage);
        window.removeEventListener('profileImageUpdated', loadProfileImage);
    };
  }, []);

  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const dayName = days[date.getDay()];
  
  const pad = (n: number) => n.toString().padStart(2, '0');
  
  const dateStr = `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()}`;
  const timeStr = `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg py-1.5 px-3 sm:py-2 sm:px-4 shadow-xl flex justify-between items-center">
      <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
              <button 
                  onClick={onShowProfile}
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden border-2 border-green-500 hover:border-green-400 transition-colors flex-shrink-0 focus:outline-none focus:ring-1 focus:ring-green-500 bg-gray-800 flex items-center justify-center text-gray-400 hover:text-green-400"
                  title="Profil Pengguna"
              >
                  {profileImage ? (
                      <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-4 sm:h-4">
                        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                      </svg>
                  )}
              </button>
              <button 
                  onClick={onShowDeveloperProfile}
                  className="flex-none justify-center flex items-center px-2 py-1 rounded transition-colors text-[10px] sm:text-xs font-bold shadow-sm bg-blue-700 hover:bg-blue-600 text-white tracking-wider leading-none"
              >
                  R_BESAR.ID
              </button>
          </div>
          <div className="text-[10px] sm:text-xs font-sans font-medium tracking-wide text-gray-300 whitespace-nowrap leading-none flex items-center">
            {dayName}, {dateStr}
            <span className="mx-2 text-gray-600">|</span>
            {timeStr} WIB
          </div>
      </div>
      <div className="flex items-center gap-1">
        <button 
          onClick={onShowSupport} 
          className="text-gray-500 hover:text-blue-400 transition-colors p-1.5 rounded-full hover:bg-gray-800"
          title="Support"
        >
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <button 
          onClick={onShowSidebar} 
          className="text-gray-500 hover:text-blue-400 transition-colors p-1.5 rounded-full hover:bg-gray-800"
          title="Menu Utama"
        >
          <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeModule, setActiveModule] = useState<AppModule>('infographic');
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
  const [visualStyle, setVisualStyle] = useState('');
  const [aspectRatio, setAspectRatio] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [veoPrompt, setVeoPrompt] = useState(''); 
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'info'} | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDeveloperProfileOpen, setIsDeveloperProfileOpen] = useState(false);
  
  // Configuration Panel State
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  // Undo/Redo State
  const [undoStack, setUndoStack] = useState<FormData[]>([]);
  const [redoStack, setRedoStack] = useState<FormData[]>([]);
  const undoTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);
  const stateBeforeTypingRef = useRef<FormData>(INITIAL_DATA);
  const cancelAnalysisRef = useRef(false);

  const handleCancelAnalysis = () => {
      cancelAnalysisRef.current = true;
      setIsGeneratingText(false);
  };

  // State for Auto Generate Text
  const [autoGenMode, setAutoGenMode] = useState<AutoGenMode>('text');
  const [topicInput, setTopicInput] = useState('');
  const [isTopicDisabled, setIsTopicDisabled] = useState(false);
  const [isGeneratingText, setIsGeneratingText] = useState(false);
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  
  // State for PDF Upload (Analysis)
  const [uploadedPdf, setUploadedPdf] = useState<{data: string, name: string} | null>(null);

  // State for Image Upload (Analysis)
  const [uploadedAnalysisImage, setUploadedAnalysisImage] = useState<{data: string, mimeType: string, name: string} | null>(null);

  // State for Generate Count & Stats
  const [generateCount, setGenerateCount] = useState(0);
  const [generateStats, setGenerateStats] = useState<Record<string, number>>({});
  const [isStatsOpen, setIsStatsOpen] = useState(false);

  useEffect(() => {
    // Check login status
    const loggedIn = localStorage.getItem('infographic_logged_in');
    if (loggedIn === 'true') {
      setIsLoggedIn(true);
    }

    // Load history from local storage
    const savedHistory = localStorage.getItem('infographic_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }

    // Load generate count from local storage
    const savedCount = localStorage.getItem('infographic_gen_count_v2');
    if (savedCount) {
        setGenerateCount(parseInt(savedCount, 10) || 0);
    }

    // Load generate stats from local storage
    const savedStats = localStorage.getItem('infographic_gen_stats_v2');
    if (savedStats) {
        try {
            setGenerateStats(JSON.parse(savedStats));
        } catch (e) {
            console.error("Failed to load stats", e);
        }
    }

    // Load shared configuration from URL
    const params = new URLSearchParams(window.location.search);
    const shareParam = params.get('share');
    if (shareParam) {
        try {
            const json = decodeURIComponent(atob(shareParam));
            const data = JSON.parse(json);
            
            if (data.formData) {
                 if (isTypingRef.current) {
                     if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
                     setUndoStack(current => [...current, stateBeforeTypingRef.current]);
                     isTypingRef.current = false;
                 }
                 setUndoStack(prev => [...prev, formData]);
                 setRedoStack([]);
                 setFormData({ 
                     ...INITIAL_DATA, 
                     ...data.formData, 
                     brand_url: PERMANENT_BRAND_URL,
                     instagram: data.formData.instagram || 'r_besar.id',
                     whatsapp: data.formData.whatsapp || '+6281329466856',
                     facebook: data.formData.facebook || 'Rojudin'
                });
            }
            if (data.visualStyle) setVisualStyle(data.visualStyle);
            if (data.aspectRatio) setAspectRatio(data.aspectRatio);
            
            if (data.templateName) {
                showNotification(`Template "${data.templateName}" berhasil dimuat!`, 'success');
            }
            
            setIsConfigOpen(true);
            window.history.replaceState({}, document.title, window.location.pathname);
        } catch (e) {
            console.error("Invalid share link", e);
        }
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('infographic_logged_in', 'true');
  };

  const handleGeneratePrompt = async () => {
    const hasData = formData.title.trim() !== '' || formData.main_subject.trim() !== '' || formData.sections.length > 0;
    
    if (!hasData) {
        setGeneratedPrompt('');
        setVeoPrompt('');
        return;
    }

    setIsGeneratingPrompt(true);

    // Simulate a 10 second delay for the loading animation to build a good prompt
    await new Promise(resolve => setTimeout(resolve, 10000));

    const style = VISUAL_STYLES.find(s => s.value === visualStyle);
    const purpose = PURPOSE_OPTIONS.find(p => p.value === formData.purpose)?.label || formData.purpose;
    
    // Quality Boosters Logic
    let qualityBoosters = "masterpiece, best quality, professional composition, 8k resolution, highly detailed";
    let motionDescription = "slow pan, subtle movement, high quality";

    switch (visualStyle) {
        case 'vintage':
        case 'vintage_blueprint':
             qualityBoosters += ", archival paper texture, intricate cross-hatching, copperplate engraving, museum quality, sepia tones, botanical illustration style";
             motionDescription = "camera slowly zooming in, dust particles floating in light, slight parallax effect on the layers";
             break;
        case 'modern_flat':
        case 'abstract_geometric':
             qualityBoosters += ", vector art, clean lines, minimalist, flat design, behance trending, dribbble aesthetic, sharp edges, vivid colors, no noise";
             motionDescription = "smooth sliding animations of elements, geometric shapes morphing, clean kinetic typography motion";
             break;
        case '3d_realistic':
             qualityBoosters += ", unreal engine 5 render, octane render, raytracing, global illumination, photorealistic, 8k textures, cinematic lighting, depth of field, hyper-detailed";
             motionDescription = "cinematic camera orbit, photorealistic lighting changes, soft focus rack, subtle character breathing or movement";
             break;
        case 'universal_3d_simulator':
             qualityBoosters += ", Unreal Engine 5.4, path tracing, physically based rendering (PBR), high dynamic range (HDR), volumetric lighting, digital twin precision, technical accuracy, 8k raw data visualization, sharp textures, advanced UI overlay";
             motionDescription = "digital twin rotation, UI elements popping up, data streams flowing, high-tech scanning effect";
             break;
        case '3d_render':
        case '3d_loaded':
             qualityBoosters += ", blender 3d, claymorphism, soft studio lighting, subsurface scattering, ambient occlusion, cute 3d character, matte finish, pastel colors";
             motionDescription = "bouncy animation, soft clay-like deformation, turntable rotation, cute character blinking";
             break;
        case 'futuristic':
        case 'glowing_neon':
             qualityBoosters += ", cyberpunk aesthetic, neon glow, chromatic aberration, synthwave, futuristic interface, HUD details, dark background, bioluminescence, volumetric lighting";
             motionDescription = "neon lights pulsing, glitch effects, hologram projection appearing, camera flying through digital grid";
             break;
        case 'watercolor':
             qualityBoosters += ", watercolor paper texture, wet-on-wet technique, alcohol ink, soft edges, artistic wash, traditional art, fluid strokes, pastel tones";
             motionDescription = "ink spreading on paper, watercolor wash transition, gentle floating motion, hand-painted stop motion feel";
             break;
        case 'blueprint':
             qualityBoosters += ", technical drawing, schematic, white lines on blue background, precise grid, engineering diagram, CAD style, architectural plan";
             motionDescription = "lines drawing themselves, schematic parts assembling, grid scrolling, technical measurements popping up";
             break;
        case 'isometric':
             qualityBoosters += ", isometric projection, 3d vector, orthographic view, clean geometry, sim city style, low poly aesthetic, precise angles";
             motionDescription = "isometric world building up, traffic or elements moving along paths, mechanical gears turning";
             break;
        case 'paper_cutout':
             qualityBoosters += ", layered paper art, depth of field, shadowbox effect, craft texture, scissors cut edges, tactile feel, paper grain";
             motionDescription = "paper layers shifting parallax, shadows moving as light source changes, stop motion paper unfold";
             break;
        case 'pop_art':
             qualityBoosters += ", halftone pattern, ben-day dots, comic book style, bold black outlines, vibrant primary colors, pop culture aesthetic, roy lichtenstein style";
             motionDescription = "comic panels sliding, halftone dots animating, pop-up text bubbles, dynamic action lines";
             break;
        case 'wooden_carved':
             qualityBoosters += ", natural wood grain texture, bas-relief, hand carved, varnish finish, rustic aesthetic, carpentry details, tactile wood surface";
             motionDescription = "light passing over wood grain, slow rotation to show carving depth, wood chips settling";
             break;
        case 'chalkboard':
             qualityBoosters += ", chalk texture, slate background, dusty residue, hand lettering, educational diagram, white chalk on green board";
             motionDescription = "hand drawing with chalk, erasing and redrawing, chalk dust settling, stop motion writing";
             break;
        case 'pixel_art':
             qualityBoosters += ", 16-bit, pixel perfect, sprite sheet, retro gaming, dithering, arcade aesthetic, digital grid";
             motionDescription = "character idle animation, 8-bit arcade movement, retro game scrolling background, pixel particles";
             break;
        case 'claymation':
             qualityBoosters += ", plasticine texture, stop motion, handmade, fingerprint details, clay shader, aardman style, physical model look";
             motionDescription = "low frame rate stop motion (12fps), fingerprints changing on clay surface, handmade character movement";
             break;
        case 'knitted_art':
             qualityBoosters += ", wool texture, yarn strands, crochet pattern, fuzzy, fabric simulation, macro photography of fabric, warm and cozy";
             motionDescription = "yarn unravelling and knitting itself, fabric waving softly, warm cozy lighting flickering";
             break;
        case 'minimalist_line_art':
             qualityBoosters += ", continuous line drawing, black ink on white paper, minimalism, abstraction, elegant curves, negative space";
             motionDescription = "continuous line drawing itself, ink flowing along the path, elegant minimal movement";
             break;
        default:
             qualityBoosters += ", vector aesthetics, clean design, award winning graphic design, sharp focus";
             motionDescription = "cinematic slow pan, high quality professional video, sharp focus";
    }

    // Add explicit high-accuracy tokens if enabled
    if (formData.enable_face_fix) {
        qualityBoosters += ", perfect facial likeness, accurate identity, photorealistic face, official logo accuracy, correct brand colors, authentic insignia, editorial photography";
    }
    
    let negativePrompts = "";

    // "Excellent" mode toggle (formerly carousel) enhances the single prompt
    if (formData.enable_carousel) {
        qualityBoosters += ", award-winning graphic design, cinematic lighting, hyper-detailed, intricate details, sharp focus, professional color grading, editorial quality, behance HD, artstation HQ, physically based rendering";
    }

    const negativePromptList = [
        "Penulisan Code colour",
        "cartoonish",
        "flat illustration",
        "low detail",
        "blurry",
        "oversaturated neon colors",
        "poor typography",
        "cluttered layout",
        "penulisan kode tone warna",
        "Penulisan dengan bahasa inggris",
        "rusty metal",
        "messy wires",
        "incorrect engine anatomy",
        "bent valves",
        "unrealistic mechanical physics",
        "2D vector style",
        "tulisan Tujuan",
        "judul Tujuan"
    ];
    
    const strictVisualPolicy = {
        "visible_text_policy": "design_text_only",
        "forbidden_text": [
            "hex color codes",
            "rgb values",
            "icon references",
            "style descriptions",
            "material descriptions",
            "prompt keywords",
            "debug labels",
            "Tujuan",
            "Judul Tujuan",
            "Purpose"
        ],
        "violation_handling": "remove all forbidden text from visual output"
    };

    let prompt = PROMPT_CONFIG.prompt_template.final_prompt_example_structure;
    
    prompt = prompt.replace('{PURPOSE}', purpose || 'education');
    prompt = prompt.replace('{VISUAL_STYLE}', style?.prompt_fragment || visualStyle || 'modern flat design');
    prompt = prompt.replace('{ASPECT_RATIO}', aspectRatio || '9:16');
    prompt = prompt.replace('{ARCHITECTURE_TYPE}', ARCHITECTURE_OPTIONS.find(o => o.value === formData.architecture_type)?.label || 'Standard');
    prompt = prompt.replace('{LAYOUT_FLOW}', LAYOUT_FLOW_OPTIONS.find(o => o.value === formData.layout_flow)?.label || 'Standard');
    prompt = prompt.replace('{VISUAL_ELEMENT}', VISUAL_ELEMENT_OPTIONS.find(o => o.value === formData.visual_element)?.label || 'Standard');
    prompt = prompt.replace('{COLOR_PALETTE}', COLOR_PALETTE_OPTIONS.find(o => o.value === formData.color_palette)?.label || 'Standard');
    prompt = prompt.replace('{TITLE}', formData.title);
    prompt = prompt.replace('{SUBTITLE}', formData.subtitle);
    prompt = prompt.replace('{SOURCES}', formData.sources);
    prompt = prompt.replace('{MAIN_SUBJECT}', formData.main_subject);
    prompt = prompt.replace('{MAIN_ATTIRE_OR_ATTRIBUTE}', formData.main_attribute);
    prompt = prompt.replace('{BRAND_URL}', PERMANENT_BRAND_URL);
    prompt = prompt.replace('{INSTAGRAM}', formData.instagram);
    prompt = prompt.replace('{WHATSAPP}', formData.whatsapp);
    prompt = prompt.replace('{FACEBOOK}', formData.facebook);

    const sectionsText = formData.sections.map((s, i) => {
        return `- Render title exactly as: "${i+1}. ${s.title}" \n  Render content exactly as: "${s.text}" \n  [Visual Hint: ${s.visual_hint}]`;
    }).join('\n');
    
    prompt = prompt.replace('{SECTION_LIST}', sectionsText);

    const panels = [];
    if (formData.enable_timeline) panels.push('Vertical Timeline (DO NOT render the word "Timeline". Render the events in a strict, systematic chronological order based on real-time events)');
    if (formData.enable_map) panels.push('Geographic Map Location (Render the title exactly as "Lokasi")');
    // Updated Factbox instruction
    if (formData.enable_factbox) panels.push('Factbox (Render the title exactly as "Fakta Menarik" followed by the content. DO NOT write "Factbox")');
    if (formData.enable_statistics) panels.push('Statistical Chart/Graph (DO NOT render any title, just the chart)');
    if (formData.enable_quote) panels.push('Highlight Quote Block (Render the quote content directly WITHOUT writing the word "Kutipan" or "Quote" or "Highlight quote block")');
    if (formData.enable_qr_code) panels.push('QR Code Element (DO NOT render the word "QR Code")');
    
    const sidePanelsText = panels.length > 0 ? panels.join(', ') : "None";
    prompt = prompt.replace('{SIDE_PANELS}', sidePanelsText);
    prompt = prompt.replace('{QUALITY_BOOSTERS}', qualityBoosters);
    
    if (formData.enable_face_fix) {
        prompt += `\n\n**CRITICAL IDENTITY & BRANDING OVERRIDE:** \n1. **Public Figures:** Ensure perfect facial likeness for "{MAIN_SUBJECT}". \n2. **Logos/Emblems:** If a band logo, government seal, or brand logo is present, render it with **100% accuracy** to the official design. Do not hallucinate text or alter shapes. Use official brand colors. \n3. **Products:** Maintain exact product packaging details.`;
        prompt = prompt.replace('{MAIN_SUBJECT}', formData.main_subject);
    }
    
    // Construct the final JSON object
    const finalPromptJSON = {
        prompt: prompt,
        negative_prompt: negativePromptList,
        strict_visual_policy: strictVisualPolicy
    };

    setGeneratedPrompt(JSON.stringify(finalPromptJSON, null, 2));

    // --- GOOGLE VEO PROMPT GENERATION ---
    // Only generate if enable_veo is true
    if (formData.enable_veo) {
        const visualStyleLabel = VISUAL_STYLES.find(s => s.value === visualStyle)?.label || visualStyle;
        const subject = formData.main_subject || "The main subject";
        
        let veoPromptStr = `Cinematic video, ${visualStyleLabel} style. `;
        veoPromptStr += `Animate the ${subject}. `;
        veoPromptStr += `${motionDescription}. `;
        veoPromptStr += `Aspect ratio ${aspectRatio}. High quality, 4k, smooth motion. `;
        
        if (formData.enable_face_fix) {
            veoPromptStr += "Keep facial features consistent and accurate. ";
        }

        setVeoPrompt(veoPromptStr);
    } else {
        setVeoPrompt('');
    }

    setIsGeneratingPrompt(false);
    showNotification("Konten berhasil digenerate!", "success");
  };

  const showNotification = (message: string, type: 'success' | 'info' = 'success') => {
      setNotification({ message, type });
      setTimeout(() => setNotification(null), 4000);
  };

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => {
        const newState = { ...prev, [field]: value };
        
        if (!isTypingRef.current) {
            stateBeforeTypingRef.current = prev;
            isTypingRef.current = true;
        }

        if (undoTimeoutRef.current) {
            clearTimeout(undoTimeoutRef.current);
        }
        
        undoTimeoutRef.current = setTimeout(() => {
            setUndoStack(current => [...current, stateBeforeTypingRef.current]);
            isTypingRef.current = false;
        }, 800);
        
        setRedoStack([]);
        return newState;
    });
  };

  const handleUndo = () => {
    let currentUndoStack = undoStack;
    if (isTypingRef.current) {
        if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
        currentUndoStack = [...undoStack, stateBeforeTypingRef.current];
        setUndoStack(currentUndoStack);
        isTypingRef.current = false;
    }

    if (currentUndoStack.length === 0) return;
    
    const previousState = currentUndoStack[currentUndoStack.length - 1];
    setRedoStack(prev => [...prev, formData]);
    setFormData(previousState);
    setUndoStack(currentUndoStack.slice(0, -1));
  };

  const handleRedo = () => {
    if (isTypingRef.current) {
        if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
        setUndoStack(current => [...current, stateBeforeTypingRef.current]);
        isTypingRef.current = false;
    }

    if (redoStack.length === 0) return;
    
    const nextState = redoStack[redoStack.length - 1];
    setUndoStack(prev => [...prev, formData]);
    setFormData(nextState);
    setRedoStack(prev => prev.slice(0, -1));
  };

  const handleSectionChange = (index: number, field: keyof Omit<Section, 'id'>, value: string) => {
    const newSections = [...formData.sections];
    newSections[index] = { ...newSections[index], [field]: value };
    updateFormData('sections', newSections);
  };

  const addSection = () => {
    const newSection: Section = {
      id: Date.now(),
      title: '',
      text: '',
      visual_hint: ''
    };
    updateFormData('sections', [...formData.sections, newSection]);
  };

  const removeSection = (id: number) => {
    updateFormData('sections', formData.sections.filter(s => s.id !== id));
  };

  const handlePdfUpload = (base64Clean: string, fileName: string) => {
    setUploadedPdf({ data: base64Clean, name: fileName });
  };

  const handlePdfRemove = () => {
    setUploadedPdf(null);
  };

  const handleAnalysisImageUpload = (base64Clean: string, mimeType: string, fileName: string) => {
    setUploadedAnalysisImage({ data: base64Clean, mimeType, name: fileName });
  };

  const handleAnalysisImageRemove = () => {
    setUploadedAnalysisImage(null);
  };
  
  const handleClearPrompt = () => {
      if (isTypingRef.current) {
          if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
          isTypingRef.current = false;
      }
      setUndoStack([]);
      setRedoStack([]);
      
      setFormData({ ...INITIAL_DATA });
      setVisualStyle('');
      setAspectRatio('');
      setGeneratedPrompt('');
      setVeoPrompt('');
      setTopicInput('');
      setUploadedPdf(null);
      setUploadedAnalysisImage(null);
      showNotification("Semua data berhasil direset", "info");
  };

  const handleAutoGenerateContent = async () => {
    // 1. Basic Input Validation
    if (autoGenMode === 'text' && !topicInput.trim()) {
        alert("Mohon masukkan topik terlebih dahulu.");
        return;
    }
    if (autoGenMode === 'pdf' && !uploadedPdf) {
        alert("Mohon upload file PDF terlebih dahulu.");
        return;
    }
    if (autoGenMode === 'image' && !uploadedAnalysisImage) {
        alert("Mohon upload gambar referensi terlebih dahulu.");
        return;
    }

    // 2. API Key Validation
    // Removed API Key validation since it's handled on the server

    cancelAnalysisRef.current = false;
    setIsGeneratingText(true);

    try {
      const jsonStructureInstruction = `
        You are a professional Editor in Chief for a top-tier Indonesian Infographic Agency.
        Your goal is to ensure 100% linguistic accuracy and structured data output.
        
        STRICT RULES FOR GENERATION:
        1. **LANGUAGE:** ALL output text (title, subtitle, section content) MUST be in **FORMAL INDONESIAN (BAHASA INDONESIA BAKU/EYD)**.
        2. **SPELLING CHECK:** Verify every word against KBBI (Kamus Besar Bahasa Indonesia). **ZERO TYPOS ALLOWED.**
        3. **NO ENGLISH:** Do not use English for content unless it is a specific international Brand Name or proper noun.
        4. **FORMAT:** Return ONLY a valid JSON object. Do not include markdown code blocks.
        
        JSON Structure Requirements:
        {
          "title": "Judul utama yang menarik, singkat, dan PADAT (Bahasa Indonesia Baku)",
          "subtitle": "Subjudul penjelasan yang jelas (Bahasa Indonesia Baku)",
          "main_subject": "Description of the central hero image visual (Keep this in English for the Image Generator to understand)",
          "main_attribute": "Specific visual attributes/props for the hero image (English)",
          "purpose": "One of: education, marketing, social_media, report, awareness, history (MUST CHOOSE ONE)",
          "architecture_type": "One of: timeline, step_by_step, comparison, anatomy, statistics, hierarchy, cycle, decision_tree (MUST CHOOSE ONE)",
          "layout_flow": "One of: zigzag, bento_grid, mind_map, vertical_scroll, s_curve, split_two_columns, dashboard, magazine (MUST CHOOSE ONE)",
          "visual_element": "One of: charts, simple_icons, arrows_flow, glassmorphism, mascot, big_typography, photo_collage, gadget_mockup (MUST CHOOSE ONE)",
          "color_palette": "One of: trust_academic, alert_attention, nature_growth, playful_creative, kids_primary, luxury_exclusive (MUST CHOOSE ONE)",
          "aspect_ratio": "One of: 9:16, 3:4, 1:1, 4:3, 16:9 (MUST CHOOSE ONE based on the most appropriate ratio for the layout and purpose)",
          "visual_style": "One of: minimalist, corporate, art_deco, vintage, modern_flat, 3d_render, 3d_realistic, universal_3d_simulator, futuristic, glowing_neon, watercolor, blueprint, vintage_blueprint, isometric, 3d_loaded, paper_cutout, pop_art, wooden_carved, chalkboard, pixel_art, claymation, minimalist_line_art, knitted_art (MUST CHOOSE ONE best matching aesthetic)",
          "sections": [
            {
              "title": "Judul Seksi (Bahasa Indonesia Baku)",
              "text": "Poin-poin data. Gunakan tanda titik koma (;) untuk memisahkan poin. (Bahasa Indonesia Baku)",
              "visual_hint": "Visual description for a small icon representing this section (English)"
            }
          ],
          "sources": "Nama SATU sumber data yang paling valid (e.g. 'BPS', 'WHO'). Hanya satu sumber saja. If unknown, return 'Rojudin'",
          "side_panels": {
             "timeline": true/false,
             "map": true/false,
             "factbox": true/false,
             "statistics": true/false,
             "quote": true/false,
             "qr_code": true/false
          },
          "requires_high_accuracy": true/false
        }
        Create between 4 to 6 sections.
      `;

      let parts: any[] = [];
      let promptContext = "";

      if (autoGenMode === 'text') {
        promptContext = `Topic: "${topicInput}". Create a detailed infographic plan based on this topic. Ensure perfect Indonesian spelling.`;
      } else if (autoGenMode === 'pdf' && uploadedPdf) {
         promptContext = `Analyze the attached PDF file. Extract key facts. Create a structured infographic plan. Ensure perfect Indonesian spelling.`;
         parts.push({
             inlineData: {
                 mimeType: "application/pdf",
                 data: uploadedPdf.data
             }
         });
      } else if (autoGenMode === 'image' && uploadedAnalysisImage) {
          promptContext = `Analyze the attached image. Extract the layout structure and content theme. Create a similar infographic plan. Ensure perfect Indonesian spelling.`;
          parts.push({
              inlineData: {
                  mimeType: uploadedAnalysisImage.mimeType,
                  data: uploadedAnalysisImage.data
              }
          });
      }

      parts.push({ text: promptContext + "\n\n" + jsonStructureInstruction });

      const customApiKey = localStorage.getItem('infographic_api_key');
      const apiKey = customApiKey || process.env.GEMINI_API_KEY || '';
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: { parts },
        config: {
          responseMimeType: 'application/json',
        }
      });

      if (cancelAnalysisRef.current) {
        return;
      }

      const text = response.text;
      if (!text) throw new Error("No response text from AI");
      
      // Robust JSON Extraction
      // Sometimes AI adds intro text even with JSON mode. We extract the {} block.
      let jsonStr = text.trim();
      
      // Clean markdown code blocks if present
      jsonStr = jsonStr.replace(/```json|```/g, '');
      
      // Find the first '{' and last '}' to ensure valid JSON boundaries
      const firstBrace = jsonStr.indexOf('{');
      const lastBrace = jsonStr.lastIndexOf('}');
      
      if (firstBrace !== -1 && lastBrace !== -1) {
          jsonStr = jsonStr.substring(firstBrace, lastBrace + 1);
      }

      let data;
      try {
          data = JSON.parse(jsonStr);
      } catch (parseError) {
          console.error("JSON Parse Error:", parseError, "Raw Text:", text);
          throw new Error("Gagal membaca format data dari AI. Silakan coba lagi.");
      }

      const newSections = data.sections?.map((s: any, i: number) => ({
        id: Date.now() + i,
        title: s.title || '',
        text: s.text || '',
        visual_hint: s.visual_hint || ''
      })) || [];

      if (data.aspect_ratio) {
          setAspectRatio(data.aspect_ratio);
      }
      if (data.visual_style) {
          setVisualStyle(data.visual_style);
      }

      const getClosestOption = (options: any[], value: string) => {
          if (!value) return '';
          const lowerValue = value.toLowerCase();
          const option = options.find(o => o.value.toLowerCase() === lowerValue || o.label.toLowerCase().includes(lowerValue));
          return option ? option.value : options[0].value;
      };

      setFormData(prev => {
        if (isTypingRef.current) {
          if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
          setUndoStack(current => [...current, stateBeforeTypingRef.current]);
          isTypingRef.current = false;
        }
        setUndoStack(current => [...current, prev]);
        setRedoStack([]);
        
        return {
          ...prev,
          title: data.title || prev.title,
          subtitle: data.subtitle || prev.subtitle,
          main_subject: data.main_subject || prev.main_subject,
          main_attribute: data.main_attribute || prev.main_attribute,
          purpose: data.purpose || 'education',
          architecture_type: data.architecture_type || prev.architecture_type,
          layout_flow: data.layout_flow || prev.layout_flow,
          visual_element: data.visual_element || prev.visual_element,
          color_palette: data.color_palette ? getClosestOption(COLOR_PALETTE_OPTIONS, data.color_palette) : prev.color_palette,
          sources: data.sources || 'Rojudin',
          sections: newSections,
          enable_timeline: data.side_panels?.timeline || false,
          enable_map: data.side_panels?.map || false,
          enable_factbox: data.side_panels?.factbox || false,
          enable_statistics: data.side_panels?.statistics || false,
          enable_quote: data.side_panels?.quote || false,
          enable_qr_code: data.side_panels?.qr_code || false,
          enable_carousel: false,
          enable_face_fix: data.requires_high_accuracy || false, 
          brand_url: PERMANENT_BRAND_URL,
          instagram: prev.instagram || 'r_besar.id',
          whatsapp: prev.whatsapp || '+6281329466856',
          facebook: prev.facebook || 'Rojudin',
        };
      });
      
      setGenerateCount(prev => {
          const newCount = prev + 1;
          localStorage.setItem('infographic_gen_count_v2', newCount.toString());
          return newCount;
      });

      setGenerateStats(prev => {
          // Use local time for the date key
          const today = new Date();
          // Format as YYYY-MM-DD in local time
          const dateKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
          const newStats = { ...prev, [dateKey]: (prev[dateKey] || 0) + 1 };
          localStorage.setItem('infographic_gen_stats_v2', JSON.stringify(newStats));
          return newStats;
      });
      
      showNotification("Konten berhasil dianalisa!", "success");

    } catch (error: any) {
        console.error("Auto-generate failed:", error);
        
        let userMessage = "Gagal membuat konten otomatis.";
        const errString = error.toString().toLowerCase();
        const errMsg = (error.message || "").toLowerCase();

        // 1. API Key / Permission Errors
        if (errMsg.includes("api key") || errMsg.includes("403") || errString.includes("permission_denied")) {
            userMessage = "KUNCI API TIDAK VALID: Mohon periksa kembali Google Gemini API Key Anda. Pastikan Key aktif dan memiliki kuota.";
        } 
        // 2. Quota / Rate Limits
        else if (errMsg.includes("429") || errMsg.includes("quota") || errMsg.includes("exhausted")) {
            userMessage = "BATAS KUOTA TERLAMPAUI: Anda telah mencapai batas request harian/menit Google AI. Mohon tunggu beberapa saat.";
        }
        // 3. Server Issues
        else if (errMsg.includes("503") || errMsg.includes("overloaded") || errMsg.includes("500")) {
            userMessage = "SERVER SIBUK: Layanan Google Gemini sedang mengalami beban tinggi. Silakan coba lagi dalam 1-2 menit.";
        }
        // 4. Network / Connectivity
        else if (errMsg.includes("fetch") || errMsg.includes("network") || errMsg.includes("offline") || errMsg.includes("failed to fetch")) {
            userMessage = "KONEKSI BERMASALAH: Tidak dapat terhubung ke server. Periksa koneksi internet Anda atau status Google Cloud.";
        }
        // 5. Safety Filters
        else if (errMsg.includes("safety") || errMsg.includes("blocked") || errMsg.includes("finish reason")) {
            userMessage = "KONTEN DIBLOKIR: Topik atau file yang diunggah memicu filter keamanan AI (Safety Policy). Gunakan topik yang lebih netral.";
        }
        // 6. Parsing/Format Errors (My custom error or JSON.parse)
        else if (errMsg.includes("json") || errMsg.includes("gagal membaca format")) {
            userMessage = "KESALAHAN FORMAT DATA: AI gagal menghasilkan struktur JSON yang valid. Silakan coba tekan tombol Generate sekali lagi.";
        }
        // 7. Generic Fallback
        else {
            userMessage = `Error: ${error.message || "Terjadi kesalahan tidak terduga."}`;
        }

        alert(userMessage);
    } finally {
      setIsGeneratingText(false);
    }
  };

  const generateShareLink = (templateName: string = "") => {
    try {
        const state = { 
            formData, 
            visualStyle, 
            aspectRatio,
            templateName: templateName || undefined
        };
        const json = JSON.stringify(state);
        const encoded = btoa(encodeURIComponent(json));
        return `${window.location.origin}${window.location.pathname}?share=${encoded}`;
    } catch (e) {
        console.error("Error generating share link", e);
        return "";
    }
  };

  const saveToHistory = () => {
       const newItem: HistoryItem = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          name: formData.title || 'Untitled Infographic',
          data: { ...formData, brand_url: PERMANENT_BRAND_URL, instagram: formData.instagram || 'r_besar.id', whatsapp: formData.whatsapp || '+6281329466856', facebook: formData.facebook || 'Rojudin' },
          visualStyle,
          aspectRatio
      };
      const newHistory = [newItem, ...history];
      setHistory(newHistory);
      localStorage.setItem('infographic_history', JSON.stringify(newHistory));
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans selection:bg-blue-500/30 flex flex-col relative">
        {/* Toast Notification */}
        {notification && (
            <div className="fixed top-20 right-4 z-50 px-4 py-3 rounded-lg shadow-lg border animate-in slide-in-from-right duration-300 flex items-center gap-3 bg-green-900/90 border-green-500 text-green-100">
                <span className="text-sm font-medium">{notification.message}</span>
            </div>
        )}

        {/* Header */}
        <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-30">
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-2 relative">
                <div className="flex items-center justify-center gap-3 sm:absolute sm:left-1/2 sm:-translate-x-1/2 w-full sm:w-auto">
                    <div className="flex flex-col items-center justify-center text-center">
                        <h1 className="text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 whitespace-nowrap leading-tight">
                            MPV - MASTER PROMPT VISUAL
                        </h1>
                        <p className="text-[8px] sm:text-[9px] text-gray-400 font-medium tracking-wide leading-tight mt-0.5 whitespace-nowrap">
                            Platform AI untuk Produksi Prompt Visual Terstruktur & Profesional
                        </p>
                    </div>
                </div>
                <div className="w-full sm:w-auto sm:ml-auto z-10">
                    <DateTimeWidget 
                        onShowProfile={() => setIsProfileOpen(true)} 
                        onShowSupport={() => setIsSupportOpen(true)}
                        onShowSidebar={() => setIsSidebarOpen(true)}
                        onShowDeveloperProfile={() => setIsDeveloperProfileOpen(true)}
                    />
                </div>
            </div>
        </header>

        <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
            <ModuleSwitcher active={activeModule} onChange={setActiveModule} />

            {activeModule === 'infographic' ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-700">
                    {/* Column 1: API Key & Auto Generate */}
                    <div className="space-y-6">
                    
                    {/* Auto Generate Panel */}
                    <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-xl relative overflow-hidden">
                         {/* Header & Tabs */}
                        <div className="p-3">
                             <h2 className="text-xs font-bold flex items-center gap-2 text-gray-400 uppercase tracking-wider mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                                </svg>
                                AUTO GENERATE
                            </h2>
                            <div className="flex bg-gray-900 border border-gray-700 rounded-lg p-1 gap-1">
                                <button
                                    onClick={() => setAutoGenMode('text')}
                                    className={`flex-1 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all ${
                                        autoGenMode === 'text' 
                                        ? 'bg-blue-600 text-white shadow-lg' 
                                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                                    }`}
                                >
                                    Input Teks
                                </button>
                                <button
                                    onClick={() => setAutoGenMode('pdf')}
                                    className={`flex-1 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all ${
                                        autoGenMode === 'pdf' 
                                        ? 'bg-blue-600 text-white shadow-lg' 
                                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                                    }`}
                                >
                                    Upload PDF
                                </button>
                                <button
                                    onClick={() => setAutoGenMode('image')}
                                    className={`flex-1 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all ${
                                        autoGenMode === 'image' 
                                        ? 'bg-blue-600 text-white shadow-lg' 
                                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                                    }`}
                                >
                                    Upload Image
                                </button>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="p-3 sm:p-4">
                            {autoGenMode === 'text' && (
                                <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[10px] sm:text-xs text-gray-400 whitespace-nowrap overflow-hidden text-ellipsis">
                                            Masukkan topik utama untuk menghasilkan struktur infografis.
                                        </p>
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
                                    <input
                                        type="text"
                                        placeholder="Contoh: Sejarah Kopi"
                                        className={`w-full bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-xs sm:text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500 placeholder:text-xs sm:placeholder:text-sm transition-all ${isTopicDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        value={topicInput}
                                        onChange={(e) => setTopicInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && !isTopicDisabled && handleAutoGenerateContent()}
                                        disabled={isTopicDisabled}
                                        autoComplete="off"
                                        autoCorrect="off"
                                        autoCapitalize="off"
                                        spellCheck="false"
                                    />
                                </div>
                            )}

                            {autoGenMode === 'pdf' && (
                                <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <p className="text-[10px] sm:text-xs text-gray-400 whitespace-nowrap overflow-hidden text-ellipsis">Upload file PDF untuk dianalisis.</p>
                                    <PdfUpload 
                                        pdfData={uploadedPdf?.data || null}
                                        fileName={uploadedPdf?.name || null}
                                        onUpload={handlePdfUpload}
                                        onRemove={handlePdfRemove}
                                    />
                                </div>
                            )}

                            {autoGenMode === 'image' && (
                                <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <p className="text-[10px] sm:text-xs text-gray-400 whitespace-nowrap overflow-hidden text-ellipsis">Upload referensi visual untuk dianalisis.</p>
                                    <ImageAnalysisUpload 
                                        imageData={uploadedAnalysisImage ? { data: uploadedAnalysisImage.data, name: uploadedAnalysisImage.name } : null}
                                        onUpload={handleAnalysisImageUpload}
                                        onRemove={handleAnalysisImageRemove}
                                    />
                                </div>
                            )}

                            <div className="mt-4 pt-3 border-t border-gray-800">
                                <button
                                    onClick={isGeneratingText ? handleCancelAnalysis : handleAutoGenerateContent}
                                    className={`w-full flex justify-center items-center gap-2 px-6 py-2 text-white rounded-lg transition-colors text-sm font-medium shadow-lg ${
                                        isGeneratingText 
                                        ? 'bg-gray-500 hover:bg-gray-600 shadow-gray-900/20' 
                                        : 'bg-blue-700 hover:bg-blue-600 shadow-blue-900/20'
                                    }`}
                                >
                                    {isGeneratingText ? (
                                         <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Cancel
                                        </span>
                                    ) : (
                                         <span className="flex items-center justify-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                                            </svg>
                                            Analisa
                                         </span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Column 2: Infographic Configuration */}
                <div className="space-y-6">
                    <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-xl overflow-hidden transition-all duration-300">
                        <div 
                            onClick={() => setIsConfigOpen(!isConfigOpen)}
                            className="p-4 sm:p-5 flex justify-between items-center cursor-pointer hover:bg-gray-800/50 transition-colors border-b border-gray-800 bg-gray-900"
                        >
                            <h2 className="text-xs font-bold flex items-center gap-2 text-gray-400 uppercase tracking-wider">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71-.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>
                                LAYOUT SETTINGS
                            </h2>
                            <div className="flex items-center gap-1 sm:gap-2">
                                <button 
                                    className={`text-gray-400 hover:text-blue-400 transition-transform duration-300 ${isConfigOpen ? 'rotate-180' : ''}`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5-7.5" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        
                        {isConfigOpen && (
                            <div className="p-4 sm:p-5 space-y-5 animate-in fade-in slide-in-from-top-4 duration-300 bg-gray-900">
                                <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700/50 shadow-inner">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                                        </svg>
                                        Mode Render
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-800 hover:border-blue-500/30 transition-colors">
                                            <Checkbox
                                                id="carousel_mode"
                                                label="Excellent Mode"
                                                checked={formData.enable_carousel}
                                                onChange={(e) => updateFormData('enable_carousel', e.target.checked)}
                                            />
                                            <p className="text-[9px] text-gray-500 mt-1 leading-tight whitespace-nowrap overflow-hidden text-ellipsis ml-6">
                                                High quality tokens, cinematic lighting, & strict negative prompts.
                                            </p>
                                        </div>
                                        <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-800 hover:border-blue-500/30 transition-colors">
                                            <Checkbox
                                                id="veo_mode"
                                                label="Prompt Video"
                                                checked={formData.enable_veo || false}
                                                onChange={(e) => updateFormData('enable_veo', e.target.checked)}
                                            />
                                            <p className="text-[9px] text-gray-500 mt-1 leading-tight whitespace-nowrap overflow-hidden text-ellipsis ml-6">
                                                Centang untuk menghasilkan prompt animasi video.
                                            </p>
                                        </div>
                                        <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-800 hover:border-blue-500/30 transition-colors">
                                            <Checkbox
                                                id="face_fix_mode"
                                                label="Akurasi Tinggi"
                                                checked={formData.enable_face_fix}
                                                onChange={(e) => updateFormData('enable_face_fix', e.target.checked)}
                                            />
                                            <p className="text-[9px] text-gray-500 mt-1 leading-tight whitespace-nowrap overflow-hidden text-ellipsis ml-6">
                                                Centang jika mengandung Tokoh Publik, Logo, atau Brand Terkenal.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Select 
                                        label="Tujuan" 
                                        value={formData.purpose} 
                                        options={PURPOSE_OPTIONS}
                                        onChange={(val) => updateFormData('purpose', val)}
                                        placeholder="Select an Option"
                                        labelClassName="block text-[10px] font-medium mb-1 text-blue-300"
                                    />
                                    <Select
                                        label="Aspek Rasio"
                                        value={aspectRatio}
                                        options={[
                                            { value: '9:16', label: '9:16' },
                                            { value: '3:4', label: '3:4' },
                                            { value: '1:1', label: '1:1' },
                                            { value: '4:3', label: '4:3' },
                                            { value: '16:9', label: '16:9' }
                                        ]}
                                        onChange={setAspectRatio}
                                        placeholder="Select an Option"
                                        labelClassName="block text-[10px] font-medium mb-1 text-blue-300"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <ModalSelector 
                                        label="Gaya Visual" 
                                        options={VISUAL_STYLES.map(opt => ({
                                            value: opt.value,
                                            label: opt.label,
                                            desc: opt.prompt_fragment,
                                            icon: opt.value === 'minimalist' ? <Minus className="w-6 h-6" /> :
                                                  opt.value === 'corporate' ? <Briefcase className="w-6 h-6" /> :
                                                  opt.value === 'art_deco' ? <Diamond className="w-6 h-6" /> :
                                                  opt.value === 'vintage' ? <Camera className="w-6 h-6" /> :
                                                  opt.value === 'modern_flat' ? <Layout className="w-6 h-6" /> :
                                                  opt.value === '3d_render' ? <Box className="w-6 h-6" /> :
                                                  opt.value === '3d_realistic' ? <Aperture className="w-6 h-6" /> :
                                                  opt.value === 'universal_3d_simulator' ? <Globe className="w-6 h-6" /> :
                                                  opt.value === 'futuristic' ? <Cpu className="w-6 h-6" /> :
                                                  opt.value === 'glowing_neon' ? <Zap className="w-6 h-6" /> :
                                                  opt.value === 'watercolor' ? <Droplet className="w-6 h-6" /> :
                                                  opt.value === 'blueprint' ? <PenTool className="w-6 h-6" /> :
                                                  opt.value === 'vintage_blueprint' ? <Compass className="w-6 h-6" /> :
                                                  opt.value === 'isometric' ? <Hexagon className="w-6 h-6" /> :
                                                  opt.value === '3d_loaded' ? <Layers className="w-6 h-6" /> :
                                                  opt.value === 'paper_cutout' ? <Scissors className="w-6 h-6" /> :
                                                  opt.value === 'pop_art' ? <MessageSquare className="w-6 h-6" /> :
                                                  opt.value === 'wooden_carved' ? <ImageIcon className="w-6 h-6" /> :
                                                  opt.value === 'chalkboard' ? <Edit3 className="w-6 h-6" /> :
                                                  opt.value === 'pixel_art' ? <Gamepad2 className="w-6 h-6" /> :
                                                  opt.value === 'claymation' ? <Smile className="w-6 h-6" /> :
                                                  opt.value === 'minimalist_line_art' ? <Activity className="w-6 h-6" /> :
                                                  opt.value === 'knitted_art' ? <Shirt className="w-6 h-6" /> : <Palette className="w-6 h-6" />
                                        }))} 
                                        value={visualStyle} 
                                        onChange={setVisualStyle} 
                                        placeholder="Select an Option"
                                        labelClassName="block text-[10px] font-medium text-blue-300 mb-1"
                                    />
                                    
                                    <ModalSelector 
                                        label="Tipe Arsitektur" 
                                        options={ARCHITECTURE_OPTIONS.map(opt => ({
                                            ...opt,
                                            icon: opt.value === 'timeline' ? <BookOpen className="w-6 h-6" /> :
                                                  opt.value === 'step_by_step' ? <ListOrdered className="w-6 h-6" /> :
                                                  opt.value === 'comparison' ? <ArrowRightLeft className="w-6 h-6" /> :
                                                  opt.value === 'anatomy' ? <Target className="w-6 h-6" /> :
                                                  opt.value === 'statistics' ? <BarChart2 className="w-6 h-6" /> :
                                                  opt.value === 'hierarchy' ? <Layers className="w-6 h-6" /> :
                                                  opt.value === 'cycle' ? <RefreshCw className="w-6 h-6" /> :
                                                  opt.value === 'decision_tree' ? <GitBranch className="w-6 h-6" /> : undefined
                                        }))} 
                                        value={formData.architecture_type} 
                                        onChange={(val) => updateFormData('architecture_type', val)} 
                                        placeholder="Select an Option"
                                        labelClassName="block text-[10px] font-medium text-blue-300 mb-1"
                                    />

                                    <ModalSelector 
                                        label="Tata Letak" 
                                        options={LAYOUT_FLOW_OPTIONS.map(opt => ({
                                            ...opt,
                                            icon: opt.value === 'zigzag' ? <Grid className="w-6 h-6" /> :
                                                  opt.value === 'bento_grid' ? <Box className="w-6 h-6" /> :
                                                  opt.value === 'mind_map' ? <CircleDot className="w-6 h-6" /> :
                                                  opt.value === 'vertical_scroll' ? <ChevronsDown className="w-6 h-6" /> :
                                                  opt.value === 's_curve' ? <MoveRight className="w-6 h-6" /> :
                                                  opt.value === 'split_two_columns' ? <Columns className="w-6 h-6" /> :
                                                  opt.value === 'dashboard' ? <LayoutDashboard className="w-6 h-6" /> :
                                                  opt.value === 'magazine' ? <Newspaper className="w-6 h-6" /> : undefined
                                        }))} 
                                        value={formData.layout_flow} 
                                        onChange={(val) => updateFormData('layout_flow', val)} 
                                        placeholder="Select an Option"
                                        labelClassName="block text-[10px] font-medium text-blue-300 mb-1"
                                    />

                                    <ModalSelector 
                                        label="Elemen Visual" 
                                        options={VISUAL_ELEMENT_OPTIONS.map(opt => ({
                                            ...opt,
                                            icon: opt.value === 'charts' ? <PieChart className="w-6 h-6" /> :
                                                  opt.value === 'simple_icons' ? <Circle className="w-6 h-6" /> :
                                                  opt.value === 'arrows_flow' ? <ArrowRight className="w-6 h-6" /> :
                                                  opt.value === 'glassmorphism' ? <Square className="w-6 h-6" /> :
                                                  opt.value === 'mascot' ? <User className="w-6 h-6" /> :
                                                  opt.value === 'big_typography' ? <Type className="w-6 h-6" /> :
                                                  opt.value === 'photo_collage' ? <Scissors className="w-6 h-6" /> :
                                                  opt.value === 'gadget_mockup' ? <Smartphone className="w-6 h-6" /> : undefined
                                        }))} 
                                        value={formData.visual_element} 
                                        onChange={(val) => updateFormData('visual_element', val)} 
                                        placeholder="Select an Option"
                                        labelClassName="block text-[10px] font-medium text-blue-300 mb-1"
                                    />

                                    <ModalSelector 
                                        label="Palet Warna" 
                                        options={COLOR_PALETTE_OPTIONS} 
                                        value={formData.color_palette} 
                                        onChange={(val) => updateFormData('color_palette', val)} 
                                        placeholder="Select an Option"
                                        labelClassName="block text-[10px] font-medium text-blue-300 mb-1"
                                    />
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Input 
                                        id="title" 
                                        label="Judul Utama" 
                                        placeholder="Contoh: Sejarah Kopi" 
                                        value={formData.title}
                                        onChange={(e) => updateFormData('title', e.target.value)}
                                        labelClassName="block text-[10px] font-medium mb-1 text-blue-300"
                                    />
                                    <Input 
                                        id="subtitle" 
                                        label="Subjudul" 
                                        placeholder="Penjelasan singkat..." 
                                        value={formData.subtitle}
                                        onChange={(e) => updateFormData('subtitle', e.target.value)}
                                        labelClassName="block text-[10px] font-medium mb-1 text-blue-300"
                                    />
                                    <div className="sm:col-span-2">
                                        <Textarea
                                            id="main_subject"
                                            label="Subjek Utama"
                                            placeholder="Deskripsikan visual utama secara detail..."
                                            value={formData.main_subject}
                                            onChange={(e) => updateFormData('main_subject', e.target.value)}
                                            rows={3}
                                            labelClassName="block text-[10px] font-medium mb-1 text-blue-300"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <Input 
                                            id="main_attribute" 
                                            label="Atribut Khusus" 
                                            placeholder="Pakaian, objek, warna..." 
                                            value={formData.main_attribute}
                                            onChange={(e) => updateFormData('main_attribute', e.target.value)}
                                            labelClassName="block text-[10px] font-medium mb-1 text-blue-300"
                                        />
                                    </div>
                                </div>

                                <SectionBuilder 
                                    sections={formData.sections}
                                    onChange={handleSectionChange}
                                    onAdd={addSection}
                                    onRemove={removeSection}
                                />

                                <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700/50 shadow-inner">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        Panel Tambahan
                                    </h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        <div className="bg-gray-900/50 p-2.5 rounded-lg border border-gray-800 hover:border-blue-500/30 transition-colors">
                                            <Checkbox 
                                                id="timeline" 
                                                label="Timeline" 
                                                checked={formData.enable_timeline}
                                                onChange={(e) => updateFormData('enable_timeline', e.target.checked)}
                                            />
                                        </div>
                                        <div className="bg-gray-900/50 p-2.5 rounded-lg border border-gray-800 hover:border-blue-500/30 transition-colors">
                                            <Checkbox 
                                                id="map" 
                                                label="Lokasi" 
                                                checked={formData.enable_map}
                                                onChange={(e) => updateFormData('enable_map', e.target.checked)}
                                            />
                                        </div>
                                        <div className="bg-gray-900/50 p-2.5 rounded-lg border border-gray-800 hover:border-blue-500/30 transition-colors">
                                            <Checkbox 
                                                id="factbox" 
                                                label="Fakta" 
                                                checked={formData.enable_factbox}
                                                onChange={(e) => updateFormData('enable_factbox', e.target.checked)}
                                            />
                                        </div>
                                        <div className="bg-gray-900/50 p-2.5 rounded-lg border border-gray-800 hover:border-blue-500/30 transition-colors">
                                            <Checkbox 
                                                id="stats" 
                                                label="Statistik" 
                                                checked={formData.enable_statistics}
                                                onChange={(e) => updateFormData('enable_statistics', e.target.checked)}
                                            />
                                        </div>
                                        <div className="bg-gray-900/50 p-2.5 rounded-lg border border-gray-800 hover:border-blue-500/30 transition-colors">
                                            <Checkbox 
                                                id="quote" 
                                                label="Kutipan" 
                                                checked={formData.enable_quote}
                                                onChange={(e) => updateFormData('enable_quote', e.target.checked)}
                                            />
                                        </div>
                                        <div className="bg-gray-900/50 p-2.5 rounded-lg border border-gray-800 hover:border-blue-500/30 transition-colors">
                                            <Checkbox 
                                                id="qr_code" 
                                                label="QR Code" 
                                                checked={formData.enable_qr_code}
                                                onChange={(e) => updateFormData('enable_qr_code', e.target.checked)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Input 
                                        id="sources" 
                                        label="Sumber Data" 
                                        value={formData.sources}
                                        onChange={(e) => updateFormData('sources', e.target.value)}
                                    />
                                </div>

                                <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700/50 shadow-inner">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        BRANDING
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Input 
                                            id="instagram" 
                                            label="Instagram" 
                                            value={formData.instagram}
                                            readOnly
                                            className="opacity-75 cursor-not-allowed text-gray-400"
                                        />
                                        <Input 
                                            id="whatsapp" 
                                            label="WhatsApp" 
                                            value={formData.whatsapp}
                                            readOnly
                                            className="opacity-75 cursor-not-allowed text-gray-400"
                                        />
                                        <Input 
                                            id="facebook" 
                                            label="Facebook" 
                                            value={formData.facebook}
                                            readOnly
                                            className="opacity-75 cursor-not-allowed text-gray-400"
                                        />
                                        <Input 
                                            id="brand" 
                                            label="Website" 
                                            value={PERMANENT_BRAND_URL}
                                            readOnly
                                            className="opacity-75 cursor-not-allowed text-gray-400"
                                        />
                                    </div>
                                </div>

                                    <div className="pt-6 border-t border-gray-800 mt-6">
                                        <button
                                            onClick={handleGeneratePrompt}
                                            disabled={isGeneratingPrompt}
                                            className="w-full flex justify-center items-center gap-2 px-6 py-2 text-white rounded-lg transition-colors text-sm font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed bg-green-600 hover:bg-green-500 shadow-green-900/20"
                                        >
                                            {isGeneratingPrompt ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Generating...
                                                </span>
                                            ) : (
                                                <>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09l2.846.813-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                                                    </svg>
                                                    Generate
                                                </>
                                            )}
                                        </button>
                                    </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Column 3: Preview & Output */}
                <div className="space-y-6 flex flex-col sticky top-24 self-start">
                    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 sm:p-5 space-y-4 shadow-xl">
                         <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                             <h2 className="text-xs font-bold flex items-center gap-2 text-gray-400 uppercase tracking-wider">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                </svg>
                                PROMPT RESULT
                             </h2>
                             <div className="flex items-center gap-2">
                                 <button 
                                     onClick={() => setIsStatsOpen(true)}
                                     className="text-xs font-medium bg-blue-900/50 hover:bg-blue-800/60 text-blue-300 px-4 py-1 rounded-full border border-blue-700/50 transition-colors cursor-pointer flex items-center justify-center" 
                                     title="Lihat Statistik Generate"
                                 >
                                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                                     </svg>
                                 </button>
                             </div>
                         </div>

                         {isGeneratingPrompt ? (
                             <div className="text-center text-blue-400 aspect-square w-full bg-gray-800/50 rounded-lg border border-blue-500/30 border-dashed flex flex-col items-center justify-center animate-in fade-in duration-500">
                                 <svg className="animate-spin h-10 w-10 mb-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                 </svg>
                                 <p className="text-xs text-blue-400/70 mt-2 animate-pulse">Menyusun prompt...</p>
                             </div>
                         ) : generatedPrompt ? (
                             <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                 <PromptPreview 
                                    prompt={generatedPrompt}
                                    veoPrompt={veoPrompt}
                                    formData={formData}
                                    onSave={saveToHistory}
                                    onShare={() => generateShareLink()}
                                    onShareTemplate={(name) => generateShareLink(name)}
                                    onOpenHistory={() => setIsHistoryOpen(true)}
                                    historyCount={history.length}
                                    onClear={handleClearPrompt}
                                 />
                             </div>
                         ) : (
                             <div className="text-center text-gray-500 aspect-square w-full bg-gray-800/50 rounded-lg border border-gray-700 border-dashed flex flex-col items-center justify-center animate-in fade-in duration-500">
                                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto mb-3 opacity-50">
                                     <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                 </svg>
                             </div>
                         )}
                    </div>
                    
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
            ) : activeModule === 'timelapse' ? (
                <TimelapseModule onOpenSupport={() => setIsSupportOpen(true)} />
            ) : (
                <CarouselModule onOpenSupport={() => setIsSupportOpen(true)} />
            )}
        </main>

        <footer className="bg-gray-900 border-t border-gray-800 py-6 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-gray-500 text-[10px] font-bold animate-pulse">
                    Copyright © 2026 R_besar.id | All rights reserved.
                </p>
                <div className="flex gap-4">
                    <a href="#" className="text-[10px] text-gray-500 hover:text-white transition-colors font-medium">Privacy Policy</a>
                    <a href="#" className="text-[10px] text-gray-500 hover:text-white transition-colors font-medium">Terms of Service</a>
                </div>
            </div>
        </footer>

        <HistorySidebar 
            isOpen={isHistoryOpen}
            onClose={() => setIsHistoryOpen(false)}
            history={history}
            onLoad={(item) => {
                setFormData({ ...item.data, brand_url: PERMANENT_BRAND_URL, instagram: item.data.instagram || 'r_besar.id', whatsapp: item.data.whatsapp || '+6281329466856', facebook: item.data.facebook || 'Rojudin' }); 
                setVisualStyle(item.visualStyle);
                setAspectRatio(item.aspectRatio);
                setIsHistoryOpen(false);
            }}
            onDelete={(id) => {
                const newHistory = history.filter(h => h.id !== id);
                setHistory(newHistory);
                localStorage.setItem('infographic_history', JSON.stringify(newHistory));
            }}
            onClear={() => {
                setHistory([]);
                localStorage.removeItem('infographic_history');
            }}
        />

        <ProfilePage isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
        <SidebarOverlay isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <DeveloperProfileModal isOpen={isDeveloperProfileOpen} onClose={() => setIsDeveloperProfileOpen(false)} />
        <Support 
            isOpen={isSupportOpen} 
            onClose={() => setIsSupportOpen(false)} 
        />
        <StatisticsModal 
            isOpen={isStatsOpen} 
            onClose={() => setIsStatsOpen(false)} 
            generateStats={generateStats} 
            totalGenerates={generateCount} 
            history={history}
        />
    </div>
  );
}
