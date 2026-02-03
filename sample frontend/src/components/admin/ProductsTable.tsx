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
import { Edit2, Trash2, Package } from 'lucide-react';
import type { Product } from '@/types';

interface ProductsTableProps {
  products: Product[];
  onEditProduct: (product: Product) => void;
  onDeleteProduct?: (product: Product) => void;
}

export function ProductsTable({ products, onEditProduct, onDeleteProduct }: ProductsTableProps) {
  const getStockBadge = (stock: number) => {
    if (stock === 0) return <Badge variant="destructive">Out of Stock</Badge>;
    if (stock < 10) return <Badge variant="secondary">Low Stock</Badge>;
    return <Badge variant="default">In Stock</Badge>;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                    <Package className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <span className="font-medium">{product.name}</span>
                </div>
              </TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  {product.offerPrice && product.offerPrice > 0 && product.actualPrice ? (
                    <>
                      <span className="font-semibold text-primary">₹{product.offerPrice.toLocaleString()}</span>
                      <span className="text-xs text-muted-foreground line-through">₹{(product.actualPrice || product.price || 0).toLocaleString()}</span>
                    </>
                  ) : (
                    <span className="font-semibold">₹{(product.actualPrice || product.price || 0).toLocaleString()}</span>
                  )}
                </div>
              </TableCell>
              <TableCell>{getStockBadge(product.stock)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEditProduct(product)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  {onDeleteProduct && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteProduct(product)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
