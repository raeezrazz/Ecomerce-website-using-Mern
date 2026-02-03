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
import type { Category } from '@/types';

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingCategory: Category | null;
  formData: {
    name: string;
    description: string;
  };
  errors: {
    name?: string;
    description?: string;
  };
  onFormDataChange: (data: Partial<CategoryDialogProps['formData']>) => void;
  onSubmit: () => void;
  loading?: boolean;
}

export function CategoryDialog({
  open,
  onOpenChange,
  editingCategory,
  formData,
  onFormDataChange,
  onSubmit,
  errors,
  loading = false,
}: CategoryDialogProps) {
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !loading) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
          <DialogDescription>
            {editingCategory ? 'Update category details below.' : 'Enter category details to add.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="category-name">Category Name *</Label>
            <Input
              id="category-name"
              value={formData.name}
              onChange={(e) => onFormDataChange({ name: e.target.value })}
              placeholder="Digital Meters"
              className={errors.name ? "border-red-500" : ""}
              disabled={loading}
              autoFocus
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category-description">Description *</Label>
            <Textarea
              id="category-description"
              value={formData.description}
              onChange={(e) => onFormDataChange({ description: e.target.value })}
              placeholder="High-quality digital speedometers and odometers"
              rows={3}
              className={errors.description ? "border-red-500" : ""}
              disabled={loading}
            />
            {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
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
          <Button 
            onClick={onSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="mr-2">Processing...</span>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </>
            ) : (
              editingCategory ? 'Update Category' : 'Add Category'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
