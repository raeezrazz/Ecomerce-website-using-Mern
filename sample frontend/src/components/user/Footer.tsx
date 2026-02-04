import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Youtube, MessageCircle, Gauge, ArrowRight } from 'lucide-react';

const quickLinks = [
  { to: '/shop', label: 'Shop' },
  { to: '/shop?category=Meter Spares', label: 'Spares' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact Us' },
];

const customerLinks = [
  { to: '/profile', label: 'My Account' },
  { to: '/cart', label: 'Cart' },
];

export function Footer() {
  return (
    <footer className="w-full mt-auto relative overflow-hidden bg-slate-900">
      {/* Dark gradient + subtle pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900 to-primary/95" />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top CTA strip */}
        <div className="border-b border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-amber-400">
                <Gauge className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-white">Need speedometer repair?</p>
                <p className="text-sm text-slate-400">Get a free consultation today</p>
              </div>
            </div>
            <a
              href="https://wa.me/919778599696"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#25D366]/20 hover:bg-[#20bd5a] hover:shadow-[#25D366]/30 hover:-translate-y-0.5 transition-all duration-200"
            >
              <MessageCircle className="h-5 w-5" />
              Chat on WhatsApp
            </a>
          </div>
        </div>

        {/* Main footer grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 py-12 md:py-14">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-4">
            <Link to="/" className="inline-block mb-4">
              <span className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
                RsMeters
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm mb-6">
              Your trusted partner for speedometer repair, calibration, and digital meter service. Quality parts and expert service for all vehicles.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/meter_repairing_calicut/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-slate-400 hover:bg-amber-500 hover:text-white transition-colors duration-200"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.youtube.com/@MeterServiceCalicut"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-slate-400 hover:bg-amber-500 hover:text-white transition-colors duration-200"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/90 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="group inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-amber-400 transition-colors duration-200"
                  >
                    {label}
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-amber-400" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/90 mb-4">
              Customer
            </h4>
            <ul className="space-y-3">
              {customerLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="group inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-amber-400 transition-colors duration-200"
                  >
                    {label}
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-amber-400" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="sm:col-span-2 lg:col-span-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/90 mb-4">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="tel:+919778599696"
                  className="group flex items-center gap-3 rounded-xl p-3 -m-3 text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-200">
                    <Phone className="h-4 w-4" />
                  </span>
                  <span className="font-medium">+91 9778599696</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:rsmeter1@gmail.com"
                  className="group flex items-center gap-3 rounded-xl p-3 -m-3 text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200 break-all"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-200">
                    <Mail className="h-4 w-4" />
                  </span>
                  <span className="font-medium">rsmeter1@gmail.com</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 rounded-xl p-3 -m-3 text-sm text-slate-400">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-amber-400 mt-0.5">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <span>
                    Rs Meter Service, Thottungal P.O, Ramanattukara, Kozhikode, Kerala - 673633
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs sm:text-sm text-slate-500">
              &copy; {new Date().getFullYear()} RsMeters. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-xs text-slate-500">
              <Link to="/about" className="hover:text-amber-400 transition-colors">About</Link>
              <Link to="/contact" className="hover:text-amber-400 transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
