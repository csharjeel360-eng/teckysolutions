import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';

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
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* ===== PUBLIC ROUTES ===== */}
                <Route path="/" element={<Home />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/cart" element={<Cart />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/category/:id/products" element={<Products />} />
                <Route path="/blogs" element={<Blogs />} />
                <Route path="/blogs/:slug" element={<BlogDetail />} />
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
                
                {/* Admin Protected Routes */}
                <Route 
                  path="/admin/dashboard" 
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/categories" 
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <CategoryManagement />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/products" 
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <ProductManagement />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/blogs" 
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <BlogManagement />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/blogs/new" 
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <BlogEditor />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/blogs/edit/:id" 
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <BlogEditor />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/banners" 
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <BannerManagement />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/users" 
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <UserManagement />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/settings" 
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <Settings />
                    </ProtectedRoute>
                  } 
                />
                
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