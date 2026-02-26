import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PhotoUploadProps {
  /** Existing saved image URLs (from backend/Cloudinary) */
  photos: string[];
  /** Newly selected files, not yet uploaded – preview only */
  pendingFiles: File[];
  maxPhotos?: number;
  onPhotosChange: (photos: string[]) => void;
  onPendingFilesChange: (files: File[]) => void;
  disabled?: boolean;
}

export function PhotoUpload({
  photos,
  pendingFiles,
  maxPhotos = 10,
  onPhotosChange,
  onPendingFilesChange,
  disabled = false,
}: PhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Object URLs for pending files; revoke on cleanup
  useEffect(() => {
    if (pendingFiles.length === 0) {
      setPreviewUrls([]);
      return;
    }
    const urls = pendingFiles.map((f) => URL.createObjectURL(f));
    setPreviewUrls(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [pendingFiles]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remaining = maxPhotos - photos.length - pendingFiles.length;
    const toAdd = Array.from(files)
      .filter((f) => f.type.startsWith('image/'))
      .slice(0, Math.max(0, remaining));

    if (toAdd.length === 0) {
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    onPendingFilesChange([...pendingFiles, ...toAdd]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemovePhoto = (index: number) => {
    onPhotosChange(photos.filter((_, i) => i !== index));
  };

  const handleRemovePending = (index: number) => {
    onPendingFilesChange(pendingFiles.filter((_, i) => i !== index));
  };

  const canAddMore = !disabled && photos.length + pendingFiles.length < maxPhotos;
  const totalCount = photos.length + pendingFiles.length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Product images</label>
        <span className="text-xs text-muted-foreground">
          {totalCount}/{maxPhotos} • Uploaded to Cloudinary when you click Submit
        </span>
      </div>

      {(photos.length > 0 || pendingFiles.length > 0) && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {photos.map((url, index) => (
            <div key={`saved-${index}`} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden border bg-muted">
                <img src={url} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
              </div>
              {!disabled && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemovePhoto(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}
          {pendingFiles.map((_, index) => (
            <div key={`pending-${index}`} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden border bg-muted">
                {previewUrls[index] ? (
                  <img
                    src={previewUrls[index]}
                    alt={`New ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">Preview</div>
                )}
              </div>
              {!disabled && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemovePending(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {canAddMore && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            disabled={disabled}
          />
          <Button
            type="button"
            variant="outline"
            className={cn(
              'w-full h-24 border-2 border-dashed',
              canAddMore && 'hover:border-primary hover:bg-primary/5 cursor-pointer'
            )}
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
          >
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {totalCount === 0
                  ? 'Choose images (upload to Cloudinary on Submit)'
                  : `Add more (${maxPhotos - totalCount} left)`}
              </span>
            </div>
          </Button>
        </div>
      )}

      {totalCount >= maxPhotos && (
        <p className="text-xs text-muted-foreground text-center">Maximum {maxPhotos} images</p>
      )}
    </div>
  );
}
