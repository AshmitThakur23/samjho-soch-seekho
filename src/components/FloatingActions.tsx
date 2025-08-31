import { Mic, Globe, Volume2 } from 'lucide-react';
import { Language } from '@/types';
import { cn } from '@/lib/utils';

interface FloatingActionsProps {
  isVoicePlaying: boolean;
  summaryLanguage: Language;
  voiceLanguage: Language;
  onVoiceToggle: () => void;
  onSummaryLanguageToggle: () => void;
  onVoiceLanguageToggle: () => void;
}

export const FloatingActions = ({
  isVoicePlaying,
  summaryLanguage,
  voiceLanguage,
  onVoiceToggle,
  onSummaryLanguageToggle,
  onVoiceLanguageToggle,
}: FloatingActionsProps) => {
  return (
    <div className="fixed bottom-6 right-6 md:right-8 flex flex-col space-y-3 z-50">
      {/* Voice Mode Button */}
      <button
        onClick={onVoiceToggle}
        className={cn(
          "fab",
          isVoicePlaying && "bg-destructive"
        )}
        title={isVoicePlaying ? "Stop Voice" : "Start Voice"}
      >
        <Mic className={cn("w-5 h-5", isVoicePlaying && "animate-pulse")} />
      </button>

      {/* Summary Language Button */}
      <button
        onClick={onSummaryLanguageToggle}
        className="fab relative"
        title={`Summary Language: ${summaryLanguage === 'EN' ? 'English' : 'Hindi'}`}
      >
        <Globe className="w-5 h-5" />
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-secondary-foreground text-xs rounded-full flex items-center justify-center font-bold">
          {summaryLanguage}
        </span>
      </button>

      {/* Voice Language Button */}
      <button
        onClick={onVoiceLanguageToggle}
        className="fab relative"
        title={`Voice Language: ${voiceLanguage === 'EN' ? 'English' : 'Hindi'}`}
      >
        <Volume2 className="w-5 h-5" />
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-secondary-foreground text-xs rounded-full flex items-center justify-center font-bold">
          {voiceLanguage}
        </span>
      </button>
    </div>
  );
};