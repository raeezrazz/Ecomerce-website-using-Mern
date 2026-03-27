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
    <div className="user-page-dots min-h-[50vh]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <header className="mb-5 motion-safe:animate-fade-in-up">
          <h1 className="font-display text-xl sm:text-2xl font-semibold tracking-tight">Cart</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {cartCount} item{cartCount !== 1 ? 's' : ''}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
          <div className="lg:col-span-2 space-y-2.5">
            {cart.map((item, i) => (
              <div
                key={item.id}
                className="opacity-0 motion-safe:animate-fade-in-up animate-fill-both"
                style={{ animationDelay: `${i * 45}ms` }}
              >
                <CartItem item={item} onRemove={removeFromCart} onUpdateQuantity={updateQuantity} />
              </div>
            ))}
          </div>

          <div className="lg:sticky lg:top-20 lg:self-start motion-safe:animate-fade-in-up motion-safe:animate-delay-200 motion-safe:animate-fill-both">
            <CartSummary itemCount={cartCount} total={cartTotal} />
          </div>
        </div>
      </div>
    </div>
  );
}
