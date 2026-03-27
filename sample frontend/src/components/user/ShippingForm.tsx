import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ShippingFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

interface ShippingFormProps {
  formData: ShippingFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ShippingForm({ formData, onChange }: ShippingFormProps) {
  return (
    <Card className="p-4 sm:p-5 rounded-xl border border-border/80 bg-card/95 shadow-soft">
      <h2 className="text-sm font-semibold mb-4 tracking-tight">Shipping</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="md:col-span-2 space-y-1.5">
          <Label htmlFor="fullName" className="text-xs">
            Full name *
          </Label>
          <Input
            id="fullName"
            name="fullName"
            required
            value={formData.fullName}
            onChange={onChange}
            className="h-9 rounded-lg text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs">
            Email *
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={onChange}
            className="h-9 rounded-lg text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone" className="text-xs">
            Phone *
          </Label>
          <Input
            id="phone"
            name="phone"
            required
            value={formData.phone}
            onChange={onChange}
            className="h-9 rounded-lg text-sm"
          />
        </div>

        <div className="md:col-span-2 space-y-1.5">
          <Label htmlFor="address" className="text-xs">
            Address *
          </Label>
          <Input
            id="address"
            name="address"
            required
            value={formData.address}
            onChange={onChange}
            className="h-9 rounded-lg text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="city" className="text-xs">
            City *
          </Label>
          <Input
            id="city"
            name="city"
            required
            value={formData.city}
            onChange={onChange}
            className="h-9 rounded-lg text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="state" className="text-xs">
            State *
          </Label>
          <Input
            id="state"
            name="state"
            required
            value={formData.state}
            onChange={onChange}
            className="h-9 rounded-lg text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="pincode" className="text-xs">
            Pincode *
          </Label>
          <Input
            id="pincode"
            name="pincode"
            required
            value={formData.pincode}
            onChange={onChange}
            className="h-9 rounded-lg text-sm"
          />
        </div>
      </div>
    </Card>
  );
}
