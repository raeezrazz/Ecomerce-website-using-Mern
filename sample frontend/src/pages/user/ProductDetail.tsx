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
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12 md:py-16 text-center w-full">
        <p className="text-sm sm:text-base text-muted-foreground">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12 md:py-16 text-center w-full">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">Product not found</h1>
        <Link to="/shop">
          <Button className="text-sm sm:text-base">Back to Shop</Button>
        </Link>
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
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 w-full">
      <Link to="/shop" className="inline-flex items-center text-sm sm:text-base text-muted-foreground hover:text-primary mb-4 sm:mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Shop
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 mb-8 sm:mb-12 md:mb-16">
        <ProductImage src={product.images[0]} alt={product.name} />
        <ProductInfo
          product={product}
          quantity={quantity}
          onQuantityChange={setQuantity}
          onAddToCart={handleAddToCart}
        />
      </div>

      <RelatedProducts products={relatedProducts} />
    </div>
  );
}
