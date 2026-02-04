interface ProductImageProps {
  src: string;
  alt: string;
}

export function ProductImage({ src, alt }: ProductImageProps) {
  return (
    <div className="aspect-square bg-muted/50 rounded-2xl overflow-hidden shadow-sm border">
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </div>
  );
}
