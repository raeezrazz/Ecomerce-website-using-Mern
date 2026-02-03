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
import type { WarehouseItem, Category } from '@/types';

interface WarehouseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingItem: WarehouseItem | null;
  categories: Category[];
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
  loading?: boolean;
}

export function WarehouseDialog({
  open,
  onOpenChange,
  editingItem,
  categories,
  formData,
  errors,
  onFormDataChange,
  onSubmit,
  loading = false,
}: WarehouseDialogProps) {
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !loading) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
              >
                <SelectTrigger className={errors.category ? "border-red-500" : ""} disabled={loading}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.length === 0 ? (
                    <SelectItem value="" disabled>No categories available</SelectItem>
                  ) : (
                    categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))
                  )}
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
                disabled={loading}
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
                disabled={loading}
              />
              {errors.currentStock && <p className="text-sm text-red-500">{errors.currentStock}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="unit">Unit *</Label>
              <Select
                value={formData.unit}
                onValueChange={(v) => onFormDataChange({ unit: v })}
                disabled={loading}
              >
                <SelectTrigger className={errors.unit ? "border-red-500" : ""} disabled={loading}>
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
                disabled={loading}
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
                disabled={loading}
              />
              {errors.sellingPrice && <p className="text-sm text-red-500">{errors.sellingPrice}</p>}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={loading}>
            {loading ? (
              <>
                <span className="mr-2">Processing...</span>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </>
            ) : (
              editingItem ? 'Update Item' : 'Add Item'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
