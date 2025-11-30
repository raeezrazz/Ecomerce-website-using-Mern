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
import type { UsedPart, WarehouseItem } from '@/types';
import { Card } from '@/components/ui/card';

interface UsedPartsProps {
  usedParts: UsedPart[];
  warehouseItems: WarehouseItem[];
  onPartsChange: (parts: UsedPart[]) => void;
}

export function UsedParts({ usedParts, warehouseItems, onPartsChange }: UsedPartsProps) {
  const addPart = () => {
    const newPart: UsedPart = {
      id: `part-${Date.now()}`,
      partName: '',
      quantity: 1,
      rate: 0,
      total: 0,
    };
    onPartsChange([...usedParts, newPart]);
  };

  const removePart = (id: string) => {
    onPartsChange(usedParts.filter(part => part.id !== id));
  };

  const updatePart = (id: string, updates: Partial<UsedPart>) => {
    const updated = usedParts.map(part => {
      if (part.id === id) {
        const updatedPart = { ...part, ...updates };
        // Auto-calculate total when quantity or rate changes
        if (updates.quantity !== undefined || updates.rate !== undefined) {
          updatedPart.total = (updatedPart.quantity || 0) * (updatedPart.rate || 0);
        }
        return updatedPart;
      }
      return part;
    });
    onPartsChange(updated);
  };

  const handlePartNameChange = (id: string, partName: string) => {
    // Find the warehouse item to get its rate
    const warehouseItem = warehouseItems.find(item => item.name === partName);
    if (warehouseItem) {
      updatePart(id, { partName, rate: warehouseItem.costPrice });
    } else {
      updatePart(id, { partName });
    }
  };

  const totalPartsCost = usedParts.reduce((sum, part) => sum + part.total, 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Used Spare Parts</Label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Total: ₹{totalPartsCost.toLocaleString()}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addPart}
            className="h-8"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Part
          </Button>
        </div>
      </div>

      {usedParts.length === 0 ? (
        <Card className="p-6 border-dashed text-center">
          <p className="text-sm text-muted-foreground mb-2">No parts added yet</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addPart}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add First Part
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {usedParts.map((part, index) => (
            <Card key={part.id} className="p-4">
              <div className="grid grid-cols-12 gap-3 items-end">
                <div className="col-span-5">
                  <Label htmlFor={`part-name-${part.id}`} className="text-xs">
                    Part Name *
                  </Label>
                  <Select
                    value={part.partName}
                    onValueChange={(value) => handlePartNameChange(part.id, value)}
                  >
                    <SelectTrigger id={`part-name-${part.id}`}>
                      <SelectValue placeholder="Select part" />
                    </SelectTrigger>
                    <SelectContent>
                      {warehouseItems
                        .filter(item => item.category === 'Meter Spares' || item.category === 'Accessories')
                        .map((item) => (
                          <SelectItem 
                            key={item.id} 
                            value={item.name}
                            disabled={item.currentStock === 0}
                          >
                            {item.name} {item.currentStock === 0 && '(Out of Stock)'}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-2">
                  <Label htmlFor={`part-qty-${part.id}`} className="text-xs">
                    Quantity *
                  </Label>
                  <Input
                    id={`part-qty-${part.id}`}
                    type="number"
                    min="1"
                    value={part.quantity}
                    onChange={(e) => {
                      const qty = parseInt(e.target.value) || 1;
                      const warehouseItem = warehouseItems.find(item => item.name === part.partName);
                      const maxQty = warehouseItem?.currentStock || 999;
                      updatePart(part.id, { quantity: Math.min(qty, maxQty) });
                    }}
                    placeholder="1"
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor={`part-rate-${part.id}`} className="text-xs">
                    Rate (₹) *
                  </Label>
                  <Input
                    id={`part-rate-${part.id}`}
                    type="number"
                    min="0"
                    step="0.01"
                    value={part.rate}
                    onChange={(e) => updatePart(part.id, { rate: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                  />
                </div>

                <div className="col-span-2">
                  <Label className="text-xs">Total</Label>
                  <div className="h-10 px-3 rounded-md border bg-muted flex items-center font-semibold">
                    ₹{part.total.toLocaleString()}
                  </div>
                </div>

                <div className="col-span-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removePart(part.id)}
                    className="h-10"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>

              {part.partName && (() => {
                const warehouseItem = warehouseItems.find(item => item.name === part.partName);
                if (warehouseItem && part.quantity > warehouseItem.currentStock) {
                  return (
                    <p className="text-xs text-destructive mt-2">
                      Available stock: {warehouseItem.currentStock} {warehouseItem.unit}
                    </p>
                  );
                }
                if (warehouseItem) {
                  return (
                    <p className="text-xs text-muted-foreground mt-2">
                      Available: {warehouseItem.currentStock} {warehouseItem.unit}
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

