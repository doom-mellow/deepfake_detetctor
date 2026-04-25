import { useCallback, useState } from 'react';
import { Upload, File, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface FileUploadZoneProps {
  onFileSelect: (file: File) => void;
  accept: string;
  maxSize?: number;
  className?: string;
  disabled?: boolean;
}

export function FileUploadZone({
  onFileSelect,
  accept,
  maxSize = 100 * 1024 * 1024,
  className,
  disabled = false
}: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      if (file.size <= maxSize) {
        setSelectedFile(file);
        onFileSelect(file);
      }
    }
  }, [disabled, maxSize, onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.size <= maxSize) {
        setSelectedFile(file);
        onFileSelect(file);
      }
    }
  }, [maxSize, onFileSelect]);

  const handleClear = useCallback(() => {
    setSelectedFile(null);
  }, []);

  return (
    <div className={cn('w-full', className)}>
      {!selectedFile ? (
        <label
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded cursor-pointer transition-all',
            isDragging && !disabled && 'border-primary bg-primary/5',
            !isDragging && !disabled && 'border-border hover:border-primary hover:bg-accent',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className={cn('w-10 h-10 mb-3', isDragging ? 'text-primary' : 'text-muted-foreground')} />
            <p className="mb-2 text-sm text-foreground">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-muted-foreground">
              Maximum file size: {Math.round(maxSize / 1024 / 1024)}MB
            </p>
          </div>
          <input
            type="file"
            className="hidden"
            accept={accept}
            onChange={handleFileInput}
            disabled={disabled}
          />
        </label>
      ) : (
        <div className="flex items-center justify-between p-4 border rounded bg-card">
          <div className="flex items-center gap-3">
            <File className="w-8 h-8 text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClear}
            disabled={disabled}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
