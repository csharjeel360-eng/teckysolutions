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
    'AI Tools',
    'Software',
    'Productivity',
    'Marketing',
    'Design Tools'
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
  const isBlogDetail = /^\/blogs\/[^/]+/.test(location.pathname);
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

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

  useEffect(() => {
    setSearchQuery('');
    setShowSearchSuggestions(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate('/');
  };

  const saveToRecentSearches = (query) => {
    if (!query.trim()) return;
    
    const updatedSearches = [
      query,
      ...recentSearches.filter(search => search !== query)
    ].slice(0, 5);
    
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

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
    navigate('/products');
    setSearchQuery('');
    setShowSearchSuggestions(false);
  };

  const isAdmin = user?.role === 'admin';

  const TextLogo = () => (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-white rounded-sm transform rotate-45"></div>
        </div>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"></div>
        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
      </div>
      <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
        Trendy<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Breeze</span>
      </span>
    </div>
  );

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Mobile Menu Button and Logo */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-black transition-colors rounded-lg hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <Link to="/" className="flex items-center">
              <TextLogo />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-8 lg:ml-12">
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors font-medium group relative px-3 py-2 rounded-lg hover:bg-gray-50"
            >
              <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-blue-50 flex items-center justify-center transition-colors">
                <Home className="h-4 w-4 text-gray-600 group-hover:text-blue-600" />
              </div>
              <span className="group-hover:font-semibold whitespace-nowrap">Home</span>
            </Link>
            
            <Link 
              to="/products" 
              className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors font-medium group relative px-3 py-2 rounded-lg hover:bg-gray-50"
            >
              <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-green-50 flex items-center justify-center transition-colors">
                <Package className="h-4 w-4 text-gray-600 group-hover:text-green-600" />
              </div>
              <span className="group-hover:font-semibold whitespace-nowrap">Products</span>
            </Link>
            
            <Link 
              to="/categories" 
              className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors font-medium group relative px-3 py-2 rounded-lg hover:bg-gray-50"
            >
              <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-purple-50 flex items-center justify-center transition-colors">
                <FolderOpen className="h-4 w-4 text-gray-600 group-hover:text-purple-600" />
              </div>
              <span className="group-hover:font-semibold whitespace-nowrap">Categories</span>
            </Link>
            
            <Link 
              to="/blogs" 
              className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors font-medium group relative px-3 py-2 rounded-lg hover:bg-gray-50"
            >
              <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-orange-50 flex items-center justify-center transition-colors">
                <BookOpen className="h-4 w-4 text-gray-600 group-hover:text-orange-600" />
              </div>
              <span className="group-hover:font-semibold whitespace-nowrap">Blogs</span>
            </Link>
          </div>

          {/* Search Bar - Responsive */}
          {!isBlogDetail && (
            <div className={`hidden md:flex flex-1 max-w-2xl mx-2 lg:mx-4 xl:mx-8 ${isMenuOpen ? 'hidden' : 'flex'}`} ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <div className="relative group">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => searchQuery.trim() && setShowSearchSuggestions(true)}
                    placeholder="Search AI tools, software, blogs..."
                    className="w-full px-4 py-2 pl-10 pr-20 sm:pl-12 sm:pr-24 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50 group-hover:bg-white transition-all duration-300"
                  />
                  <Search className="absolute left-3 sm:left-4 top-2.5 sm:top-3 h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="absolute right-16 sm:right-20 top-2 sm:top-2.5 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                  )}
                  
                  <button 
                    type="submit" 
                    className="absolute right-2 top-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    Search
                  </button>
                </div>

                {/* Search Suggestions */}
                {showSearchSuggestions && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto">
                    {searchQuery.trim() && (
                      <div className="p-3 border-b border-gray-100 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                          Search for "{searchQuery}"
                        </div>
                        <button
                          onClick={() => handleSuggestionClick(searchQuery)}
                          className="w-full text-left p-3 rounded-lg hover:bg-white transition-colors text-gray-800 flex items-center bg-white shadow-sm"
                        >
                          <Search className="w-4 h-4 mr-3 text-blue-500" />
                          <span className="font-medium">"{searchQuery}"</span>
                          <span className="ml-auto text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">Enter</span>
                        </button>
                      </div>
                    )}

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
                              className="w-full text-left p-2.5 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 flex items-center justify-between group"
                            >
                              <div className="flex items-center">
                                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mr-3 group-hover:bg-blue-100 transition-colors">
                                  <Clock className="w-3 h-3 text-gray-400" />
                                </div>
                                <span className="text-sm">{search}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {popularSearches.length > 0 && (
                      <div className="p-3">
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 flex items-center">
                          <TrendingUp className="w-3 h-3 mr-2" />
                          Trending Now
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {popularSearches.map((search, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionClick(search)}
                              className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-gradient-to-r from-blue-50 to-purple-50 text-gray-700 hover:from-blue-100 hover:to-purple-100 transition-all duration-300 border border-blue-100"
                            >
                              {search}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {(location.pathname === '/products' && location.search) && (
                      <div className="p-3 border-t border-gray-100">
                        <button
                          onClick={handleClearFilters}
                          className="w-full text-center py-2.5 text-sm text-gray-600 hover:text-black font-medium transition-colors rounded-lg hover:bg-gray-50"
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

          {/* Navigation Icons - Responsive */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Mobile Search Icon */}
            <button 
              onClick={() => navigate('/products')}
              className="md:hidden p-2 text-gray-700 hover:text-black transition-colors rounded-lg hover:bg-gray-100"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Cart Icon */}
            <Link 
              to="/cart"
              className="p-2 sm:p-2.5 text-gray-700 hover:text-black transition-colors rounded-lg hover:bg-gray-100 relative group"
            >
              <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold shadow-sm">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
              <div className="hidden lg:block absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Cart ({cartCount})
              </div>
            </Link>

            {/* User Menu */}
            <div className="relative" ref={profileRef}>
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 p-2 text-gray-700 hover:text-black transition-colors rounded-lg hover:bg-gray-100 group"
                    aria-label="User menu"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold shadow-sm group-hover:shadow-md transition-shadow">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span className="hidden lg:block text-sm font-medium">Account</span>
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 sm:w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                        <p className="text-sm font-semibold text-gray-900 truncate flex items-center">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs mr-2">
                            {user?.name?.charAt(0)?.toUpperCase()}
                          </div>
                          {user?.name || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 truncate mt-1">
                          {user?.email}
                        </p>
                        {isAdmin && (
                          <span className="inline-block mt-2 px-2.5 py-1 text-xs bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full font-medium border border-purple-200">
                            ⚡ Administrator
                          </span>
                        )}
                      </div>
                      
                      <div className="py-1">
                        {isAdmin && (
                          <Link
                            to="/admin/dashboard"
                            className="flex items-center space-x-3 px-4 py-2.5 text-sm text-purple-700 hover:bg-purple-50 transition-colors group"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <Settings className="h-4 w-4 group-hover:rotate-180 transition-transform" />
                            <span>Admin Dashboard</span>
                          </Link>
                        )}
                        
                        <Link
                          to="/profile"
                          className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors group"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <User className="h-4 w-4 group-hover:scale-110 transition-transform" />
                          <span>My Profile</span>
                        </Link>
                      </div>
                      
                      <div className="border-t border-gray-100 pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors group"
                        >
                          <div className="w-4 h-4 flex items-center justify-center">
                            <div className="w-3 h-0.5 bg-red-500 transform rotate-45"></div>
                            <div className="w-3 h-0.5 bg-red-500 transform -rotate-45 -ml-3"></div>
                          </div>
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="hidden sm:block bg-gradient-to-r from-gray-900 to-black text-white px-3 sm:px-4 py-2 rounded-lg font-semibold hover:from-black hover:to-gray-900 transition-all duration-300 text-sm shadow-sm hover:shadow-md"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/login"
                    className="sm:hidden p-2 text-gray-700 hover:text-black transition-colors rounded-lg hover:bg-gray-100"
                    aria-label="Sign in"
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
                  placeholder="Search AI tools, software..."
                  className="w-full px-4 py-3 pl-12 pr-20 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50"
                />
                <Search className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
                
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-16 top-3 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                
                <button 
                  type="submit" 
                  className="absolute right-2 top-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-purple-700 transition-colors"
                >
                  Go
                </button>
              </div>

              {(location.pathname === '/products' && location.search) && (
                <button
                  onClick={handleClearFilters}
                  className="w-full mt-3 text-center py-2.5 text-sm text-gray-600 hover:text-black font-medium transition-colors bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  Clear All Filters
                </button>
              )}
            </form>
          </div>
        )}

        {/* Mobile Menu - Responsive */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 pt-4 pb-4">
            <div className="flex flex-col space-y-1">
              <Link
                to="/"
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-black hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-colors font-medium rounded-xl"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Home className="h-4 w-4 text-blue-600" />
                </div>
                <span>Home</span>
              </Link>
              
              <Link
                to="/products"
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-black hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-colors rounded-xl"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <Package className="h-4 w-4 text-green-600" />
                </div>
                <span>Products</span>
              </Link>
              
              <Link
                to="/categories"
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-black hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-colors rounded-xl"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <FolderOpen className="h-4 w-4 text-purple-600" />
                </div>
                <span>Categories</span>
              </Link>
              
              <Link
                to="/blogs"
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-black hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 transition-colors rounded-xl"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-orange-600" />
                </div>
                <span>Blogs</span>
              </Link>

              <Link
                to="/cart"
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-black hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-colors rounded-xl"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center relative">
                  <ShoppingCart className="h-4 w-4 text-gray-600" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span>Shopping Cart {cartCount > 0 && `(${cartCount})`}</span>
              </Link>
              
              {isAuthenticated && isAdmin && (
                <Link 
                  to="/admin/dashboard" 
                  className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Settings className="h-4 w-4" />
                  <span className="font-semibold">Admin Dashboard</span>
                </Link>
              )}
              
              {!isAuthenticated ? (
                <div className="grid grid-cols-2 gap-3 px-4 py-3">
                  <Link
                    to="/login"
                    className="text-center bg-gradient-to-r from-gray-900 to-black text-white px-4 py-3 rounded-xl font-semibold hover:from-black hover:to-gray-900 transition-all duration-300 text-sm shadow-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="text-center border border-gray-300 text-gray-700 px-4 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors text-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div className="px-4 py-3 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white rounded-xl mt-2">
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