import { useState } from 'react';
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
import { Plus, Trash2, Loader2 } from 'lucide-react';
import type { UsedPart, WarehouseItem } from '@/types';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const SPARE_CATEGORIES = ['Meter Spares', 'Accessories'] as const satisfies readonly WarehouseItem['category'][];

export type RegisterAdHocWarehousePartParams = {
  name: string;
  costPrice: number;
  category: (typeof SPARE_CATEGORIES)[number];
  /** Opening stock saved in warehouse (not forced to 0). */
  currentStock: number;
};

interface UsedPartsProps {
  usedParts: UsedPart[];
  warehouseItems: WarehouseItem[];
  onPartsChange: (parts: UsedPart[]) => void;
  /** Create warehouse row from tally flow; return true when created and list was refreshed. */
  onRegisterAdHocWarehousePart?: (params: RegisterAdHocWarehousePartParams) => Promise<boolean>;
}

function qtyCapForWarehouseName(partName: string, warehouseItems: WarehouseItem[]): number {
  const warehouseItem = warehouseItems.find((item) => item.name === partName);
  if (warehouseItem != null && warehouseItem.currentStock > 0) {
    return warehouseItem.currentStock;
  }
  return 999_999;
}

export function UsedParts({
  usedParts,
  warehouseItems,
  onPartsChange,
  onRegisterAdHocWarehousePart,
}: UsedPartsProps) {
  const { toast } = useToast();
  const [adHocForId, setAdHocForId] = useState<string | null>(null);
  const [adHocDraft, setAdHocDraft] = useState({
    name: '',
    cost: '',
    warehouseQty: '',
    category: 'Meter Spares' as (typeof SPARE_CATEGORIES)[number],
  });
  const [adHocSavingId, setAdHocSavingId] = useState<string | null>(null);
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
      const cap = qtyCapForWarehouseName(partName, warehouseItems);
      const part = usedParts.find((p) => p.id === id);
      const nextQty = part ? Math.min(part.quantity, cap) : 1;
      updatePart(id, { partName, rate: warehouseItem.costPrice, quantity: nextQty });
    } else {
      updatePart(id, { partName });
    }
  };

  const openAdHoc = (lineId: string) => {
    if (adHocForId === lineId) {
      setAdHocForId(null);
      return;
    }
    const line = usedParts.find((p) => p.id === lineId);
    const defaultWh = Math.max(1, line?.quantity ?? 1);
    setAdHocForId(lineId);
    setAdHocDraft({ name: '', cost: '', warehouseQty: String(defaultWh), category: 'Meter Spares' });
  };

  const submitAdHoc = async (lineId: string) => {
    if (!onRegisterAdHocWarehousePart) return;
    const name = adHocDraft.name.trim();
    if (!name) return;
    const costPrice = Math.max(0, parseFloat(adHocDraft.cost) || 0);
    const part = usedParts.find((p) => p.id === lineId);
    const usedQty = part?.quantity ?? 1;
    const whQty = parseInt(adHocDraft.warehouseQty, 10);
    if (!Number.isFinite(whQty) || whQty < 0) {
      toast({
        title: 'Invalid warehouse quantity',
        description: 'Enter a whole number 0 or greater for stock you are adding.',
        variant: 'destructive',
      });
      return;
    }
    if (usedQty > whQty) {
      toast({
        title: 'Quantity mismatch',
        description: `This line uses ${usedQty} pc(s). Warehouse quantity must be at least that much (or lower the quantity in the row above).`,
        variant: 'destructive',
      });
      return;
    }
    setAdHocSavingId(lineId);
    try {
      const ok = await onRegisterAdHocWarehousePart({
        name,
        costPrice,
        category: adHocDraft.category,
        currentStock: whQty,
      });
      if (ok) {
        updatePart(lineId, { partName: name, rate: costPrice });
        setAdHocForId(null);
        setAdHocDraft({ name: '', cost: '', warehouseQty: '', category: 'Meter Spares' });
      }
    } finally {
      setAdHocSavingId(null);
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
                    value={part.partName || undefined}
                    onValueChange={(value) => handlePartNameChange(part.id, value)}
                  >
                    <SelectTrigger id={`part-name-${part.id}`}>
                      <SelectValue placeholder="Select part" />
                    </SelectTrigger>
                    <SelectContent>
                      {warehouseItems
                        .filter(item => item.category === 'Meter Spares' || item.category === 'Accessories')
                        .map((item) => (
                          <SelectItem key={item.id} value={item.name}>
                            {item.name}
                            {item.currentStock === 0 ? ' (0 in stock)' : ` (${item.currentStock} in stock)`}
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
                      const maxQty = qtyCapForWarehouseName(part.partName, warehouseItems);
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

              {onRegisterAdHocWarehousePart && (
                <div className="mt-3 border-t pt-3">
                  <button
                    type="button"
                    onClick={() => openAdHoc(part.id)}
                    className="text-xs text-primary hover:underline"
                  >
                    {adHocForId === part.id ? 'Hide' : 'Part not in list? Register in warehouse…'}
                  </button>
                  {adHocForId === part.id && (
                    <div className="mt-3 grid gap-3 rounded-md border bg-muted/30 p-3 sm:grid-cols-2">
                      <div className="sm:col-span-2 grid gap-2">
                        <Label className="text-xs">New part name *</Label>
                        <Input
                          value={adHocDraft.name}
                          onChange={(e) => setAdHocDraft((d) => ({ ...d, name: e.target.value }))}
                          placeholder="Exact name as it should appear in warehouse"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label className="text-xs">Cost price (₹)</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={adHocDraft.cost}
                          onChange={(e) => setAdHocDraft((d) => ({ ...d, cost: e.target.value }))}
                          placeholder="0"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label className="text-xs">Quantity in warehouse *</Label>
                        <Input
                          type="number"
                          min="0"
                          step="1"
                          value={adHocDraft.warehouseQty}
                          onChange={(e) => setAdHocDraft((d) => ({ ...d, warehouseQty: e.target.value }))}
                          placeholder="Stock you are adding"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label className="text-xs">Category</Label>
                        <Select
                          value={adHocDraft.category}
                          onValueChange={(v) =>
                            setAdHocDraft((d) => ({
                              ...d,
                              category: v as (typeof SPARE_CATEGORIES)[number],
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {SPARE_CATEGORIES.map((c) => (
                              <SelectItem key={c} value={c}>
                                {c}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="sm:col-span-2">
                        <Button
                          type="button"
                          size="sm"
                          disabled={(() => {
                            const w = parseInt(adHocDraft.warehouseQty, 10);
                            const whOk = Number.isFinite(w) && w >= 0;
                            const useOk = part.quantity <= w;
                            return (
                              !adHocDraft.name.trim() ||
                              !whOk ||
                              !useOk ||
                              adHocSavingId === part.id
                            );
                          })()}
                          onClick={() => void submitAdHoc(part.id)}
                        >
                          {adHocSavingId === part.id ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Saving…
                            </>
                          ) : (
                            'Add to warehouse & apply to this line'
                          )}
                        </Button>
                        <p className="text-xs text-muted-foreground mt-2">
                          Opening stock is saved as entered. The quantity used on this repair is the amount in the row
                          above—it must not exceed warehouse quantity.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {part.partName && (() => {
                const warehouseItem = warehouseItems.find(item => item.name === part.partName);
                if (
                  warehouseItem &&
                  warehouseItem.currentStock > 0 &&
                  part.quantity > warehouseItem.currentStock
                ) {
                  return (
                    <p className="text-xs text-destructive mt-2">
                      Available stock: {warehouseItem.currentStock} {warehouseItem.unit}
                    </p>
                  );
                }
                if (warehouseItem && warehouseItem.currentStock === 0) {
                  return (
                    <p className="text-xs text-muted-foreground mt-2">
                      Warehouse stock: 0 {warehouseItem.unit}. Usage on this repair is still allowed; add stock when
                      you receive it.
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

