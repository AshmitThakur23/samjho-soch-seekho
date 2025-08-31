import { useCallback, useState } from 'react';
import { Upload, FileText, Image } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export const FileUpload = ({ onFileSelect, disabled }: FileUploadProps) => {
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
    
    if (file && isValidFile(file)) {
      onFileSelect(file);
    }
  }, [onFileSelect, disabled]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && isValidFile(file)) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const isValidFile = (file: File) => {
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/webp'
    ];
    return validTypes.includes(file.type);
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
          accept=".pdf,.docx,.jpg,.jpeg,.png,.webp"
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
                  <span>PDF, DOCX</span>
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