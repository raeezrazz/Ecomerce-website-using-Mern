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

  if (categories.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 md:py-20 w-full">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 animate-fade-in-up">Shop by Category</h2>
      <p className="text-muted-foreground text-center mb-10 sm:mb-12 max-w-xl mx-auto animate-fade-in-up" style={{ animationDelay: '80ms' }}>
        Find the right parts for your vehicle
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 stagger-children">
        {categories.map((category) => {
          const Icon = iconMap[category.name] || Package;
          return (
            <Link
              key={category.id}
              to={`/shop?category=${encodeURIComponent(category.name)}`}
              className="group block h-full"
            >
              <div className="relative h-full min-h-[200px] sm:min-h-[240px] rounded-2xl border border-border bg-card overflow-hidden shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primary/20 hover:-translate-y-1">
                {/* Thumbnail fills entire card */}
                <div className="absolute inset-0">
                  {category.thumbnail ? (
                    <img
                      src={category.thumbnail}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        const el = e.target as HTMLImageElement;
                        el.style.display = 'none';
                        el.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`absolute inset-0 bg-gradient-to-br from-primary/90 to-primary ${category.thumbnail ? 'hidden' : ''} flex items-center justify-center`}>
                    <Icon className="h-16 w-16 sm:h-20 sm:w-20 text-primary-foreground/80" />
                  </div>
                </div>
                {/* Gradient overlay so text is readable */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                {/* Text overlay at bottom */}
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 text-left">
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-1 drop-shadow-sm">{category.name}</h3>
                  <p className="text-sm text-white/90 line-clamp-2">{category.description}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
