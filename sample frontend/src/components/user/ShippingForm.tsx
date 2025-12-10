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
    <Card className="p-4 sm:p-5 md:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Shipping Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="fullName" className="text-sm sm:text-base">Full Name *</Label>
          <Input
            id="fullName"
            name="fullName"
            required
            value={formData.fullName}
            onChange={onChange}
            className="text-sm sm:text-base"
          />
        </div>

        <div>
          <Label htmlFor="email" className="text-sm sm:text-base">Email *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={onChange}
            className="text-sm sm:text-base"
          />
        </div>

        <div>
          <Label htmlFor="phone" className="text-sm sm:text-base">Phone Number *</Label>
          <Input
            id="phone"
            name="phone"
            required
            value={formData.phone}
            onChange={onChange}
            className="text-sm sm:text-base"
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="address" className="text-sm sm:text-base">Address *</Label>
          <Input
            id="address"
            name="address"
            required
            value={formData.address}
            onChange={onChange}
            className="text-sm sm:text-base"
          />
        </div>

        <div>
          <Label htmlFor="city" className="text-sm sm:text-base">City *</Label>
          <Input
            id="city"
            name="city"
            required
            value={formData.city}
            onChange={onChange}
            className="text-sm sm:text-base"
          />
        </div>

        <div>
          <Label htmlFor="state" className="text-sm sm:text-base">State *</Label>
          <Input
            id="state"
            name="state"
            required
            value={formData.state}
            onChange={onChange}
            className="text-sm sm:text-base"
          />
        </div>

        <div>
          <Label htmlFor="pincode" className="text-sm sm:text-base">Pincode *</Label>
          <Input
            id="pincode"
            name="pincode"
            required
            value={formData.pincode}
            onChange={onChange}
            className="text-sm sm:text-base"
          />
        </div>
      </div>
    </Card>
  );
}
