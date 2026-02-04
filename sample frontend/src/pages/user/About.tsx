import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 sm:py-14 md:py-16">
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 animate-fade-in-up">About Us</h1>
      <p className="text-muted-foreground mb-8 animate-fade-in-up animate-delay-100 animate-fill-both opacity-0">Learn more about RsMeters</p>
      <Card className="rounded-2xl border shadow-sm overflow-hidden animate-fade-in-up animate-delay-200 animate-fill-both opacity-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">RsMeters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 text-muted-foreground leading-relaxed">
          <p>
            We specialize in meter spares and related products to keep your equipment running smoothly.
          </p>
          <p>
            Our mission is to provide quality parts and reliable service to our customers. Browse our shop for meter spares and more.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
