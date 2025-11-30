import type { User, Product, Category, Order, TallyEntry, DailySales } from '@/types';

// Generate 50 mock users
export const mockUsers: User[] = Array.from({ length: 50 }, (_, i) => ({
  id: `user-${i + 1}`,
  name: `Customer ${i + 1}`,
  email: `customer${i + 1}@example.com`,
  phone: `+91-${9000000000 + i}`,
  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
  registeredDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  status: Math.random() > 0.1 ? 'active' : 'blocked',
  address: `${i + 1} Main Street`,
  city: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata'][i % 5],
  totalOrders: Math.floor(Math.random() * 20),
}));

// Categories
export const mockCategories: Category[] = [
  { id: 'cat-1', name: 'Digital Meters', description: 'Digital speedometers and odometers', productCount: 45 },
  { id: 'cat-2', name: 'Meter Spares', description: 'Replacement parts for meters', productCount: 50 },
  { id: 'cat-3', name: 'Accessories', description: 'Additional accessories and tools', productCount: 25 },
];

// Generate 120 products
const productNames = {
  'Digital Meters': [
    'LCD Digital Speedometer', 'LED Odometer Display', 'Backlit Digital Meter',
    'Universal Digital Dashboard', 'Motorcycle Digital Meter', 'Car Digital Speedometer',
    'GPS Digital Speedometer', 'Wireless Digital Meter', 'Smart Digital Dashboard',
    'Multi-function Digital Meter', 'Racing Digital Speedometer', 'Vintage Style Digital Meter',
    'Compact Digital Odometer', 'Premium Digital Meter', 'Basic Digital Speedometer',
  ],
  'Meter Spares': [
    'LCD Screen Replacement', 'LED Bulb Set', 'Mounting Bracket',
    'Cable Harness Kit', 'Sensor Unit', 'Display Glass',
    'Circuit Board', 'Reset Button', 'Connector Set',
    'Rubber Gasket', 'Backlight Panel', 'Calibration Tool',
    'Needle Set', 'Bezel Ring', 'Speedometer Cable',
  ],
  'Accessories': [
    'Mount Kit', 'Protective Cover', 'Anti-glare Film',
    'Extension Cable', 'Cleaning Kit', 'Installation Tool Set',
    'Weatherproof Case', 'USB Adapter', 'Bluetooth Module',
    'Data Logger', 'Power Supply Unit', 'Remote Control',
  ],
};

export const mockProducts: Product[] = [];
let productId = 1;

Object.entries(productNames).forEach(([category, names]) => {
  const count = category === 'Digital Meters' ? 45 : category === 'Meter Spares' ? 50 : 25;
  for (let i = 0; i < count; i++) {
    const name = names[i % names.length] + (i >= names.length ? ` V${Math.floor(i / names.length) + 1}` : '');
    mockProducts.push({
      id: `prod-${productId}`,
      name,
      sku: `SKU-${String(productId).padStart(5, '0')}`,
      category: category as Product['category'],
      price: Math.floor(Math.random() * 5000) + 500,
      stock: Math.floor(Math.random() * 100),
      description: `High-quality ${name.toLowerCase()} with excellent durability and performance.`,
      images: [`https://placehold.co/400x400/2563eb/ffffff?text=${encodeURIComponent(name.slice(0, 20))}`],
      createdAt: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    });
    productId++;
  }
});

// Generate 200 orders
export const mockOrders: Order[] = Array.from({ length: 200 }, (_, i) => {
  const numItems = Math.floor(Math.random() * 3) + 1;
  const items = Array.from({ length: numItems }, () => {
    const product = mockProducts[Math.floor(Math.random() * mockProducts.length)];
    const quantity = Math.floor(Math.random() * 3) + 1;
    return {
      productId: product.id,
      productName: product.name,
      quantity,
      price: product.price,
    };
  });
  
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const orderDate = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000);
  const customer = mockUsers[Math.floor(Math.random() * mockUsers.length)];
  
  const statuses: Order['deliveryStatus'][] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  const deliveryStatus = statuses[Math.floor(Math.random() * statuses.length)];
  
  return {
    id: `ORD-${String(i + 1001).padStart(6, '0')}`,
    customerId: customer.id,
    customerName: customer.name,
    items,
    totalAmount,
    paymentStatus: Math.random() > 0.3 ? 'Paid' : 'Unpaid',
    deliveryStatus,
    orderDate: orderDate.toISOString().split('T')[0],
    deliveryDate: deliveryStatus === 'Delivered' ? new Date(orderDate.getTime() + Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined,
    shippingAddress: `${customer.address}, ${customer.city}`,
  };
});

// Generate 60 tally/service entries
export const mockTallyEntries: TallyEntry[] = Array.from({ length: 60 }, (_, i) => {
  const date = new Date(Date.now() - (59 - i) * 24 * 60 * 60 * 1000);
  const serviceType = i % 3 === 0 ? 'sale' : 'repair';
  const status = ['pending', 'in-progress', 'completed', 'delivered'][Math.floor(Math.random() * 4)] as TallyEntry['status'];
  const serviceCharge = serviceType === 'repair' ? Math.floor(Math.random() * 800) + 200 : Math.floor(Math.random() * 2000) + 500;
  const partsCost = serviceType === 'repair' ? Math.floor(Math.random() * 500) : 0;
  
  return {
    id: `tally-${i + 1}`,
    date: date.toISOString().split('T')[0],
    customerName: `Customer ${i + 1}`,
    phone: `98${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
    itemType: ['LCD Digital Speedometer', 'Analog Speedometer', 'Tachometer', 'Fuel Gauge', 'Speedometer Cable'][Math.floor(Math.random() * 5)],
    serviceType,
    status,
    serviceCharge,
    partsCost,
    totalAmount: serviceCharge + partsCost,
    paymentStatus: ['paid', 'unpaid', 'partial'][Math.floor(Math.random() * 3)] as TallyEntry['paymentStatus'],
    dateCompleted: status === 'completed' || status === 'delivered' ? date.toISOString().split('T')[0] : undefined,
    notes: i % 4 === 0 ? 'Urgent repair needed' : i % 3 === 0 ? 'Customer complained about accuracy' : '',
  };
});

// Generate daily sales data for last 30 days
export const mockDailySales: DailySales[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000);
  return {
    date: date.toISOString().split('T')[0],
    sales: Math.floor(Math.random() * 50000) + 10000,
    orders: Math.floor(Math.random() * 20) + 5,
  };
});
