import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { getUserProfile, updateUserProfile } from '@/api/userApi';
import { ProfileForm } from '@/components/user/ProfileForm';
import { OrderHistory } from '@/components/user/OrderHistory';
import { Loader2 } from 'lucide-react';
import type { Order } from '@/types';

export default function Profile() {
  type ApiError = { response?: { data?: { error?: string } } };
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [userOrders] = useState<Order[]>([]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const response = await getUserProfile();
        if (response.success && response.data) {
          setProfile({
            name: response.data.name || '',
            email: response.data.email || '',
            phone: response.data.phone || '',
            address: response.data.address || '',
            city: response.data.city || '',
            state: response.data.state || '',
            pincode: response.data.pincode || '',
          });
        }
      } catch (error: unknown) {
        const err = error as ApiError;
        toast({
          title: "Error",
          description: err?.response?.data?.error || "Failed to load profile",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [toast]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await updateUserProfile({
        name: profile.name,
        phone: profile.phone,
        address: profile.address,
        city: profile.city,
        state: profile.state,
        pincode: profile.pincode,
      });

      if (response.success) {
        toast({
          title: "Profile updated",
          description: "Your profile information has been saved successfully.",
        });
      }
    } catch (error: unknown) {
      const err = error as ApiError;
      toast({
        title: "Error",
        description: err?.response?.data?.error || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="user-page-dots min-h-[40vh]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 w-full">
          <div className="rounded-xl border border-border/80 bg-card/90 shadow-soft overflow-hidden motion-safe:animate-fade-in-up">
            <div className="flex items-center justify-center h-48">
              <Loader2 className="h-7 w-7 animate-spin text-primary" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-page-dots min-h-[50vh]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full">
        <header className="mb-5 motion-safe:animate-fade-in-up">
          <h1 className="font-display text-xl sm:text-2xl font-semibold text-foreground tracking-tight">Account</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Profile and orders</p>
        </header>

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="w-full sm:w-auto h-9 p-0.5 rounded-lg bg-muted/70 border border-border/80">
            <TabsTrigger
              value="profile"
              className="flex-1 sm:flex-none text-xs sm:text-sm rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200"
            >
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="flex-1 sm:flex-none text-xs sm:text-sm rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200"
            >
              Orders
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="motion-safe:animate-fade-in focus-visible:outline-none">
            <ProfileForm profile={profile} onProfileChange={setProfile} onSave={handleSave} saving={saving} />
          </TabsContent>

          <TabsContent value="orders" className="motion-safe:animate-fade-in focus-visible:outline-none">
            {userOrders.length > 0 ? (
              <OrderHistory orders={userOrders} />
            ) : (
              <div className="rounded-xl border border-dashed border-border/80 bg-muted/20 p-8 text-center motion-safe:animate-scale-in">
                <p className="text-muted-foreground text-xs sm:text-sm">No orders yet</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
