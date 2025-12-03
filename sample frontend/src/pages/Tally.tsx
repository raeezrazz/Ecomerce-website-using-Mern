import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Download, Phone } from 'lucide-react';
import { fetchTallyEntries, fetchWarehouseItems, createTallyEntry, updateTallyEntry } from '@/api/adminApi';
import type { TallyEntry } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { PhotoUpload } from '@/components/admin/PhotoUpload';
import { PhotoGallery } from '@/components/admin/PhotoGallery';
import { UsedParts } from '@/components/admin/UsedParts';
import { mockWarehouseItems } from '@/data/warehouseData';
import type { WarehouseItem, UsedPart } from '@/types';

export default function Tally() {
  const { toast } = useToast();
  const [entries, setEntries] = useState<TallyEntry[]>([]);
  const [warehouseItems, setWarehouseItems] = useState<WarehouseItem[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TallyEntry | null>(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    customerName: '',
    phone: '',
    itemType: '',
    serviceType: 'repair' as 'repair' | 'sale',
    status: 'pending' as TallyEntry['status'],
    serviceCharge: '',
    usedParts: [] as UsedPart[],
    paymentStatus: 'unpaid' as TallyEntry['paymentStatus'],
    notes: '',
    photos: [] as string[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const [tallyData, warehouseData] = await Promise.all([
          fetchTallyEntries(),
          fetchWarehouseItems()
        ]);
        setEntries(tallyData);
        setWarehouseItems(warehouseData);
      } catch (error) {
        // Fallback to localStorage if API fails
        const stored = localStorage.getItem('tallyEntries');
        if (stored) {
          setEntries(JSON.parse(stored));
        }
        const warehouseStored = localStorage.getItem('warehouseItems');
        if (warehouseStored) {
          setWarehouseItems(JSON.parse(warehouseStored));
        } else {
          setWarehouseItems(mockWarehouseItems);
        }
      }
    };
    loadData();
  }, []);

  const handleOpenDialog = (entry?: TallyEntry) => {
    if (entry) {
      setEditingEntry(entry);
      setFormData({
        date: entry.date,
        customerName: entry.customerName,
        phone: entry.phone,
        itemType: entry.itemType,
        serviceType: entry.serviceType,
        status: entry.status,
        serviceCharge: entry.serviceCharge.toString(),
        usedParts: entry.usedParts || [],
        paymentStatus: entry.paymentStatus,
        notes: entry.notes,
        photos: entry.photos || [],
      });
    } else {
      setEditingEntry(null);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        customerName: '',
        phone: '',
        itemType: '',
        serviceType: 'repair',
        status: 'pending',
        serviceCharge: '',
        usedParts: [],
        paymentStatus: 'unpaid',
        notes: '',
        photos: [],
      });
    }
    setErrors({});
    setDialogOpen(true);
  };

  const reduceStockFromWarehouse = (usedParts: UsedPart[], oldUsedParts: UsedPart[] = []) => {
    const updatedWarehouse = [...warehouseItems];
    
    // First, restore stock from old parts if editing
    oldUsedParts.forEach(oldPart => {
      const warehouseItem = updatedWarehouse.find(item => item.name === oldPart.partName);
      if (warehouseItem) {
        warehouseItem.currentStock += oldPart.quantity;
      }
    });
    
    // Then, reduce stock for new parts
    usedParts.forEach(usedPart => {
      const warehouseItem = updatedWarehouse.find(item => item.name === usedPart.partName);
      if (warehouseItem) {
        warehouseItem.currentStock = Math.max(0, warehouseItem.currentStock - usedPart.quantity);
        warehouseItem.lastUpdated = new Date().toISOString();
      }
    });
    
    setWarehouseItems(updatedWarehouse);
    localStorage.setItem('warehouseItems', JSON.stringify(updatedWarehouse));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.customerName) newErrors.customerName = 'Customer Name is required';
    if (!formData.phone) newErrors.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Phone must be 10 digits';
    if (!formData.itemType) newErrors.itemType = 'Item Type is required';
    if (!formData.serviceCharge) newErrors.serviceCharge = 'Service Charge is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors in the form.',
        variant: 'destructive',
      });
      return;
    }

    // Validate used parts
    for (const part of formData.usedParts) {
      if (!part.partName || part.quantity <= 0 || part.rate <= 0) {
        toast({
          title: 'Invalid Parts',
          description: 'Please ensure all parts have valid name, quantity, and rate.',
          variant: 'destructive',
        });
        return;
      }
      
      const warehouseItem = warehouseItems.find(item => item.name === part.partName);
      if (warehouseItem && part.quantity > warehouseItem.currentStock) {
        toast({
          title: 'Insufficient Stock',
          description: `${part.partName} has only ${warehouseItem.currentStock} ${warehouseItem.unit} available.`,
          variant: 'destructive',
        });
        return;
      }
    }

    const serviceCharge = parseFloat(formData.serviceCharge) || 0;
    const partsCost = formData.usedParts.reduce((sum, part) => sum + part.total, 0);
    
    const newEntry: TallyEntry = {
      id: editingEntry?.id || `tally-${Date.now()}`,
      date: formData.date,
      customerName: formData.customerName,
      phone: formData.phone,
      itemType: formData.itemType,
      serviceType: formData.serviceType,
      status: formData.status,
      serviceCharge,
      usedParts: formData.usedParts,
      partsCost, // Calculated from usedParts for backward compatibility
      totalAmount: serviceCharge + partsCost,
      paymentStatus: formData.paymentStatus,
      dateCompleted: formData.status === 'completed' || formData.status === 'delivered' ? new Date().toISOString().split('T')[0] : undefined,
      notes: formData.notes,
      photos: formData.photos,
    };

    try {
      // Save to backend (backend handles stock reduction)
      if (editingEntry) {
        const updatedEntry = await updateTallyEntry(editingEntry.id, newEntry);
        const updated = entries.map(e => e.id === editingEntry.id ? updatedEntry : e);
        setEntries(updated);
      } else {
        const createdEntry = await createTallyEntry(newEntry);
        const updated = [...entries, createdEntry];
        setEntries(updated);
      }
      
      // Refresh warehouse items to reflect stock changes
      const warehouseData = await fetchWarehouseItems();
      setWarehouseItems(warehouseData);
    } catch (error) {
      // Fallback to localStorage if API fails
      const oldUsedParts = editingEntry?.usedParts || [];
      reduceStockFromWarehouse(formData.usedParts, oldUsedParts);
      
      if (editingEntry) {
        const updated = entries.map(e => e.id === editingEntry.id ? newEntry : e);
        setEntries(updated);
        localStorage.setItem('tallyEntries', JSON.stringify(updated));
      } else {
        const updated = [...entries, newEntry];
        setEntries(updated);
        localStorage.setItem('tallyEntries', JSON.stringify(updated));
      }
    }

    toast({
      title: editingEntry ? 'Entry Updated' : 'Entry Added',
      description: `Service entry has been ${editingEntry ? 'updated' : 'added'} successfully.`,
    });
    setDialogOpen(false);
  };

  const handleExport = () => {
    const headers = ['Date', 'Customer', 'Phone', 'Item', 'Type', 'Status', 'Service Charge', 'Parts Cost', 'Total', 'Payment', 'Notes'];
    const rows = entries.map(e => [
      new Date(e.date).toLocaleDateString(),
      e.customerName,
      e.phone,
      e.itemType,
      e.serviceType,
      e.status,
      e.serviceCharge,
      e.partsCost,
      e.totalAmount,
      e.paymentStatus,
      e.notes
    ]);
    
    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `service-register-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();

    toast({
      title: 'Export Successful',
      description: 'Service register exported to CSV.',
    });
  };

  const totals = entries.reduce(
    (acc, entry) => ({
      revenue: acc.revenue + entry.totalAmount,
      paid: acc.paid + (entry.paymentStatus === 'paid' ? entry.totalAmount : 0),
      pending: acc.pending + (entry.paymentStatus !== 'paid' ? entry.totalAmount : 0),
      repairs: acc.repairs + (entry.serviceType === 'repair' ? 1 : 0),
      sales: acc.sales + (entry.serviceType === 'sale' ? 1 : 0),
    }),
    { revenue: 0, paid: 0, pending: 0, repairs: 0, sales: 0 }
  );

  const getStatusBadge = (status: TallyEntry['status']) => {
    const variants = {
      pending: 'secondary',
      'in-progress': 'default',
      completed: 'outline',
      delivered: 'default',
    } as const;
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const getPaymentBadge = (status: TallyEntry['paymentStatus']) => {
    const variants = {
      paid: 'default',
      unpaid: 'destructive',
      partial: 'secondary',
    } as const;
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Daily Service Register</h1>
            <p className="text-muted-foreground">Track repairs, sales and customer service records</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleExport} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Entry
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{totals.revenue.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Paid
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ₹{totals.paid.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                ₹{totals.pending.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Repairs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totals.repairs}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Sales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totals.sales}</div>
            </CardContent>
          </Card>
        </div>

        {/* Service Register Table */}
        <Card>
          <CardHeader>
            <CardTitle>Service Entries ({entries.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Item/Meter</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Parts Cost</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Photos</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={11} className="text-center text-muted-foreground">
                        No entries yet. Click "Add Entry" to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    entries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>
                          {new Date(entry.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{entry.customerName}</div>
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {entry.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{entry.itemType}</TableCell>
                        <TableCell>
                          <Badge variant={entry.serviceType === 'repair' ? 'secondary' : 'default'}>
                            {entry.serviceType}
                          </Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(entry.status)}</TableCell>
                        <TableCell>₹{entry.serviceCharge.toLocaleString()}</TableCell>
                        <TableCell>
                          ₹{(entry.usedParts?.reduce((sum, part) => sum + part.total, 0) || entry.partsCost || 0).toLocaleString()}
                          {entry.usedParts && entry.usedParts.length > 0 && (
                            <span className="text-xs text-muted-foreground block">
                              ({entry.usedParts.length} part{entry.usedParts.length !== 1 ? 's' : ''})
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="font-semibold">
                          ₹{entry.totalAmount.toLocaleString()}
                        </TableCell>
                        <TableCell>{getPaymentBadge(entry.paymentStatus)}</TableCell>
                        <TableCell>
                          {entry.photos && entry.photos.length > 0 ? (
                            <PhotoGallery photos={entry.photos} />
                          ) : (
                            <span className="text-muted-foreground text-sm">No photos</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDialog(entry)}
                          >
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Entry Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingEntry ? 'Edit Service Entry' : 'Add New Service Entry'}
              </DialogTitle>
              <DialogDescription>
                Record customer repair or sale transaction
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="serviceType">Type *</Label>
                  <Select
                    value={formData.serviceType}
                    onValueChange={(value: 'repair' | 'sale') => 
                      setFormData({ ...formData, serviceType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="repair">Repair</SelectItem>
                      <SelectItem value="sale">Sale</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="customerName">Customer Name *</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) =>
                      setFormData({ ...formData, customerName: e.target.value })
                    }
                    placeholder="John Doe"
                    className={errors.customerName ? "border-red-500" : ""}
                  />
                  {errors.customerName && <p className="text-sm text-red-500">{errors.customerName}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="9876543210"
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="itemType">Item/Meter Type *</Label>
                <Input
                  id="itemType"
                  value={formData.itemType}
                  onChange={(e) =>
                    setFormData({ ...formData, itemType: e.target.value })
                  }
                  placeholder="LCD Digital Speedometer"
                  className={errors.itemType ? "border-red-500" : ""}
                />
                {errors.itemType && <p className="text-sm text-red-500">{errors.itemType}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: TallyEntry['status']) => 
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="paymentStatus">Payment Status</Label>
                  <Select
                    value={formData.paymentStatus}
                    onValueChange={(value: TallyEntry['paymentStatus']) => 
                      setFormData({ ...formData, paymentStatus: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="unpaid">Unpaid</SelectItem>
                      <SelectItem value="partial">Partial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="serviceCharge">Service Charge (₹) *</Label>
                  <Input
                    id="serviceCharge"
                    type="number"
                    value={formData.serviceCharge}
                    onChange={(e) =>
                      setFormData({ ...formData, serviceCharge: e.target.value })
                    }
                    placeholder="500"
                    className={errors.serviceCharge ? "border-red-500" : ""}
                  />
                  {errors.serviceCharge && <p className="text-sm text-red-500">{errors.serviceCharge}</p>}
                </div>
                <div className="grid gap-2">
                  <Label>Total Amount</Label>
                  <div className="flex items-center h-10 px-3 rounded-md border bg-muted font-semibold">
                    ₹{(
                      (parseFloat(formData.serviceCharge) || 0) + 
                      formData.usedParts.reduce((sum, part) => sum + part.total, 0)
                    ).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                <UsedParts
                  usedParts={formData.usedParts}
                  warehouseItems={warehouseItems}
                  onPartsChange={(usedParts) => setFormData({ ...formData, usedParts })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Additional notes about the service..."
                  rows={2}
                />
              </div>

              <div className="grid gap-2">
                <PhotoUpload
                  photos={formData.photos}
                  maxPhotos={6}
                  onPhotosChange={(photos) => setFormData({ ...formData, photos })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {editingEntry ? 'Update Entry' : 'Add Entry'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
