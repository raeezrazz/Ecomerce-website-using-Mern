import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { ShippingForm } from '@/components/user/ShippingForm';
import { OrderSummary } from '@/components/user/OrderSummary';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const { userInfo } = useSelector((state: RootState) => state.user);
  
  // Check if user is authenticated
  useEffect(() => {
    const userToken = localStorage.getItem('userToken');
    const accessToken = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('userData');
    const authToken = localStorage.getItem('authToken'); // Admin token
    
    // If admin token exists, redirect
    if (authToken) {
      navigate('/admin');
      return;
    }
    
    // If no user token and no userInfo, redirect to auth
    if (!userToken && !accessToken && !userData && !userInfo) {
      navigate('/auth');
    }
  }, [navigate, userInfo]);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Order placed successfully!",
      description: "Your order has been received and will be processed soon.",
    });
    
    clearCart();
    navigate('/profile');
  };

  return (
    <div className="user-page-dots min-h-[50vh]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full">
        <header className="mb-5 motion-safe:animate-fade-in-up">
          <h1 className="font-display text-xl sm:text-2xl font-semibold tracking-tight">Checkout</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Shipping details and review</p>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
            <div className="lg:col-span-2 motion-safe:animate-fade-in-up motion-safe:animate-delay-100 motion-safe:animate-fill-both">
              <ShippingForm formData={formData} onChange={handleChange} />
            </div>

            <div className="lg:sticky lg:top-20 lg:self-start motion-safe:animate-fade-in-up motion-safe:animate-delay-150 motion-safe:animate-fill-both">
              <OrderSummary items={cart} total={cartTotal} showPlaceOrder={true} />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
