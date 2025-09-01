import { useState, useCallback } from 'react';
import { Language, ProcessingMode, AppSettings } from '@/types';

const defaultSettings: AppSettings = {
  summaryLanguage: 'EN',
  voiceLanguage: 'EN',
  mode: 'Simple',
};

export const useAppSettings = () => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  const toggleSummaryLanguage = useCallback(() => {
    setSettings(prev => ({
      ...prev,
      summaryLanguage: prev.summaryLanguage === 'EN' ? 'HI' : 'EN'
    }));
  }, []);

  const setSummaryLanguage = useCallback((language: Language) => {
    setSettings(prev => ({ ...prev, summaryLanguage: language }));
  }, []);

  const setVoiceLanguage = useCallback((language: Language) => {
    setSettings(prev => ({ ...prev, voiceLanguage: language }));
  }, []);

  const toggleVoiceLanguage = useCallback(() => {
    setSettings(prev => ({
      ...prev,
      voiceLanguage: prev.voiceLanguage === 'EN' ? 'HI' : 'EN'
    }));
  }, []);

  const setMode = useCallback((mode: ProcessingMode) => {
    setSettings(prev => ({ ...prev, mode }));
  }, []);

  return {
    settings,
    toggleSummaryLanguage,
    toggleVoiceLanguage,
    setSummaryLanguage,
    setVoiceLanguage,
    setMode,
  };
};