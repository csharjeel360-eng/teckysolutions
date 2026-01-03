import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import ScrollToTop from './components/Common/ScrollToTop';

// Public Pages
import Home from './pages/Public/Home';
import Categories from './pages/Public/Categories';
import Products from './pages/Public/Products';
import ProductDetail from './pages/Public/ProductDetail';
import Blogs from './pages/Public/Blogs';
import BlogDetail from './pages/Public/BlogDetail';
import Cart from './pages/Public/Cart';
import NotFound from './pages/Public/NotFound';
import Unauthorized from './pages/Public/Unauthorized';
import PrivacyPolicy from './pages/Public/PrivacyPolicy';
import TermsOfService from './pages/Public/TermsOfService';
// Auth Pages (Updated for Firebase)
import UserLogin from './pages/auth/UserLogin';
import UserSignup from './pages/auth/UserSignup';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Profile from './pages/auth/Profile';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import CreateAdmin from './pages/admin/CreateAdmin';
import AdminDashboard from './pages/admin/AdminDashboard';
import BannerManagement from './pages/admin/BannerManagement';
import CategoryManagement from './pages/admin/CategoryManagement';
import ProductManagement from './pages/admin/ProductManagement';
import UserManagement from './pages/admin/UserManagement';
import BlogManagement from './pages/admin/BlogManagement';
import BlogEditor from './pages/admin/BlogEditor';
import Settings from './pages/admin/Settings';
import AdminLayout from './components/Admins/AdminLayout';

// Protected Route Component
import ProtectedRoute from './components/Common/ProtectedRoute';

// Debug/Test Components
import TestFirebase from './components/TestFirebase';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <div className="App min-h-screen bg-gray-50 flex flex-col">
            <ScrollToTop />
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* ===== PUBLIC ROUTES ===== */}
                <Route path="/" element={<Home />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/cart" element={<Cart />} />
                <Route path="/product/:slug" element={<ProductDetail />} />
                <Route path="/category/:id/products" element={<Products />} />
                <Route path="/blogs" element={<Blogs />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                {/* ===== AUTHENTICATION ROUTES ===== */}
                {/* User Authentication (Firebase + Backend) */}
                <Route path="/login" element={<UserLogin />} />
                <Route path="/signup" element={<UserSignup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                
                {/* Protected User Routes */}
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />
                
                {/* ===== ADMIN ROUTES ===== */}
                {/* Admin Authentication (Backend Only) */}
                <Route path="/admin/login" element={<AdminLogin />} />
                {/* Development-only admin creation page (remove/protect in production) */}
                <Route path="/admin/create" element={<CreateAdmin />} />

                {/* Admin Protected Routes - AdminLayout handles auth checks internally */}
                <Route
                  path="/admin/*"
                  element={<AdminLayout />}
                >
                  <Route index element={<AdminDashboard />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="categories" element={<CategoryManagement />} />
                  <Route path="products" element={<ProductManagement />} />
                  <Route path="blogs" element={<BlogManagement />} />
                  <Route path="blogs/new" element={<BlogEditor />} />
                  <Route path="blogs/edit/:id" element={<BlogEditor />} />
                  <Route path="banners" element={<BannerManagement />} />
                  <Route path="users" element={<UserManagement />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
                
                {/* ===== DEBUG/TEST ROUTES ===== */}
                <Route path="/test-firebase" element={<TestFirebase />} />
                
                {/* ===== 404 ROUTE ===== */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
