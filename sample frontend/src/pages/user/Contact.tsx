import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, Instagram, Youtube } from 'lucide-react';

export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 sm:py-14 md:py-16">
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 animate-fade-in-up">Contact Us</h1>
      <p className="text-muted-foreground mb-8 animate-fade-in-up animate-delay-100 animate-fill-both opacity-0">Get in touch — we’re here to help</p>
      <Card className="rounded-2xl border shadow-sm overflow-hidden animate-fade-in-up animate-delay-200 animate-fill-both opacity-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Contact details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Phone className="h-5 w-5" />
            </span>
            <div>
              <p className="font-medium text-foreground">Phone</p>
              <a href="tel:+919778599696" className="text-muted-foreground hover:text-primary transition-colors">+91 9778599696</a>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Mail className="h-5 w-5" />
            </span>
            <div>
              <p className="font-medium text-foreground">Email</p>
              <a href="mailto:rsmeter1@gmail.com" className="text-muted-foreground hover:text-primary transition-colors break-all">rsmeter1@gmail.com</a>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <MapPin className="h-5 w-5" />
            </span>
            <div>
              <p className="font-medium text-foreground">Address</p>
              <p className="text-muted-foreground">
                Rs Meter Service,<br />
                Thottungal P.O,<br />
                Ramanattukara, Kozhikode,<br />
                Kerala, India - 673633
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Instagram className="h-5 w-5" />
            </span>
            <div>
              <p className="font-medium text-foreground">Instagram</p>
              <a href="https://www.instagram.com/meter_repairing_calicut/?hl=en" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors break-all">
                @meter_repairing_calicut
              </a>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Youtube className="h-5 w-5" />
            </span>
            <div>
              <p className="font-medium text-foreground">YouTube</p>
              <a href="https://www.youtube.com/@MeterServiceCalicut" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors break-all">
                Meter Service Calicut
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
