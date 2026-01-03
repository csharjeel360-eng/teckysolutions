import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  X, 
  Home, 
  ShoppingBag, 
  Tag, 
  FileText, 
  User,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  Search,
  Heart,
  Clock,
  Star
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, categories } = useApp();
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  // Close sidebar when route changes
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
  }, [location.pathname]);

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/');
  };

  const toggleSubmenu = (menuName) => {
    setActiveSubmenu(activeSubmenu === menuName ? null : menuName);
  };

  const mainMenuItems = [
    {
      name: 'Home',
      path: '/',
      icon: Home,
      exact: true
    },
    {
      name: 'Products',
      path: '/products',
      icon: ShoppingBag,
      submenu: [
        { name: 'All Products', path: '/products' },
        { name: 'Featured', path: '/products?featured=true' },
        { name: 'On Sale', path: '/products?sale=true' },
        { name: 'New Arrivals', path: '/products?new=true' }
      ]
    },
    {
      name: 'Categories',
      path: '/categories',
      icon: Tag,
      submenu: categories.slice(0, 8).map(category => ({
        name: category.name,
        path: `/category/${category._id}/products`
      }))
    },
    {
      name: 'Blogs',
      path: '/blogs',
      icon: FileText
    }
  ];

  const userMenuItems = [
    {
      name: 'My Profile',
      path: '/profile',
      icon: User
    },
    {
      name: 'Wishlist',
      path: '/wishlist',
      icon: Heart
    },
    {
      name: 'Order History',
      path: '/orders',
      icon: Clock
    },
    {
      name: 'My Reviews',
      path: '/reviews',
      icon: Star
    }
  ];

  const supportMenuItems = [
    {
      name: 'Help Center',
      path: '/help',
      icon: HelpCircle
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: Settings
    }
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const renderMenuItem = (item, index) => {
    const Icon = item.icon;
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isItemActive = isActive(item.path, item.exact);
    const isSubmenuOpen = activeSubmenu === item.name;

    return (
      <div key={index} className="border-b border-gray-200 last:border-b-0">
        {hasSubmenu ? (
          <>
            <button
              onClick={() => toggleSubmenu(item.name)}
              className={`w-full flex items-center justify-between py-4 px-4 rounded-lg transition-colors ${
                isItemActive
                  ? 'bg-temu-red text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </div>
              <ChevronRight 
                className={`w-4 h-4 transition-transform ${
                  isSubmenuOpen ? 'rotate-90' : ''
                }`} 
              />
            </button>

            {/* Submenu */}
            {isSubmenuOpen && (
              <div className="ml-8 mt-2 space-y-1 pb-2">
                {item.submenu.map((subItem, subIndex) => (
                  <Link
                    key={subIndex}
                    to={subItem.path}
                    className={`block py-2 px-3 rounded-lg transition-colors ${
                      isActive(subItem.path)
                        ? 'bg-temu-red bg-opacity-10 text-temu-red font-medium'
                        : 'text-gray-600 hover:text-temu-red hover:bg-gray-50'
                    }`}
                  >
                    {subItem.name}
                  </Link>
                ))}
              </div>
            )}
          </>
        ) : (
          <Link
            to={item.path}
            className={`flex items-center space-x-3 py-4 px-4 rounded-lg transition-colors ${
              isItemActive
                ? 'bg-temu-red text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="font-medium">{item.name}</span>
          </Link>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Sidebar Panel */}
      <div className="absolute left-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
          <Link to="/" className="flex items-center space-x-2" onClick={onClose}>
            <div className="w-8 h-8 bg-gradient-to-r from-temu-red to-temu-pink rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="text-xl font-bold text-gray-900">TemuClone</span>
          </Link>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-temu-red focus:border-transparent"
            />
          </div>
        </div>

        {/* User Info */}
        {isAuthenticated ? (
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-temu-blue rounded-full flex items-center justify-center text-white font-semibold text-lg">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-sm text-gray-600 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="text-center">
              <p className="text-gray-700 mb-3">Welcome to TemuClone</p>
              <div className="flex space-x-2">
                <Link
                  to="/admin/login"
                  onClick={onClose}
                  className="flex-1 bg-temu-red text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-600 transition-colors text-center"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={onClose}
                  className="flex-1 border border-temu-red text-temu-red py-2 px-4 rounded-lg font-semibold hover:bg-temu-red hover:text-white transition-colors text-center"
                >
                  Register
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Main Navigation */}
        <nav className="p-4">
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Main Menu
            </h3>
            <div className="space-y-1">
              {mainMenuItems.map(renderMenuItem)}
            </div>
          </div>

          {/* User Menu */}
          {isAuthenticated && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                My Account
              </h3>
              <div className="space-y-1">
                {userMenuItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center space-x-3 py-3 px-4 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? 'bg-temu-red text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Support Menu */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Support
            </h3>
            <div className="space-y-1">
              {supportMenuItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  onClick={onClose}
                  className="flex items-center space-x-3 py-3 px-4 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Logout Button */}
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 py-3 px-4 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors border-t border-gray-200 mt-4"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          )}
        </nav>

        {/* Quick Links */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <Link
              to="/about"
              onClick={onClose}
              className="text-gray-600 hover:text-temu-red transition-colors text-center py-2"
            >
              About Us
            </Link>
            <Link
              to="/contact"
              onClick={onClose}
              className="text-gray-600 hover:text-temu-red transition-colors text-center py-2"
            >
              Contact
            </Link>
            <Link
              to="/privacy"
              onClick={onClose}
              className="text-gray-600 hover:text-temu-red transition-colors text-center py-2"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              onClick={onClose}
              className="text-gray-600 hover:text-temu-red transition-colors text-center py-2"
            >
              Terms of Service
            </Link>
          </div>
        </div>

        {/* App Download Banner */}
        <div className="p-4 border-t border-gray-200">
          <div className="bg-gradient-to-r from-temu-purple to-temu-blue rounded-2xl p-4 text-white text-center">
            <h4 className="font-semibold mb-2">Get the App</h4>
            <p className="text-sm opacity-90 mb-3">
              Shop faster and easier with our mobile app
            </p>
            <div className="flex space-x-2">
              <button className="flex-1 bg-white text-temu-purple py-2 px-3 rounded-lg text-xs font-semibold hover:bg-gray-100 transition-colors">
                App Store
              </button>
              <button className="flex-1 bg-white text-temu-purple py-2 px-3 rounded-lg text-xs font-semibold hover:bg-gray-100 transition-colors">
                Google Play
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
