import { useCallback, useRef } from 'react';

export const useIdlePrompts = () => {
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const repeatTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isActiveRef = useRef<boolean>(false);

  const speakPrompt = useCallback((text: string, language: 'EN' | 'HI' = 'EN') => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'HI' ? 'hi-IN' : 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  }, []);

  const startIdlePrompts = useCallback(() => {
    // Clear any existing timers
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (repeatTimerRef.current) clearTimeout(repeatTimerRef.current);
    
    isActiveRef.current = true;

    // Start initial 10-second timer
    idleTimerRef.current = setTimeout(() => {
      if (!isActiveRef.current) return; // Don't proceed if stopped
      
      // Speak in English first
      speakPrompt("Please upload a document here to begin", 'EN');
      
      // Then Hindi after 3 seconds
      setTimeout(() => {
        if (!isActiveRef.current) return; // Check again before Hindi
        speakPrompt("कृपया शुरू करने के लिए यहाँ एक दस्तावेज़ अपलोड करें", 'HI');
      }, 3000);

      // Set up repeating timer every 15 seconds
      repeatTimerRef.current = setInterval(() => {
        if (!isActiveRef.current) return; // Don't repeat if stopped
        speakPrompt("Please upload a document here to begin", 'EN');
        setTimeout(() => {
          if (!isActiveRef.current) return; // Check again before Hindi
          speakPrompt("कृपया शुरू करने के लिए यहाँ एक दस्तावेज़ अपलोड करें", 'HI');
        }, 3000);
      }, 15000);
    }, 10000);
  }, [speakPrompt]);

  const stopIdlePrompts = useCallback(() => {
    isActiveRef.current = false; // Mark as inactive
    
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
    if (repeatTimerRef.current) {
      clearInterval(repeatTimerRef.current);
      repeatTimerRef.current = null;
    }
    speechSynthesis.cancel(); // Stop any ongoing voice prompts
  }, []);

  return {
    startIdlePrompts,
    stopIdlePrompts,
  };
};