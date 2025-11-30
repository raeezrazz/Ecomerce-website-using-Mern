import { Package, Wrench, Gauge } from 'lucide-react';

const features = [
  {
    icon: Package,
    title: 'Fast Shipping',
    description: 'Quick delivery across India',
  },
  {
    icon: Wrench,
    title: 'Expert Support',
    description: 'Technical assistance available',
  },
  {
    icon: Gauge,
    title: 'Quality Products',
    description: 'Tested and reliable meters',
  },
];

export function FeaturesSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div key={feature.title}>
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
