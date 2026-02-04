import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit2, Trash2, FolderTree, Package } from 'lucide-react';
import type { Category } from '@/types';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
  const productCount = category.productCount || 0;
  const hasProducts = productCount > 0;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className={cn(
              "flex h-12 w-12 items-center justify-center rounded-xl overflow-hidden flex-shrink-0 bg-muted",
              hasProducts && !category.thumbnail && "bg-primary/10"
            )}>
              {category.thumbnail ? (
                <img src={category.thumbnail} alt="" className="h-full w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden'); }} />
              ) : null}
              <span className={cn(
                "flex items-center justify-center h-full w-full",
                category.thumbnail ? "hidden" : ""
              )}>
                <FolderTree className={cn(
                  "h-6 w-6",
                  hasProducts ? "text-primary" : "text-muted-foreground"
                )} />
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold truncate">{category.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge 
                  variant={hasProducts ? "default" : "secondary"}
                  className="text-xs"
                >
                  <Package className="h-3 w-3 mr-1" />
                  {productCount} {productCount === 1 ? 'product' : 'products'}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 min-h-[2.5rem]">
          {category.description || 'No description provided'}
        </p>
        <div className="flex items-center justify-end gap-2 pt-2 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(category)}
            className="h-8"
          >
            <Edit2 className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(category)}
            className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
