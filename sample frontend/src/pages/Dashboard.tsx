import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Users, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { fetchKPI, fetchDailySales, fetchOrders } from '@/api/adminApi';
import type { KPI, DailySales, Order } from '@/types';
import { KPICard } from '@/components/admin/KPICard';
import { SalesChart } from '@/components/admin/SalesChart';
import { RecentOrdersTable } from '@/components/admin/RecentOrdersTable';

export default function Dashboard() {
  const [kpi, setKpi] = useState<KPI | null>(null);
  const [salesData, setSalesData] = useState<DailySales[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [kpiData, sales, orders] = await Promise.all([
          fetchKPI(),
          fetchDailySales(30),
          fetchOrders(),
        ]);
        setKpi(kpiData);
        setSalesData(sales);
        setRecentOrders(orders.slice(0, 10));
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      }
    };
    loadData();
  }, []);

  const kpiCards = [
    {
      title: 'Total Users',
      value: kpi?.totalUsers || 0,
      icon: Users,
      color: 'text-blue-500',
    },
    {
      title: "Today's Sales",
      value: `₹${(kpi?.todaySales || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-500',
    },
    {
      title: 'This Month Revenue',
      value: `₹${(kpi?.monthRevenue || 0).toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-purple-500',
    },
    {
      title: 'Low Stock Items',
      value: kpi?.lowStockItems || 0,
      icon: AlertCircle,
      color: 'text-orange-500',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="animate-fade-in-up">
          <h1 className="text-3xl font-display font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome to RsMeters Admin Panel</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 stagger-children">
          {kpiCards.map((card) => (
            <KPICard key={card.title} {...card} />
          ))}
        </div>

        <div className="animate-fade-in-up">
          <SalesChart data={salesData} />
        </div>
        <div className="animate-fade-in-up">
          <RecentOrdersTable orders={recentOrders} />
        </div>
      </div>
    </DashboardLayout>
  );
}
