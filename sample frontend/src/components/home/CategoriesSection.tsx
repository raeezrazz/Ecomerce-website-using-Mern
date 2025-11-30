import { Link } from 'react-router-dom';
import { Gauge, Wrench, Package } from 'lucide-react';

const categories = [
  {
    to: '/shop?category=Digital Meters',
    icon: Gauge,
    title: 'Digital Meters',
    description: 'High-quality digital speedometers and odometers',
  },
  {
    to: '/shop?category=Meter Spares',
    icon: Wrench,
    title: 'Meter Spares',
    description: 'Replacement parts and components',
  },
  {
    to: '/shop?category=Accessories',
    icon: Package,
    title: 'Accessories',
    description: 'Tools and accessories for installation',
  },
];

export function CategoriesSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Link key={category.to} to={category.to} className="group">
              <div className="bg-card border rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
                <Icon className="h-16 w-16 mx-auto mb-4 text-primary group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                <p className="text-muted-foreground">{category.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
