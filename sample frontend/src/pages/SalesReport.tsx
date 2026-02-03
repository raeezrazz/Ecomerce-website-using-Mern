import { useEffect, useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { fetchSalesReport, type ReportParams } from '@/api/adminApi';
import type { SalesReportData, ReportDailyRow } from '@/types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Download, Wrench, ShoppingCart, Package, TrendingUp, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type PeriodOption = 'current_month' | 'previous_month' | '7' | '30' | '90';

export default function SalesReport() {
  const { toast } = useToast();
  const [report, setReport] = useState<SalesReportData | null>(null);
  const [previousMonthReport, setPreviousMonthReport] = useState<SalesReportData | null>(null);
  const [period, setPeriod] = useState<PeriodOption>('current_month');
  const [loading, setLoading] = useState(true);
  const [comparePrevious, setComparePrevious] = useState(true);

  const currentDate = useMemo(() => new Date(), []);
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
  const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;

  const getParams = (option: PeriodOption): ReportParams => {
    switch (option) {
      case 'current_month':
        return { month: currentMonth, year: currentYear };
      case 'previous_month':
        return { month: prevMonth, year: prevYear };
      case '7':
      case '30':
      case '90':
        return { days: parseInt(option, 10) };
      default:
        return { month: currentMonth, year: currentYear };
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const params = getParams(period);
        const [mainData, prevData] = await Promise.all([
          fetchSalesReport(params),
          (period === 'current_month' && comparePrevious)
            ? fetchSalesReport({ month: prevMonth, year: prevYear })
            : Promise.resolve(null),
        ]);
        setReport(mainData);
        setPreviousMonthReport(prevData ?? null);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load report data. Please try again.',
          variant: 'destructive',
        });
        setReport(null);
        setPreviousMonthReport(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [period, comparePrevious, prevMonth, prevYear]);

  const daily = report?.daily ?? [];
  const prevDaily = previousMonthReport?.daily ?? [];

  const chartData = useMemo(() => {
    type Row = ReportDailyRow & { dayLabel?: string; prevServiceRevenue?: number; prevOrderRevenue?: number; prevSalesRevenue?: number; prevServices?: number; prevOrders?: number; prevSales?: number };

    if (comparePrevious && period === 'current_month' && prevDaily.length > 0) {
      const currMap = new Map(daily.map((d) => [d.date, d]));
      const prevMap = new Map(prevDaily.map((d) => [d.date, d]));
      const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
      const result: Row[] = [];
      for (let day = 1; day <= daysInMonth; day++) {
        const currDate = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const prevDate = `${prevYear}-${String(prevMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const curr = currMap.get(currDate);
        const prev = prevMap.get(prevDate);
        result.push({
          date: currDate,
          dayLabel: `Day ${day}`,
          orders: curr?.orders ?? 0,
          orderRevenue: curr?.orderRevenue ?? 0,
          services: curr?.services ?? 0,
          serviceRevenue: curr?.serviceRevenue ?? 0,
          sales: curr?.sales ?? 0,
          salesRevenue: curr?.salesRevenue ?? 0,
          prevOrders: prev?.orders ?? 0,
          prevOrderRevenue: prev?.orderRevenue ?? 0,
          prevServices: prev?.services ?? 0,
          prevServiceRevenue: prev?.serviceRevenue ?? 0,
          prevSales: prev?.sales ?? 0,
          prevSalesRevenue: prev?.salesRevenue ?? 0,
        });
      }
      return result;
    }

    return daily.map((d) => ({ ...d })) as Row[];
  }, [daily, prevDaily, comparePrevious, period, currentYear, currentMonth, prevYear, prevMonth]);

  const totals = useMemo(() => {
    const t = { serviceRevenue: 0, serviceCount: 0, orderRevenue: 0, orderCount: 0, salesRevenue: 0, salesCount: 0 };
    daily.forEach((d) => {
      t.serviceRevenue += d.serviceRevenue;
      t.serviceCount += d.services;
      t.orderRevenue += d.orderRevenue;
      t.orderCount += d.orders;
      t.salesRevenue += d.salesRevenue;
      t.salesCount += d.sales;
    });
    return t;
  }, [daily]);

  const showCompare = comparePrevious && period === 'current_month' && prevDaily.length > 0;
  const xKey = showCompare ? 'dayLabel' : 'date';
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  };
  const formatXLabel = (value: string) => (showCompare ? value : value ? formatDate(value) : value);

  const formatTooltipDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleExport = () => {
    if (!report) return;
    const headers = ['Date', 'Orders', 'Order Revenue', 'Services', 'Service Revenue', 'Sales', 'Sales Revenue'];
    const rows = report.daily.map((d) => [d.date, d.orders, d.orderRevenue, d.services, d.serviceRevenue, d.sales, d.salesRevenue]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-report-${report.period.label.replace(/\s/g, '-')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast({ title: 'Export Successful', description: 'Report has been downloaded.' });
  };

  const chartHeight = 320;
  const chartMargin = { top: 16, right: 24, left: 0, bottom: 8 };
  const lineStrokeWidth = 2.5;
  const lineStrokeWidthCurrent = 3;
  const gridStroke = '#e5e5e5';
  const chartBg = '#f4f4f5';
  const colorCurrent = '#1e3a8a';
  const colorPrevious = '#b91c1c';
  const formatPrice = (v: number) => (v >= 1000 ? `₹${(v / 1000).toFixed(1)}k` : `₹${v}`);
  const formatTooltipPrice = (v: number) => `₹${Number(v).toLocaleString()}`;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Sales Report</h1>
            <p className="text-muted-foreground text-sm sm:text-base">Service, orders & sales overview</p>
          </div>
          <Button onClick={handleExport} disabled={loading || !report}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>

        {/* Period selector */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Period</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'current_month' as const, label: 'Current month' },
                { key: 'previous_month' as const, label: 'Previous month' },
                { key: '7' as const, label: 'Last 7 days' },
                { key: '30' as const, label: 'Last 30 days' },
                { key: '90' as const, label: 'Last 90 days' },
              ].map(({ key, label }) => (
                <Button
                  key={key}
                  variant={period === key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPeriod(key)}
                  disabled={loading}
                >
                  {label}
                </Button>
              ))}
            </div>
            {period === 'current_month' && (
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={comparePrevious}
                  onChange={(e) => setComparePrevious(e.target.checked)}
                />
                Compare with previous month
              </label>
            )}
          </CardContent>
        </Card>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {/* Summary cards */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Service (Repairs)</CardTitle>
                  <Wrench className="h-4 w-4 text-blue-500 sm:h-5 sm:w-5" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold sm:text-2xl">₹{totals.serviceRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">{totals.serviceCount} jobs</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Orders (E‑commerce)</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-green-500 sm:h-5 sm:w-5" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold sm:text-2xl">₹{totals.orderRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">{totals.orderCount} orders</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Sales (Tally)</CardTitle>
                  <Package className="h-4 w-4 text-amber-500 sm:h-5 sm:w-5" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold sm:text-2xl">₹{totals.salesRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">{totals.salesCount} transactions</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                  <TrendingUp className="h-4 w-4 text-purple-500 sm:h-5 sm:w-5" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold sm:text-2xl">
                    ₹{(totals.serviceRevenue + totals.orderRevenue + totals.salesRevenue).toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">{report?.period.label ?? '—'}</p>
                </CardContent>
              </Card>
            </div>

            {/* Service graph */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Wrench className="h-4 w-4" /> Service (Repairs)
                </CardTitle>
                <p className="text-sm text-muted-foreground">Daily revenue (₹)</p>
              </CardHeader>
              <CardContent>
                {chartData.length === 0 ? (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground text-sm">No data for this period</div>
                ) : (
                  <div style={{ backgroundColor: chartBg, borderRadius: 8, padding: 12 }}>
                    <ResponsiveContainer width="100%" height={chartHeight}>
                      <LineChart data={chartData} margin={chartMargin}>
                        <CartesianGrid stroke={gridStroke} strokeDasharray="0" vertical={false} />
                        <XAxis dataKey={xKey} tickFormatter={formatXLabel} angle={-45} textAnchor="end" height={48} tick={{ fontSize: 12 }} />
                        <YAxis tickFormatter={(v) => formatPrice(v)} tick={{ fontSize: 12 }} width={48} />
                        <Tooltip
                          formatter={(value: number, name: string) => [formatTooltipPrice(Number(value)), name.replace('prev', 'Prev ')]}
                          labelFormatter={formatTooltipDate}
                          contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e5e5', borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                          labelStyle={{ fontWeight: 600 }}
                        />
                        <Legend verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: 16 }} iconType="line" iconSize={12} />
                        <Line type="monotone" dataKey="serviceRevenue" stroke={colorCurrent} strokeWidth={lineStrokeWidthCurrent} dot={false} activeDot={{ r: 4, strokeWidth: 2, stroke: colorCurrent }} connectNulls name="Current month" />
                        {showCompare && <Line type="monotone" dataKey="prevServiceRevenue" stroke={colorPrevious} strokeWidth={lineStrokeWidth} dot={false} activeDot={{ r: 4, strokeWidth: 2, stroke: colorPrevious }} connectNulls name="Previous month" />}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order graph */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" /> Orders (E‑commerce)
                </CardTitle>
                <p className="text-sm text-muted-foreground">Daily revenue (₹)</p>
              </CardHeader>
              <CardContent>
                {chartData.length === 0 ? (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground text-sm">No data for this period</div>
                ) : (
                  <div style={{ backgroundColor: chartBg, borderRadius: 8, padding: 12 }}>
                    <ResponsiveContainer width="100%" height={chartHeight}>
                      <LineChart data={chartData} margin={chartMargin}>
                        <CartesianGrid stroke={gridStroke} strokeDasharray="0" vertical={false} />
                        <XAxis dataKey={xKey} tickFormatter={formatXLabel} angle={-45} textAnchor="end" height={48} tick={{ fontSize: 12 }} />
                        <YAxis tickFormatter={(v) => formatPrice(v)} tick={{ fontSize: 12 }} width={48} />
                        <Tooltip
                          formatter={(value: number, name: string) => [formatTooltipPrice(Number(value)), name.replace('prev', 'Prev ')]}
                          labelFormatter={formatTooltipDate}
                          contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e5e5', borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                          labelStyle={{ fontWeight: 600 }}
                        />
                        <Legend verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: 16 }} iconType="line" iconSize={12} />
                        <Line type="monotone" dataKey="orderRevenue" stroke={colorCurrent} strokeWidth={lineStrokeWidthCurrent} dot={false} activeDot={{ r: 4, strokeWidth: 2, stroke: colorCurrent }} connectNulls name="Current month" />
                        {showCompare && <Line type="monotone" dataKey="prevOrderRevenue" stroke={colorPrevious} strokeWidth={lineStrokeWidth} dot={false} activeDot={{ r: 4, strokeWidth: 2, stroke: colorPrevious }} connectNulls name="Previous month" />}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Sales graph */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Package className="h-4 w-4" /> Sales (Tally)
                </CardTitle>
                <p className="text-sm text-muted-foreground">Daily revenue (₹)</p>
              </CardHeader>
              <CardContent>
                {chartData.length === 0 ? (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground text-sm">No data for this period</div>
                ) : (
                  <div style={{ backgroundColor: chartBg, borderRadius: 8, padding: 12 }}>
                    <ResponsiveContainer width="100%" height={chartHeight}>
                      <LineChart data={chartData} margin={chartMargin}>
                        <CartesianGrid stroke={gridStroke} strokeDasharray="0" vertical={false} />
                        <XAxis dataKey={xKey} tickFormatter={formatXLabel} angle={-45} textAnchor="end" height={48} tick={{ fontSize: 12 }} />
                        <YAxis tickFormatter={(v) => formatPrice(v)} tick={{ fontSize: 12 }} width={48} />
                        <Tooltip
                          formatter={(value: number, name: string) => [formatTooltipPrice(Number(value)), name.replace('prev', 'Prev ')]}
                          labelFormatter={formatTooltipDate}
                          contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e5e5', borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                          labelStyle={{ fontWeight: 600 }}
                        />
                        <Legend verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: 16 }} iconType="line" iconSize={12} />
                        <Line type="monotone" dataKey="salesRevenue" stroke={colorCurrent} strokeWidth={lineStrokeWidthCurrent} dot={false} activeDot={{ r: 4, strokeWidth: 2, stroke: colorCurrent }} connectNulls name="Current month" />
                        {showCompare && <Line type="monotone" dataKey="prevSalesRevenue" stroke={colorPrevious} strokeWidth={lineStrokeWidth} dot={false} activeDot={{ r: 4, strokeWidth: 2, stroke: colorPrevious }} connectNulls name="Previous month" />}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
