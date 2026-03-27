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
import { Plus, Download, Phone, Calendar, X, Filter, ImageIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { fetchTallyEntries, fetchWarehouseItems, createTallyEntry, updateTallyEntry } from '@/api/adminApi';
import type { TallyEntry } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useFormDialog } from '@/contexts/FormDialogContext';
import { PhotoUpload } from '@/components/admin/PhotoUpload';
import { PhotoGallery } from '@/components/admin/PhotoGallery';
import { UsedParts } from '@/components/admin/UsedParts';
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
  /** On small screens, filters start collapsed; use toggle to expand. */
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  /** Mobile: read-only entry detail modal */
  const [mobileDetailEntry, setMobileDetailEntry] = useState<TallyEntry | null>(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    customerName: '',
    phone: '',
    itemType: '',
    serviceType: 'repair' as 'repair' | 'sale',
    status: 'pending' as TallyEntry['status'],
    serviceCharge: '',
    itemPrice: '',
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
        serviceCharge: (entry.laborCost ?? entry.serviceCharge ?? 0).toString(),
        itemPrice: (entry.itemPrice ?? entry.total ?? entry.totalAmount ?? 0).toString(),
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
        itemPrice: '',
        usedParts: [],
        paymentStatus: 'unpaid',
        notes: '',
        photos: [],
      });
    }
    setErrors({});
    setFormOpen(true);
    setDialogOpen(true);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.customerName) newErrors.customerName = 'Customer Name is required';
    if (!formData.phone) newErrors.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Phone must be 10 digits';
    
    if (formData.serviceType === 'repair') {
      if (!formData.itemType) newErrors.itemType = 'Item/Meter Type is required';
      const laborCost = parseFloat(formData.serviceCharge) || 0;
      const partsCost = formData.usedParts.reduce((sum, part) => sum + part.total, 0);
      if (laborCost <= 0 && partsCost <= 0) {
        newErrors.serviceCharge = 'Labor cost or parts cost is required';
      }
    } else if (formData.serviceType === 'sale') {
      if (!formData.itemType) newErrors.itemType = 'Item is required';
      const itemPrice = parseFloat(formData.itemPrice) || 0;
      if (itemPrice <= 0) newErrors.itemPrice = 'Item price is required';
    }
    
    setErrors(newErrors);
    const firstError = Object.values(newErrors)[0];
    return {
      isValid: Object.keys(newErrors).length === 0,
      firstError,
    };
  };

  const handleSubmit = async () => {
    const validation = validateForm();
    if (!validation.isValid) {
      toast({
        title: 'Validation Error',
        description: validation.firstError || 'Please fix the errors in the form.',
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
    let laborCost = 0;
    let partsCost = 0;
    let itemPrice = 0;
    let totalAmount = 0;
    const itemType = formData.itemType;

    if (formData.serviceType === 'repair') {
      serviceCharge = parseFloat(formData.serviceCharge) || 0;
      laborCost = serviceCharge;
      partsCost = formData.usedParts.reduce((sum, part) => sum + part.total, 0);
      totalAmount = serviceCharge + partsCost;
    } else if (formData.serviceType === 'sale') {
      itemPrice = parseFloat(formData.itemPrice) || 0;
      totalAmount = itemPrice;
      serviceCharge = 0;
      laborCost = 0;
      partsCost = 0;
    }
    
    const newEntry: TallyEntry & { item?: string; type?: 'repair' | 'sale'; laborCost?: number; itemPrice?: number; total?: number } = {
      id: editingEntry?.id || `tally-${Date.now()}`,
      date: formData.date,
      customerName: formData.customerName,
      phone: formData.phone,
      item: itemType,
      itemType: itemType,
      type: formData.serviceType,
      serviceType: formData.serviceType,
      status: formData.status,
      laborCost,
      serviceCharge,
      usedParts: formData.serviceType === 'repair' ? formData.usedParts : [],
      partsCost,
      itemPrice,
      total: totalAmount,
      totalAmount,
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
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { error?: string; message?: string } };
        message?: string;
      };
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        'Failed to save entry. Please try again.';

      toast({
        title: 'Save Failed (Server)',
        description: errorMessage,
        variant: 'destructive',
      });

      return;
    }

    toast({
      title: editingEntry ? 'Entry Updated' : 'Entry Added',
      description: `Service entry has been ${editingEntry ? 'updated' : 'added'} successfully.`,
    });
    setFormOpen(false);
    setDialogOpen(false);
  };

  const handleExport = () => {
    const headers = ['Date', 'Customer', 'Phone', 'Item', 'Type', 'Status', 'Labor Cost', 'Parts Cost', 'Item Price', 'Total', 'Payment', 'Notes'];
    const rows = filteredEntries.map(e => [
      new Date(e.date).toLocaleDateString(),
      e.customerName,
      e.phone,
      e.itemType,
      e.serviceType,
      e.status,
      e.laborCost ?? e.serviceCharge ?? 0,
      e.partsCost ?? 0,
      e.itemPrice ?? (e.serviceType === 'sale' ? (e.total ?? e.totalAmount ?? 0) : 0),
      e.total ?? e.totalAmount ?? 0,
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

  const getLaborCost = (entry: TallyEntry) => entry.laborCost ?? entry.serviceCharge ?? 0;
  const getPartsCost = (entry: TallyEntry) =>
    entry.usedParts?.reduce((sum, part) => sum + part.total, 0) || entry.partsCost || 0;
  const getItemPrice = (entry: TallyEntry) =>
    entry.itemPrice ?? (entry.serviceType === 'sale' ? (entry.total ?? entry.totalAmount ?? 0) : 0);
  const getTotalAmount = (entry: TallyEntry) => entry.total ?? entry.totalAmount ?? 0;
  const showSaleColumns = selectedServiceType === 'sale';
  const showRepairColumns = selectedServiceType !== 'sale';
  const isUnpaidDelivered = (entry: TallyEntry) =>
    entry.status === 'delivered' && entry.paymentStatus !== 'paid';

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
            {/* Filter Header — mobile: toggle to show/hide filter controls */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
                <h3 className="text-sm font-semibold">Filters</h3>
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {activeFiltersCount} active
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="h-7 text-xs hidden sm:inline-flex"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Clear All
                  </Button>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs sm:hidden"
                  onClick={() => setMobileFiltersOpen((open) => !open)}
                  aria-expanded={mobileFiltersOpen}
                >
                  {mobileFiltersOpen ? (
                    <>
                      Hide
                      <ChevronUp className="h-3 w-3 ml-1" />
                    </>
                  ) : (
                    <>
                      Show filters
                      <ChevronDown className="h-3 w-3 ml-1" />
                    </>
                  )}
                </Button>
              </div>
            </div>
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="h-7 text-xs w-full sm:hidden -mt-1"
              >
                <X className="h-3 w-3 mr-1" />
                Clear All
              </Button>
            )}

            <div
              className={`space-y-3 ${mobileFiltersOpen ? 'block' : 'hidden'} sm:block`}
            >
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

            {/* Active filter chips (inside mobile collapsible) */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-1 sm:hidden pt-1">
                  {selectedMonth !== 'all' && (
                    <Badge variant="outline" className="text-xs h-5">
                      {monthOptions.find(opt => opt.value === selectedMonth)?.label || 'Month'}
                      <button
                        type="button"
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
                        type="button"
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
                        type="button"
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
                        type="button"
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
                        type="button"
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

            {/* Results Summary — always visible */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pt-2 border-t">
              <div className="text-xs text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{filteredEntries.length}</span> of{' '}
                <span className="font-semibold text-foreground">{entries.length}</span> entries
              </div>
              {activeFiltersCount > 0 && (
                <div className="hidden sm:flex flex-wrap gap-1">
                  {selectedMonth !== 'all' && (
                    <Badge variant="outline" className="text-xs h-5">
                      {monthOptions.find(opt => opt.value === selectedMonth)?.label || 'Month'}
                      <button
                        type="button"
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
                        type="button"
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
                        type="button"
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
                        type="button"
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
                        type="button"
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
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
            <Card 
              className={`p-2 cursor-pointer transition-all hover:bg-accent border shadow-none sm:shadow-sm ${
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
              <CardHeader className="pb-0 p-0">
                <CardTitle className="text-[10px] sm:text-xs font-medium text-muted-foreground leading-tight">
                  <span className="md:hidden">Revenue</span>
                  <span className="hidden md:inline">Total Revenue</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 pt-0.5">
                <div className="text-xs sm:text-sm md:text-base font-bold tabular-nums">
                  ₹{totalStats.revenue.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card 
              className={`p-2 cursor-pointer transition-all hover:bg-accent border shadow-none sm:shadow-sm ${
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
              <CardHeader className="pb-0 p-0">
                <CardTitle className="text-[10px] sm:text-xs font-medium text-muted-foreground leading-tight">
                  Paid
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 pt-0.5">
                <div className="text-xs sm:text-sm md:text-base font-bold text-green-600 tabular-nums">
                  ₹{totalStats.paid.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card 
              className={`p-2 cursor-pointer transition-all hover:bg-accent border shadow-none sm:shadow-sm ${
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
              <CardHeader className="pb-0 p-0">
                <CardTitle className="text-[10px] sm:text-xs font-medium text-muted-foreground leading-tight">
                  Pending
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 pt-0.5">
                <div className="text-xs sm:text-sm md:text-base font-bold text-orange-600 tabular-nums">
                  ₹{totalStats.pending.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card 
              className={`p-2 cursor-pointer transition-all hover:bg-accent border shadow-none sm:shadow-sm ${
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
              <CardHeader className="pb-0 p-0">
                <CardTitle className="text-[10px] sm:text-xs font-medium text-muted-foreground leading-tight">
                  Repairs
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 pt-0.5">
                <div className="text-xs sm:text-sm md:text-base font-bold tabular-nums">{totalStats.repairs}</div>
              </CardContent>
            </Card>

            <Card 
              className={`p-2 cursor-pointer transition-all hover:bg-accent border shadow-none sm:shadow-sm ${
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
              <CardHeader className="pb-0 p-0">
                <CardTitle className="text-[10px] sm:text-xs font-medium text-muted-foreground leading-tight">
                  Sales
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 pt-0.5">
                <div className="text-xs sm:text-sm md:text-base font-bold tabular-nums">{totalStats.sales}</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Current Month Statistics */}
        <div>
          <h2 className="text-sm sm:text-base font-semibold mb-2">Current Month ({new Date().toLocaleString('default', { month: 'short', year: 'numeric' })})</h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
            <Card 
              className={`p-2 cursor-pointer transition-all hover:bg-accent border shadow-none sm:shadow-sm ${
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
              <CardHeader className="pb-0 p-0">
                <CardTitle className="text-[10px] sm:text-xs font-medium text-muted-foreground leading-tight">
                  Revenue
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 pt-0.5">
                <div className="text-xs sm:text-sm md:text-base font-bold tabular-nums">
                  ₹{currentMonthStats.revenue.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card 
              className={`p-2 cursor-pointer transition-all hover:bg-accent border shadow-none sm:shadow-sm ${
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
              <CardHeader className="pb-0 p-0">
                <CardTitle className="text-[10px] sm:text-xs font-medium text-muted-foreground leading-tight">
                  Paid
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 pt-0.5">
                <div className="text-xs sm:text-sm md:text-base font-bold text-green-600 tabular-nums">
                  ₹{currentMonthStats.paid.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card 
              className={`p-2 cursor-pointer transition-all hover:bg-accent border shadow-none sm:shadow-sm ${
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
              <CardHeader className="pb-0 p-0">
                <CardTitle className="text-[10px] sm:text-xs font-medium text-muted-foreground leading-tight">
                  Pending
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 pt-0.5">
                <div className="text-xs sm:text-sm md:text-base font-bold text-orange-600 tabular-nums">
                  ₹{currentMonthStats.pending.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card 
              className={`p-2 cursor-pointer transition-all hover:bg-accent border shadow-none sm:shadow-sm ${
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
              <CardHeader className="pb-0 p-0">
                <CardTitle className="text-[10px] sm:text-xs font-medium text-muted-foreground leading-tight">
                  Repairs
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 pt-0.5">
                <div className="text-xs sm:text-sm md:text-base font-bold tabular-nums">{currentMonthStats.repairs}</div>
              </CardContent>
            </Card>

            <Card 
              className={`p-2 cursor-pointer transition-all hover:bg-accent border shadow-none sm:shadow-sm ${
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
              <CardHeader className="pb-0 p-0">
                <CardTitle className="text-[10px] sm:text-xs font-medium text-muted-foreground leading-tight">
                  Sales
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 pt-0.5">
                <div className="text-xs sm:text-sm md:text-base font-bold tabular-nums">{currentMonthStats.sales}</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Service Register Table */}
        <Card>
          <CardHeader className="p-3 pb-2 sm:p-6 sm:pb-6">
            <CardTitle className="text-base sm:text-xl">
              Service Entries ({filteredEntries.length})
              {selectedMonth !== 'all' && selectedMonth !== 'current' && (
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  ({monthOptions.find(opt => opt.value === selectedMonth)?.label})
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            {/* Mobile: compact table + details in modal */}
            <div className="md:hidden px-2 pb-4">
              {filteredEntries.length === 0 ? (
                <div className="text-center text-muted-foreground py-8 text-sm px-2">
                  {selectedMonth === 'all' 
                    ? 'No entries yet. Click "Add Entry" to get started.'
                    : `No entries found for ${monthOptions.find(opt => opt.value === selectedMonth)?.label || 'selected month'}.`
                  }
                </div>
              ) : (
                <div className="rounded-md border overflow-hidden bg-card">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[340px] text-xs">
                      <thead>
                        <tr className="border-b bg-muted/50 text-left">
                          <th className="p-2 font-medium text-muted-foreground w-[72px]">Date</th>
                          <th className="p-2 font-medium text-muted-foreground min-w-[88px]">Customer</th>
                          <th className="p-2 font-medium text-muted-foreground text-center w-[52px]">Type</th>
                          <th className="p-2 font-medium text-muted-foreground text-right w-[76px]">Total</th>
                          <th className="p-2 font-medium text-muted-foreground w-[76px] text-right pr-1"> </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredEntries.map((entry, index) => (
                          <tr
                            key={`${entry.id}-${entry.date}-${index}`}
                            className={`border-b border-border/80 last:border-0 ${isUnpaidDelivered(entry) ? 'bg-destructive/5' : ''}`}
                          >
                            <td className="p-2 text-muted-foreground whitespace-nowrap align-middle tabular-nums">
                              {new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </td>
                            <td className="p-2 align-middle">
                              <span className="font-medium line-clamp-2 break-words block max-w-[120px]" title={entry.customerName}>
                                {entry.customerName}
                              </span>
                            </td>
                            <td className="p-2 text-center align-middle">
                              <Badge
                                variant={entry.serviceType === 'repair' ? 'secondary' : 'default'}
                                className="text-[10px] px-1.5 py-0 h-5 whitespace-nowrap"
                                title={entry.serviceType}
                              >
                                {entry.serviceType === 'repair' ? 'Rep' : 'Sale'}
                              </Badge>
                            </td>
                            <td className="p-2 text-right font-semibold align-middle tabular-nums whitespace-nowrap">
                              ₹{getTotalAmount(entry).toLocaleString()}
                            </td>
                            <td className="p-1 align-middle text-right">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-8 text-[11px] px-2"
                                onClick={() => setMobileDetailEntry(entry)}
                              >
                                Details
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
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
                    {showRepairColumns && <TableHead className="text-right">Labor Cost</TableHead>}
                    {showRepairColumns && <TableHead className="text-right">Parts Cost</TableHead>}
                    {showSaleColumns && <TableHead className="text-right">Item Price</TableHead>}
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Photos</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEntries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={showSaleColumns ? 10 : 11} className="text-center text-muted-foreground">
                        {selectedMonth === 'all' 
                          ? 'No entries yet. Click "Add Entry" to get started.'
                          : `No entries found for ${monthOptions.find(opt => opt.value === selectedMonth)?.label || 'selected month'}.`
                        }
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEntries.map((entry, index) => (
                      <TableRow
                        key={`${entry.id}-${entry.date}-${index}`}
                        className={isUnpaidDelivered(entry) ? 'bg-destructive/5' : ''}
                      >
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
                        {showRepairColumns && (
                          <TableCell className="text-right">₹{getLaborCost(entry).toLocaleString()}</TableCell>
                        )}
                        {showRepairColumns && (
                          <TableCell className="text-right">₹{getPartsCost(entry).toLocaleString()}</TableCell>
                        )}
                        {showSaleColumns && (
                          <TableCell className="text-right">₹{getItemPrice(entry).toLocaleString()}</TableCell>
                        )}
                        <TableCell className="font-bold text-right">
                          ₹{getTotalAmount(entry).toLocaleString()}
                        </TableCell>
                        <TableCell>{getPaymentBadge(entry.paymentStatus)}</TableCell>
                        <TableCell>
                          {entry.photos && entry.photos.length > 0 ? (
                            <div className="inline-flex items-center gap-1 text-primary">
                              <ImageIcon className="h-4 w-4" />
                              <span className="text-xs">{entry.photos.length}</span>
                            </div>
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

        {/* Mobile: read-only entry detail modal */}
        <Dialog
          open={!!mobileDetailEntry}
          onOpenChange={(open) => {
            if (!open) setMobileDetailEntry(null);
          }}
        >
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md gap-0">
            {mobileDetailEntry && (
              <>
                <DialogHeader className="space-y-1 pb-2">
                  <DialogTitle className="text-lg">Entry details</DialogTitle>
                  <DialogDescription className="text-sm">
                    {new Date(mobileDetailEntry.date).toLocaleDateString(undefined, {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}{' '}
                    · {mobileDetailEntry.customerName}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-3 py-3 text-sm border-t">
                  <div className="grid grid-cols-[100px_1fr] gap-x-2 gap-y-2">
                    <span className="text-muted-foreground">Phone</span>
                    <span className="font-medium flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5 shrink-0" />
                      {mobileDetailEntry.phone}
                    </span>
                    <span className="text-muted-foreground">Item</span>
                    <span className="font-medium break-words">{mobileDetailEntry.itemType}</span>
                    <span className="text-muted-foreground">Type</span>
                    <span>
                      <Badge variant={mobileDetailEntry.serviceType === 'repair' ? 'secondary' : 'default'} className="capitalize">
                        {mobileDetailEntry.serviceType}
                      </Badge>
                    </span>
                    <span className="text-muted-foreground">Status</span>
                    <span>{getStatusBadge(mobileDetailEntry.status)}</span>
                    <span className="text-muted-foreground">Payment</span>
                    <span>{getPaymentBadge(mobileDetailEntry.paymentStatus)}</span>
                    {mobileDetailEntry.serviceType === 'repair' ? (
                      <>
                        <span className="text-muted-foreground">Labor</span>
                        <span className="text-right tabular-nums">₹{getLaborCost(mobileDetailEntry).toLocaleString()}</span>
                        <span className="text-muted-foreground">Parts</span>
                        <span className="text-right tabular-nums">₹{getPartsCost(mobileDetailEntry).toLocaleString()}</span>
                      </>
                    ) : (
                      <>
                        <span className="text-muted-foreground">Item price</span>
                        <span className="text-right tabular-nums font-medium">₹{getItemPrice(mobileDetailEntry).toLocaleString()}</span>
                      </>
                    )}
                    <span className="text-muted-foreground">Total</span>
                    <span className="text-right text-base font-bold tabular-nums">
                      ₹{getTotalAmount(mobileDetailEntry).toLocaleString()}
                    </span>
                  </div>

                  {mobileDetailEntry.notes?.trim() && (
                    <div className="pt-2 border-t space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">Notes</p>
                      <p className="text-sm whitespace-pre-wrap break-words">{mobileDetailEntry.notes}</p>
                    </div>
                  )}

                  {mobileDetailEntry.usedParts && mobileDetailEntry.usedParts.length > 0 && (
                    <div className="pt-2 border-t space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">Parts used</p>
                      <ul className="text-xs space-y-1 list-disc list-inside">
                        {mobileDetailEntry.usedParts.map((p) => (
                          <li key={p.id}>
                            {p.partName} × {p.quantity} @ ₹{p.rate} = ₹{p.total}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {mobileDetailEntry.photos && mobileDetailEntry.photos.length > 0 && (
                    <div className="pt-2 border-t space-y-2">
                      <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                        <ImageIcon className="h-3.5 w-3.5" />
                        Photos ({mobileDetailEntry.photos.length})
                      </p>
                      <PhotoGallery photos={mobileDetailEntry.photos} />
                    </div>
                  )}
                </div>

                <DialogFooter className="flex-col-reverse sm:flex-row gap-2 pt-2 border-t sm:justify-end">
                  <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={() => setMobileDetailEntry(null)}>
                    Close
                  </Button>
                  <Button
                    type="button"
                    className="w-full sm:w-auto"
                    onClick={() => {
                      const e = mobileDetailEntry;
                      setMobileDetailEntry(null);
                      handleOpenDialog(e);
                    }}
                  >
                    Edit entry
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

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
                          itemPrice: '',
                        });
                      } else {
                        setFormData({ 
                          ...formData, 
                          serviceType: value,
                          usedParts: [],
                          serviceCharge: '',
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

              {/* Item Price - Only for Sale */}
              {formData.serviceType === 'sale' && (
                <div className="grid gap-2">
                  <Label htmlFor="itemPrice">Item Price (₹) *</Label>
                  <Input
                    id="itemPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.itemPrice}
                    onChange={(e) => setFormData({ ...formData, itemPrice: e.target.value })}
                    placeholder="0.00"
                    className={errors.itemPrice ? "border-red-500" : ""}
                  />
                  {errors.itemPrice && <p className="text-sm text-red-500">{errors.itemPrice}</p>}
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

              {/* Labor Cost and Used Parts - Only for Repair */}
              {formData.serviceType === 'repair' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="serviceCharge">Labor Cost (₹)</Label>
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
                    ₹{(parseFloat(formData.itemPrice) || 0).toLocaleString()}
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
