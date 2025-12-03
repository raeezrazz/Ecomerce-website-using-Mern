import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { WarehouseItem } from '@/types';

interface WarehouseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingItem: WarehouseItem | null;
  formData: {
    name: string;
    sku: string;
    category: string;
    location: string;
    currentStock: string;
    unit: string;
    costPrice: string;
    sellingPrice: string;
  };
  errors: {
    name?: string;
    sku?: string;
    category?: string;
    location?: string;
    currentStock?: string;
    unit?: string;
    costPrice?: string;
    sellingPrice?: string;
  };
  onFormDataChange: (data: Partial<WarehouseDialogProps['formData']>) => void;
  onSubmit: () => void;
}

export function WarehouseDialog({
  open,
  onOpenChange,
  editingItem,
  formData,
  errors,
  onFormDataChange,
  onSubmit,
}: WarehouseDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{editingItem ? 'Edit Warehouse Item' : 'Add New Item'}</DialogTitle>
          <DialogDescription>
            {editingItem ? 'Update inventory details below.' : 'Enter details for new inventory item.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Item Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => onFormDataChange({ name: e.target.value })}
                placeholder="Speedometer Cable"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sku">SKU *</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => onFormDataChange({ sku: e.target.value })}
                placeholder="CBL-001"
                className={errors.sku ? "border-red-500" : ""}
              />
              {errors.sku && <p className="text-sm text-red-500">{errors.sku}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(v) => onFormDataChange({ category: v })}
              >
                <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Digital Meters">Digital Meters</SelectItem>
                  <SelectItem value="Meter Spares">Meter Spares</SelectItem>
                  <SelectItem value="Accessories">Accessories</SelectItem>
                  <SelectItem value="Tools">Tools</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => onFormDataChange({ location: e.target.value })}
                placeholder="Shelf A-1"
                className={errors.location ? "border-red-500" : ""}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="currentStock">Current Stock *</Label>
              <Input
                id="currentStock"
                type="number"
                value={formData.currentStock}
                onChange={(e) => onFormDataChange({ currentStock: e.target.value })}
                placeholder="100"
                className={errors.currentStock ? "border-red-500" : ""}
              />
              {errors.currentStock && <p className="text-sm text-red-500">{errors.currentStock}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="unit">Unit *</Label>
              <Select
                value={formData.unit}
                onValueChange={(v) => onFormDataChange({ unit: v })}
              >
                <SelectTrigger className={errors.unit ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pcs">Pieces (pcs)</SelectItem>
                  <SelectItem value="set">Set</SelectItem>
                  <SelectItem value="kg">Kilogram (kg)</SelectItem>
                  <SelectItem value="mtr">Meter (mtr)</SelectItem>
                  <SelectItem value="box">Box</SelectItem>
                </SelectContent>
              </Select>
              {errors.unit && <p className="text-sm text-red-500">{errors.unit}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="costPrice">Cost Price (₹) *</Label>
              <Input
                id="costPrice"
                type="number"
                value={formData.costPrice}
                onChange={(e) => onFormDataChange({ costPrice: e.target.value })}
                placeholder="150"
                className={errors.costPrice ? "border-red-500" : ""}
              />
              {errors.costPrice && <p className="text-sm text-red-500">{errors.costPrice}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sellingPrice">Selling Price (₹) *</Label>
              <Input
                id="sellingPrice"
                type="number"
                value={formData.sellingPrice}
                onChange={(e) => onFormDataChange({ sellingPrice: e.target.value })}
                placeholder="250"
                className={errors.sellingPrice ? "border-red-500" : ""}
              />
              {errors.sellingPrice && <p className="text-sm text-red-500">{errors.sellingPrice}</p>}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>
            {editingItem ? 'Update Item' : 'Add Item'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
