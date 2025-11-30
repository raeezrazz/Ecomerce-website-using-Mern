import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchOrders } from '@/api/adminApi';
import type { Order } from '@/types';
import { OrderFilters } from '@/components/admin/OrderFilters';
import { OrdersTable } from '@/components/admin/OrdersTable';
import { OrderDetailSheet } from '@/components/admin/OrderDetailSheet';
import { Pagination } from '@/components/shared/Pagination';

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchOrders();
        setOrders(data);
      } catch (error) {
        console.error('Failed to load orders:', error);
      }
    };
    loadOrders();
  }, []);

  useEffect(() => {
    let filtered = orders;
    
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter((order) => order.deliveryStatus === statusFilter);
    }
    
    setFilteredOrders(filtered);
    setPage(1);
  }, [searchTerm, statusFilter, orders]);

  const paginatedOrders = filteredOrders.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);


  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">Manage customer orders and fulfillment</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Orders ({filteredOrders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <OrderFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
            />
            <OrdersTable orders={paginatedOrders} onViewOrder={setSelectedOrder} />
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              totalItems={filteredOrders.length}
              onPageChange={setPage}
            />
          </CardContent>
        </Card>

        <OrderDetailSheet
          order={selectedOrder}
          open={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onOrderUpdate={async () => {
            const data = await fetchOrders();
            setOrders(data);
          }}
        />
      </div>
    </DashboardLayout>
  );
}
