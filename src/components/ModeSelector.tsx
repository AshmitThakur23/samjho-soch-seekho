import { ProcessingMode } from '@/types';
import { cn } from '@/lib/utils';

interface ModeSelectorProps {
  value: ProcessingMode;
  onChange: (mode: ProcessingMode) => void;
  disabled?: boolean;
}

export const ModeSelector = ({ value, onChange, disabled }: ModeSelectorProps) => {
  const modes: { value: ProcessingMode; label: string; description: string }[] = [
    {
      value: 'Simple',
      label: 'Simple',
      description: 'Auto voice reading for easy understanding'
    },
    {
      value: 'Pro',
      label: 'Pro',
      description: 'Detailed analysis with manual controls'
    }
  ];

  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4 text-center">Choose Mode</h3>
      
      <div className="grid grid-cols-2 gap-3">
        {modes.map((mode) => (
          <button
            key={mode.value}
            onClick={() => onChange(mode.value)}
            disabled={disabled}
            className={cn(
              "p-4 rounded-lg border transition-all duration-300",
              "hover:scale-105 active:scale-95",
              value === mode.value
                ? "border-primary bg-primary/10 text-primary"
                : "border-muted hover:border-primary/50",
              disabled && "opacity-50 cursor-not-allowed hover:scale-100"
            )}
          >
            <div className="text-center">
              <div className="font-semibold mb-1">{mode.label}</div>
              <div className="text-xs text-muted-foreground">
                {mode.description}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};