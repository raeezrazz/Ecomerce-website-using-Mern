import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

interface ProfileFormProps {
  profile: ProfileData;
  onProfileChange: (profile: ProfileData) => void;
  onSave: () => void;
  saving?: boolean;
}

export function ProfileForm({ profile, onProfileChange, onSave, saving = false }: ProfileFormProps) {
  const handleChange = (field: keyof ProfileData, value: string) => {
    onProfileChange({ ...profile, [field]: value });
  };

  return (
    <Card className="rounded-2xl border border-border bg-card shadow-soft p-4 sm:p-5 md:p-6 transition-shadow hover:shadow-soft-lg">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-foreground">Profile Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm sm:text-base">Full Name</Label>
          <Input
            id="name"
            value={profile.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="rounded-xl border-border/80 focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
          <Input
            id="email"
            type="email"
            value={profile.email}
            disabled
            className="rounded-xl bg-muted cursor-not-allowed border-border/80"
          />
          <p className="text-xs text-muted-foreground">Email cannot be changed</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm sm:text-base">Phone Number</Label>
          <Input
            id="phone"
            value={profile.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="rounded-xl border-border/80 focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address" className="text-sm sm:text-base">Address</Label>
          <Input
            id="address"
            value={profile.address}
            onChange={(e) => handleChange('address', e.target.value)}
            className="rounded-xl border-border/80 focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city" className="text-sm sm:text-base">City</Label>
          <Input
            id="city"
            value={profile.city}
            onChange={(e) => handleChange('city', e.target.value)}
            className="rounded-xl border-border/80 focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="state" className="text-sm sm:text-base">State</Label>
          <Input
            id="state"
            value={profile.state}
            onChange={(e) => handleChange('state', e.target.value)}
            className="rounded-xl border-border/80 focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="pincode" className="text-sm sm:text-base">Pincode</Label>
          <Input
            id="pincode"
            value={profile.pincode}
            onChange={(e) => handleChange('pincode', e.target.value)}
            className="rounded-xl border-border/80 focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <Button onClick={onSave} disabled={saving} className="rounded-xl shadow-soft text-sm sm:text-base w-full sm:w-auto hover:shadow-soft-lg transition-shadow">
        {saving ? 'Saving...' : 'Save Changes'}
      </Button>
    </Card>
  );
}
