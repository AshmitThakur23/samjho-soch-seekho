import { useState, useCallback, useRef, useEffect } from 'react';
import { Language } from '@/types';

export const useVoiceMode = (voiceLanguage: Language) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = useCallback((text: string, language: Language = voiceLanguage) => {
    if (!text) return;

    // Stop any current speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'HI' ? 'hi-IN' : 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  }, [voiceLanguage]);

  const stop = useCallback(() => {
    speechSynthesis.cancel();
    setIsPlaying(false);
  }, []);

  const toggle = useCallback((text: string) => {
    if (isPlaying) {
      stop();
    } else {
      speak(text);
    }
  }, [isPlaying, speak, stop]);

  useEffect(() => {
    return () => {
      speechSynthesis.cancel();
    };
  }, []);

  return {
    isPlaying,
    speak,
    stop,
    toggle,
  };
};