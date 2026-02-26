import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Upload } from 'lucide-react';

interface CategoryImageUploadProps {
  /** Existing saved thumbnail URL (from backend/Cloudinary) */
  thumbnail: string;
  /** Newly selected file, not yet uploaded – preview only */
  pendingFile: File | null;
  onFileSelect: (file: File | null) => void;
  disabled?: boolean;
}

export function CategoryImageUpload({
  thumbnail,
  pendingFile,
  onFileSelect,
  disabled = false,
}: CategoryImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Local preview from pending file (object URL); revoke on cleanup
  useEffect(() => {
    if (pendingFile) {
      const url = URL.createObjectURL(pendingFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(null);
  }, [pendingFile]);

  const displayUrl = previewUrl || thumbnail;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      onFileSelect(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    onFileSelect(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemove = () => {
    onFileSelect(null);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Category image</label>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-24 h-24 rounded-xl border bg-muted overflow-hidden relative group">
          {displayUrl ? (
            <>
              <img src={displayUrl} alt="Category preview" className="w-full h-full object-cover" />
              {!disabled && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={handleRemove}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
              No image
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={disabled}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
          >
            <Upload className="h-4 w-4 mr-2" />
            {displayUrl ? 'Change image' : 'Choose image'}
          </Button>
          <p className="text-xs text-muted-foreground mt-1">
            Image is uploaded to Cloudinary when you click Submit (JPEG, PNG, GIF, WebP, max 5MB)
          </p>
        </div>
      </div>
    </div>
  );
}
