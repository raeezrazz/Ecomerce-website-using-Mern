import { useState } from 'react';

interface ProductImageProps {
  /** Single image URL (legacy) */
  src?: string;
  /** Multiple image URLs (Cloudinary or any); first is main, rest are gallery */
  images?: string[];
  alt: string;
}

const placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"%3E%3Crect fill="%23f0f0f0" width="400" height="400"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="24"%3ENo image%3C/text%3E%3C/svg%3E';

export function ProductImage({ src, images = [], alt }: ProductImageProps) {
  const list = images.length > 0 ? images : (src ? [src] : []);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const mainUrl = list[selectedIndex] || placeholder;

  return (
    <div className="space-y-3">
      <div className="aspect-square bg-muted/50 rounded-2xl overflow-hidden shadow-sm border">
        <img
          src={mainUrl}
          alt={alt}
          className="w-full h-full object-cover"
        />
      </div>
      {list.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {list.map((url, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedIndex(i)}
              className={`w-14 h-14 rounded-lg overflow-hidden border-2 flex-shrink-0 ${
                selectedIndex === i ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-muted-foreground/30'
              }`}
            >
              <img src={url} alt={`${alt} ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
