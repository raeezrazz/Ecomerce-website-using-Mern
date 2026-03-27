import { Gauge } from 'lucide-react';

export default function About() {
  return (
    <div className="user-page-dots min-h-[50vh]">
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <header className="mb-6 motion-safe:animate-fade-in-up">
          <h1 className="font-display text-xl sm:text-2xl font-semibold tracking-tight">About</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">RsMeters in brief</p>
        </header>

        <div className="rounded-xl border border-border/80 bg-card/90 backdrop-blur-sm shadow-soft p-4 sm:p-5 space-y-4 motion-safe:animate-fade-in-up motion-safe:animate-delay-100 motion-safe:animate-fill-both">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary motion-safe:animate-scale-in">
            <Gauge className="h-5 w-5" />
          </div>
          <div className="space-y-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            <p>
              We specialize in meter spares and related products so your equipment keeps running smoothly.
            </p>
            <p>
              Our focus is quality parts and dependable service—browse the shop for spares and more.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
