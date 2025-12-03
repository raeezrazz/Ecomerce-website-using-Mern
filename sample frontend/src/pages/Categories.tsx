import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '@/api/adminApi';
import type { Category } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { CategoryCard } from '@/components/admin/CategoryCard';
import { CategoryDialog } from '@/components/admin/CategoryDialog';

export default function Categories() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load categories. Please try again.',
          variant: 'destructive',
        });
      }
    };
    loadCategories();
  }, []);

  const handleOpenDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        description: '',
      });
    }

    setErrors({}); // Clear errors when opening dialog
    setDialogOpen(true);
  };

  const handleFormDataChange = (updates: Partial<typeof formData>) => {
    setFormData({ ...formData, ...updates });
    // Clear errors for fields being updated
    if (Object.keys(updates).length > 0) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        Object.keys(updates).forEach((key) => {
          delete newErrors[key as keyof typeof newErrors];
        });
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: { name?: string; description?: string } = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Category name must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const categoryData = {
        name: formData.name,
        description: formData.description,
      };

      if (editingCategory) {
        await updateCategory(editingCategory.id, categoryData);
        toast({
          title: 'Category Updated',
          description: `${formData.name} has been updated successfully.`,
        });
      } else {
        await createCategory(categoryData);
        toast({
          title: 'Category Created',
          description: `${formData.name} has been created successfully.`,
        });
      }

      // Refresh categories list
      const updatedCategories = await fetchCategories();
      setCategories(updatedCategories);
      setDialogOpen(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to save category. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id);
      toast({
        title: 'Category Deleted',
        description: 'Category has been deleted successfully.',
      });
      // Refresh categories list
      const updatedCategories = await fetchCategories();
      setCategories(updatedCategories);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to delete category. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
            <p className="text-muted-foreground">Manage product categories</p>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onEdit={handleOpenDialog}
              onDelete={handleDelete}
            />
          ))}
        </div>

        <CategoryDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          editingCategory={editingCategory}
          formData={formData}
          onFormDataChange={handleFormDataChange}
          onSubmit={handleSubmit}
          errors={errors}
        />
      </div>
    </DashboardLayout>
  );
}
