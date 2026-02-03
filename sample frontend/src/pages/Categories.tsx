import { useEffect, useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Search, Filter, X, Loader2, FolderTree, Edit2, Trash2, Package } from 'lucide-react';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '@/api/adminApi';
import type { Category } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useFormDialog } from '@/contexts/FormDialogContext';
import { CategoryDialog } from '@/components/admin/CategoryDialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function Categories() {
  const { toast } = useToast();
  const { setFormOpen } = useFormDialog();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  
  // Filter and search states
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'products' | 'newest'>('name');

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load categories. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  const handleOpenDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name || '',
        description: category.description || '',
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        description: '',
      });
    }

    setErrors({}); // Clear errors when opening dialog
    setSubmitting(false); // Reset submitting state
    setFormOpen(true);
    setDialogOpen(true);
  };

  const handleCloseDialog = (open?: boolean) => {
    if (open === false || open === undefined) {
      setFormOpen(false);
      setDialogOpen(false);
      setEditingCategory(null);
      setFormData({
        name: '',
        description: '',
      });
      setErrors({});
      setSubmitting(false);
    }
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
    if (!validateForm()) {
      return;
    }

    if (submitting) {
      return; // Prevent double submission
    }

    setSubmitting(true);
    setErrors({});

    try {
      const categoryData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
      };

      if (editingCategory) {
        const categoryId = editingCategory.id || (editingCategory as any)._id;
        if (!categoryId) {
          toast({
            title: 'Error',
            description: 'Category ID is missing. Please try again.',
            variant: 'destructive',
          });
          return;
        }
        await updateCategory(categoryId, categoryData);
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
      
      // Reset form and close dialog
      setFormOpen(false);
      setDialogOpen(false);
      setEditingCategory(null);
      setFormData({
        name: '',
        description: '',
      });
      setErrors({});
    } catch (error: any) {
      console.error('Category save error:', error);
      
      // Extract error message
      let errorMessage = 'Failed to save category. Please try again.';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      // Set field-specific errors if available
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Filtered and sorted categories
  const filteredCategories = useMemo(() => {
    let filtered = [...categories];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (cat) =>
          cat.name.toLowerCase().includes(query) ||
          cat.description.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'products':
          return b.productCount - a.productCount;
        case 'newest':
          // Since we don't have createdAt in the type, we'll sort by name as fallback
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [categories, searchQuery, sortBy]);

  // Statistics
  const totalCategories = categories.length;

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;

    try {
      await deleteCategory(categoryToDelete.id);
      toast({
        title: 'Category Deleted',
        description: `${categoryToDelete.name} has been deleted successfully.`,
      });
      // Refresh categories list
      const updatedCategories = await fetchCategories();
      setCategories(updatedCategories);
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
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
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Categories</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Manage product categories and organize your inventory
            </p>
          </div>
          <Button onClick={() => handleOpenDialog()} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </div>

        {/* Statistics Card */}
        <Card className="p-3 sm:p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <FolderTree className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Categories</p>
              <p className="text-2xl sm:text-3xl font-bold">{totalCategories}</p>
            </div>
          </div>
        </Card>

        {/* Search and Filter Bar */}
        <Card className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search categories by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 sm:h-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={sortBy} onValueChange={(value: 'name' | 'products' | 'newest') => setSortBy(value)}>
                <SelectTrigger className="w-[180px] h-9 sm:h-10">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Sort by Name</SelectItem>
                  <SelectItem value="products">Sort by Products</SelectItem>
                  <SelectItem value="newest">Sort by Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery('')}
                className="h-9 sm:h-10"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          {searchQuery && (
            <div className="mt-3 pt-3 border-t">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{filteredCategories.length}</span> of{' '}
                <span className="font-semibold text-foreground">{categories.length}</span> categories
              </p>
            </div>
          )}
        </Card>

        {/* Categories Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Categories ({filteredCategories.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Products</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCategories.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground py-12">
                          <div className="flex flex-col items-center gap-3">
                            <FolderTree className="h-12 w-12 text-muted-foreground" />
                            <div>
                              <h3 className="text-lg font-semibold mb-1">
                                {searchQuery ? 'No categories found' : 'No categories yet'}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {searchQuery
                                  ? 'Try adjusting your search query'
                                  : 'Get started by creating your first category'}
                              </p>
                            </div>
                            {!searchQuery && (
                              <Button onClick={() => handleOpenDialog()} className="mt-2">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Category
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCategories.map((category) => (
                        <TableRow key={category.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                                <FolderTree className="h-4 w-4 text-primary" />
                              </div>
                              {category.name}
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm text-muted-foreground line-clamp-2 max-w-md">
                              {category.description || 'No description provided'}
                            </p>
                          </TableCell>
                          <TableCell>
                            <Badge variant={category.productCount > 0 ? "default" : "secondary"}>
                              <Package className="h-3 w-3 mr-1" />
                              {category.productCount || 0} {category.productCount === 1 ? 'product' : 'products'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenDialog(category)}
                                className="h-8"
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteClick(category)}
                                className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Category Dialog */}
        <CategoryDialog
          open={dialogOpen}
          onOpenChange={(open) => {
            if (!open && !submitting) {
              handleCloseDialog(open);
            }
          }}
          editingCategory={editingCategory}
          formData={formData}
          onFormDataChange={handleFormDataChange}
          onSubmit={handleSubmit}
          errors={errors}
          loading={submitting}
        />

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Category</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete <strong>{categoryToDelete?.name}</strong>? This action cannot be undone.
                {categoryToDelete && categoryToDelete.productCount > 0 && (
                  <span className="block mt-2 text-destructive">
                    Warning: This category has {categoryToDelete.productCount} product(s). Deleting it may affect those products.
                  </span>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setCategoryToDelete(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}
