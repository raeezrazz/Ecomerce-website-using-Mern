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
    <Card className="rounded-xl border border-border/80 bg-card/95 shadow-soft p-4 sm:p-5 transition-shadow hover:shadow-md">
      <h2 className="text-sm font-semibold mb-4 text-foreground tracking-tight">Your details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-xs">
            Full name
          </Label>
          <Input
            id="name"
            value={profile.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="h-9 rounded-lg text-sm border-border/80"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={profile.email}
            disabled
            className="h-9 rounded-lg bg-muted/80 cursor-not-allowed text-sm border-border/80"
          />
          <p className="text-[10px] text-muted-foreground">Cannot be changed</p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone" className="text-xs">
            Phone
          </Label>
          <Input
            id="phone"
            value={profile.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="h-9 rounded-lg text-sm border-border/80"
          />
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="address" className="text-xs">
            Address
          </Label>
          <Input
            id="address"
            value={profile.address}
            onChange={(e) => handleChange('address', e.target.value)}
            className="h-9 rounded-lg text-sm border-border/80"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="city" className="text-xs">
            City
          </Label>
          <Input
            id="city"
            value={profile.city}
            onChange={(e) => handleChange('city', e.target.value)}
            className="h-9 rounded-lg text-sm border-border/80"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="state" className="text-xs">
            State
          </Label>
          <Input
            id="state"
            value={profile.state}
            onChange={(e) => handleChange('state', e.target.value)}
            className="h-9 rounded-lg text-sm border-border/80"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="pincode" className="text-xs">
            Pincode
          </Label>
          <Input
            id="pincode"
            value={profile.pincode}
            onChange={(e) => handleChange('pincode', e.target.value)}
            className="h-9 rounded-lg text-sm border-border/80"
          />
        </div>
      </div>

      <Button
        onClick={onSave}
        disabled={saving}
        className="rounded-lg h-9 px-5 text-sm w-full sm:w-auto transition-all hover:scale-[1.01] active:scale-[0.99]"
      >
        {saving ? 'Saving...' : 'Save'}
      </Button>
    </Card>
  );
}
