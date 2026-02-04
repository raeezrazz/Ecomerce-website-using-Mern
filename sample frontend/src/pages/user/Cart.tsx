import { useCart } from '@/contexts/CartContext';
import { EmptyCart } from '@/components/user/EmptyCart';
import { CartItem } from '@/components/user/CartItem';
import { CartSummary } from '@/components/user/CartSummary';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

  if (cart.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">Shopping Cart</h1>
      <p className="text-muted-foreground mb-6 sm:mb-8">{cartCount} item{cartCount !== 1 ? 's' : ''} in your cart</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-2 space-y-3 sm:space-y-4">
          {cart.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onRemove={removeFromCart}
              onUpdateQuantity={updateQuantity}
            />
          ))}
        </div>

        <div className="lg:sticky lg:top-20 lg:self-start">
          <CartSummary itemCount={cartCount} total={cartTotal} />
        </div>
      </div>
    </div>
  );
}
