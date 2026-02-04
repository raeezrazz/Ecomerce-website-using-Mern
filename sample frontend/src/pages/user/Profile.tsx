import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { getUserProfile, updateUserProfile } from '@/api/userApi';
import { ProfileForm } from '@/components/user/ProfileForm';
import { OrderHistory } from '@/components/user/OrderHistory';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function Profile() {
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
  const [userOrders, setUserOrders] = useState([]);

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
      } catch (error: any) {
        toast({
          title: "Error",
          description: error?.response?.data?.error || "Failed to load profile",
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
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.error || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 w-full">
        <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden animate-fade-in-up">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 w-full">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-foreground animate-fade-in-up">My Account</h1>
      <p className="text-muted-foreground mb-6 md:mb-8 animate-fade-in-up animate-delay-100">Manage your profile and orders</p>

      <Tabs defaultValue="profile" className="space-y-4 sm:space-y-6">
        <TabsList className="w-full sm:w-auto h-11 p-1 rounded-xl bg-muted/60 border border-border/80">
          <TabsTrigger value="profile" className="flex-1 sm:flex-none text-sm sm:text-base rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">Profile</TabsTrigger>
          <TabsTrigger value="orders" className="flex-1 sm:flex-none text-sm sm:text-base rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">My Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="animate-fade-in-up">
          <ProfileForm profile={profile} onProfileChange={setProfile} onSave={handleSave} saving={saving} />
        </TabsContent>

        <TabsContent value="orders" className="animate-fade-in-up">
          {userOrders.length > 0 ? (
            <OrderHistory orders={userOrders} />
          ) : (
            <div className="rounded-2xl border border-border bg-card shadow-soft p-8 text-center">
              <p className="text-muted-foreground text-sm sm:text-base">No orders found</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
