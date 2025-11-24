import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  User,
  Menu,
  Settings,
  ShoppingCart,
  Home,
  Package,
  FolderOpen,
  BookOpen,
  X,
  Clock,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { debounce } from '../../utils/helpers';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [popularSearches] = useState([
    'Smartphone',
    'Laptop',
    'Headphones',
    'Watch',
    'Shoes'
  ]);
  
  const { user, isAuthenticated, logout } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  const getCountFromStorage = () => {
    try {
      const raw = localStorage.getItem('temu-clone-cart');
      if (!raw) return 0;
      const items = JSON.parse(raw);
      return (items || []).reduce((total, item) => total + (item.quantity || 0), 0);
    } catch (err) {
      console.warn('Failed to read cart from storage', err);
      return 0;
    }
  };

  useEffect(() => {
    // initialize
    setCartCount(getCountFromStorage());

    const handler = (e) => {
      if (e?.detail?.itemsCount !== undefined) {
        setCartCount(e.detail.itemsCount);
      } else {
        setCartCount(getCountFromStorage());
      }
    };

    window.addEventListener('cartUpdated', handler);
    return () => window.removeEventListener('cartUpdated', handler);
  }, []);
  const navigate = useNavigate();
  const location = useLocation();
  // Detect if we're on a blog detail page like /blogs/:slug
  const isBlogDetail = /^\/blogs\/[^/]+/.test(location.pathname);
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  // Save search to recent searches
  const saveToRecentSearches = (query) => {
    if (!query.trim()) return;
    
    const updatedSearches = [
      query,
      ...recentSearches.filter(search => search !== query)
    ].slice(0, 5);
    
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Clear search when route changes
  useEffect(() => {
    setSearchQuery('');
    setShowSearchSuggestions(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate('/');
  };

  // Debounced search function
  const debouncedSearch = debounce((query) => {
    if (query.trim()) {
      saveToRecentSearches(query);
      navigate(`/products?search=${encodeURIComponent(query)}`);
      setShowSearchSuggestions(false);
    }
  }, 500);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.trim()) {
      setShowSearchSuggestions(true);
      debouncedSearch(value);
    } else {
      setShowSearchSuggestions(false);
      handleClearSearch();
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      saveToRecentSearches(searchQuery);
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setShowSearchSuggestions(false);
      setSearchQuery('');
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setShowSearchSuggestions(false);
    // Navigate back to products without search query
    if (location.pathname === '/products') {
      navigate('/products');
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    saveToRecentSearches(suggestion);
    navigate(`/products?search=${encodeURIComponent(suggestion)}`);
    setShowSearchSuggestions(false);
  };

  const handleClearFilters = () => {
    // Clear all search filters and navigate to base products page
    navigate('/products');
    setSearchQuery('');
    setShowSearchSuggestions(false);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-[#2563eb] transition-colors rounded-lg hover:bg-gray-100"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-[#2563eb] to-[#f97316] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">ShopHub</span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 lg:ml-12">
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-gray-700 hover:text-[#2563eb] transition-colors font-medium"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link 
              to="/products" 
              className="flex items-center space-x-2 text-gray-700 hover:text-[#2563eb] transition-colors font-medium"
            >
              <Package className="h-4 w-4" />
              <span>Products</span>
            </Link>
            <Link 
              to="/categories" 
              className="flex items-center space-x-2 text-gray-700 hover:text-[#2563eb] transition-colors font-medium"
            >
              <FolderOpen className="h-4 w-4" />
              <span>Categories</span>
            </Link>
            <Link 
              to="/blogs" 
              className="flex items-center space-x-2 text-gray-700 hover:text-[#2563eb] transition-colors font-medium"
            >
              <BookOpen className="h-4 w-4" />
              <span>Blogs</span>
            </Link>
          </div>

          {/* Search Bar (hidden on blog detail pages) */}
          {!isBlogDetail && (
            <div className="hidden md:flex flex-1 max-w-2xl mx-4 lg:mx-8" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => searchQuery.trim() && setShowSearchSuggestions(true)}
                  placeholder="Search products, brands, and more..."
                  className="w-full px-4 py-2 pl-10 pr-20 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent text-sm"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                
                {/* Clear Search Button */}
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-20 top-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                
                {/* Search Button */}
                <button 
                  type="submit" 
                  className="absolute right-2 top-1 bg-[#2563eb] text-white px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-[#1e40af] transition-colors"
                >
                  Search
                </button>
              </div>

              {/* Search Suggestions */}
              {showSearchSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto">
                  {/* Current Search */}
                  {searchQuery.trim() && (
                    <div className="p-3 border-b border-gray-100">
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                        Search for "{searchQuery}"
                      </div>
                      <button
                        onClick={() => handleSuggestionClick(searchQuery)}
                        className="w-full text-left p-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 flex items-center"
                      >
                        <Search className="w-4 h-4 mr-3 text-gray-400" />
                        Search for "{searchQuery}"
                      </button>
                    </div>
                  )}

                  {/* Recent Searches */}
                  {recentSearches.length > 0 && (
                    <div className="p-3 border-b border-gray-100">
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 flex items-center">
                        <Clock className="w-3 h-3 mr-2" />
                        Recent Searches
                      </div>
                      <div className="space-y-1">
                        {recentSearches.map((search, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(search)}
                            className="w-full text-left p-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 flex items-center justify-between"
                          >
                            <span>{search}</span>
                            <Clock className="w-3 h-3 text-gray-400" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Popular Searches */}
                  {popularSearches.length > 0 && (
                    <div className="p-3 border-b border-gray-100">
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 flex items-center">
                        <TrendingUp className="w-3 h-3 mr-2" />
                        Popular Searches
                      </div>
                      <div className="space-y-1">
                        {popularSearches.map((search, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(search)}
                            className="w-full text-left p-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                          >
                            {search}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Clear Filters Button */}
                  {(location.pathname === '/products' && location.search) && (
                    <div className="p-3 border-t border-gray-100">
                      <button
                        onClick={handleClearFilters}
                        className="w-full text-center py-2 text-sm text-[#f97316] hover:text-[#ea580c] font-medium transition-colors"
                      >
                        Clear All Filters
                      </button>
                    </div>
                  )}
                </div>
              )}
            </form>
            </div>
          )}

          {/* Navigation Icons and User Menu */}
          <div className="flex items-center space-x-4">
            {/* Mobile Search Icon */}
            <button 
              onClick={() => navigate('/products')}
              className="md:hidden p-2 text-gray-700 hover:text-[#2563eb] transition-colors rounded-lg hover:bg-gray-100"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Cart Icon */}
            <Link 
              to="/cart"
              className="p-2 text-gray-700 hover:text-[#2563eb] transition-colors rounded-lg hover:bg-gray-100 relative"
            >
              <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#2563eb] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
            </Link>

            {/* User Menu */}
            <div className="relative" ref={profileRef}>
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 p-2 text-gray-700 hover:text-[#2563eb] transition-colors rounded-lg hover:bg-gray-100"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-[#2563eb] to-[#f97316] rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span className="hidden lg:block text-sm font-medium">Account</span>
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {user?.name || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user?.email}
                        </p>
                        {isAdmin && (
                          <span className="inline-block mt-1 px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full font-medium">
                            Administrator
                          </span>
                        )}
                      </div>
                      
                      {/* Menu Items */}
                      <div className="py-1">
                        {/* Admin Dashboard Link */}
                        {isAdmin && (
                          <Link
                            to="/admin/dashboard"
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-purple-700 hover:bg-purple-50 transition-colors"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <Settings className="h-4 w-4" />
                            <span>Admin Dashboard</span>
                          </Link>
                        )}
                        
                        <Link
                          to="/profile"
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <User className="h-4 w-4" />
                          <span>My Profile</span>
                        </Link>
                      </div>
                      
                      {/* Logout Button */}
                      <div className="border-t border-gray-100 pt-1">
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="hidden sm:block bg-[#2563eb] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#1e40af] transition-colors text-sm"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/login"
                    className="sm:hidden p-2 text-gray-700 hover:text-[#2563eb] transition-colors rounded-lg hover:bg-gray-100"
                  >
                    <User className="h-5 w-5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isMenuOpen && (
          <div className="md:hidden pb-4" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => searchQuery.trim() && setShowSearchSuggestions(true)}
                  placeholder="Search products..."
                  className="w-full px-4 py-2 pl-10 pr-16 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent text-sm"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-12 top-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                
                <button 
                  type="submit" 
                  className="absolute right-2 top-1.5 bg-[#2563eb] text-white px-3 py-1 rounded-full text-xs font-semibold hover:bg-[#1e40af] transition-colors"
                >
                  Go
                </button>
              </div>

              {/* Clear Filters Button for Mobile */}
              {(location.pathname === '/products' && location.search) && (
                <button
                  onClick={handleClearFilters}
                  className="w-full mt-2 text-center py-2 text-sm text-[#f97316] hover:text-[#ea580c] font-medium transition-colors"
                >
                  Clear All Filters
                </button>
              )}
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="flex flex-col space-y-1 py-2">
              <Link
                to="/"
                className="flex items-center space-x-2 px-4 py-3 text-gray-700 hover:text-[#2563eb] hover:bg-blue-50 transition-colors font-medium rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <Link
                to="/products"
                className="flex items-center space-x-2 px-4 py-3 text-gray-700 hover:text-[#2563eb] hover:bg-blue-50 transition-colors rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                <Package className="h-4 w-4" />
                <span>Products</span>
              </Link>
              <Link
                to="/categories"
                className="flex items-center space-x-2 px-4 py-3 text-gray-700 hover:text-[#2563eb] hover:bg-blue-50 transition-colors rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                <FolderOpen className="h-4 w-4" />
                <span>Categories</span>
              </Link>
              <Link
                to="/blogs"
                className="flex items-center space-x-2 px-4 py-3 text-gray-700 hover:text-[#2563eb] hover:bg-blue-50 transition-colors rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                <BookOpen className="h-4 w-4" />
                <span>Blogs</span>
              </Link>

              {/* Cart in Mobile Menu */}
              <Link
                to="/cart"
                className="flex items-center space-x-2 px-4 py-3 text-gray-700 hover:text-[#2563eb] hover:bg-blue-50 transition-colors rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Shopping Cart</span>
              </Link>
              
              {/* Admin Dashboard Button in Mobile Menu */}
              {isAuthenticated && isAdmin && (
                <Link 
                  to="/admin/dashboard" 
                  className="flex items-center space-x-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Settings className="h-4 w-4" />
                  <span>Admin Dashboard</span>
                </Link>
              )}
              
              {/* Auth Links */}
              {!isAuthenticated ? (
                <div className="flex space-x-2 px-4 py-3">
                  <Link
                    to="/login"
                    className="flex-1 text-center bg-[#2563eb] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#1e40af] transition-colors text-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="flex-1 text-center border border-[#2563eb] text-[#2563eb] px-4 py-2 rounded-lg font-semibold hover:bg-[#2563eb] hover:text-white transition-colors text-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div className="px-4 py-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">Signed in as</p>
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;