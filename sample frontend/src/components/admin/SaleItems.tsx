import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Plus, Trash2, X, Loader2 } from 'lucide-react';
import type { WarehouseItem } from '@/types';
import { cn } from '@/lib/utils';

export interface SaleItem {
  id: string;
  warehouseItemId: string;
  itemName: string;
  quantity: number;
  actualPrice: number;
  sellingPrice: number;
  total: number;
}

interface SaleItemsProps {
  saleItems: SaleItem[];
  warehouseItems: WarehouseItem[];
  onItemsChange: (items: SaleItem[]) => void;
}

export function SaleItems({ saleItems, warehouseItems, onItemsChange }: SaleItemsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchingItemId, setSearchingItemId] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Filter warehouse items based on search
  const filteredWarehouseItems = warehouseItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    item.currentStock > 0
  ).slice(0, 10);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setSearchQuery('');
        setSearchingItemId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addItem = () => {
    const newItem: SaleItem = {
      id: `sale-item-${Date.now()}`,
      warehouseItemId: '',
      itemName: '',
      quantity: 1,
      actualPrice: 0,
      sellingPrice: 0,
      total: 0,
    };
    onItemsChange([...saleItems, newItem]);
    setSearchingItemId(newItem.id);
    setShowSuggestions(true);
  };

  const removeItem = (id: string) => {
    onItemsChange(saleItems.filter(item => item.id !== id));
  };

  const selectWarehouseItem = (itemId: string, saleItemId: string) => {
    const warehouseItem = warehouseItems.find(item => item.id === itemId);
    if (!warehouseItem) return;

    const updated = saleItems.map(item => {
      if (item.id === saleItemId) {
        return {
          ...item,
          warehouseItemId: itemId,
          itemName: warehouseItem.name,
          actualPrice: warehouseItem.costPrice,
          sellingPrice: warehouseItem.sellingPrice,
          quantity: 1,
          total: warehouseItem.sellingPrice,
        };
      }
      return item;
    });
    onItemsChange(updated);
    setShowSuggestions(false);
    setSearchQuery('');
    setSearchingItemId(null);
  };

  const updateItem = (id: string, updates: Partial<SaleItem>) => {
    const updated = saleItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, ...updates };
        // Auto-calculate total when quantity or selling price changes
        if (updates.quantity !== undefined || updates.sellingPrice !== undefined) {
          updatedItem.total = (updatedItem.quantity || 0) * (updatedItem.sellingPrice || 0);
        }
        return updatedItem;
      }
      return item;
    });
    onItemsChange(updated);
  };

  const totalSaleAmount = saleItems.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Sale Items</Label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Total: ₹{totalSaleAmount.toLocaleString()}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addItem}
            className="h-8"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Item
          </Button>
        </div>
      </div>

      {saleItems.length === 0 ? (
        <Card className="p-6 border-dashed text-center">
          <p className="text-sm text-muted-foreground mb-2">No items added yet</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addItem}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add First Item
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {saleItems.map((item, index) => {
            const warehouseItem = warehouseItems.find(w => w.id === item.warehouseItemId);
            const isSearching = searchingItemId === item.id;

            return (
              <Card key={item.id} className="p-4">
                <div className="space-y-3">
                  {/* Item Selection */}
                  {!item.itemName ? (
                    <div className="relative" ref={wrapperRef}>
                      <Label htmlFor={`item-search-${item.id}`} className="text-xs mb-2 block">
                        Select Item *
                      </Label>
                      <Input
                        id={`item-search-${item.id}`}
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setShowSuggestions(true);
                          setSearchingItemId(item.id);
                        }}
                        onFocus={() => {
                          setShowSuggestions(true);
                          setSearchingItemId(item.id);
                        }}
                        placeholder="Search warehouse items..."
                        className="w-full"
                      />
                      {showSuggestions && isSearching && (
                        <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-lg max-h-60 overflow-auto">
                          {filteredWarehouseItems.length > 0 ? (
                            <div className="p-1">
                              {filteredWarehouseItems.map((warehouseItem) => (
                                <button
                                  key={warehouseItem.id}
                                  type="button"
                                  className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-sm transition-colors"
                                  onClick={() => selectWarehouseItem(warehouseItem.id, item.id)}
                                >
                                  <div className="font-medium">{warehouseItem.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    Stock: {warehouseItem.currentStock} {warehouseItem.unit} | 
                                    Price: ₹{warehouseItem.sellingPrice.toLocaleString()}
                                  </div>
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="p-3 text-sm text-muted-foreground text-center">
                              No items found
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                      <div>
                        <div className="font-medium">{item.itemName}</div>
                        {warehouseItem && (
                          <div className="text-xs text-muted-foreground">
                            Available: {warehouseItem.currentStock} {warehouseItem.unit}
                          </div>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          updateItem(item.id, { itemName: '', warehouseItemId: '' });
                          setSearchQuery('');
                        }}
                        className="h-7"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}

                  {/* Quantity and Prices */}
                  {item.itemName && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor={`qty-${item.id}`} className="text-xs">
                          Quantity *
                        </Label>
                        <Input
                          id={`qty-${item.id}`}
                          type="number"
                          min="1"
                          max={warehouseItem?.currentStock || 999}
                          value={item.quantity}
                          onChange={(e) => {
                            const qty = parseInt(e.target.value) || 1;
                            const maxQty = warehouseItem?.currentStock || 999;
                            updateItem(item.id, { quantity: Math.min(qty, maxQty) });
                          }}
                          placeholder="1"
                        />
                        {warehouseItem && item.quantity > warehouseItem.currentStock && (
                          <p className="text-xs text-destructive mt-1">
                            Max available: {warehouseItem.currentStock}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor={`selling-price-${item.id}`} className="text-xs">
                          Selling Price (₹) *
                        </Label>
                        <Input
                          id={`selling-price-${item.id}`}
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.sellingPrice}
                          onChange={(e) => updateItem(item.id, { sellingPrice: parseFloat(e.target.value) || 0 })}
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  )}

                  {/* Price Info */}
                  {item.itemName && (
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t">
                      <div>
                        <Label className="text-xs text-muted-foreground">Actual Price</Label>
                        <div className="text-sm font-medium">₹{item.actualPrice.toLocaleString()}</div>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Selling Price</Label>
                        <div className="text-sm font-medium">₹{item.sellingPrice.toLocaleString()}</div>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Total</Label>
                        <div className="text-sm font-bold">₹{item.total.toLocaleString()}</div>
                      </div>
                    </div>
                  )}

                  {/* Remove Button */}
                  <div className="flex justify-end pt-2 border-t">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="h-8 text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

