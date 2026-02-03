import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Gauge, Wrench, Package } from 'lucide-react';
import { fetchCategories } from '@/api/adminApi';
import type { Category } from '@/types';

const iconMap: Record<string, typeof Gauge> = {
  'Digital Meters': Gauge,
  'Meter Spares': Wrench,
  'Accessories': Package,
};

export function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };
    loadCategories();
  }, []);

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 w-full">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 md:mb-12">Shop by Category</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {categories.map((category) => {
          const Icon = iconMap[category.name] || Package;
          return (
            <Link key={category.id} to={`/shop?category=${encodeURIComponent(category.name)}`} className="group">
              <div className="bg-card border rounded-lg p-6 sm:p-8 text-center hover:shadow-lg transition-shadow h-full">
                <Icon className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 mx-auto mb-3 sm:mb-4 text-primary group-hover:scale-110 transition-transform" />
                <h3 className="text-lg sm:text-xl font-semibold mb-2">{category.name}</h3>
                <p className="text-sm sm:text-base text-muted-foreground">{category.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
