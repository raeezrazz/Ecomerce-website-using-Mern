import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProducts, fetchProduct } from '@/api/adminApi';
import type { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { ProductImage } from '@/components/user/ProductImage';
import { ProductInfo } from '@/components/user/ProductInfo';
import { RelatedProducts } from '@/components/user/RelatedProducts';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const productData = await fetchProduct(id!);
        setProduct(productData);
        
        // Load related products
        const allProducts = await fetchProducts();
        const related = allProducts
          .filter(p => p.category === productData.category && p.id !== productData.id)
          .slice(0, 4);
        setRelatedProducts(related);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load product. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      loadProduct();
    }
  }, [id, toast]);

  if (loading) {
    return (
      <div className="user-page-dots min-h-[50vh]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="animate-pulse space-y-5">
            <div className="h-4 w-28 bg-muted rounded-lg" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              <div className="aspect-square bg-muted rounded-xl max-w-md mx-auto lg:mx-0" />
              <div className="space-y-3">
                <div className="h-6 w-20 bg-muted rounded-lg" />
                <div className="h-8 w-full bg-muted rounded-lg" />
                <div className="h-10 w-36 bg-muted rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="user-page-dots min-h-[50vh] flex items-center">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 text-center w-full motion-safe:animate-fade-in-up">
          <h1 className="text-lg sm:text-xl font-semibold mb-3">Product not found</h1>
          <Link to="/shop">
            <Button size="sm" className="rounded-lg">Back to Shop</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast({
      title: "Added to cart",
      description: `${quantity} × ${product.name} added to your cart.`,
    });
  };

  return (
    <div className="user-page-dots min-h-[50vh]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Link
          to="/shop"
          className="group inline-flex items-center text-xs font-medium text-muted-foreground hover:text-primary mb-5 transition-colors motion-safe:animate-slide-in-left"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1.5 transition-transform group-hover:-translate-x-0.5" />
          Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-10 lg:mb-12 items-start">
          <div className="motion-safe:animate-fade-in-up lg:sticky lg:top-24">
            <ProductImage images={product.images || []} alt={product.name} />
          </div>
          <div
            className="min-w-0 opacity-0 motion-safe:animate-fade-in-up animate-fill-both"
            style={{ animationDelay: '80ms' }}
          >
            <ProductInfo
              product={product}
              quantity={quantity}
              onQuantityChange={setQuantity}
              onAddToCart={handleAddToCart}
            />
          </div>
        </div>

        <RelatedProducts products={relatedProducts} />
      </div>
    </div>
  );
}
