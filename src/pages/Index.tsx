import { useState, useEffect, useCallback } from 'react';
import heroBackground from '@/assets/hero-background.jpg';
import { FileUpload } from '@/components/FileUpload';
import { ModeSelector } from '@/components/ModeSelector';
import { DocumentSummary } from '@/components/DocumentSummary';
import { FloatingActions } from '@/components/FloatingActions';
import { ChatBot } from '@/components/ChatBot';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useAppSettings } from '@/hooks/useAppSettings';
import { useVoiceMode } from '@/hooks/useVoiceMode';
import { DocumentAnalysis } from '@/types';

// Mock document analysis for demo
const mockAnalysis: DocumentAnalysis = {
  summary: "This is a rental agreement for a 2-bedroom apartment in Mumbai. The lease is for 11 months with a monthly rent of ₹25,000. The document contains standard clauses but has some important conditions you should be aware of.",
  highlights: [
    {
      label: 'Safe',
      emoji: '✅',
      color: 'success',
      text: 'Standard 11-month lease agreement with clear termination conditions'
    },
    {
      label: 'Caution',
      emoji: '⚠️',
      color: 'warning',
      text: 'Security deposit is 3 months rent (₹75,000) - higher than typical 2 months'
    },
    {
      label: 'Risk',
      emoji: '❌',
      color: 'destructive',
      text: 'No pets allowed clause with penalty of ₹10,000 if violated'
    }
  ],
  explanations: [
    {
      clause: "The tenant shall not keep any pets in the premises",
      meaning: "You cannot have any animals like dogs, cats, or birds in the apartment",
      example: "If you get a dog later, you could be fined ₹10,000 and may have to leave"
    }
  ],
  actions: [
    "Pay security deposit of ₹75,000 before moving in",
    "Ensure you can commit to 11 months without pets",
    "Keep all receipts for rent payments",
    "Take photos of apartment condition before moving in"
  ]
};

const Index = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysis, setAnalysis] = useState<DocumentAnalysis | null>(null);
  const [idleTimer, setIdleTimer] = useState<NodeJS.Timeout | null>(null);

  const { settings, toggleSummaryLanguage, toggleVoiceLanguage, setMode } = useAppSettings();
  const { isPlaying, toggle: toggleVoice, autoSpeak } = useVoiceMode(settings.voiceLanguage);

  // Handle file upload
  const handleFileSelect = useCallback(async (file: File) => {
    setUploadedFile(file);
    setIsProcessing(true);

    // Simulate processing delay
    setTimeout(() => {
      setAnalysis(mockAnalysis);
      setIsProcessing(false);
      
      // Focus summary card after processing
      setTimeout(() => {
        document.getElementById('document-summary')?.scrollIntoView({ 
          behavior: 'smooth' 
        });
        
        // Start idle timer for Simple mode
        if (settings.mode === 'Simple') {
          const timer = setTimeout(() => {
            autoSpeak(mockAnalysis.summary);
          }, 8000); // 8 seconds idle
          setIdleTimer(timer);
        }
      }, 500);
    }, 3000);
  }, [settings.mode, autoSpeak]);

  // Handle voice toggle
  const handleVoiceToggle = useCallback(() => {
    if (analysis) {
      const textToSpeak = `${analysis.summary}. Key highlights: ${analysis.highlights.map(h => `${h.emoji} ${h.label}: ${h.text}`).join('. ')}`;
      toggleVoice(textToSpeak);
    }
  }, [analysis, toggleVoice]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      
      switch (e.key.toLowerCase()) {
        case 'v':
          e.preventDefault();
          handleVoiceToggle();
          break;
        case 'l':
          e.preventDefault();
          toggleSummaryLanguage();
          break;
        case 'j':
          e.preventDefault();
          toggleVoiceLanguage();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleVoiceToggle, toggleSummaryLanguage, toggleVoiceLanguage]);

  // Clear idle timer when user interacts
  useEffect(() => {
    const clearTimer = () => {
      if (idleTimer) {
        clearTimeout(idleTimer);
        setIdleTimer(null);
      }
    };

    window.addEventListener('click', clearTimer);
    window.addEventListener('keydown', clearTimer);
    
    return () => {
      window.removeEventListener('click', clearTimer);
      window.removeEventListener('keydown', clearTimer);
      if (idleTimer) clearTimeout(idleTimer);
    };
  }, [idleTimer]);

  return (
    <div className="min-h-screen">
      {/* Fixed Background */}
      <div 
        className="hero-bg"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      <div className="hero-overlay" />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {!analysis ? (
          // Home Screen
          <div className="min-h-screen flex flex-col justify-center space-y-8">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                SamjhoDocs
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground">
                Read. Understand. Decide — in your language.
              </p>
            </div>

            {/* Upload and Mode Selection */}
            <div className="space-y-6">
              {isProcessing ? (
                <LoadingSpinner message="Analyzing document with AI..." />
              ) : (
                <>
                  <FileUpload onFileSelect={handleFileSelect} />
                  <ModeSelector 
                    value={settings.mode} 
                    onChange={setMode}
                  />
                </>
              )}
            </div>
          </div>
        ) : (
          // Document Analysis View
          <div className="py-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                SamjhoDocs
              </h1>
              <p className="text-muted-foreground">
                Analysis complete • {settings.mode} Mode • {uploadedFile?.name}
              </p>
            </div>

            {/* Document Summary */}
            <DocumentSummary 
              analysis={analysis} 
              language={settings.summaryLanguage} 
            />

            {/* ChatBot */}
            <ChatBot language={settings.summaryLanguage} />

            {/* Floating Action Buttons */}
            <FloatingActions
              isVoicePlaying={isPlaying}
              summaryLanguage={settings.summaryLanguage}
              voiceLanguage={settings.voiceLanguage}
              onVoiceToggle={handleVoiceToggle}
              onSummaryLanguageToggle={toggleSummaryLanguage}
              onVoiceLanguageToggle={toggleVoiceLanguage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
