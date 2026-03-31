import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import type { SaleItem, WarehouseItem } from '@/types';
import { Card } from '@/components/ui/card';

function warehouseRowId(item: WarehouseItem & { _id?: string }) {
  return String(item.id ?? item._id ?? '');
}

interface SaleLineItemsProps {
  saleItems: SaleItem[];
  warehouseItems: WarehouseItem[];
  onItemsChange: (items: SaleItem[]) => void;
}

export function SaleLineItems({ saleItems, warehouseItems, onItemsChange }: SaleLineItemsProps) {
  const addLine = () => {
    const line: SaleItem = {
      id: `sale-${Date.now()}`,
      warehouseItemId: '',
      itemName: '',
      quantity: 1,
      actualPrice: 0,
      sellingPrice: 0,
      total: 0,
    };
    onItemsChange([...saleItems, line]);
  };

  const removeLine = (id: string) => {
    onItemsChange(saleItems.filter((l) => l.id !== id));
  };

  const updateLine = (id: string, updates: Partial<SaleItem>) => {
    onItemsChange(
      saleItems.map((line) => {
        if (line.id !== id) return line;
        const next = { ...line, ...updates };
        next.total = (next.quantity || 0) * (next.sellingPrice || 0);
        return next;
      })
    );
  };

  const onProductSelect = (lineId: string, warehouseId: string) => {
    if (!warehouseId) {
      updateLine(lineId, {
        warehouseItemId: '',
        itemName: '',
        actualPrice: 0,
        sellingPrice: 0,
      });
      return;
    }
    const w = warehouseItems.find((it) => warehouseRowId(it as WarehouseItem & { _id?: string }) === warehouseId);
    if (!w) return;
    const cost = w.costPrice ?? 0;
    const sell = w.sellingPrice ?? 0;
    const line = saleItems.find((l) => l.id === lineId);
    const qty = line?.quantity ?? 1;
    onItemsChange(
      saleItems.map((l) =>
        l.id === lineId
          ? {
              ...l,
              warehouseItemId: warehouseId,
              itemName: w.name,
              actualPrice: cost,
              sellingPrice: sell,
              total: qty * sell,
            }
          : l
      )
    );
  };

  const lineSubtotal = saleItems.reduce((sum, l) => sum + l.total, 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Products sold</Label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Lines total: ₹{lineSubtotal.toLocaleString()}
          </span>
          <Button type="button" variant="outline" size="sm" className="h-8" onClick={addLine}>
            <Plus className="h-4 w-4 mr-1" />
            Add product
          </Button>
        </div>
      </div>

      {saleItems.length === 0 ? (
        <Card className="p-6 border-dashed text-center">
          <p className="text-sm text-muted-foreground mb-2">No products added yet</p>
          <Button type="button" variant="outline" size="sm" onClick={addLine}>
            <Plus className="h-4 w-4 mr-1" />
            Add first product
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {saleItems.map((line) => (
            <Card key={line.id} className="p-4">
              <div className="grid grid-cols-12 gap-3 items-end">
                <div className="col-span-12 sm:col-span-5">
                  <Label className="text-xs">Product *</Label>
                  <Select
                    value={line.warehouseItemId || ''}
                    onValueChange={(v) => onProductSelect(line.id, v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select warehouse product" />
                    </SelectTrigger>
                    <SelectContent>
                      {warehouseItems.map((item) => {
                        const wid = warehouseRowId(item as WarehouseItem & { _id?: string });
                        return (
                          <SelectItem
                            key={wid}
                            value={wid}
                            disabled={!wid || item.currentStock === 0}
                          >
                            {item.name}
                            {item.currentStock === 0 ? ' (Out of stock)' : ` · ${item.currentStock} ${item.unit}`}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <Label className="text-xs">Qty *</Label>
                  <Input
                    type="number"
                    min="1"
                    value={line.quantity}
                    onChange={(e) => {
                      const qty = Math.max(1, parseInt(e.target.value, 10) || 1);
                      const w = warehouseItems.find(
                        (it) => warehouseRowId(it as WarehouseItem & { _id?: string }) === line.warehouseItemId
                      );
                      const maxQty = w?.currentStock ?? 9999;
                      updateLine(line.id, { quantity: Math.min(qty, maxQty) });
                    }}
                  />
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <Label className="text-xs">Unit price (₹) *</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={line.sellingPrice}
                    onChange={(e) =>
                      updateLine(line.id, { sellingPrice: parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
                <div className="col-span-3 sm:col-span-2">
                  <Label className="text-xs">Line total</Label>
                  <div className="h-10 px-3 rounded-md border bg-muted flex items-center font-semibold text-sm">
                    ₹{line.total.toLocaleString()}
                  </div>
                </div>
                <div className="col-span-1 flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-10"
                    onClick={() => removeLine(line.id)}
                    aria-label="Remove line"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
              {line.warehouseItemId && (() => {
                const w = warehouseItems.find(
                  (it) => warehouseRowId(it as WarehouseItem & { _id?: string }) === line.warehouseItemId
                );
                if (w && line.quantity > w.currentStock) {
                  return (
                    <p className="text-xs text-destructive mt-2">
                      Available stock: {w.currentStock} {w.unit}
                    </p>
                  );
                }
                if (w) {
                  return (
                    <p className="text-xs text-muted-foreground mt-2">
                      Cost ₹{w.costPrice} · Available {w.currentStock} {w.unit}
                    </p>
                  );
                }
                return null;
              })()}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
