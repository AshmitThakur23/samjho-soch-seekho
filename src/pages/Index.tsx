import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft } from 'lucide-react';
import { FileUpload } from '@/components/FileUpload';
import { ModeSelector } from '@/components/ModeSelector';
import { DocumentSummary } from '@/components/DocumentSummary';
import { FloatingActions } from '@/components/FloatingActions';
import { ChatBot } from '@/components/ChatBot';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { VoiceSetupDialog } from '@/components/VoiceSetupDialog';
import { useAppSettings } from '@/hooks/useAppSettings';
import { useVoiceMode } from '@/hooks/useVoiceMode';
import { DocumentAnalysis } from '@/types';
import { translateAnalysis } from '@/utils/documentTranslator';
import { parseDocument, analyzeDocument } from '@/utils/documentParser';

const Index = () => {
  const [currentDocument, setCurrentDocument] = useState<File | null>(null);
  const [documentContent, setDocumentContent] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysis, setAnalysis] = useState<DocumentAnalysis | null>(null);
  const [baseAnalysis, setBaseAnalysis] = useState<DocumentAnalysis | null>(null);
  const [showVoiceSetup, setShowVoiceSetup] = useState(false);
  const [voiceModeEnabled, setVoiceModeEnabled] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { settings, toggleSummaryLanguage, toggleVoiceLanguage, setMode } = useAppSettings();
  const { isPlaying, toggle: toggleVoice, speak, stop } = useVoiceMode(settings.voiceLanguage);

  // Handle file upload - parse document and clear all previous data
  const handleFileSelect = useCallback(async (file: File) => {
    setError(null);
    
    // IMMEDIATELY clear ALL previous document data
    setCurrentDocument(null);
    setDocumentContent('');
    setAnalysis(null);
    setBaseAnalysis(null);
    setVoiceModeEnabled(false);
    stop(); // Stop any ongoing voice
    
    setIsProcessing(true);
    
    try {
      // Parse the document content
      const content = await parseDocument(file);
      
      // Set the new document and content
      setCurrentDocument(file);
      setDocumentContent(content);
      setIsProcessing(false);
      setShowVoiceSetup(true);
    } catch (parseError) {
      console.error('Document parsing failed:', parseError);
      setError(parseError instanceof Error ? parseError.message : 'Failed to parse document');
      setIsProcessing(false);
    }
  }, [stop]);

  // Handle file upload errors
  const handleFileError = useCallback((message: string) => {
    setError(message);
    // Clear error after 5 seconds
    setTimeout(() => setError(null), 5000);
  }, []);

  // Handle voice setup completion - generate fresh analysis for current document
  const handleVoiceSetupComplete = useCallback(async (enableVoice: boolean, language?: string) => {
    setShowVoiceSetup(false);
    setVoiceModeEnabled(enableVoice);
    if (language && language !== settings.voiceLanguage) {
      toggleVoiceLanguage();
    }
    
    // Start processing with current document content
    if (!currentDocument || !documentContent) {
      setError("No document content found. Please upload again.");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Generate fresh analysis from the actual document content
      const freshAnalysis = await analyzeDocument(documentContent, currentDocument.name);
      
      setBaseAnalysis(freshAnalysis);
      const translatedAnalysis = translateAnalysis(freshAnalysis, settings.summaryLanguage, settings.mode);
      setAnalysis(translatedAnalysis);
      setIsProcessing(false);
      
      // If voice mode enabled, start reading after processing
      if (enableVoice && translatedAnalysis) {
        setTimeout(() => {
          const textToSpeak = getFullSummaryText(translatedAnalysis);
          speak(textToSpeak, language === 'HI' ? 'HI' : 'EN');
        }, 1000);
      }
      
      // Focus summary card after processing
      setTimeout(() => {
        document.getElementById('document-summary')?.scrollIntoView({ 
          behavior: 'smooth' 
        });
      }, 500);
    } catch (analysisError) {
      console.error('Document analysis failed:', analysisError);
      setError(analysisError instanceof Error ? analysisError.message : 'Failed to analyze document');
      setIsProcessing(false);
    }
  }, [settings.summaryLanguage, settings.mode, settings.voiceLanguage, toggleVoiceLanguage, currentDocument, documentContent, speak]);
  
  // Handle back to upload - completely reset all state
  const handleBackToUpload = useCallback(() => {
    // Clear ALL document data and reset to initial state
    setCurrentDocument(null);
    setDocumentContent('');
    setAnalysis(null);
    setBaseAnalysis(null);
    setVoiceModeEnabled(false);
    setError(null);
    setIsProcessing(false);
    stop(); // Stop any ongoing voice
  }, [stop]);

  // Get full summary text for voice reading
  const getFullSummaryText = useCallback((analysis: DocumentAnalysis) => {
    const overview = analysis.overview;
    const highlights = analysis.highlights.map(h => `${h.emoji} ${h.label}: ${h.text}`).join('. ');
    const actions = analysis.actions.join('. ');
    return `${overview}. Key highlights: ${highlights}. What this means for you: ${actions}`;
  }, []);

  // Handle voice toggle - toggle voice reading of current summary
  const handleVoiceToggle = useCallback(() => {
    if (isPlaying) {
      stop(); // Stop voice if playing
    } else if (analysis && currentDocument) {
      const textToSpeak = getFullSummaryText(analysis);
      speak(textToSpeak, settings.voiceLanguage); // Start voice with current language
    }
  }, [analysis, currentDocument, isPlaying, stop, speak, getFullSummaryText, settings.voiceLanguage]);

  // Handle summary language toggle - re-translate entire summary for current document
  const handleSummaryLanguageToggle = useCallback(() => {
    if (baseAnalysis && currentDocument) {
      toggleSummaryLanguage();
      const newLanguage = settings.summaryLanguage === 'EN' ? 'HI' : 'EN';
      const translatedAnalysis = translateAnalysis(baseAnalysis, newLanguage, settings.mode);
      setAnalysis(translatedAnalysis);
    }
  }, [baseAnalysis, currentDocument, settings.summaryLanguage, settings.mode, toggleSummaryLanguage]);

  // Handle voice language toggle - switch TTS language and restart if playing
  const handleVoiceLanguageToggle = useCallback(() => {
    const wasPlaying = isPlaying;
    if (wasPlaying) stop(); // Stop current voice
    toggleVoiceLanguage(); // Toggle language
    if (wasPlaying && analysis && currentDocument) {
      // Restart with new language after a brief delay
      setTimeout(() => {
        const textToSpeak = getFullSummaryText(analysis);
        const newLanguage = settings.voiceLanguage === 'EN' ? 'HI' : 'EN';
        speak(textToSpeak, newLanguage);
      }, 100);
    }
  }, [isPlaying, stop, toggleVoiceLanguage, analysis, currentDocument, getFullSummaryText, settings.voiceLanguage, speak]);

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
          handleVoiceLanguageToggle();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleVoiceToggle, handleSummaryLanguageToggle, handleVoiceLanguageToggle]);

  // Cleanup voice on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return (
    <div className="min-h-screen">
      {/* Live Animated Background */}
      <div className="hero-bg" />
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
                <div className="glass-card rounded-xl p-8 text-center animate-fade-in">
                  <LoadingSpinner message="Analyzing document..." />
                  <p className="text-sm text-muted-foreground mt-2">
                    Clearing previous data and processing new file...
                  </p>
                </div>
              ) : (
                <>
                  <div className="animate-fade-in">
                    <FileUpload 
                      onFileSelect={handleFileSelect} 
                      onError={handleFileError}
                    />
                  </div>
                  {error && (
                    <div className="glass-card rounded-xl p-4 text-center bg-destructive/10 border border-destructive/20 animate-scale-in">
                      <p className="text-destructive font-medium">{error}</p>
                    </div>
                  )}
                  <div className="animate-fade-in">
                    <ModeSelector 
                      value={settings.mode} 
                      onChange={setMode}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          // Document Analysis View
          <div className="py-8 animate-fade-in">
            {/* Header with Back Button */}
            <div className="text-center mb-8 relative">
              <button
                onClick={handleBackToUpload}
                className="absolute left-0 top-0 p-2 rounded-lg bg-background/80 hover:bg-background border border-border transition-all duration-200 hover:scale-105"
                title="Back to Upload"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                SamjhoDocs
              </h1>
              <p className="text-muted-foreground">
                Analysis complete • {settings.mode} Mode • {currentDocument?.name}
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Document processed: {new Date().toLocaleTimeString()}
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
              voiceEnabled={voiceModeEnabled}
              currentDocument={currentDocument}
              documentContent={documentContent}
            />

            {/* Floating Action Buttons */}
            <FloatingActions
              isVoicePlaying={isPlaying}
              summaryLanguage={settings.summaryLanguage}
              voiceLanguage={settings.voiceLanguage}
              onVoiceToggle={handleVoiceToggle}
              onSummaryLanguageToggle={handleSummaryLanguageToggle}
              onVoiceLanguageToggle={handleVoiceLanguageToggle}
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
