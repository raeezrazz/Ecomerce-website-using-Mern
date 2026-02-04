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
    description: 'Technical assistance when you need it',
  },
  {
    icon: Gauge,
    title: 'Quality Products',
    description: 'Tested and reliable parts',
  },
];

export function FeaturesSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 md:py-20 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10 stagger-children">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              className="text-center group"
            >
              <div className="inline-flex h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem] items-center justify-center rounded-2xl bg-primary/10 text-primary mb-5 group-hover:scale-105 group-hover:bg-primary/15 transition-all duration-300">
                <Icon className="h-8 w-8 sm:h-9 sm:w-9" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm sm:text-base text-muted-foreground max-w-xs mx-auto">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
