import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import type { DailySales } from '@/types';

interface SalesChartProps {
  data: DailySales[];
}

const chartHeight = 320;
const chartMargin = { top: 16, right: 24, left: 0, bottom: 8 };
const lineStrokeWidth = 3;
const gridStroke = '#e5e5e5';
const chartBg = '#f4f4f5';
const colorPrimary = '#1e3a8a';

export function SalesChart({ data }: SalesChartProps) {
  const formattedData = data
    .map((item) => ({
      ...item,
      date: item.date || new Date().toISOString().split('T')[0],
      sales: Number(item.sales) || 0,
      orders: Number(item.orders) || 0,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const formatTooltipDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('en-IN', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const formatPrice = (v: number) => (v >= 1000 ? `₹${(v / 1000).toFixed(1)}k` : `₹${v}`);
  const formatTooltipPrice = (v: number) => `₹${Number(v).toLocaleString()}`;

  return (
    <Card className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
      <CardHeader>
        <CardTitle>Sales Overview (Last 30 Days)</CardTitle>
        <p className="text-sm text-muted-foreground">Daily revenue (₹)</p>
      </CardHeader>
      <CardContent>
        {formattedData.length === 0 ? (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground text-sm">
            No sales data available
          </div>
        ) : (
          <div style={{ backgroundColor: chartBg, borderRadius: 8, padding: 12 }}>
            <ResponsiveContainer width="100%" height={chartHeight}>
              <LineChart data={formattedData} margin={chartMargin}>
                <CartesianGrid stroke={gridStroke} strokeDasharray="0" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  angle={-45}
                  textAnchor="end"
                  height={48}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  tickFormatter={(v) => formatPrice(v)}
                  tick={{ fontSize: 12 }}
                  width={48}
                />
                <Tooltip
                  formatter={(value: number) => [formatTooltipPrice(Number(value)), 'Sales']}
                  labelFormatter={formatTooltipDate}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e5e5',
                    borderRadius: '6px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  }}
                  labelStyle={{ fontWeight: 600 }}
                />
                <Legend verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: 16 }} iconType="line" iconSize={12} />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke={colorPrimary}
                  strokeWidth={lineStrokeWidth}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 2, stroke: colorPrimary }}
                  connectNulls
                  name="Sales"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
