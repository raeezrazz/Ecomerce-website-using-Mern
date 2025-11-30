import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { mockOrders } from '@/data/mockData';
import { ProfileForm } from '@/components/user/ProfileForm';
import { OrderHistory } from '@/components/user/OrderHistory';

export default function Profile() {
  const { toast } = useToast();
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+91-9876543210',
    address: '123 Main Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
  });

  const userOrders = mockOrders.slice(0, 10);

  const handleSave = () => {
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved successfully.",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold mb-8">My Account</h1>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="orders">My Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileForm profile={profile} onProfileChange={setProfile} onSave={handleSave} />
        </TabsContent>

        <TabsContent value="orders">
          <OrderHistory orders={userOrders} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
