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
    pendingImageFiles: File[];
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
  loading?: boolean;
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
  loading = false,
}: ProductDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(open) => !loading && onOpenChange(open)}>
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
              disabled={loading}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(v) => onFormDataChange({ category: v })}
            >
              <SelectTrigger className={errors.category ? "border-red-500" : ""} disabled={loading}>
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
              disabled={loading}
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
                disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
          </div>
          <div className="grid gap-2">
            <PhotoUpload
              photos={formData.images || []}
              pendingFiles={formData.pendingImageFiles || []}
              maxPhotos={10}
              onPhotosChange={(images) => onFormDataChange({ images })}
              onPendingFilesChange={(files) => onFormDataChange({ pendingImageFiles: files })}
              disabled={loading}
            />
            {errors.images && <p className="text-sm text-red-500">{errors.images}</p>}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={loading}>
            {loading ? (
              <>
                <span className="mr-2">Saving...</span>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden>
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </>
            ) : (
              editingProduct ? 'Update Product' : 'Add Product'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
