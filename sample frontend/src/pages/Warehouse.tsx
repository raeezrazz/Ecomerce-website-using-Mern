import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SearchInput } from '@/components/shared/SearchInput';
import type { WarehouseItem, Category } from '@/types';
import { fetchWarehouseItems, createWarehouseItem, updateWarehouseItem, deleteWarehouseItem, fetchCategories } from '@/api/adminApi';
import { WarehouseDialog } from '@/components/admin/WarehouseDialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFormDialog } from '@/contexts/FormDialogContext';

export default function Warehouse() {
  const { toast } = useToast();
  const { setFormOpen } = useFormDialog();
  const [items, setItems] = useState<WarehouseItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<WarehouseItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WarehouseItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    location: '',
    currentStock: '',
    unit: 'pcs',
    costPrice: '',
    sellingPrice: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [itemsData, categoriesData] = await Promise.all([
          fetchWarehouseItems(),
          fetchCategories()
        ]);
        setItems(itemsData);
        setCategories(categoriesData);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load warehouse data. Please try again.',
          variant: 'destructive',
        });
        // Fallback to localStorage if API fails
        const stored = localStorage.getItem('warehouseItems');
        if (stored) {
          setItems(JSON.parse(stored));
        }
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    let filtered = items;

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter((item) => item.category === categoryFilter);
    }

    setFilteredItems(filtered);
  }, [searchTerm, categoryFilter, items]);

  const handleOpenDialog = (item?: WarehouseItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        sku: item.sku,
        category: item.category,
        location: item.location || '',
        currentStock: item.currentStock.toString(),
        unit: item.unit,
        costPrice: item.costPrice.toString(),
        sellingPrice: item.sellingPrice.toString(),
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        sku: '',
        category: '',
        location: '',
        currentStock: '',
        unit: 'pcs',
        costPrice: '',
        sellingPrice: '',
      });
    }
    setErrors({});
    setFormOpen(true);
    setDialogOpen(true);
  };

  const handleFormDataChange = (updates: Partial<typeof formData>) => {
    setFormData({ ...formData, ...updates });
    if (Object.keys(updates).length > 0) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        Object.keys(updates).forEach((key) => delete newErrors[key]);
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.currentStock) newErrors.currentStock = 'Stock is required';
    else if (parseInt(formData.currentStock) < 0) newErrors.currentStock = 'Stock cannot be negative';
    if (!formData.unit) newErrors.unit = 'Unit is required';
    if (!formData.costPrice) newErrors.costPrice = 'Cost Price is required';
    else if (parseFloat(formData.costPrice) < 0) newErrors.costPrice = 'Price cannot be negative';
    if (!formData.sellingPrice) newErrors.sellingPrice = 'Selling Price is required';
    else if (parseFloat(formData.sellingPrice) < 0) newErrors.sellingPrice = 'Price cannot be negative';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (submitting) return; // Prevent double submission

    setSubmitting(true);
    try {
      // Validate and parse numeric fields
      const currentStock = parseInt(formData.currentStock);
      const costPrice = parseFloat(formData.costPrice);
      const sellingPrice = parseFloat(formData.sellingPrice);

      if (isNaN(currentStock) || currentStock < 0) {
        toast({
          title: 'Error',
          description: 'Current stock must be a valid number',
          variant: 'destructive',
        });
        return;
      }

      if (isNaN(costPrice) || costPrice < 0) {
        toast({
          title: 'Error',
          description: 'Cost price must be a valid number',
          variant: 'destructive',
        });
        return;
      }

      if (isNaN(sellingPrice) || sellingPrice < 0) {
        toast({
          title: 'Error',
          description: 'Selling price must be a valid number',
          variant: 'destructive',
        });
        return;
      }

      // Build clean item data object
      const itemData = {
        name: formData.name.trim(),
        sku: formData.sku.trim(),
        category: formData.category,
        location: formData.location.trim() || 'Main Warehouse',
        currentStock: currentStock,
        unit: formData.unit,
        costPrice: costPrice,
        sellingPrice: sellingPrice,
      };

      if (editingItem) {
        const itemId = editingItem.id || (editingItem as any)._id;
        if (!itemId) {
          toast({
            title: 'Error',
            description: 'Item ID is missing. Please try again.',
            variant: 'destructive',
          });
          return;
        }
        await updateWarehouseItem(itemId, itemData);
        toast({ title: 'Success', description: 'Item updated successfully' });
      } else {
        const createdItem = await createWarehouseItem(itemData);
        console.log('Created warehouse item:', createdItem);
        toast({ title: 'Success', description: 'Item created successfully' });
      }

      const updatedItems = await fetchWarehouseItems();
      setItems(updatedItems);
      
      // Reset form and close dialog
      setFormOpen(false);
      setDialogOpen(false);
      setEditingItem(null);
      setFormData({
        name: '',
        sku: '',
        category: '',
        location: '',
        currentStock: '',
        unit: 'pcs',
        costPrice: '',
        sellingPrice: '',
      });
      setErrors({});
    } catch (error: any) {
      console.error('Warehouse item save error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to save item';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await deleteWarehouseItem(id);
      toast({ title: 'Success', description: 'Item deleted successfully' });
      const updatedItems = await fetchWarehouseItems();
      setItems(updatedItems);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to delete item',
        variant: 'destructive',
      });
    }
  };

  const getStockBadge = (stock: number) => {
    if (stock === 0) return <Badge variant="destructive">Out of Stock</Badge>;
    if (stock < 10) return <Badge variant="secondary">Low Stock</Badge>;
    return <Badge variant="default">In Stock</Badge>;
  };

  const totalItems = filteredItems.length;
  const lowStockItems = filteredItems.filter(item => item.currentStock < 10).length;
  const outOfStockItems = filteredItems.filter(item => item.currentStock === 0).length;
  const totalValue = filteredItems.reduce((sum, item) => sum + (item.currentStock * item.costPrice), 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Warehouse</h1>
          <p className="text-muted-foreground">Manage inventory and stock levels</p>
        </div>
        <div className="flex justify-end">
           <Button onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalItems}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Low Stock Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{lowStockItems}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Out of Stock
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{outOfStockItems}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Inventory Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalValue.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Items ({filteredItems.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 mb-6 sm:flex-row">
              <SearchInput
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search by name, SKU, or location..."
              />
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Cost Price</TableHead>
                    <TableHead>Selling Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center text-muted-foreground">
                        No items found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.sku}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.category}</Badge>
                        </TableCell>
                        <TableCell>{item.location || 'N/A'}</TableCell>
                        <TableCell className="font-semibold">
                          {item.currentStock}
                        </TableCell>
                        <TableCell>{item.unit}</TableCell>
                        <TableCell>₹{item.costPrice.toLocaleString()}</TableCell>
                        <TableCell>₹{item.sellingPrice.toLocaleString()}</TableCell>
                        <TableCell>{getStockBadge(item.currentStock)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(item)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <WarehouseDialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setFormOpen(open);
            setDialogOpen(open);
          }}
          editingItem={editingItem}
          categories={categories}
          formData={formData}
          errors={errors}
          onFormDataChange={handleFormDataChange}
          onSubmit={handleSubmit}
          loading={submitting}
        />
      </div>
    </DashboardLayout>
  );
}
