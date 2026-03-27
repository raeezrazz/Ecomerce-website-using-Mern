import { Mail, Phone, MapPin, Instagram, Youtube } from 'lucide-react';

export default function Contact() {
  const rows = [
    {
      icon: Phone,
      label: 'Phone',
      content: (
        <a href="tel:+919778599696" className="text-muted-foreground hover:text-primary transition-colors text-xs sm:text-sm">
          +91 9778599696
        </a>
      ),
    },
    {
      icon: Mail,
      label: 'Email',
      content: (
        <a
          href="mailto:rsmeter1@gmail.com"
          className="text-muted-foreground hover:text-primary transition-colors text-xs sm:text-sm break-all"
        >
          rsmeter1@gmail.com
        </a>
      ),
    },
    {
      icon: MapPin,
      label: 'Address',
      content: (
        <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
          Rs Meter Service, Thottungal P.O,
          <br />
          Ramanattukara, Kozhikode,
          <br />
          Kerala, India - 673633
        </p>
      ),
    },
    {
      icon: Instagram,
      label: 'Instagram',
      content: (
        <a
          href="https://www.instagram.com/meter_repairing_calicut/?hl=en"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-primary transition-colors text-xs sm:text-sm break-all"
        >
          @meter_repairing_calicut
        </a>
      ),
    },
    {
      icon: Youtube,
      label: 'YouTube',
      content: (
        <a
          href="https://www.youtube.com/@MeterServiceCalicut"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-primary transition-colors text-xs sm:text-sm break-all"
        >
          Meter Service Calicut
        </a>
      ),
    },
  ];

  return (
    <div className="user-page-dots min-h-[50vh]">
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <header className="mb-5 motion-safe:animate-fade-in-up">
          <h1 className="font-display text-xl sm:text-2xl font-semibold tracking-tight">Contact</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">We're here to help</p>
        </header>

        <ul className="space-y-2.5">
          {rows.map((row, i) => {
            const Icon = row.icon;
            return (
              <li
                key={row.label}
                className="rounded-xl border border-border/80 bg-card/90 backdrop-blur-sm shadow-sm px-3 py-3 sm:px-4 sm:py-3.5 flex gap-3 transition-all duration-200 hover:border-primary/15 hover:shadow-soft opacity-0 motion-safe:animate-fade-in-up animate-fill-both"
                style={{ animationDelay: `${80 + i * 55}ms` }}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 pt-0.5">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-foreground/80 mb-1">{row.label}</p>
                  {row.content}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
