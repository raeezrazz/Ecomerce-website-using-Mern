/**
 * API Placeholder Service
 * 
 * This file contains mock API functions that simulate network requests.
 * Replace these with actual API calls when connecting to your backend.
 * 
 * Base URL: /api/admin
 * 
 * Endpoints:
 * - GET    /api/admin/users              - Fetch all users
 * - GET    /api/admin/users/:id          - Fetch single user
 * - POST   /api/admin/users              - Create user
 * - PUT    /api/admin/users/:id          - Update user
 * - DELETE /api/admin/users/:id          - Delete user
 * 
 * - GET    /api/admin/products           - Fetch all products
 * - GET    /api/admin/products/:id       - Fetch single product
 * - POST   /api/admin/products           - Create product
 * - PUT    /api/admin/products/:id       - Update product
 * - DELETE /api/admin/products/:id       - Delete product
 * 
 * - GET    /api/admin/categories         - Fetch all categories
 * - POST   /api/admin/categories         - Create category
 * - PUT    /api/admin/categories/:id     - Update category
 * - DELETE /api/admin/categories/:id     - Delete category
 * 
 * - GET    /api/admin/orders             - Fetch all orders
 * - GET    /api/admin/orders/:id         - Fetch single order
 * - PUT    /api/admin/orders/:id/status  - Update order status
 * 
 * - GET    /api/admin/tally              - Fetch tally entries
 * - POST   /api/admin/tally              - Create tally entry
 * - PUT    /api/admin/tally/:id          - Update tally entry
 * - DELETE /api/admin/tally/:id          - Delete tally entry
 * 
 * - GET    /api/admin/dashboard/kpi      - Fetch KPI data
 * - GET    /api/admin/dashboard/sales    - Fetch sales data
 * 
 * - POST   /api/admin/auth/login         - Login
 * - POST   /api/admin/auth/logout        - Logout
 */
import apiClient from "@/api/apiClient/axios";
import type { User, Product, Category, Order, TallyEntry, DailySales, KPI } from "@/types";

// -------- AUTH --------
export const login = async (email: string, password: string) => {
  const res = await apiClient.post("/api/admin/auth/login", { email, password });
  return res.data;
};

export const logout = async () => {
  await apiClient.post("/api/admin/auth/logout");
};

// -------- USERS --------
export const fetchUsers = async (): Promise<User[]> => {
  const res = await apiClient.get("/api/admin/users");
  return res.data;
};

export const fetchUser = async (id: string): Promise<User> => {
  const res = await apiClient.get(`/api/admin/users/${id}`);
  return res.data;
};

export const createUser = async (user: Partial<User>): Promise<User> => {
  const res = await apiClient.post("/api/admin/users", user);
  return res.data;
};

export const updateUser = async (id: string, updates: Partial<User>): Promise<User> => {
  const res = await apiClient.put(`/api/admin/users/${id}`, updates);
  return res.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/admin/users/${id}`);
};

// -------- PRODUCTS --------
export const fetchProducts = async (): Promise<Product[]> => {
  const res = await apiClient.get("/api/admin/products");
  return res.data;
};

export const fetchProduct = async (id: string): Promise<Product> => {
  const res = await apiClient.get(`/api/admin/products/${id}`);
  return res.data;
};

export const createProduct = async (product: Partial<Product>): Promise<Product> => {
  const res = await apiClient.post("/api/admin/products", product);
  return res.data;
};

export const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product> => {
  const res = await apiClient.put(`/api/admin/products/${id}`, updates);
  return res.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/admin/products/${id}`);
};

// -------- CATEGORIES --------
export const fetchCategories = async (): Promise<Category[]> => {
  const res = await apiClient.get("/api/admin/categories");
  return res.data;
};

export const createCategory = async (category: Partial<Category>): Promise<Category> => {
  const res = await apiClient.post("/api/admin/categories", category);
  return res.data;
};

export const updateCategory = async (id: string, updates: Partial<Category>): Promise<Category> => {
  const res = await apiClient.put(`/api/admin/categories/${id}`, updates);
  return res.data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/admin/categories/${id}`);
};

// -------- ORDERS --------
export const fetchOrders = async (): Promise<Order[]> => {
  const res = await apiClient.get("/api/admin/orders");
  return res.data;
};

export const fetchOrder = async (id: string): Promise<Order> => {
  const res = await apiClient.get(`/api/admin/orders/${id}`);
  return res.data;
};

export const updateOrderStatus = async (
  id: string,
  status: string,
  type: "delivery" | "payment"
): Promise<Order> => {
  const res = await apiClient.put(`/api/admin/orders/${id}/status`, { status, type });
  return res.data;
};

// -------- TALLY --------
export const fetchTallyEntries = async (): Promise<TallyEntry[]> => {
  const res = await apiClient.get("/api/admin/tally");
  return res.data;
};

export const createTallyEntry = async (entry: Partial<TallyEntry>): Promise<TallyEntry> => {
  const res = await apiClient.post("/api/admin/tally", entry);
  return res.data;
};

export const updateTallyEntry = async (id: string, updates: Partial<TallyEntry>): Promise<TallyEntry> => {
  const res = await apiClient.put(`/api/admin/tally/${id}`, updates);
  return res.data;
};

export const deleteTallyEntry = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/admin/tally/${id}`);
};

// -------- DASHBOARD --------
export const fetchKPI = async (): Promise<KPI> => {
  const res = await apiClient.get("/api/admin/dashboard/kpi");
  return res.data;
};

export const fetchDailySales = async (days = 30): Promise<DailySales[]> => {
  const res = await apiClient.get(`/api/admin/dashboard/sales?days=${days}`);
  return res.data;
};

// -------- WAREHOUSE --------
export const fetchWarehouseItems = async (): Promise<any[]> => {
  const res = await apiClient.get("/api/admin/warehouse");
  return res.data;
};

export const fetchWarehouseItem = async (id: string): Promise<any> => {
  const res = await apiClient.get(`/api/admin/warehouse/${id}`);
  return res.data;
};

export const createWarehouseItem = async (item: any): Promise<any> => {
  const res = await apiClient.post("/api/admin/warehouse", item);
  return res.data;
};

export const updateWarehouseItem = async (id: string, updates: any): Promise<any> => {
  const res = await apiClient.put(`/api/admin/warehouse/${id}`, updates);
  return res.data;
};

export const deleteWarehouseItem = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/admin/warehouse/${id}`);
};

export const fetchLowStockItems = async (): Promise<any[]> => {
  const res = await apiClient.get("/api/admin/warehouse/low-stock");
  return res.data;
};