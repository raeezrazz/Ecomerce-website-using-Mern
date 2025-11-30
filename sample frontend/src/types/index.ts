export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  registeredDate: string;
  status: 'active' | 'blocked';
  address?: string;
  city?: string;
  totalOrders?: number;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: 'Digital Meters' | 'Meter Spares' | 'Accessories';
  price: number;
  stock: number;
  description: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  totalAmount: number;
  paymentStatus: 'Paid' | 'Unpaid';
  deliveryStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  orderDate: string;
  deliveryDate?: string;
  shippingAddress: string;
}

export interface UsedPart {
  id: string;
  partName: string;
  quantity: number;
  rate: number;
  total: number;
}

export interface TallyEntry {
  id: string;
  date: string;
  customerName: string;
  phone: string;
  itemType: string;
  serviceType: 'repair' | 'sale';
  status: 'pending' | 'in-progress' | 'completed' | 'delivered';
  serviceCharge: number;
  usedParts: UsedPart[];
  partsCost: number; // Keep for backward compatibility, calculated from usedParts
  totalAmount: number;
  paymentStatus: 'paid' | 'unpaid' | 'partial';
  dateCompleted?: string;
  notes: string;
  photos?: string[];
}

export interface WarehouseItem {
  id: string;
  name: string;
  sku: string;
  category: 'Digital Meters' | 'Meter Spares' | 'Accessories';
  currentStock: number;
  unit: string;
  costPrice: number;
  sellingPrice: number;
  location?: string;
  lastUpdated: string;
}

export interface DailySales {
  date: string;
  sales: number;
  orders: number;
}

export interface KPI {
  totalUsers: number;
  todaySales: number;
  monthRevenue: number;
  lowStockItems: number;
}
