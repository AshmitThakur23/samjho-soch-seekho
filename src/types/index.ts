export type Language = 'EN' | 'HI';

export type ProcessingMode = 'Simple' | 'Pro';

export type HighlightType = 'Safe' | 'Caution' | 'Risk';

export interface DocumentHighlight {
  label: HighlightType;
  emoji: '✅' | '⚠️' | '❌';
  color: 'success' | 'warning' | 'destructive';
  text: string;
}

export interface DocumentExplanation {
  clause: string;
  meaning: string;
  example: string;
}

export interface DocumentAnalysis {
  overview: string;
  highlights: DocumentHighlight[];
  explanations: DocumentExplanation[];
  actions: string[];
}

export interface AppSettings {
  summaryLanguage: Language;
  voiceLanguage: Language;
  mode: ProcessingMode;
}

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  language?: Language;
}