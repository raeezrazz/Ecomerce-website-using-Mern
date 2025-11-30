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
    setDialogOpen(true);
  };

  const handleFormDataChange = (updates: Partial<typeof formData>) => {
    setFormData({ ...formData, ...updates });
  };

  const handleSubmit = async () => {
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
        />
      </div>
    </DashboardLayout>
  );
}
