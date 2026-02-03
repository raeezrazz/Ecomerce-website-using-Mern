import { useEffect, useState, useMemo } from 'react';
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
import { Plus, Download, Phone, Calendar, X, Filter } from 'lucide-react';
import { fetchTallyEntries, fetchWarehouseItems, createTallyEntry, updateTallyEntry } from '@/api/adminApi';
import type { TallyEntry } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useFormDialog } from '@/contexts/FormDialogContext';
import { PhotoUpload } from '@/components/admin/PhotoUpload';
import { PhotoGallery } from '@/components/admin/PhotoGallery';
import { UsedParts } from '@/components/admin/UsedParts';
import { SaleItems, type SaleItem } from '@/components/admin/SaleItems';
import { ItemTypeAutocomplete } from '@/components/admin/ItemTypeAutocomplete';
import { CustomerAutocomplete } from '@/components/admin/CustomerAutocomplete';
import { mockWarehouseItems } from '@/data/warehouseData';
import type { WarehouseItem, UsedPart } from '@/types';

export default function Tally() {
  const { toast } = useToast();
  const { setFormOpen } = useFormDialog();
  const [entries, setEntries] = useState<TallyEntry[]>([]);
  const [warehouseItems, setWarehouseItems] = useState<WarehouseItem[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TallyEntry | null>(null);
  // Filter states
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<string>('all');
  const [selectedServiceType, setSelectedServiceType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isCurrentMonthFilter, setIsCurrentMonthFilter] = useState<boolean>(false);
  const [customFromDate, setCustomFromDate] = useState<string>('');
  const [customToDate, setCustomToDate] = useState<string>('');
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    customerName: '',
    phone: '',
    itemType: '',
    serviceType: 'repair' as 'repair' | 'sale',
    status: 'pending' as TallyEntry['status'],
    serviceCharge: '',
    actualPrice: '',
    sellingPrice: '',
    usedParts: [] as UsedPart[],
    saleItems: [] as SaleItem[],
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
        actualPrice: '',
        sellingPrice: '',
        usedParts: entry.usedParts || [],
        saleItems: (entry as any).saleItems || [],
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
        actualPrice: '',
        sellingPrice: '',
        usedParts: [],
        saleItems: [],
        paymentStatus: 'unpaid',
        notes: '',
        photos: [],
      });
    }
    setErrors({});
    setFormOpen(true);
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
    
    if (formData.serviceType === 'repair') {
      if (!formData.itemType) newErrors.itemType = 'Item/Meter Type is required';
      if (!formData.serviceCharge) newErrors.serviceCharge = 'Service Charge is required';
    } else if (formData.serviceType === 'sale') {
      if (formData.saleItems.length === 0) {
        newErrors.saleItems = 'At least one sale item is required';
      }
      // Validate each sale item
      for (const item of formData.saleItems) {
        if (!item.itemName || !item.warehouseItemId) {
          newErrors.saleItems = 'All sale items must have a selected item';
          break;
        }
        if (item.quantity <= 0) {
          newErrors.saleItems = 'All sale items must have quantity greater than 0';
          break;
        }
        if (item.sellingPrice <= 0) {
          newErrors.saleItems = 'All sale items must have selling price greater than 0';
          break;
        }
        const warehouseItem = warehouseItems.find(w => w.id === item.warehouseItemId);
        if (warehouseItem && item.quantity > warehouseItem.currentStock) {
          newErrors.saleItems = `${item.itemName} has only ${warehouseItem.currentStock} available`;
          break;
        }
      }
    }
    
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

    // Validate based on service type
    if (formData.serviceType === 'repair') {
      // Validate used parts for repair
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
    }

    let serviceCharge = 0;
    let partsCost = 0;
    let totalAmount = 0;
    let itemType = formData.itemType;

    if (formData.serviceType === 'repair') {
      serviceCharge = parseFloat(formData.serviceCharge) || 0;
      partsCost = formData.usedParts.reduce((sum, part) => sum + part.total, 0);
      totalAmount = serviceCharge + partsCost;
    } else if (formData.serviceType === 'sale') {
      // For sale, calculate from sale items
      const saleTotal = formData.saleItems.reduce((sum, item) => sum + item.total, 0);
      totalAmount = saleTotal;
      serviceCharge = 0; // No service charge for sales
      partsCost = 0; // No parts cost for sales
      // Set itemType from sale items
      itemType = formData.saleItems.map(item => item.itemName).join(', ') || '';
    }
    
    const newEntry: TallyEntry & { saleItems?: SaleItem[] } = {
      id: editingEntry?.id || `tally-${Date.now()}`,
      date: formData.date,
      customerName: formData.customerName,
      phone: formData.phone,
      itemType: itemType,
      serviceType: formData.serviceType,
      status: formData.status,
      serviceCharge,
      usedParts: formData.serviceType === 'repair' ? formData.usedParts : [],
      partsCost,
      totalAmount,
      paymentStatus: formData.paymentStatus,
      dateCompleted: formData.status === 'completed' || formData.status === 'delivered' ? new Date().toISOString().split('T')[0] : undefined,
      notes: formData.notes,
      photos: formData.photos,
      saleItems: formData.serviceType === 'sale' ? formData.saleItems : undefined,
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
      if (formData.serviceType === 'repair') {
        const oldUsedParts = editingEntry?.usedParts || [];
        reduceStockFromWarehouse(formData.usedParts, oldUsedParts);
      } else if (formData.serviceType === 'sale') {
        // Reduce stock for sale items
        const updatedWarehouse = [...warehouseItems];
        formData.saleItems.forEach(saleItem => {
          const warehouseItem = updatedWarehouse.find(item => item.id === saleItem.warehouseItemId);
          if (warehouseItem) {
            warehouseItem.currentStock = Math.max(0, warehouseItem.currentStock - saleItem.quantity);
            warehouseItem.lastUpdated = new Date().toISOString();
          }
        });
        setWarehouseItems(updatedWarehouse);
        localStorage.setItem('warehouseItems', JSON.stringify(updatedWarehouse));
      }
      
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
    setFormOpen(false);
    setDialogOpen(false);
  };

  const handleExport = () => {
    const headers = ['Date', 'Customer', 'Phone', 'Item', 'Type', 'Status', 'Service Charge', 'Parts Cost', 'Total', 'Payment', 'Notes'];
    const rows = filteredEntries.map(e => [
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

  // Get current month and year
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); // 0-11

  // Generate month options for filter
  const monthOptions = useMemo(() => {
    const options: { value: string; label: string }[] = [
      { value: 'all', label: 'All Time' },
      { value: 'current', label: 'Current Month' },
    ];
    
    // Generate last 12 months
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentYear, currentMonth - i, 1);
      const year = date.getFullYear();
      const month = date.getMonth();
      const monthName = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      const value = `${year}-${String(month + 1).padStart(2, '0')}`;
      options.push({ value, label: monthName });
    }
    
    return options;
  }, [currentYear, currentMonth]);

  // Helper function to parse date and get year/month
  const getEntryYearMonth = (dateString: string) => {
    try {
      // Handle different date formats
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        // Try parsing as YYYY-MM-DD format
        const parts = dateString.split('-');
        if (parts.length >= 2) {
          return {
            year: parseInt(parts[0], 10),
            month: parseInt(parts[1], 10) - 1 // Convert to 0-based month
          };
        }
        return null;
      }
      return {
        year: date.getFullYear(),
        month: date.getMonth()
      };
    } catch (error) {
      console.error('Error parsing date:', dateString, error);
      return null;
    }
  };

  // Filter entries based on all selected filters
  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      // Custom date range filter (day-to-day)
      if (customFromDate || customToDate) {
        const entryDateStr = typeof entry.date === 'string' ? entry.date.split('T')[0] : new Date(entry.date).toISOString().split('T')[0];
        if (customFromDate && entryDateStr < customFromDate) return false;
        if (customToDate && entryDateStr > customToDate) return false;
      }

      // Date/Month filter
      if (selectedMonth !== 'all') {
        if (selectedMonth === 'current') {
          const entryDateInfo = getEntryYearMonth(entry.date);
          if (!entryDateInfo) return false;
          if (entryDateInfo.year !== currentYear || entryDateInfo.month !== currentMonth) {
            return false;
          }
        } else {
          // Filter by specific month (YYYY-MM format)
          const [year, month] = selectedMonth.split('-').map(Number);
          const targetMonth = month - 1; // Convert to 0-based month
          const entryDateInfo = getEntryYearMonth(entry.date);
          if (!entryDateInfo) return false;
          if (entryDateInfo.year !== year || entryDateInfo.month !== targetMonth) {
            return false;
          }
        }
      }

      // Payment status filter
      if (selectedPaymentStatus !== 'all' && entry.paymentStatus !== selectedPaymentStatus) {
        return false;
      }

      // Service type filter
      if (selectedServiceType !== 'all' && entry.serviceType !== selectedServiceType) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'all' && entry.status !== selectedStatus) {
        return false;
      }

      return true;
    });
  }, [entries, selectedMonth, selectedPaymentStatus, selectedServiceType, selectedStatus, currentYear, currentMonth, customFromDate, customToDate]);

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedMonth !== 'all') count++;
    if (selectedPaymentStatus !== 'all') count++;
    if (selectedServiceType !== 'all') count++;
    if (selectedStatus !== 'all') count++;
    if (customFromDate || customToDate) count++;
    return count;
  }, [selectedMonth, selectedPaymentStatus, selectedServiceType, selectedStatus, customFromDate, customToDate]);

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedMonth('all');
    setSelectedPaymentStatus('all');
    setSelectedServiceType('all');
    setSelectedStatus('all');
    setIsCurrentMonthFilter(false);
    setCustomFromDate('');
    setCustomToDate('');
  };

  // Handler functions to reset current month filter when manually changing filters
  const handleMonthChange = (value: string) => {
    setSelectedMonth(value);
    if (value !== 'current') {
      setIsCurrentMonthFilter(false);
    }
  };

  const handlePaymentStatusChange = (value: string) => {
    setSelectedPaymentStatus(value);
    setIsCurrentMonthFilter(false);
  };

  const handleServiceTypeChange = (value: string) => {
    setSelectedServiceType(value);
    setIsCurrentMonthFilter(false);
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    setIsCurrentMonthFilter(false);
  };

  // Calculate totals for ALL entries (All Time - always shows all data, not filtered)
  const totalStats = useMemo(() => {
    return entries.reduce(
      (acc, entry) => ({
        revenue: acc.revenue + entry.totalAmount,
        paid: acc.paid + (entry.paymentStatus === 'paid' ? entry.totalAmount : 0),
        pending: acc.pending + (entry.paymentStatus !== 'paid' ? entry.totalAmount : 0),
        repairs: acc.repairs + (entry.serviceType === 'repair' ? 1 : 0),
        sales: acc.sales + (entry.serviceType === 'sale' ? 1 : 0),
      }),
      { revenue: 0, paid: 0, pending: 0, repairs: 0, sales: 0 }
    );
  }, [entries]);

  // Calculate totals for filtered entries (for display in table header if needed)
  const filteredStats = useMemo(() => {
    return filteredEntries.reduce(
      (acc, entry) => ({
        revenue: acc.revenue + entry.totalAmount,
        paid: acc.paid + (entry.paymentStatus === 'paid' ? entry.totalAmount : 0),
        pending: acc.pending + (entry.paymentStatus !== 'paid' ? entry.totalAmount : 0),
        repairs: acc.repairs + (entry.serviceType === 'repair' ? 1 : 0),
        sales: acc.sales + (entry.serviceType === 'sale' ? 1 : 0),
      }),
      { revenue: 0, paid: 0, pending: 0, repairs: 0, sales: 0 }
    );
  }, [filteredEntries]);

  // Calculate totals for current month
  const currentMonthStats = useMemo(() => {
    const currentMonthEntries = entries.filter(entry => {
      const entryDateInfo = getEntryYearMonth(entry.date);
      if (!entryDateInfo) return false;
      return entryDateInfo.year === currentYear && entryDateInfo.month === currentMonth;
    });
    
    return currentMonthEntries.reduce(
      (acc, entry) => ({
        revenue: acc.revenue + entry.totalAmount,
        paid: acc.paid + (entry.paymentStatus === 'paid' ? entry.totalAmount : 0),
        pending: acc.pending + (entry.paymentStatus !== 'paid' ? entry.totalAmount : 0),
        repairs: acc.repairs + (entry.serviceType === 'repair' ? 1 : 0),
        sales: acc.sales + (entry.serviceType === 'sale' ? 1 : 0),
      }),
      { revenue: 0, paid: 0, pending: 0, repairs: 0, sales: 0 }
    );
  }, [entries, currentYear, currentMonth]);


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
      <div className="space-y-2 sm:space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Daily Service Register</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">Track repairs, sales and customer service records</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 w-full sm:w-auto">
            <Button 
              onClick={handleExport} 
              variant="outline"
              size="sm"
              className="w-full sm:w-auto text-sm sm:text-base"
            >
              <Download className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              Export
            </Button>
            <Button 
              onClick={() => handleOpenDialog()}
              size="sm"
              className="w-full sm:w-auto text-sm sm:text-base"
            >
              <Plus className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              Add Entry
            </Button>
          </div>
        </div>

        {/* Professional Filter Section */}
        <Card className="p-3 sm:p-4">
          <div className="space-y-3">
            {/* Filter Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold">Filters</h3>
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {activeFiltersCount} active
                  </Badge>
                )}
              </div>
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="h-7 text-xs"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear All
                </Button>
              )}
            </div>

            {/* Filter Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Date/Month Filter */}
              <div className="space-y-1">
                <Label htmlFor="month-filter" className="text-xs font-medium min-h-5 flex items-center gap-1 shrink-0">
                  <Calendar className="h-3 w-3 shrink-0" />
                  Date/Month
                </Label>
                <Select value={selectedMonth} onValueChange={handleMonthChange}>
                  <SelectTrigger id="month-filter" className="h-8 text-xs">
                    <SelectValue placeholder="All Time" />
                  </SelectTrigger>
                  <SelectContent>
                    {monthOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Payment Status Filter */}
              <div className="space-y-1">
                <Label htmlFor="payment-filter" className="text-xs font-medium min-h-5 flex items-center">
                  Payment Status
                </Label>
                <Select value={selectedPaymentStatus} onValueChange={handlePaymentStatusChange}>
                  <SelectTrigger id="payment-filter" className="h-8 text-xs">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="unpaid">Unpaid</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Service Type Filter */}
              <div className="space-y-1">
                <Label htmlFor="service-type-filter" className="text-xs font-medium min-h-5 flex items-center">
                  Service Type
                </Label>
                <Select value={selectedServiceType} onValueChange={handleServiceTypeChange}>
                  <SelectTrigger id="service-type-filter" className="h-8 text-xs">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="repair">Repair</SelectItem>
                    <SelectItem value="sale">Sale</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div className="space-y-1">
                <Label htmlFor="status-filter" className="text-xs font-medium min-h-5 flex items-center">
                  Status
                </Label>
                <Select value={selectedStatus} onValueChange={handleStatusChange}>
                  <SelectTrigger id="status-filter" className="h-8 text-xs">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Custom date range */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              <div className="space-y-1">
                <Label htmlFor="custom-from" className="text-xs font-medium min-h-5 flex items-center gap-1 shrink-0">
                  <Calendar className="h-3 w-3 shrink-0" />
                  From date
                </Label>
                <Input
                  id="custom-from"
                  type="date"
                  value={customFromDate}
                  onChange={(e) => setCustomFromDate(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="custom-to" className="text-xs font-medium min-h-5 flex items-center gap-1 shrink-0">
                  <Calendar className="h-3 w-3 shrink-0" />
                  To date
                </Label>
                <Input
                  id="custom-to"
                  type="date"
                  value={customToDate}
                  onChange={(e) => setCustomToDate(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              {(customFromDate || customToDate) && (
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => {
                      setCustomFromDate('');
                      setCustomToDate('');
                    }}
                  >
                    <X className="h-3 w-3 mr-1" />
                    Clear date range
                  </Button>
                </div>
              )}
            </div>

            {/* Results Summary */}
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="text-xs text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{filteredEntries.length}</span> of{' '}
                <span className="font-semibold text-foreground">{entries.length}</span> entries
              </div>
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap gap-1">
                  {selectedMonth !== 'all' && (
                    <Badge variant="outline" className="text-xs h-5">
                      {monthOptions.find(opt => opt.value === selectedMonth)?.label || 'Month'}
                      <button
                        onClick={() => handleMonthChange('all')}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {selectedPaymentStatus !== 'all' && (
                    <Badge variant="outline" className="text-xs h-5">
                      {selectedPaymentStatus}
                      <button
                        onClick={() => handlePaymentStatusChange('all')}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {selectedServiceType !== 'all' && (
                    <Badge variant="outline" className="text-xs h-5">
                      {selectedServiceType}
                      <button
                        onClick={() => handleServiceTypeChange('all')}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {selectedStatus !== 'all' && (
                    <Badge variant="outline" className="text-xs h-5">
                      {selectedStatus}
                      <button
                        onClick={() => handleStatusChange('all')}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {(customFromDate || customToDate) && (
                    <Badge variant="outline" className="text-xs h-5">
                      {customFromDate && customToDate ? `${customFromDate} → ${customToDate}` : customFromDate ? `${customFromDate} → …` : `… → ${customToDate}`}
                      <button
                        onClick={() => { setCustomFromDate(''); setCustomToDate(''); }}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Total Statistics (All Time - Always shows all data) */}
        <div>
          <h2 className="text-sm sm:text-base font-semibold mb-2">
            Total (All Time)
          </h2>
          <div className="grid grid-cols-5 gap-2">
            <Card 
              className={`p-2 cursor-pointer transition-all hover:bg-accent ${
                selectedMonth === 'all' && selectedPaymentStatus === 'all' && selectedServiceType === 'all' && selectedStatus === 'all' && !isCurrentMonthFilter ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => {
                setSelectedMonth('all');
                setSelectedPaymentStatus('all');
                setSelectedServiceType('all');
                setSelectedStatus('all');
                setIsCurrentMonthFilter(false);
                setCustomFromDate('');
                setCustomToDate('');
              }}
            >
              <CardHeader className="pb-1 p-0">
                <CardTitle className="text-[10px] sm:text-xs font-medium text-muted-foreground">
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 pt-1">
                <div className="text-sm sm:text-base font-bold">
                  ₹{totalStats.revenue.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card 
              className={`p-2 cursor-pointer transition-all hover:bg-accent ${
                selectedPaymentStatus === 'paid' && !isCurrentMonthFilter ? 'ring-2 ring-green-500 bg-green-50 dark:bg-green-950' : ''
              }`}
              onClick={() => {
                if (selectedPaymentStatus === 'paid' && !isCurrentMonthFilter) {
                  setSelectedPaymentStatus('all');
                } else {
                  setSelectedMonth('all');
                  setSelectedPaymentStatus('paid');
                  setSelectedServiceType('all');
                  setSelectedStatus('all');
                  setIsCurrentMonthFilter(false);
                }
              }}
            >
              <CardHeader className="pb-1 p-0">
                <CardTitle className="text-[10px] sm:text-xs font-medium text-muted-foreground">
                  Paid
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 pt-1">
                <div className="text-sm sm:text-base font-bold text-green-600">
                  ₹{totalStats.paid.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card 
              className={`p-2 cursor-pointer transition-all hover:bg-accent ${
                selectedPaymentStatus === 'unpaid' && !isCurrentMonthFilter ? 'ring-2 ring-orange-500 bg-orange-50 dark:bg-orange-950' : ''
              }`}
              onClick={() => {
                if (selectedPaymentStatus === 'unpaid' && !isCurrentMonthFilter) {
                  setSelectedPaymentStatus('all');
                } else {
                  setSelectedMonth('all');
                  setSelectedPaymentStatus('unpaid');
                  setSelectedServiceType('all');
                  setSelectedStatus('all');
                  setIsCurrentMonthFilter(false);
                }
              }}
            >
              <CardHeader className="pb-1 p-0">
                <CardTitle className="text-[10px] sm:text-xs font-medium text-muted-foreground">
                  Pending
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 pt-1">
                <div className="text-sm sm:text-base font-bold text-orange-600">
                  ₹{totalStats.pending.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card 
              className={`p-2 cursor-pointer transition-all hover:bg-accent ${
                selectedServiceType === 'repair' && !isCurrentMonthFilter ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950' : ''
              }`}
              onClick={() => {
                if (selectedServiceType === 'repair' && !isCurrentMonthFilter) {
                  setSelectedServiceType('all');
                } else {
                  setSelectedMonth('all');
                  setSelectedPaymentStatus('all');
                  setSelectedServiceType('repair');
                  setSelectedStatus('all');
                  setIsCurrentMonthFilter(false);
                }
              }}
            >
              <CardHeader className="pb-1 p-0">
                <CardTitle className="text-[10px] sm:text-xs font-medium text-muted-foreground">
                  Repairs
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 pt-1">
                <div className="text-sm sm:text-base font-bold">{totalStats.repairs}</div>
              </CardContent>
            </Card>

            <Card 
              className={`p-2 cursor-pointer transition-all hover:bg-accent ${
                selectedServiceType === 'sale' && !isCurrentMonthFilter ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-950' : ''
              }`}
              onClick={() => {
                if (selectedServiceType === 'sale' && !isCurrentMonthFilter) {
                  setSelectedServiceType('all');
                } else {
                  setSelectedMonth('all');
                  setSelectedPaymentStatus('all');
                  setSelectedServiceType('sale');
                  setSelectedStatus('all');
                  setIsCurrentMonthFilter(false);
                }
              }}
            >
              <CardHeader className="pb-1 p-0">
                <CardTitle className="text-[10px] sm:text-xs font-medium text-muted-foreground">
                  Sales
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 pt-1">
                <div className="text-sm sm:text-base font-bold">{totalStats.sales}</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Current Month Statistics */}
        <div>
          <h2 className="text-sm sm:text-base font-semibold mb-2">Current Month ({new Date().toLocaleString('default', { month: 'short', year: 'numeric' })})</h2>
          <div className="grid grid-cols-5 gap-2">
            <Card 
              className={`p-2 cursor-pointer transition-all hover:bg-accent ${
                selectedMonth === 'current' && selectedPaymentStatus === 'all' && selectedServiceType === 'all' && selectedStatus === 'all' && isCurrentMonthFilter ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => {
                setSelectedMonth('current');
                setSelectedPaymentStatus('all');
                setSelectedServiceType('all');
                setSelectedStatus('all');
                setIsCurrentMonthFilter(true);
                setCustomFromDate('');
                setCustomToDate('');
              }}
            >
              <CardHeader className="pb-1 p-0">
                <CardTitle className="text-[10px] sm:text-xs font-medium text-muted-foreground">
                  Revenue
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 pt-1">
                <div className="text-sm sm:text-base font-bold">
                  ₹{currentMonthStats.revenue.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card 
              className={`p-2 cursor-pointer transition-all hover:bg-accent ${
                selectedPaymentStatus === 'paid' && isCurrentMonthFilter ? 'ring-2 ring-green-500 bg-green-50 dark:bg-green-950' : ''
              }`}
              onClick={() => {
                if (selectedPaymentStatus === 'paid' && isCurrentMonthFilter) {
                  setSelectedPaymentStatus('all');
                } else {
                  setSelectedMonth('current');
                  setSelectedPaymentStatus('paid');
                  setSelectedServiceType('all');
                  setSelectedStatus('all');
                  setIsCurrentMonthFilter(true);
                }
              }}
            >
              <CardHeader className="pb-1 p-0">
                <CardTitle className="text-[10px] sm:text-xs font-medium text-muted-foreground">
                  Paid
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 pt-1">
                <div className="text-sm sm:text-base font-bold text-green-600">
                  ₹{currentMonthStats.paid.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card 
              className={`p-2 cursor-pointer transition-all hover:bg-accent ${
                selectedPaymentStatus === 'unpaid' && isCurrentMonthFilter ? 'ring-2 ring-orange-500 bg-orange-50 dark:bg-orange-950' : ''
              }`}
              onClick={() => {
                if (selectedPaymentStatus === 'unpaid' && isCurrentMonthFilter) {
                  setSelectedPaymentStatus('all');
                } else {
                  setSelectedMonth('current');
                  setSelectedPaymentStatus('unpaid');
                  setSelectedServiceType('all');
                  setSelectedStatus('all');
                  setIsCurrentMonthFilter(true);
                }
              }}
            >
              <CardHeader className="pb-1 p-0">
                <CardTitle className="text-[10px] sm:text-xs font-medium text-muted-foreground">
                  Pending
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 pt-1">
                <div className="text-sm sm:text-base font-bold text-orange-600">
                  ₹{currentMonthStats.pending.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card 
              className={`p-2 cursor-pointer transition-all hover:bg-accent ${
                selectedServiceType === 'repair' && isCurrentMonthFilter ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950' : ''
              }`}
              onClick={() => {
                if (selectedServiceType === 'repair' && isCurrentMonthFilter) {
                  setSelectedServiceType('all');
                } else {
                  setSelectedMonth('current');
                  setSelectedPaymentStatus('all');
                  setSelectedServiceType('repair');
                  setSelectedStatus('all');
                  setIsCurrentMonthFilter(true);
                }
              }}
            >
              <CardHeader className="pb-1 p-0">
                <CardTitle className="text-[10px] sm:text-xs font-medium text-muted-foreground">
                  Repairs
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 pt-1">
                <div className="text-sm sm:text-base font-bold">{currentMonthStats.repairs}</div>
              </CardContent>
            </Card>

            <Card 
              className={`p-2 cursor-pointer transition-all hover:bg-accent ${
                selectedServiceType === 'sale' && isCurrentMonthFilter ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-950' : ''
              }`}
              onClick={() => {
                if (selectedServiceType === 'sale' && isCurrentMonthFilter) {
                  setSelectedServiceType('all');
                } else {
                  setSelectedMonth('current');
                  setSelectedPaymentStatus('all');
                  setSelectedServiceType('sale');
                  setSelectedStatus('all');
                  setIsCurrentMonthFilter(true);
                }
              }}
            >
              <CardHeader className="pb-1 p-0">
                <CardTitle className="text-[10px] sm:text-xs font-medium text-muted-foreground">
                  Sales
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 pt-1">
                <div className="text-sm sm:text-base font-bold">{currentMonthStats.sales}</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Service Register Table */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">
              Service Entries ({filteredEntries.length})
              {selectedMonth !== 'all' && selectedMonth !== 'current' && (
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  ({monthOptions.find(opt => opt.value === selectedMonth)?.label})
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            {/* Mobile Card View */}
            <div className="md:hidden space-y-3 p-4">
              {filteredEntries.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  {selectedMonth === 'all' 
                    ? 'No entries yet. Click "Add Entry" to get started.'
                    : `No entries found for ${monthOptions.find(opt => opt.value === selectedMonth)?.label || 'selected month'}.`
                  }
                </div>
              ) : (
                filteredEntries.map((entry) => (
                  <Card key={entry.id} className="p-4">
                    <div className="space-y-3">
                      {/* Header Row */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-base mb-1">{entry.customerName}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Phone className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{entry.phone}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          <div className="text-xs text-muted-foreground">
                            {new Date(entry.date).toLocaleDateString()}
                          </div>
                          {getStatusBadge(entry.status)}
                        </div>
                      </div>

                      {/* Item and Type */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium">{entry.itemType}</span>
                        <Badge variant={entry.serviceType === 'repair' ? 'secondary' : 'default'} className="text-xs">
                          {entry.serviceType}
                        </Badge>
                        {getPaymentBadge(entry.paymentStatus)}
                      </div>

                      {/* Financial Info */}
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                        <div>
                          <div className="text-xs text-muted-foreground">Service Charge</div>
                          <div className="text-sm font-medium">₹{entry.serviceCharge.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Parts Cost</div>
                          <div className="text-sm font-medium">
                            ₹{(entry.usedParts?.reduce((sum, part) => sum + part.total, 0) || entry.partsCost || 0).toLocaleString()}
                            {entry.usedParts && entry.usedParts.length > 0 && (
                              <span className="text-xs text-muted-foreground block">
                                ({entry.usedParts.length} part{entry.usedParts.length !== 1 ? 's' : ''})
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="col-span-2">
                          <div className="text-xs text-muted-foreground">Total Amount</div>
                          <div className="text-base font-bold">₹{entry.totalAmount.toLocaleString()}</div>
                        </div>
                      </div>

                      {/* Photos */}
                      {entry.photos && entry.photos.length > 0 && (
                        <div className="pt-2 border-t">
                          <div className="text-xs text-muted-foreground mb-2">Photos</div>
                          <PhotoGallery photos={entry.photos} />
                        </div>
                      )}

                      {/* Actions */}
                      <div className="pt-2 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenDialog(entry)}
                          className="w-full"
                        >
                          Edit Entry
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block rounded-md border overflow-auto">
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
                  {filteredEntries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={11} className="text-center text-muted-foreground">
                        {selectedMonth === 'all' 
                          ? 'No entries yet. Click "Add Entry" to get started.'
                          : `No entries found for ${monthOptions.find(opt => opt.value === selectedMonth)?.label || 'selected month'}.`
                        }
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEntries.map((entry) => (
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
        <Dialog open={dialogOpen} onOpenChange={(open) => { setFormOpen(open); setDialogOpen(open); }}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto scrollbar-hide">
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
                  <Label htmlFor="date" className="min-h-5 flex items-center">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="serviceType" className="min-h-5 flex items-center">Type *</Label>
                  <Select
                    value={formData.serviceType}
                    onValueChange={(value: 'repair' | 'sale') => {
                      // Reset type-specific fields when switching
                      if (value === 'repair') {
                        setFormData({ 
                          ...formData, 
                          serviceType: value,
                          saleItems: [],
                          actualPrice: '',
                          sellingPrice: '',
                        });
                      } else {
                        setFormData({ 
                          ...formData, 
                          serviceType: value,
                          usedParts: [],
                          serviceCharge: '',
                          itemType: '',
                        });
                      }
                    }}
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

              <CustomerAutocomplete
                customerName={formData.customerName}
                phone={formData.phone}
                onCustomerNameChange={(value) =>
                  setFormData({ ...formData, customerName: value })
                }
                onPhoneChange={(value) =>
                  setFormData({ ...formData, phone: value })
                }
                nameError={errors.customerName}
                phoneError={errors.phone}
              />

              {/* Item/Meter Type - Only for Repair */}
              {formData.serviceType === 'repair' && (
                <div className="grid gap-2">
                  <Label htmlFor="itemType">Item/Meter Type *</Label>
                  <ItemTypeAutocomplete
                    value={formData.itemType}
                    onChange={(value) =>
                      setFormData({ ...formData, itemType: value })
                    }
                    placeholder="LCD Digital Speedometer"
                    className={errors.itemType ? "border-red-500" : ""}
                    error={errors.itemType}
                  />
                </div>
              )}

              {/* Sale Items - Only for Sale */}
              {formData.serviceType === 'sale' && (
                <div className="grid gap-2">
                  <SaleItems
                    saleItems={formData.saleItems}
                    warehouseItems={warehouseItems}
                    onItemsChange={(saleItems) => setFormData({ ...formData, saleItems })}
                  />
                  {errors.saleItems && <p className="text-sm text-red-500">{errors.saleItems}</p>}
                </div>
              )}

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

              {/* Service Charge and Used Parts - Only for Repair */}
              {formData.serviceType === 'repair' && (
                <>
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
                </>
              )}

              {/* Total Amount for Sale */}
              {formData.serviceType === 'sale' && (
                <div className="grid gap-2">
                  <Label>Total Sale Amount</Label>
                  <div className="flex items-center h-10 px-3 rounded-md border bg-muted font-semibold text-lg">
                    ₹{formData.saleItems.reduce((sum, item) => sum + item.total, 0).toLocaleString()}
                  </div>
                </div>
              )}

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
              <Button variant="outline" onClick={() => { setFormOpen(false); setDialogOpen(false); }}>
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
