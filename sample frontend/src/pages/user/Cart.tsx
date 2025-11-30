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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onRemove={removeFromCart}
              onUpdateQuantity={updateQuantity}
            />
          ))}
        </div>

        <div>
          <CartSummary itemCount={cartCount} total={cartTotal} />
        </div>
      </div>
    </div>
  );
}
