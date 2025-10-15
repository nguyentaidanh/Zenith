import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ProductListPage } from './pages/ProductListPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { LoginPage } from './pages/LoginPage';
import { ProfilePage } from './pages/ProfilePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { WishlistPage } from './pages/WishlistPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';

// Admin Imports
import { ProtectedAdminRoute } from './components/admin/ProtectedAdminRoute';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductListPage } from './pages/admin/AdminProductListPage';
import { AdminOrderListPage } from './pages/admin/AdminOrderListPage';
import { AdminUserListPage } from './pages/admin/AdminUserListPage';
import { AdminProductEditPage } from './pages/admin/AdminProductEditPage';
import { AdminRatingsPage } from './pages/admin/AdminRatingsPage';
import { AdminSalesHistoryPage } from './pages/admin/AdminSalesHistoryPage';


const App: React.FC = () => {
  return (
    <StoreProvider>
      <HashRouter>
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedAdminRoute />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="products" element={<AdminProductListPage />} />
            <Route path="products/new" element={<AdminProductEditPage />} />
            <Route path="products/edit/:id" element={<AdminProductEditPage />} />
            <Route path="orders" element={<AdminOrderListPage />} />
            <Route path="users" element={<AdminUserListPage />} />
            <Route path="ratings" element={<AdminRatingsPage />} />
            <Route path="sales" element={<AdminSalesHistoryPage />} />
          </Route>

          {/* Client Routes */}
          <Route path="/*" element={<ClientLayout />} />

        </Routes>
      </HashRouter>
    </StoreProvider>
  );
}

const ClientLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-grow">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </main>
    <Footer />
  </div>
);


export default App;