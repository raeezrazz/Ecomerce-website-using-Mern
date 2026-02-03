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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 text-center">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div key={feature.title}>
              <div className="bg-primary/10 rounded-full w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Icon className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm sm:text-base text-muted-foreground">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
