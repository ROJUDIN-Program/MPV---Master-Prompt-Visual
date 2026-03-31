
import React, { useState } from 'react';
import type { FormData } from '../types';

interface PromptPreviewProps {
  prompt: string;
  veoPrompt?: string; 
  formData?: FormData;
  onSave: () => void;
  onShare?: () => string;
  onShareTemplate?: (templateName: string) => string;
  onOpenHistory?: () => void;
  historyCount?: number;
  onClear?: () => void;
}

export const PromptPreview: React.FC<PromptPreviewProps> = ({ 
  prompt, 
  veoPrompt, 
  formData,
  onSave, 
  onShare, 
  onShareTemplate,
  onOpenHistory, 
  historyCount,
  onClear
}) => {
  const [copied, setCopied] = useState(false);
  const [veoPromptCopied, setVeoPromptCopied] = useState(false); 
  const [saved, setSaved] = useState(false);
  
  // Template sharing states
  const [isNamingTemplate, setIsNamingTemplate] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateLinkCopied, setTemplateLinkCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyVeoPrompt = () => {
    if (veoPrompt) {
        navigator.clipboard.writeText(veoPrompt);
        setVeoPromptCopied(true);
        setTimeout(() => setVeoPromptCopied(false), 2000);
    }
  };

  const handleSave = () => {
    onSave();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleTemplateShare = () => {
      if (onShareTemplate && templateName.trim()) {
          const link = onShareTemplate(templateName);
          if (link) {
              navigator.clipboard.writeText(link);
              setTemplateLinkCopied(true);
              setTimeout(() => {
                  setTemplateLinkCopied(false);
                  setIsNamingTemplate(false);
                  setTemplateName('');
              }, 2000);
          }
      }
  };

  const handleExportPDF = () => {
    // Check if jsPDF is available globally
    const jspdf = (window as any).jspdf;
    if (!jspdf) {
        alert("Sistem PDF sedang disiapkan. Harap coba beberapa saat lagi.");
        return;
    }

    const { jsPDF } = jspdf;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const maxLineWidth = pageWidth - margin * 2;
    let yPos = 20;

    // Helper for sanitizing text for PDF
    const sanitizeForPdf = (str: string) => {
        if (!str) return "";
        return str
            .replace(/[\u2018\u2019]/g, "'") // Smart single quotes
            .replace(/[\u201C\u201D]/g, '"') // Smart double quotes
            .replace(/[\u2013\u2014]/g, "-") // Em-dash, En-dash
            .replace(/\u2026/g, "...")       // Ellipsis
            .replace(/[^\x20-\x7E\n\r]/g, ""); // Strip other non-standard chars (like emojis)
    };

    const addText = (text: string, fontSize: number, isBold: boolean = false, fontName: string = "helvetica", color: number[] = [0, 0, 0]) => {
        if (!text) return;
        doc.setFontSize(fontSize);
        doc.setFont(fontName, isBold ? "bold" : "normal");
        doc.setTextColor(color[0], color[1], color[2]);
        
        const cleanText = sanitizeForPdf(text); 
        const splitText = doc.splitTextToSize(cleanText, maxLineWidth);
        
        const lineHeight = fontSize * 0.3527 * 1.3;
        const blockHeight = splitText.length * lineHeight;
        
        // Prevent auto page break to strictly control pages, but if it really overflows, we have to add a page.
        if (yPos + blockHeight > pageHeight - margin - 10) {
            doc.addPage();
            yPos = 20;
        }

        doc.text(splitText, margin, yPos);
        yPos += blockHeight + (fontSize * 0.2);
    };

    const addDivider = () => {
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 5;
    };

    // --- PAGE 1: PROJECT BRIEF ---
    addText("INFOGRAPHIC PROJECT PLAN", 18, true, "helvetica", [41, 128, 185]);
    yPos += 2;
    addDivider();

    if (formData) {
        addText("PROJECT DETAILS", 12, true, "helvetica", [52, 73, 94]);
        yPos += 2;
        addText(`Title: ${formData.title}`, 11, true);
        if (formData.subtitle) addText(`Subtitle: ${formData.subtitle}`, 10);
        yPos += 2;
        addText(`Purpose:`, 10, true);
        addText(formData.purpose, 10);
        yPos += 4;
        
        addText("VISUAL CONCEPT", 12, true, "helvetica", [52, 73, 94]);
        yPos += 2;
        addText("Main Subject:", 10, true);
        addText(formData.main_subject, 10);
        if (formData.main_attribute) {
            yPos += 2;
            addText(`Attributes:`, 10, true);
            addText(formData.main_attribute, 10);
        }
        yPos += 4;
        
        if (formData.sections && formData.sections.length > 0) {
            addText("CONTENT SECTIONS", 12, true, "helvetica", [52, 73, 94]);
            yPos += 2;
            formData.sections.forEach((section, i) => {
                addText(`${i+1}. ${section.title}`, 10, true);
                addText(`Text: ${section.text}`, 9);
                addText(`Visual: ${section.visual_hint}`, 9, false, "courier", [100, 100, 100]);
                yPos += 2;
            });
            yPos += 2;
        }
        
        const panels = [];
        if (formData.enable_timeline) panels.push('Timeline');
        if (formData.enable_map) panels.push('Map/Location');
        if (formData.enable_factbox) panels.push('Factbox');
        if (formData.enable_statistics) panels.push('Statistics');
        if (formData.enable_quote) panels.push('Quote');
        if (formData.enable_qr_code) panels.push('QR Code');
        if (formData.enable_carousel) panels.push('Carousel');
        
        if (panels.length > 0) {
            addText("ADDITIONAL PANELS", 12, true, "helvetica", [52, 73, 94]);
            yPos += 2;
            addText(panels.join(', '), 10);
        }
    }

    // --- PAGE 2: GENERATED PROMPTS ---
    doc.addPage();
    yPos = 20;
    
    addText("GENERATED PROMPTS", 18, true, "helvetica", [41, 128, 185]);
    yPos += 2;
    addDivider();

    addText("IMAGE GENERATION PROMPT", 12, true, "helvetica", [52, 73, 94]);
    yPos += 2;
    
    // Draw a light gray box background for prompt
    doc.setFillColor(245, 245, 245);
    const promptLines = doc.splitTextToSize(sanitizeForPdf(prompt), maxLineWidth - 10);
    const promptHeight = promptLines.length * (9 * 0.3527 * 1.3) + 10;
    
    if (yPos + promptHeight > pageHeight - margin) {
        doc.addPage();
        yPos = 20;
    }
    
    doc.rect(margin, yPos, maxLineWidth, promptHeight, 'F');
    yPos += 5;
    addText(prompt, 9, false, "courier", [40, 40, 40]);
    yPos += 5;

    if (veoPrompt) {
        yPos += 8;
        addText("VIDEO GENERATION PROMPT", 12, true, "helvetica", [52, 73, 94]);
        yPos += 2;
        
        const veoLines = doc.splitTextToSize(sanitizeForPdf(veoPrompt), maxLineWidth - 10);
        const veoHeight = veoLines.length * (9 * 0.3527 * 1.3) + 10;
        
        if (yPos + veoHeight > pageHeight - margin) {
            doc.addPage();
            yPos = 20;
        }
        
        doc.setFillColor(245, 245, 245);
        doc.rect(margin, yPos, maxLineWidth, veoHeight, 'F');
        yPos += 5;
        addText(veoPrompt, 9, false, "courier", [40, 40, 40]);
    }

    // --- FOOTER FOR ALL PAGES ---
    const pageCount = doc.internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(150, 150, 150);
        doc.text(`Generated by R_BESAR.ID Builder - Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    }

    doc.save(`${formData?.title || 'project'}_plan_${Date.now()}.pdf`);
  };

  return (
    <div className="bg-gray-800/30 p-4 sm:p-5 rounded-lg border border-gray-700/50 relative space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            PROMPT PREVIEW
        </h2>
        <div className="flex flex-wrap gap-2">
            {onClear && (
                <button
                    onClick={onClear}
                    className="px-3 py-1 text-sm bg-blue-700 text-white rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
                >
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                    Clear
                </button>
            )}

            {onOpenHistory && (
                <button
                    onClick={onOpenHistory}
                    className="px-3 py-1 text-sm bg-blue-700 text-white rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2 relative"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    Riwayat
                    {historyCount !== undefined && historyCount > 0 && (
                         <span className="flex h-2 w-2 absolute top-0 right-0 -mt-1 -mr-1">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                    )}
                </button>
            )}

            {/* Export PDF Button */}
            <button
                onClick={handleExportPDF}
                className="px-3 py-1 text-sm bg-green-700 border border-green-600 text-white rounded-md hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center gap-2"
                title="Export as PDF"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
                PDF
            </button>

            <button
              onClick={handleSave}
              className={`px-3 py-1 text-sm rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2 ${
                saved 
                ? 'bg-green-600 text-white' 
                : 'bg-blue-700 text-white hover:bg-blue-600'
              }`}
            >
              {saved ? (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Tersimpan
                </>
              ) : (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                    </svg>
                    Save
                </>
              )}
            </button>
            <button
              onClick={handleCopy}
              className={`px-3 py-1 text-sm rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2 ${
                  copied ? 'bg-green-600 text-white' : 'bg-blue-700 text-white hover:bg-blue-600'
              }`}
            >
              {copied ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Copied
                  </>
              ) : (
                  <>
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                    </svg>
                    Copy
                  </>
              )}
            </button>
        </div>
      </div>
      
      {/* Template Naming Popover */}
      {isNamingTemplate && (
          <div className="absolute right-0 top-16 z-20 w-72 bg-gray-800 border border-gray-600 rounded-lg shadow-xl p-4 animate-in slide-in-from-top-2 duration-200">
              <h4 className="text-sm font-semibold text-gray-200 mb-2">Beri Nama Template</h4>
              <input 
                  type="text" 
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="Contoh: Template Sejarah Minimalis"
                  className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-xs sm:text-sm text-white mb-3 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none placeholder:text-xs sm:placeholder:text-sm"
                  autoFocus
              />
              <div className="flex justify-end gap-2">
                  <button 
                      onClick={() => setIsNamingTemplate(false)}
                      className="px-3 py-1.5 text-xs text-gray-400 hover:text-white"
                  >
                      Batal
                  </button>
                  <button 
                      onClick={handleTemplateShare}
                      disabled={!templateName.trim()}
                      className={`px-3 py-1.5 text-xs font-semibold rounded text-white transition-colors ${
                          templateName.trim() 
                          ? 'bg-indigo-600 hover:bg-indigo-500' 
                          : 'bg-gray-700 cursor-not-allowed text-gray-500'
                      }`}
                  >
                      {templateLinkCopied ? 'Link Disalin!' : 'Salin Link'}
                  </button>
              </div>
              <div className="absolute top-0 right-4 w-3 h-3 bg-gray-800 border-t border-l border-gray-600 transform rotate-45 -translate-y-1/2"></div>
          </div>
      )}

      <div className="relative bg-gray-900 rounded-md mb-6 border border-gray-700 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
            <span className="text-xs font-mono text-gray-400">json</span>
        </div>
        <pre className="p-4 text-sm font-mono text-blue-300 overflow-x-auto whitespace-pre-wrap break-words">
            <code>{prompt}</code>
        </pre>
      </div>

      {/* Google Veo Video Prompt Section */}
      {veoPrompt && (
          <div className="mt-6 border-t border-gray-700 pt-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-3">
                   <h3 className="text-lg font-semibold text-blue-400 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                        </svg>
                        Prompt Video
                   </h3>
                   <button
                      onClick={handleCopyVeoPrompt}
                      className={`px-3 py-1 text-sm rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2 ${
                          veoPromptCopied ? 'bg-green-600 text-white' : 'bg-blue-800 text-white hover:bg-blue-700 border border-blue-600'
                      }`}
                    >
                      {veoPromptCopied ? (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Disalin
                          </>
                      ) : (
                          <>
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                            </svg>
                            Copy Veo Prompt
                          </>
                      )}
                    </button>
              </div>
              <div className="bg-gray-900/50 p-4 rounded-md border border-blue-900/30">
                  <p className="text-gray-300 whitespace-pre-wrap break-words font-sans text-sm">{veoPrompt}</p>
              </div>
          </div>
      )}
    </div>
  );
};