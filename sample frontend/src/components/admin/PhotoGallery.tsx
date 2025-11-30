import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PhotoGalleryProps {
  photos: string[];
  trigger?: React.ReactNode;
}

export function PhotoGallery({ photos, trigger }: PhotoGalleryProps) {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (photos.length === 0) return null;

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <div onClick={() => setOpen(true)} className="cursor-pointer">
        {trigger || (
          <div className="flex gap-1">
            {photos.slice(0, 3).map((photo, index) => (
              <div
                key={index}
                className="w-10 h-10 rounded border overflow-hidden bg-muted"
              >
                <img
                  src={photo}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {photos.length > 3 && (
              <div className="w-10 h-10 rounded border bg-muted flex items-center justify-center text-xs font-semibold">
                +{photos.length - 3}
              </div>
            )}
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl p-0">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 bg-background/80 hover:bg-background"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>

            <div className="relative aspect-video bg-black">
              <img
                src={photos[currentIndex]}
                alt={`Photo ${currentIndex + 1}`}
                className="w-full h-full object-contain"
              />

              {photos.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                    onClick={handlePrevious}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                    onClick={handleNext}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </>
              )}
            </div>

            {photos.length > 1 && (
              <div className="p-4 bg-background border-t">
                <div className="flex items-center justify-center gap-2">
                  {photos.map((_, index) => (
                    <button
                      key={index}
                      className={cn(
                        "w-2 h-2 rounded-full transition-all",
                        index === currentIndex ? "bg-primary w-8" : "bg-muted-foreground/30"
                      )}
                      onClick={() => setCurrentIndex(index)}
                    />
                  ))}
                </div>
                <p className="text-center text-sm text-muted-foreground mt-2">
                  {currentIndex + 1} of {photos.length}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
