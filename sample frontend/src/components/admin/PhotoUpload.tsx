import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Upload, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { uploadProductImages } from '@/api/adminApi';

interface PhotoUploadProps {
  photos: string[];
  maxPhotos?: number;
  onPhotosChange: (photos: string[]) => void;
  onUploadError?: (message: string) => void;
}

export function PhotoUpload({ photos, maxPhotos = 10, onPhotosChange, onUploadError }: PhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  // Local preview URLs for files selected but not yet uploaded (object URLs)
  const [pendingPreviews, setPendingPreviews] = useState<{ url: string; file: File }[]>([]);

  // Revoke object URLs on unmount
  useEffect(() => {
    const current = pendingPreviews;
    return () => {
      current.forEach(({ url }) => URL.revokeObjectURL(url));
    };
  }, [pendingPreviews]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = maxPhotos - photos.length - pendingPreviews.length;
    const filesToAdd = Array.from(files)
      .filter((file) => file.type.startsWith('image/'))
      .slice(0, Math.max(0, remainingSlots));

    if (filesToAdd.length === 0) {
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Create local previews immediately so user sees images right away
    const newPreviews = filesToAdd.map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }));
    setPendingPreviews((prev) => [...prev, ...newPreviews]);
    setUploading(true);

    try {
      const { urls } = await uploadProductImages(filesToAdd);
      // Store Cloudinary URLs in form; append to existing photos
      onPhotosChange([...photos, ...urls]);
      // Clear pending previews and revoke their object URLs
      newPreviews.forEach(({ url }) => URL.revokeObjectURL(url));
      setPendingPreviews((prev) => prev.filter((p) => !newPreviews.includes(p)));
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'error' in err.response.data
          ? String((err.response.data as { error: string }).error)
          : 'Failed to upload images. Please try again.';
      onUploadError?.(message);
      // Remove failed previews and revoke URLs
      newPreviews.forEach(({ url }) => URL.revokeObjectURL(url));
      setPendingPreviews((prev) => prev.filter((p) => !newPreviews.includes(p)));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = (index: number) => {
    const updated = photos.filter((_, i) => i !== index);
    onPhotosChange(updated);
  };

  const handleRemovePending = (index: number) => {
    const item = pendingPreviews[index];
    if (item) URL.revokeObjectURL(item.url);
    setPendingPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const canAddMore = photos.length + pendingPreviews.length < maxPhotos && !uploading;
  const allItems: { type: 'saved'; url: string; index: number }[] = photos.map((url, index) => ({ type: 'saved', url, index }));
  const pendingItems: { type: 'pending'; url: string; index: number }[] = pendingPreviews.map((p, index) => ({ type: 'pending', url: p.url, index }));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Product images</label>
        <span className="text-xs text-muted-foreground">
          {photos.length + pendingPreviews.length}/{maxPhotos} • Saved as Cloudinary links
        </span>
      </div>

      {(photos.length > 0 || pendingPreviews.length > 0) && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {allItems.map(({ url, index }) => (
            <div key={`saved-${index}`} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden border bg-muted">
                <img
                  src={url}
                  alt={`Product ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemovePhoto(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
          {pendingItems.map(({ url, index }) => (
            <div key={`pending-${index}`} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden border bg-muted">
                <img
                  src={url}
                  alt={`Uploading ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                </div>
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemovePending(index)}
              >
                <X className="h-3 w-3" />
              </Button>
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
            disabled={!canAddMore}
          />
          <Button
            type="button"
            variant="outline"
            className={cn(
              'w-full h-24 border-2 border-dashed',
              canAddMore && 'hover:border-primary hover:bg-primary/5 cursor-pointer'
            )}
            onClick={() => fileInputRef.current?.click()}
            disabled={!canAddMore}
          >
            <div className="flex flex-col items-center gap-2">
              {uploading ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              ) : (
                <Upload className="h-5 w-5 text-muted-foreground" />
              )}
              <span className="text-sm text-muted-foreground">
                {uploading
                  ? 'Uploading…'
                  : photos.length === 0 && pendingPreviews.length === 0
                    ? 'Click to add images (multiple allowed, stored on Cloudinary)'
                    : `Add more (${maxPhotos - photos.length - pendingPreviews.length} left)`}
              </span>
            </div>
          </Button>
        </div>
      )}

      {photos.length + pendingPreviews.length >= maxPhotos && (
        <p className="text-xs text-muted-foreground text-center">
          Maximum {maxPhotos} images
        </p>
      )}
    </div>
  );
}
