import { useCallback, useState } from 'react';
import { Upload, FileText, Image } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
  onError?: (message: string) => void;
}

export const FileUpload = ({ onFileSelect, disabled, onError }: FileUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragOver(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;

    const files = e.dataTransfer.files;
    const file = files[0];
    
    if (file) {
      if (isValidFile(file)) {
        onFileSelect(file);
      } else {
        const errorMsg = "This file cannot be read, please upload again.";
        onError?.(errorMsg);
        // Voice feedback for error
        if ('speechSynthesis' in window) {
          speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(errorMsg);
          utterance.lang = 'en-US';
          speechSynthesis.speak(utterance);
        }
      }
    }
  }, [onFileSelect, disabled, onError]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (isValidFile(file)) {
        onFileSelect(file);
      } else {
        const errorMsg = "This file cannot be read, please upload again.";
        onError?.(errorMsg);
        // Voice feedback for error
        if ('speechSynthesis' in window) {
          speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(errorMsg);
          utterance.lang = 'en-US';
          speechSynthesis.speak(utterance);
        }
      }
    }
    // Reset file input
    e.target.value = '';
  }, [onFileSelect, onError]);

  const isValidFile = (file: File) => {
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/jpeg',
      'image/png',
      'image/webp'
    ];
    return validTypes.includes(file.type) || /\.(pdf|docx|txt|png|jpe?g|webp)$/i.test(file.name);
  };

  return (
    <div className="glass-card rounded-xl p-8 text-center">
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 transition-all duration-300",
          isDragOver && !disabled
            ? "border-primary bg-primary/5 scale-105"
            : "border-muted hover:border-primary/50",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          accept=".pdf,.docx,.txt,.jpg,.jpeg,.png,.webp"
          onChange={handleFileChange}
          disabled={disabled}
          className="hidden"
        />
        
        <label
          htmlFor="file-upload"
          className={cn(
            "cursor-pointer block",
            disabled && "cursor-not-allowed"
          )}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Upload Document
              </h3>
              <p className="text-muted-foreground mb-4">
                Drag & drop or click to select
              </p>
              
              <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <FileText className="w-4 h-4" />
                  <span>PDF, DOCX, TXT</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Image className="w-4 h-4" />
                  <span>Images</span>
                </div>
              </div>
            </div>
          </div>
        </label>
      </div>
    </div>
  );
};