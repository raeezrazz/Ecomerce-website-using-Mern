import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { PhotoUpload } from '@/components/admin/PhotoUpload';
import type { Product, Category } from '@/types';

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingProduct: Product | null;
  formData: {
    name: string;
    category: string;
    actualPrice: string;
    offerPrice: string;
    stock: string;
    description: string;
    images: string[];
  };
  errors: {
    name?: string;
    category?: string;
    actualPrice?: string;
    offerPrice?: string;
    stock?: string;
    description?: string;
    images?: string;
  };
  categories: Category[];
  onFormDataChange: (data: Partial<ProductDialogProps['formData']>) => void;
  onSubmit: () => void;
}

export function ProductDialog({
  open,
  onOpenChange,
  editingProduct,
  formData,
  onFormDataChange,
  onSubmit,
  errors,
  categories,
}: ProductDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto scrollbar-hide">
        <DialogHeader>
          <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          <DialogDescription>
            {editingProduct ? 'Update product details below.' : 'Enter product details to add to inventory.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => onFormDataChange({ name: e.target.value })}
              placeholder="LCD Digital Speedometer"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(v) => onFormDataChange({ category: v })}
            >
              <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="" disabled>No categories available. Please add categories first.</SelectItem>
                )}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="actualPrice">Actual Price (₹) *</Label>
              <Input
                id="actualPrice"
                type="number"
                step="0.01"
                value={formData.actualPrice}
                onChange={(e) => onFormDataChange({ actualPrice: e.target.value })}
                placeholder="2500"
                className={errors.actualPrice ? "border-red-500" : ""}
              />
              {errors.actualPrice && <p className="text-sm text-red-500">{errors.actualPrice}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="offerPrice">Offer Price (₹)</Label>
              <Input
                id="offerPrice"
                type="number"
                step="0.01"
                value={formData.offerPrice}
                onChange={(e) => onFormDataChange({ offerPrice: e.target.value })}
                placeholder="2000 (optional)"
                className={errors.offerPrice ? "border-red-500" : ""}
              />
              {errors.offerPrice && <p className="text-sm text-red-500">{errors.offerPrice}</p>}
              {formData.offerPrice && parseFloat(formData.offerPrice) > 0 && formData.actualPrice && (
                <p className="text-xs text-muted-foreground">
                  Discount: ₹{(parseFloat(formData.actualPrice) - parseFloat(formData.offerPrice)).toLocaleString()}
                </p>
              )}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="stock">Stock *</Label>
            <Input
              id="stock"
              type="number"
              value={formData.stock}
              onChange={(e) => onFormDataChange({ stock: e.target.value })}
              placeholder="50"
              className={errors.stock ? "border-red-500" : ""}
            />
            {errors.stock && <p className="text-sm text-red-500">{errors.stock}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => onFormDataChange({ description: e.target.value })}
              placeholder="High-quality digital speedometer with excellent durability..."
              rows={3}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
          </div>
          <div className="grid gap-2">
            <PhotoUpload
              photos={formData.images || []}
              maxPhotos={5}
              onPhotosChange={(images) => onFormDataChange({ images })}
            />
            {errors.images && <p className="text-sm text-red-500">{errors.images}</p>}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>
            {editingProduct ? 'Update Product' : 'Add Product'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
