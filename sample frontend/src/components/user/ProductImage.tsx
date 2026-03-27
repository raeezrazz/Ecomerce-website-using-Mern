import { useState, useRef, useCallback, useEffect } from 'react';

interface ProductImageProps {
  src?: string;
  images?: string[];
  alt: string;
}

const placeholder =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"%3E%3Crect fill="%23f0f0f0" width="400" height="400"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="24"%3ENo image%3C/text%3E%3C/svg%3E';

/**
 * How much larger details appear vs the main image (same coordinate system as `object-fit: cover`).
 * 1 = same size as main; 3 ≈ triple-size pixels. Must be > 1 for a true zoom-in.
 */
const ZOOM_LEVEL = 2.45;

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function coverLayout(iw: number, ih: number, cw: number, ch: number) {
  if (iw <= 0 || ih <= 0 || cw <= 0 || ch <= 0) return null;
  const scale = Math.max(cw / iw, ch / ih);
  const rw = iw * scale;
  const rh = ih * scale;
  const tx = (cw - rw) / 2;
  const ty = (ch - rh) / 2;
  return { rw, rh, tx, ty };
}

export function ProductImage({ src, images = [], alt }: ProductImageProps) {
  const list = images.length > 0 ? images : src ? [src] : [];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const mainUrl = list[selectedIndex] || placeholder;

  const containerRef = useRef<HTMLDivElement>(null);
  const lastClientRef = useRef<{ x: number; y: number } | null>(null);
  const rafRef = useRef<number>(0);

  const [natural, setNatural] = useState<{ iw: number; ih: number } | null>(null);
  const [cover, setCover] = useState<NonNullable<ReturnType<typeof coverLayout>> | null>(null);

  const [isHovering, setIsHovering] = useState(false);
  const [mouse, setMouse] = useState({ mx: 0, my: 0 });
  const [viewport, setViewport] = useState({ cw: 0, ch: 0 });
  const [mag, setMag] = useState({ size: 140, left: 0, top: 0 });

  const remeasure = useCallback(() => {
    const el = containerRef.current;
    if (!el || !natural) return;
    const cr = el.getBoundingClientRect();
    const next = coverLayout(natural.iw, natural.ih, cr.width, cr.height);
    setCover(next);
  }, [natural]);

  useEffect(() => {
    setNatural(null);
    setCover(null);
  }, [mainUrl]);

  useEffect(() => {
    remeasure();
  }, [remeasure, natural]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => remeasure());
    ro.observe(el);
    return () => ro.disconnect();
  }, [remeasure]);

  const applyPointer = useCallback(
    (clientX: number, clientY: number) => {
      lastClientRef.current = { x: clientX, y: clientY };
      const el = containerRef.current;
      const layout = cover;
      if (!el || !layout) return;

      const rect = el.getBoundingClientRect();
      const cw = rect.width;
      const ch = rect.height;
      if (cw <= 0 || ch <= 0) return;

      const mx = clamp(clientX - rect.left, 0, cw);
      const my = clamp(clientY - rect.top, 0, ch);
      setMouse({ mx, my });
      setViewport({ cw, ch });

      const M = Math.round(clamp(cw * 0.44, 148, 228));
      setMag({
        size: M,
        left: Math.round(mx - M / 2),
        top: Math.round(my - M / 2),
      });
    },
    [cover],
  );

  const schedulePointer = useCallback(
    (clientX: number, clientY: number) => {
      lastClientRef.current = { x: clientX, y: clientY };
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        const p = lastClientRef.current;
        if (p) applyPointer(p.x, p.y);
      });
    },
    [applyPointer],
  );

  useEffect(
    () => () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  useEffect(() => {
    const p = lastClientRef.current;
    if (cover && isHovering && p) {
      applyPointer(p.x, p.y);
    }
  }, [cover, isHovering, applyPointer]);

  const onEnter = (e: React.MouseEvent) => {
    if (mainUrl === placeholder) return;
    setIsHovering(true);
    applyPointer(e.clientX, e.clientY);
  };

  const onLeave = () => {
    setIsHovering(false);
    lastClientRef.current = null;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
    setMouse({ mx: 0, my: 0 });
    setViewport({ cw: 0, ch: 0 });
    setMag({ size: 140, left: 0, top: 0 });
  };

  const onMove = (e: React.MouseEvent) => {
    if (mainUrl === placeholder) return;
    schedulePointer(e.clientX, e.clientY);
  };

  const showZoom =
    isHovering && mainUrl !== placeholder && cover && viewport.cw > 0 && mag.size > 0;

  const magnifierStyle: React.CSSProperties | undefined = (() => {
    if (!showZoom || !cover || viewport.cw <= 0) return undefined;
    const { tx, ty, rw, rh } = cover;
    const bx = clamp(mouse.mx - tx, 0, rw);
    const by = clamp(mouse.my - ty, 0, rh);
    const M = mag.size;
    const z = ZOOM_LEVEL;
    const bgW = rw * z;
    const bgH = rh * z;
    const posX = Math.round(M / 2 - bx * z);
    const posY = Math.round(M / 2 - by * z);

    return {
      left: mag.left,
      top: mag.top,
      width: M,
      height: M,
      backgroundImage: `url(${mainUrl})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: `${Math.round(bgW)}px ${Math.round(bgH)}px`,
      backgroundPosition: `${posX}px ${posY}px`,
    };
  })();

  return (
    <div className="space-y-2.5">
      <div
        className={`relative w-full ${
          mainUrl !== placeholder ? (isHovering ? 'cursor-none' : 'cursor-crosshair') : ''
        }`}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onMouseMove={onMove}
      >
        <div ref={containerRef} className="relative aspect-square w-full overflow-visible">
          <div className="absolute inset-0 overflow-hidden rounded-xl border border-border/80 bg-muted/40 shadow-soft ring-1 ring-black/[0.03] dark:ring-white/[0.06]">
            <img
              key={mainUrl}
              src={mainUrl}
              alt={alt}
              className="pointer-events-none h-full w-full object-cover select-none motion-safe:animate-scale-in"
              draggable={false}
              onLoad={(e) => {
                const t = e.currentTarget;
                if (t.naturalWidth > 0 && t.naturalHeight > 0) {
                  setNatural({ iw: t.naturalWidth, ih: t.naturalHeight });
                }
              }}
            />
          </div>

          {showZoom && magnifierStyle && (
            <div
              className="pointer-events-none absolute z-30 overflow-hidden rounded-xl border-2 border-white bg-muted/25 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.5)] ring-2 ring-black/20 dark:bg-neutral-950/50 dark:ring-white/25"
              style={magnifierStyle}
              aria-hidden
            />
          )}
        </div>
      </div>

      {list.length > 1 && (
        <div className="flex flex-wrap gap-1.5">
          {list.map((url, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedIndex(i)}
              className={`h-11 w-11 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all duration-200 sm:h-12 sm:w-12 ${
                selectedIndex === i
                  ? 'scale-[1.02] border-primary shadow-sm ring-2 ring-primary/15'
                  : 'border-transparent opacity-80 hover:border-muted-foreground/25 hover:opacity-100'
              }`}
            >
              <img src={url} alt={`${alt} ${i + 1}`} className="h-full w-full object-cover" draggable={false} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
