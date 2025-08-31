import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner = ({ message = "Processing..." }: LoadingSpinnerProps) => {
  return (
    <div className="glass-card rounded-xl p-8 text-center">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <div>
          <h3 className="text-xl font-semibold mb-2">Processing Document</h3>
          <p className="text-muted-foreground">{message}</p>
        </div>
      </div>
    </div>
  );
};