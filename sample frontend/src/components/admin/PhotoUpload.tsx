import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { X, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PhotoUploadProps {
  photos: string[];
  maxPhotos?: number;
  onPhotosChange: (photos: string[]) => void;
}

export function PhotoUpload({ photos, maxPhotos = 6, onPhotosChange }: PhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remainingSlots = maxPhotos - photos.length;
    const filesToAdd = Array.from(files)
      .filter(file => file.type.startsWith('image/'))
      .slice(0, remainingSlots);

    if (filesToAdd.length === 0) return;

    const readFiles = filesToAdd.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(file);
      });
    });

    try {
      const newPhotos = await Promise.all(readFiles);
      onPhotosChange([...photos, ...newPhotos]);
    } catch (error) {
      console.error('Error reading files:', error);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = (index: number) => {
    const updated = photos.filter((_, i) => i !== index);
    onPhotosChange(updated);
  };

  const canAddMore = photos.length < maxPhotos;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Photos</label>
        <span className="text-xs text-muted-foreground">
          {photos.length}/{maxPhotos} photos
        </span>
      </div>

      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {photos.map((photo, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden border bg-muted">
                <img
                  src={photo}
                  alt={`Photo ${index + 1}`}
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
              "w-full h-24 border-2 border-dashed",
              canAddMore && "hover:border-primary hover:bg-primary/5 cursor-pointer"
            )}
            onClick={() => fileInputRef.current?.click()}
            disabled={!canAddMore}
          >
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {photos.length === 0 
                  ? 'Click to upload photos' 
                  : `Add more photos (${maxPhotos - photos.length} remaining)`}
              </span>
            </div>
          </Button>
        </div>
      )}

      {photos.length >= maxPhotos && (
        <p className="text-xs text-muted-foreground text-center">
          Maximum {maxPhotos} photos reached
        </p>
      )}
    </div>
  );
}
