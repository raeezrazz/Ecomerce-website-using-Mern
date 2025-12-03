import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '@/api/adminApi';
import type { Product } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { ProductFilters } from '@/components/admin/ProductFilters';
import { ProductsTable } from '@/components/admin/ProductsTable';
import { ProductDialog } from '@/components/admin/ProductDialog';
import { Pagination } from '@/components/shared/Pagination';

export default function Products() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const itemsPerPage = 15;

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Digital Meters' as Product['category'],
    price: '',
    stock: '',
    description: '',
    images: [] as string[],
  });
  const [errors, setErrors] = useState<{
    name?: string;
    sku?: string;
    category?: string;
    price?: string;
    stock?: string;
    description?: string;
    images?: string;
  }>({});

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load products. Please try again.',
          variant: 'destructive',
        });
      }
    };
    loadProducts();
  }, []);

  useEffect(() => {
    let filtered = products;
    
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.sku.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((product) => product.category === categoryFilter);
    }
    
    setFilteredProducts(filtered);
    setPage(1);
  }, [searchTerm, categoryFilter, products]);

  const paginatedProducts = filteredProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        sku: product.sku,
        category: product.category,
        price: product.price.toString(),
        stock: product.stock.toString(),
        description: product.description,
        images: product.images || [],
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        sku: '',
        category: 'Digital Meters',
        price: '',
        stock: '',
        description: '',
        images: [],
      });
    }
    setErrors({});
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
    const newErrors: typeof errors = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.price) newErrors.price = 'Price is required';
    else if (parseFloat(formData.price) <= 0) newErrors.price = 'Price must be greater than 0';
    if (!formData.stock) newErrors.stock = 'Stock is required';
    else if (parseInt(formData.stock) < 0) newErrors.stock = 'Stock cannot be negative';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`Are you sure you want to delete ${product.name}?`)) {
      return;
    }

    try {
      await deleteProduct(product.id);
      toast({
        title: 'Product Deleted',
        description: `${product.name} has been deleted successfully.`,
      });
      // Refresh products list
      const updatedProducts = await fetchProducts();
      setProducts(updatedProducts);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to delete product. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const productData = {
        name: formData.name,
        sku: formData.sku,
        category: formData.category,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        description: formData.description,
        images: formData.images || [],
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        toast({
          title: 'Product Updated',
          description: `${formData.name} has been updated successfully.`,
        });
      } else {
        await createProduct(productData);
        toast({
          title: 'Product Created',
          description: `${formData.name} has been created successfully.`,
        });
      }

      // Refresh products list
      const updatedProducts = await fetchProducts();
      setProducts(updatedProducts);
      setDialogOpen(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to save product. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Products</h1>
            <p className="text-muted-foreground">Manage your product inventory</p>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Products ({filteredProducts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              categoryFilter={categoryFilter}
              onCategoryFilterChange={setCategoryFilter}
            />
            <ProductsTable 
              products={paginatedProducts} 
              onEditProduct={handleOpenDialog}
              onDeleteProduct={handleDelete}
            />
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              totalItems={filteredProducts.length}
              onPageChange={setPage}
            />
          </CardContent>
        </Card>

        <ProductDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          editingProduct={editingProduct}
          formData={formData}
          onFormDataChange={handleFormDataChange}
          onSubmit={handleSubmit}
          errors={errors}
        />
      </div>
    </DashboardLayout>
  );
}
