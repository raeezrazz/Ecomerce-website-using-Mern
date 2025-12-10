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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 md:mb-8">My Account</h1>

      <Tabs defaultValue="profile" className="space-y-4 sm:space-y-6">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="profile" className="flex-1 sm:flex-none text-sm sm:text-base">Profile</TabsTrigger>
          <TabsTrigger value="orders" className="flex-1 sm:flex-none text-sm sm:text-base">My Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileForm profile={profile} onProfileChange={setProfile} onSave={handleSave} saving={saving} />
        </TabsContent>

        <TabsContent value="orders">
          {userOrders.length > 0 ? (
            <OrderHistory orders={userOrders} />
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground text-sm sm:text-base">
                No orders found
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
