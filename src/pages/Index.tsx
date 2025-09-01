import { useState, useEffect, useCallback } from 'react';
import heroBackground from '@/assets/hero-background.jpg';
import { FileUpload } from '@/components/FileUpload';
import { ModeSelector } from '@/components/ModeSelector';
import { DocumentSummary } from '@/components/DocumentSummary';
import { FloatingActions } from '@/components/FloatingActions';
import { ChatBot } from '@/components/ChatBot';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { VoiceSetupDialog } from '@/components/VoiceSetupDialog';
import { useAppSettings } from '@/hooks/useAppSettings';
import { useVoiceMode } from '@/hooks/useVoiceMode';
import { useIdlePrompts } from '@/hooks/useIdlePrompts';
import { DocumentAnalysis } from '@/types';
import { translateAnalysis } from '@/utils/documentTranslator';

// Enhanced mock document analysis for demo
const mockAnalysis: DocumentAnalysis = {
  overview: "This document is a comprehensive rental agreement for a 2-bedroom apartment located in Bandra West, Mumbai. The lease term is set for 11 months with a monthly rental of ₹25,000. The agreement follows standard legal frameworks but contains several specific clauses that require careful attention.\n\nThe document establishes clear responsibilities for both tenant and landlord, including maintenance obligations, payment schedules, and termination procedures. While most clauses are standard industry practice, there are some conditions that differ from typical rental agreements in Mumbai and could impact your tenancy experience.",
  highlights: [
    {
      label: 'Safe',
      emoji: '✅',
      color: 'success',
      text: 'Standard 11-month lease agreement with clear termination conditions and proper legal framework'
    },
    {
      label: 'Safe',
      emoji: '✅', 
      color: 'success',
      text: 'Maintenance responsibilities clearly defined between tenant and landlord'
    },
    {
      label: 'Caution',
      emoji: '⚠️',
      color: 'warning',
      text: 'Security deposit is 3 months rent (₹75,000) - higher than typical 2 months standard'
    },
    {
      label: 'Caution',
      emoji: '⚠️',
      color: 'warning', 
      text: 'Rent increase clause allows 10% annual increment - verify market rates'
    },
    {
      label: 'Risk',
      emoji: '❌',
      color: 'destructive',
      text: 'Strict no-pets policy with ₹10,000 penalty - no exceptions mentioned'
    },
    {
      label: 'Risk',
      emoji: '❌',
      color: 'destructive',
      text: 'Early termination requires 2 months notice plus penalty equivalent to 1 month rent'
    }
  ],
  explanations: [
    {
      clause: "The tenant shall not keep any pets in the premises without prior written consent",
      meaning: "You cannot have any animals like dogs, cats, birds, or any other pets in the apartment unless the landlord gives you written permission",
      example: "If you get a dog later without permission, you could be fined ₹10,000 and may face eviction proceedings"
    },
    {
      clause: "Security deposit equivalent to three months advance rent shall be paid",
      meaning: "You must pay ₹75,000 (3 × ₹25,000) as security deposit before moving in, which is refundable at the end of tenancy",
      example: "Most Mumbai rentals ask for 2 months deposit (₹50,000), so this is ₹25,000 extra that you need to arrange"
    },
    {
      clause: "Annual rent increment of 10% shall be applicable from the second year",
      meaning: "Your rent will increase by 10% each year, so ₹25,000 becomes ₹27,500 in year 2",
      example: "Check if 10% is reasonable - typical Mumbai increments are 5-8% annually"
    }
  ],
  actions: [
    "Arrange ₹75,000 security deposit (3 months) before moving in",
    "Confirm you can commit to 11 months without keeping any pets",
    "Verify that 10% annual rent increase is acceptable for your budget",
    "Take detailed photos/videos of apartment condition before moving in",
    "Keep all rent payment receipts and maintain payment records",
    "Understand early termination costs (2 months notice + 1 month penalty)"
  ]
};

const Index = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysis, setAnalysis] = useState<DocumentAnalysis | null>(null);
  const [baseAnalysis, setBaseAnalysis] = useState<DocumentAnalysis | null>(null);
  const [showVoiceSetup, setShowVoiceSetup] = useState(false);
  const [voiceModeEnabled, setVoiceModeEnabled] = useState(false);

  const { settings, toggleSummaryLanguage, toggleVoiceLanguage, setMode } = useAppSettings();
  const { isPlaying, toggle: toggleVoice, speak } = useVoiceMode(settings.voiceLanguage);
  const { startIdlePrompts, stopIdlePrompts } = useIdlePrompts();

  // Handle file upload
  const handleFileSelect = useCallback(async (file: File) => {
    stopIdlePrompts();
    setUploadedFile(file);
    setShowVoiceSetup(true);
  }, [stopIdlePrompts]);

  // Handle voice setup completion
  const handleVoiceSetupComplete = useCallback((enableVoice: boolean, language?: string) => {
    setShowVoiceSetup(false);
    setVoiceModeEnabled(enableVoice);
    if (language && language !== settings.voiceLanguage) {
      toggleVoiceLanguage();
    }
    
    setIsProcessing(true);
    
    // Simulate processing delay
    const timer = setTimeout(() => {
      setBaseAnalysis(mockAnalysis);
      const translatedAnalysis = translateAnalysis(mockAnalysis, settings.summaryLanguage, settings.mode);
      setAnalysis(translatedAnalysis);
      setIsProcessing(false);
      
      // Focus summary card after processing
      setTimeout(() => {
        document.getElementById('document-summary')?.scrollIntoView({ 
          behavior: 'smooth' 
        });
      }, 500);
    }, 3000);
  }, [settings.summaryLanguage, settings.mode, settings.voiceLanguage, toggleVoiceLanguage]);

  // Get full summary text for voice reading
  const getFullSummaryText = useCallback((analysis: DocumentAnalysis) => {
    const overview = analysis.overview;
    const highlights = analysis.highlights.map(h => `${h.emoji} ${h.label}: ${h.text}`).join('. ');
    const actions = analysis.actions.join('. ');
    return `${overview}. Key highlights: ${highlights}. What this means for you: ${actions}`;
  }, []);

  // Handle voice toggle
  const handleVoiceToggle = useCallback(() => {
    if (analysis) {
      const textToSpeak = getFullSummaryText(analysis);
      toggleVoice(textToSpeak);
    }
  }, [analysis, toggleVoice, getFullSummaryText]);

  // Handle summary language toggle
  const handleSummaryLanguageToggle = useCallback(() => {
    if (baseAnalysis) {
      toggleSummaryLanguage();
      const newLanguage = settings.summaryLanguage === 'EN' ? 'HI' : 'EN';
      const translatedAnalysis = translateAnalysis(baseAnalysis, newLanguage, settings.mode);
      setAnalysis(translatedAnalysis);
    }
  }, [baseAnalysis, settings.summaryLanguage, settings.mode, toggleSummaryLanguage]);

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
          handleSummaryLanguageToggle();
          break;
        case 'j':
          e.preventDefault();
          toggleVoiceLanguage();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleVoiceToggle, handleSummaryLanguageToggle, toggleVoiceLanguage]);

  // Start idle prompts on home screen
  useEffect(() => {
    if (!uploadedFile && !analysis && !isProcessing) {
      startIdlePrompts();
    }
    
    return () => stopIdlePrompts();
  }, [uploadedFile, analysis, isProcessing, startIdlePrompts, stopIdlePrompts]);

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
            <ChatBot 
              language={settings.summaryLanguage}
              documentAnalysis={analysis}
              voiceEnabled={voiceModeEnabled && isPlaying}
            />

            {/* Floating Action Buttons */}
            <FloatingActions
              isVoicePlaying={isPlaying}
              summaryLanguage={settings.summaryLanguage}
              voiceLanguage={settings.voiceLanguage}
              onVoiceToggle={handleVoiceToggle}
              onSummaryLanguageToggle={handleSummaryLanguageToggle}
              onVoiceLanguageToggle={toggleVoiceLanguage}
            />
          </div>
        )}

        {/* Voice Setup Dialog */}
        <VoiceSetupDialog
          isOpen={showVoiceSetup}
          onComplete={handleVoiceSetupComplete}
        />
      </div>
    </div>
  );
};

export default Index;
