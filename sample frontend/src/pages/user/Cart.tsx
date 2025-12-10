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
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 md:mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
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
