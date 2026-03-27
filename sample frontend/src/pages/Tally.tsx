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
import { Plus, Download, Phone, Calendar, X, Filter, ImageIcon, ChevronDown, ChevronUp, BarChart3 } from 'lucide-react';
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

function getSubmitErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const ax = error as {
      response?: { status?: number; data?: unknown };
      message?: string;
    };
    const data = ax.response?.data;
    if (typeof data === 'string' && data.trim()) return data.trim();
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      const d = data as Record<string, unknown>;
      const msg = d.error ?? d.message;
      if (typeof msg === 'string' && msg.trim()) return msg.trim();
    }
    const status = ax.response?.status;
    if (status === 401) {
      return 'Session expired or not authorized. Sign in again and retry.';
    }
    if (status === 403) {
      return 'You do not have permission to save this entry.';
    }
    if (status !== undefined && status >= 500) {
      return 'Server error while saving. Please try again later.';
    }
    if (ax.message?.trim()) return ax.message.trim();
    return 'Could not save the entry. Check your connection and try again.';
  }
  if (error instanceof Error && error.message) return error.message;
  return 'Failed to save entry. Please try again.';
}

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
  /** All-time + this month metric tiles; hidden until user opens overview. */
  const [overviewOpen, setOverviewOpen] = useState(false);
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
      if (!formData.itemType?.trim()) {
        newErrors.itemType = 'Item/Meter Type is required';
      }
      const laborCost = parseFloat(formData.serviceCharge) || 0;
      const partsCost = formData.usedParts.reduce((sum, part) => sum + part.total, 0);
      if (laborCost <= 0 && partsCost <= 0) {
        newErrors.serviceCharge = 'Labor cost or parts cost is required';
      }
    } else if (formData.serviceType === 'sale') {
      if (!formData.itemType?.trim()) {
        newErrors.itemType = 'Item sold is required';
      }
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

    const { id: _clientId, ...entryPayload } = newEntry;

    try {
      if (editingEntry) {
        const updatedEntry = await updateTallyEntry(editingEntry.id, entryPayload);
        const updated = entries.map((e) => (e.id === editingEntry.id ? updatedEntry : e));
        setEntries(updated);
      } else {
        const createdEntry = await createTallyEntry(entryPayload);
        setEntries((prev) => [...prev, createdEntry]);
      }

      const warehouseData = await fetchWarehouseItems();
      setWarehouseItems(warehouseData);
    } catch (error: unknown) {
      toast({
        title: 'Could not save entry',
        description: getSubmitErrorMessage(error),
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

        {/* Filters — minimal bar when collapsed on mobile; full panel when open */}
        <div
          className={`rounded-xl border transition-[background-color,box-shadow,border-color] duration-200 sm:rounded-2xl sm:shadow-sm sm:ring-1 sm:ring-black/[0.03] dark:sm:ring-white/[0.06] ${
            !mobileFiltersOpen
              ? 'max-sm:border-border/25 max-sm:bg-muted/20 max-sm:shadow-none max-sm:ring-0'
              : 'max-sm:border-border/55 max-sm:bg-card/80 max-sm:shadow-sm max-sm:ring-1 max-sm:ring-black/[0.04] dark:max-sm:ring-white/[0.06]'
          } sm:border-border/80 sm:bg-card`}
        >
          <div
            className={`space-y-3 sm:space-y-4 ${
              !mobileFiltersOpen ? 'max-sm:p-2.5 max-sm:space-y-2' : 'max-sm:p-3 max-sm:space-y-3'
            } sm:p-5`}
          >
            <div
              className={`flex flex-wrap items-center justify-between gap-2 sm:gap-3 ${
                !mobileFiltersOpen ? 'max-sm:gap-1.5' : ''
              }`}
            >
              <div className="flex items-center gap-2 min-w-0 sm:gap-3">
                <div
                  className={`flex shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-[width,height] sm:h-10 sm:w-10 sm:rounded-xl sm:bg-primary/10 sm:text-primary ${
                    !mobileFiltersOpen
                      ? 'max-sm:h-7 max-sm:w-7 max-sm:bg-transparent max-sm:text-muted-foreground'
                      : 'max-sm:h-8 max-sm:w-8 max-sm:bg-muted/50'
                  }`}
                >
                  <Filter className="h-4 w-4 max-sm:h-3.5 max-sm:w-3.5" aria-hidden />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap sm:gap-2">
                    <h3
                      className={`font-medium tracking-tight text-foreground sm:text-sm sm:font-semibold ${
                        !mobileFiltersOpen ? 'max-sm:text-xs' : 'max-sm:text-[13px]'
                      }`}
                    >
                      Filters
                    </h3>
                    {activeFiltersCount > 0 && (
                      <span
                        className={`inline-flex items-center rounded-full bg-muted px-1.5 py-0 text-[10px] font-medium tabular-nums text-muted-foreground sm:hidden ${
                          !mobileFiltersOpen ? 'max-sm:min-h-[18px]' : ''
                        }`}
                      >
                        {activeFiltersCount}
                      </span>
                    )}
                    {activeFiltersCount > 0 && (
                      <Badge variant="secondary" className="hidden sm:inline-flex text-[10px] font-medium px-2 py-0 h-5">
                        {activeFiltersCount} active
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">
                    Period, payment, type &amp; status
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0 sm:gap-2">
                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="h-8 px-2 text-xs hidden sm:inline-flex text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5 mr-1" />
                    Reset all
                  </Button>
                )}
                {activeFiltersCount > 0 && !mobileFiltersOpen && (
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="sm:hidden text-[11px] font-medium text-muted-foreground hover:text-foreground px-1.5 py-1 rounded-md hover:bg-muted/60"
                  >
                    Clear
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen((open) => !open)}
                  aria-expanded={mobileFiltersOpen}
                  aria-label={mobileFiltersOpen ? 'Collapse filters' : 'Expand filters'}
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:hidden ${
                    !mobileFiltersOpen ? 'max-sm:h-7 max-sm:w-7' : ''
                  }`}
                >
                  {mobileFiltersOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            {activeFiltersCount > 0 && mobileFiltersOpen && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="h-8 text-xs w-full sm:hidden rounded-md text-muted-foreground -my-1"
              >
                <X className="h-3.5 w-3.5 mr-1" />
                Reset all filters
              </Button>
            )}

            <div
              className={`space-y-4 ${mobileFiltersOpen ? 'block' : 'hidden'} sm:block`}
            >
            <div className="rounded-xl border border-border/60 bg-muted/25 dark:bg-muted/10 p-3 sm:p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="month-filter" className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="h-3 w-3 opacity-70" />
                  Period
                </Label>
                <Select value={selectedMonth} onValueChange={handleMonthChange}>
                  <SelectTrigger id="month-filter" className="h-9 text-xs rounded-lg bg-background border-border/80 shadow-none">
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

              <div className="space-y-1.5">
                <Label htmlFor="payment-filter" className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Payment
                </Label>
                <Select value={selectedPaymentStatus} onValueChange={handlePaymentStatusChange}>
                  <SelectTrigger id="payment-filter" className="h-9 text-xs rounded-lg bg-background border-border/80 shadow-none">
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

              <div className="space-y-1.5">
                <Label htmlFor="service-type-filter" className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Type
                </Label>
                <Select value={selectedServiceType} onValueChange={handleServiceTypeChange}>
                  <SelectTrigger id="service-type-filter" className="h-9 text-xs rounded-lg bg-background border-border/80 shadow-none">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="repair">Repair</SelectItem>
                    <SelectItem value="sale">Sale</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="status-filter" className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Status
                </Label>
                <Select value={selectedStatus} onValueChange={handleStatusChange}>
                  <SelectTrigger id="status-filter" className="h-9 text-xs rounded-lg bg-background border-border/80 shadow-none">
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

            <div className="h-px bg-border/50" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="space-y-1.5 sm:col-span-1">
                <Label htmlFor="custom-from" className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="h-3 w-3 opacity-70" />
                  From
                </Label>
                <Input
                  id="custom-from"
                  type="date"
                  value={customFromDate}
                  onChange={(e) => setCustomFromDate(e.target.value)}
                  className="h-9 text-xs rounded-lg bg-background border-border/80 shadow-none"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="custom-to" className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="h-3 w-3 opacity-70" />
                  To
                </Label>
                <Input
                  id="custom-to"
                  type="date"
                  value={customToDate}
                  onChange={(e) => setCustomToDate(e.target.value)}
                  className="h-9 text-xs rounded-lg bg-background border-border/80 shadow-none"
                />
              </div>
              {(customFromDate || customToDate) && (
                <div className="flex items-end sm:col-span-2 lg:col-span-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-9 text-xs rounded-lg w-full sm:w-auto"
                    onClick={() => {
                      setCustomFromDate('');
                      setCustomToDate('');
                    }}
                  >
                    <X className="h-3.5 w-3.5 mr-1" />
                    Clear range
                  </Button>
                </div>
              )}
            </div>
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

            {activeFiltersCount > 0 && (
              <div className="hidden sm:flex flex-wrap gap-1 pt-2 border-t border-border/60">
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

        <div className="rounded-xl border border-border/70 bg-card/60 shadow-sm ring-1 ring-black/[0.03] dark:ring-white/[0.05] overflow-hidden">
          <button
            type="button"
            onClick={() => setOverviewOpen((o) => !o)}
            aria-expanded={overviewOpen}
            className="flex w-full items-center gap-2 px-2.5 py-2 sm:px-3 sm:py-2 text-left transition-colors hover:bg-muted/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted/80 text-muted-foreground">
              <BarChart3 className="h-3.5 w-3.5" aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-semibold text-foreground leading-tight">
                {overviewOpen ? 'Hide overview' : 'Show overview'}
              </span>
              <span className="block text-[10px] text-muted-foreground leading-tight mt-0.5">
                All time &amp; this month — tap a number to filter
              </span>
            </span>
            {overviewOpen ? (
              <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
            ) : (
              <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
            )}
          </button>

          {overviewOpen && (
            <div className="space-y-2.5 border-t border-border/60 bg-muted/15 px-2 pb-2.5 pt-2 sm:px-2.5 sm:pb-3 sm:pt-2.5">
              {/* All time — compact */}
              <div className="rounded-lg border border-border/70 bg-background/80 p-2 sm:p-2.5 dark:bg-background/50">
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">All time</p>
                  <span className="text-[9px] text-muted-foreground hidden sm:inline">Filter by metric</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 md:grid-cols-5 sm:gap-2">
                  <button
                    type="button"
                    className={`group flex flex-col rounded-md border bg-background px-2 py-1.5 text-left text-[9px] transition-all hover:border-primary/40 focus:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
                      selectedMonth === 'all' && selectedPaymentStatus === 'all' && selectedServiceType === 'all' && selectedStatus === 'all' && !isCurrentMonthFilter
                        ? 'border-primary/45 ring-1 ring-primary/20'
                        : 'border-border/60'
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
                    <span className="font-medium uppercase tracking-wide text-muted-foreground group-hover:text-foreground/70">
                      <span className="md:hidden">Revenue</span>
                      <span className="hidden md:inline">Total</span>
                    </span>
                    <span className="mt-0.5 text-xs font-semibold tabular-nums leading-none sm:text-sm">
                      ₹{totalStats.revenue.toLocaleString()}
                    </span>
                  </button>

                  <button
                    type="button"
                    className={`group flex flex-col rounded-md border bg-background px-2 py-1.5 text-left text-[9px] transition-all hover:border-emerald-500/35 focus:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
                      selectedPaymentStatus === 'paid' && !isCurrentMonthFilter
                        ? 'border-emerald-500/40 bg-emerald-500/[0.06] ring-1 ring-emerald-500/20'
                        : 'border-border/60'
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
                    <span className="font-medium uppercase tracking-wide text-muted-foreground group-hover:text-foreground/70">Paid</span>
                    <span className="mt-0.5 text-xs font-semibold tabular-nums leading-none text-emerald-600 dark:text-emerald-400 sm:text-sm">
                      ₹{totalStats.paid.toLocaleString()}
                    </span>
                  </button>

                  <button
                    type="button"
                    className={`group flex flex-col rounded-md border bg-background px-2 py-1.5 text-left text-[9px] transition-all hover:border-amber-500/35 focus:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
                      selectedPaymentStatus === 'unpaid' && !isCurrentMonthFilter
                        ? 'border-amber-500/40 bg-amber-500/[0.06] ring-1 ring-amber-500/20'
                        : 'border-border/60'
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
                    <span className="font-medium uppercase tracking-wide text-muted-foreground group-hover:text-foreground/70">Pending</span>
                    <span className="mt-0.5 text-xs font-semibold tabular-nums leading-none text-amber-600 dark:text-amber-400 sm:text-sm">
                      ₹{totalStats.pending.toLocaleString()}
                    </span>
                  </button>

                  <button
                    type="button"
                    className={`group flex flex-col rounded-md border bg-background px-2 py-1.5 text-left text-[9px] transition-all hover:border-sky-500/35 focus:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
                      selectedServiceType === 'repair' && !isCurrentMonthFilter
                        ? 'border-sky-500/40 bg-sky-500/[0.06] ring-1 ring-sky-500/20'
                        : 'border-border/60'
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
                    <span className="font-medium uppercase tracking-wide text-muted-foreground group-hover:text-foreground/70">Repairs</span>
                    <span className="mt-0.5 text-xs font-semibold tabular-nums leading-none sm:text-sm">{totalStats.repairs}</span>
                  </button>

                  <button
                    type="button"
                    className={`group flex flex-col rounded-md border bg-background px-2 py-1.5 text-left text-[9px] transition-all hover:border-violet-500/35 focus:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
                      selectedServiceType === 'sale' && !isCurrentMonthFilter
                        ? 'border-violet-500/40 bg-violet-500/[0.06] ring-1 ring-violet-500/20'
                        : 'border-border/60'
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
                    <span className="font-medium uppercase tracking-wide text-muted-foreground group-hover:text-foreground/70">Sales</span>
                    <span className="mt-0.5 text-xs font-semibold tabular-nums leading-none sm:text-sm">{totalStats.sales}</span>
                  </button>
                </div>
              </div>

              {/* This month — compact */}
              <div className="rounded-lg border border-primary/20 bg-primary/[0.04] p-2 sm:p-2.5 dark:bg-primary/[0.07]">
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-primary/85">This month</p>
                  <p className="text-[9px] font-medium text-foreground tabular-nums truncate max-w-[55%] sm:max-w-none">
                    {new Date().toLocaleString('default', { month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 md:grid-cols-5 sm:gap-2">
                  <button
                    type="button"
                    className={`group flex flex-col rounded-md border bg-background px-2 py-1.5 text-left text-[9px] transition-all hover:border-primary/40 focus:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
                      selectedMonth === 'current' && selectedPaymentStatus === 'all' && selectedServiceType === 'all' && selectedStatus === 'all' && isCurrentMonthFilter
                        ? 'border-primary/50 ring-1 ring-primary/20'
                        : 'border-border/60'
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
                    <span className="font-medium uppercase tracking-wide text-muted-foreground group-hover:text-foreground/70">Revenue</span>
                    <span className="mt-0.5 text-xs font-semibold tabular-nums leading-none sm:text-sm">
                      ₹{currentMonthStats.revenue.toLocaleString()}
                    </span>
                  </button>

                  <button
                    type="button"
                    className={`group flex flex-col rounded-md border bg-background px-2 py-1.5 text-left text-[9px] transition-all hover:border-emerald-500/35 focus:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
                      selectedPaymentStatus === 'paid' && isCurrentMonthFilter
                        ? 'border-emerald-500/40 bg-emerald-500/[0.06] ring-1 ring-emerald-500/20'
                        : 'border-border/60'
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
                    <span className="font-medium uppercase tracking-wide text-muted-foreground group-hover:text-foreground/70">Paid</span>
                    <span className="mt-0.5 text-xs font-semibold tabular-nums leading-none text-emerald-600 dark:text-emerald-400 sm:text-sm">
                      ₹{currentMonthStats.paid.toLocaleString()}
                    </span>
                  </button>

                  <button
                    type="button"
                    className={`group flex flex-col rounded-md border bg-background px-2 py-1.5 text-left text-[9px] transition-all hover:border-amber-500/35 focus:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
                      selectedPaymentStatus === 'unpaid' && isCurrentMonthFilter
                        ? 'border-amber-500/40 bg-amber-500/[0.06] ring-1 ring-amber-500/20'
                        : 'border-border/60'
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
                    <span className="font-medium uppercase tracking-wide text-muted-foreground group-hover:text-foreground/70">Pending</span>
                    <span className="mt-0.5 text-xs font-semibold tabular-nums leading-none text-amber-600 dark:text-amber-400 sm:text-sm">
                      ₹{currentMonthStats.pending.toLocaleString()}
                    </span>
                  </button>

                  <button
                    type="button"
                    className={`group flex flex-col rounded-md border bg-background px-2 py-1.5 text-left text-[9px] transition-all hover:border-sky-500/35 focus:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
                      selectedServiceType === 'repair' && isCurrentMonthFilter
                        ? 'border-sky-500/40 bg-sky-500/[0.06] ring-1 ring-sky-500/20'
                        : 'border-border/60'
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
                    <span className="font-medium uppercase tracking-wide text-muted-foreground group-hover:text-foreground/70">Repairs</span>
                    <span className="mt-0.5 text-xs font-semibold tabular-nums leading-none sm:text-sm">{currentMonthStats.repairs}</span>
                  </button>

                  <button
                    type="button"
                    className={`group flex flex-col rounded-md border bg-background px-2 py-1.5 text-left text-[9px] transition-all hover:border-violet-500/35 focus:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
                      selectedServiceType === 'sale' && isCurrentMonthFilter
                        ? 'border-violet-500/40 bg-violet-500/[0.06] ring-1 ring-violet-500/20'
                        : 'border-border/60'
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
                    <span className="font-medium uppercase tracking-wide text-muted-foreground group-hover:text-foreground/70">Sales</span>
                    <span className="mt-0.5 text-xs font-semibold tabular-nums leading-none sm:text-sm">{currentMonthStats.sales}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
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

              {/* Item — required for repair and sale */}
              <div className="grid gap-2">
                <Label htmlFor="itemType">
                  {formData.serviceType === 'repair' ? 'Item/Meter Type *' : 'Item sold *'}
                </Label>
                <ItemTypeAutocomplete
                  value={formData.itemType}
                  onChange={(value) => setFormData({ ...formData, itemType: value })}
                  placeholder={
                    formData.serviceType === 'repair'
                      ? 'LCD Digital Speedometer'
                      : 'Product or meter sold'
                  }
                  className={errors.itemType ? 'border-red-500' : ''}
                  error={errors.itemType}
                />
              </div>

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
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFormOpen(false);
                  setDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="button" onClick={() => void handleSubmit()}>
                {editingEntry ? 'Update Entry' : 'Add Entry'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
