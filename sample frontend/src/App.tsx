import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { CartProvider } from "@/contexts/CartContext";
import { FormDialogProvider } from "@/contexts/FormDialogContext";
import UserLayout from "@/components/layout/UserLayout";

// Admin Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Orders from "./pages/Orders";
import SalesReport from "./pages/SalesReport";
import Tally from "./pages/Tally";
import Settings from "./pages/Settings";

// User Pages
import Home from "./pages/user/Home";
import Shop from "./pages/user/Shop";
import ProductDetail from "./pages/user/ProductDetail";
import Cart from "./pages/user/Cart";
import Checkout from "./pages/user/Checkout";
import Profile from "./pages/user/Profile";
import Auth from "./pages/user/Auth";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
  }, []);

  if (isAuthenticated === null) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <FormDialogProvider>
          <Routes>
            {/* User-facing routes */}
            <Route path="/" element={<UserLayout><Home /></UserLayout>} />
            <Route path="/shop" element={<UserLayout><Shop /></UserLayout>} />
            <Route path="/product/:id" element={<UserLayout><ProductDetail /></UserLayout>} />
            <Route path="/cart" element={<UserLayout><Cart /></UserLayout>} />
            <Route path="/checkout" element={<UserLayout><Checkout /></UserLayout>} />
            <Route path="/profile" element={<UserLayout><Profile /></UserLayout>} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Admin routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
            <Route path="/admin/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
            <Route path="/admin/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
            <Route path="/admin/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            <Route path="/admin/sales" element={<ProtectedRoute><SalesReport /></ProtectedRoute>} />
            <Route path="/admin/tally" element={<ProtectedRoute><Tally /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
          </FormDialogProvider>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
