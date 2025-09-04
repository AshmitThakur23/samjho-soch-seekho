export type Language = 'EN' | 'HI';

export type ProcessingMode = 'Simple' | 'Pro';

export type HighlightType = 'Safe' | 'Caution' | 'Risk';

export interface DocumentHighlight {
  label: HighlightType;
  emoji: '✅' | '⚠️' | '❌';
  color: 'success' | 'warning' | 'destructive';
  text: string;
  lineNumber?: number; // optional: which line in the parsed document
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
  lines?: string[]; // optional: full document split into logical lines/sentences
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