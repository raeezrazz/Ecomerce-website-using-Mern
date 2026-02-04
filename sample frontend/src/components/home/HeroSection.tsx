import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageCircle, Phone, Check, Gauge } from 'lucide-react';

const TRUST_BADGES = [
  { text: '10+ Years Experience', icon: Check },
  { text: '5000+ Customers', icon: Check },
  { text: 'Fast Service', icon: Check },
];

export function HeroSection() {

  return (
    <section className="relative w-full min-h-[90vh] flex items-center overflow-hidden">
      {/* Background: dark gradient + glassmorphism base */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-primary to-slate-900" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_70%_50%,hsl(217_91%_40%_/_0.25),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_20%_20%,hsl(24_95%_53%_/_0.12),transparent_50%)]" />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary-foreground)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary-foreground)) 1px, transparent 1px)`,
          backgroundSize: '56px 56px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Left: Text content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-2 text-sm font-medium text-primary-foreground/95 mb-6 opacity-0 animate-fade-in-down animate-delay-100 animate-fill-both">
              <Gauge className="h-4 w-4 text-amber-400" />
              Speedometer Repair & Calibration
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-[2.75rem] lg:text-5xl xl:text-[3.25rem] font-display font-bold tracking-tight text-white mb-4 sm:mb-5 opacity-0 animate-fade-in-up animate-delay-200 animate-fill-both leading-tight">
              Professional Speedometer & Meter Repair Service
            </h1>
            <p className="text-lg sm:text-xl text-primary-foreground/90 mb-4 opacity-0 animate-fade-in-up animate-delay-300 animate-fill-both font-medium">
              Accurate Calibration, Digital Meter Repair, and Dashboard Solutions for All Vehicles
            </p>
            <p className="text-base text-primary-foreground/75 mb-8 max-w-xl mx-auto lg:mx-0 opacity-0 animate-fade-in-up animate-delay-[350ms] animate-fill-both">
              Trusted experts in speedometer repair, odometer fixing, digital meter programming, and vehicle dashboard services. Fast service. Genuine parts. Affordable price.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mb-8 opacity-0 animate-fade-in-up animate-delay-400 animate-fill-both">
              <a
                href="https://wa.me/919778599696"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex"
              >
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-12 px-6 rounded-xl font-semibold bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-lg hover:shadow-[#25D366]/40 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 border-0"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Chat on WhatsApp
                </Button>
              </a>
              <Link to="/contact" className="w-full sm:w-auto inline-flex">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto h-12 px-6 rounded-xl font-semibold bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white hover:text-primary hover:border-white transition-all duration-300 hover:-translate-y-0.5"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Get Free Consultation
                </Button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-6 opacity-0 animate-fade-in-up animate-delay-500 animate-fill-both">
              {TRUST_BADGES.map(({ text, icon: Icon }) => (
                <span
                  key={text}
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary-foreground/90"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
                    <Icon className="h-4 w-4" />
                  </span>
                  {text}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Speedometer visual */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end opacity-0 animate-fade-in-up animate-delay-300 animate-fill-both">
            <div className="relative w-full max-w-md lg:max-w-lg">
              {/* Glow behind graphic */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-primary/30 blur-3xl animate-pulse" />
              </div>
              {/* Glass card containing speedometer */}
              <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
                <SpeedometerGraphic />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** SVG speedometer with animated needle and dashboard-style elements */
function SpeedometerGraphic() {
  return (
    <div className="relative aspect-square max-w-[280px] sm:max-w-[320px] mx-auto">
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full drop-shadow-2xl"
        aria-hidden
      >
        {/* Outer ring / bezel */}
        <defs>
          <linearGradient id="dialGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(217 91% 45%)" />
            <stop offset="100%" stopColor="hsl(217 91% 25%)" />
          </linearGradient>
          <linearGradient id="needleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(24 95% 55%)" />
            <stop offset="100%" stopColor="hsl(24 95% 45%)" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Background arc */}
        <circle
          cx="100"
          cy="100"
          r="88"
          fill="none"
          stroke="url(#dialGrad)"
          strokeWidth="14"
          strokeLinecap="round"
          className="opacity-90"
        />
        <circle
          cx="100"
          cy="100"
          r="88"
          fill="none"
          stroke="hsl(0 0% 100% / 0.08)"
          strokeWidth="14"
          strokeDasharray="4 6"
          strokeLinecap="round"
        />
        {/* Tick marks */}
        {[0, 20, 40, 60, 80, 100, 120, 140, 160, 180].map((deg, i) => {
          const rad = ((deg - 90) * Math.PI) / 180;
          const r1 = 80;
          const r2 = i % 2 === 0 ? 72 : 76;
          return (
            <line
              key={deg}
              x1={100 + r1 * Math.cos(rad)}
              y1={100 + r1 * Math.sin(rad)}
              x2={100 + r2 * Math.cos(rad)}
              y2={100 + r2 * Math.sin(rad)}
              stroke="hsl(0 0% 100% / 0.5)"
              strokeWidth={i % 2 === 0 ? 2.5 : 1.5}
              strokeLinecap="round"
            />
          );
        })}
        {/* Numbers */}
        {[0, 20, 40, 60, 80].map((n, i) => {
          const deg = 180 + (i * 45);
          const rad = (deg * Math.PI) / 180;
          const r = 62;
          return (
            <text
              key={n}
              x={100 + r * Math.cos(rad)}
              y={100 + r * Math.sin(rad)}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-white/80 text-[8px] font-bold"
              style={{ fontSize: 10 }}
            >
              {n}
            </text>
          );
        })}
        {/* Center cap */}
        <circle cx="100" cy="100" r="18" fill="hsl(217 91% 20%)" stroke="hsl(217 91% 50%)" strokeWidth="2" />
        <circle cx="100" cy="100" r="8" fill="hsl(24 95% 53%)" filter="url(#glow)" />
        {/* Animated needle: from center pointing to ~60 (speed) */}
        <g className="origin-[100px_100px] animate-speedometer-needle">
          <line
            x1="100"
            y1="100"
            x2="100"
            y2="42"
            stroke="url(#needleGrad)"
            strokeWidth="4"
            strokeLinecap="round"
            filter="url(#glow)"
          />
        </g>
        {/* Small "km/h" label */}
        <text x="100" y="128" textAnchor="middle" className="fill-white/60" style={{ fontSize: 9 }}>
          km/h
        </text>
      </svg>
      {/* Subtle floating label */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-lg bg-white/10 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-white/90">
        Calibration & Repair
      </div>
    </div>
  );
}
