import { useState, useCallback, useRef, useEffect } from 'react';
import { Language } from '@/types';

export const useVoiceMode = (voiceLanguage: Language) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  // Pick a suitable TTS voice for the chosen language (hi/en)
  useEffect(() => {
    const pickVoice = () => {
      const voices = speechSynthesis.getVoices();
      const prefer = voiceLanguage === 'HI' ? 'hi' : 'en';
      const candidates = voices.filter(v => v.lang?.toLowerCase().startsWith(prefer));
      // Prefer Indian Hindi if available
      voiceRef.current = candidates.find(v => /hi-?in/i.test(v.lang) || /hindi|india/i.test(v.name)) || candidates[0] || null;
    };
    if (speechSynthesis.getVoices().length === 0) {
      speechSynthesis.onvoiceschanged = pickVoice;
    } else {
      pickVoice();
    }
  }, [voiceLanguage]);

  const speak = useCallback((text: string, language: Language = voiceLanguage) => {
    if (!text) return;

    // Stop any current speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'HI' ? 'hi-IN' : 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    if (voiceRef.current) utterance.voice = voiceRef.current;

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