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
  BookOpen,
  X,
  Clock,
  TrendingUp,
  Mail
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
      navigate(`/listings?search=${encodeURIComponent(query)}`);
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
      navigate(`/listings?search=${encodeURIComponent(searchQuery)}`);
      setShowSearchSuggestions(false);
      setSearchQuery('');
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setShowSearchSuggestions(false);
    if (location.pathname === '/listings') {
      navigate('/listings');
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    saveToRecentSearches(suggestion);
    navigate(`/listings?search=${encodeURIComponent(suggestion)}`);
    setShowSearchSuggestions(false);
  };

  const handleClearFilters = () => {
    navigate('/listings');
    setSearchQuery('');
    setShowSearchSuggestions(false);
  };

  const isAdmin = user?.role === 'admin';

  const TextLogo = () => (
    <div className="flex items-center space-x-2">
      <img 
        src="/logos/Tecky Logo Design (1).png" 
        alt="TeckySolutions Logo" 
        className="h-10 w-auto object-contain"
        onError={(e) => { e.target.src = '/logos/Tecky Logo Design for browser.jpeg'; }}
      />
      <span className="text-xl font-bold text-white">TeckySolutions</span>
    </div>
  );

  return (
    <nav className="bg-gray-900 shadow-lg sticky top-0 z-50 border-b border-white/10">
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-3 md:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16 w-full">
          {/* Mobile Menu Button and Logo */}
          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4 flex-1">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-300 hover:text-gray-100 transition-colors rounded-lg hover:bg-gray-800 flex-shrink-0"
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
              className="flex items-center space-x-2 text-gray-300 hover:text-gray-100 transition-colors font-medium group relative px-3 py-2 rounded-lg hover:bg-gray-800"
            >
                <div className="w-8 h-8 rounded-lg bg-gray-800 group-hover:bg-blue-600/20 flex items-center justify-center transition-colors">
                <Home className="h-4 w-4 text-gray-400 group-hover:text-blue-400" />
              </div>
              <span className="group-hover:font-semibold whitespace-nowrap">Home</span>
            </Link>
            
            <Link 
              to="/listings" 
              className="flex items-center space-x-2 text-gray-300 hover:text-gray-100 transition-colors font-medium group relative px-3 py-2 rounded-lg hover:bg-gray-800"
            >
              <div className="w-8 h-8 rounded-lg bg-gray-800 group-hover:bg-cyan-600/20 flex items-center justify-center transition-colors">
                <Package className="h-4 w-4 text-gray-400 group-hover:text-cyan-400" />
              </div>
              <span className="group-hover:font-semibold whitespace-nowrap">Listings</span>
            </Link>
            
            <Link 
              to="/blogs" 
              className="flex items-center space-x-2 text-gray-300 hover:text-gray-100 transition-colors font-medium group relative px-3 py-2 rounded-lg hover:bg-gray-800"
            >
              <div className="w-8 h-8 rounded-lg bg-gray-800 group-hover:bg-blue-600/20 flex items-center justify-center transition-colors">
                <BookOpen className="h-4 w-4 text-gray-400 group-hover:text-blue-400" />
              </div>
              <span className="group-hover:font-semibold whitespace-nowrap">Blogs</span>
            </Link>

            <Link 
              to="/services" 
              className="flex items-center space-x-2 text-gray-300 hover:text-gray-100 transition-colors font-medium group relative px-3 py-2 rounded-lg hover:bg-gray-800"
            >
              <div className="w-8 h-8 rounded-lg bg-gray-800 group-hover:bg-cyan-600/20 flex items-center justify-center transition-colors">
                <TrendingUp className="h-4 w-4 text-gray-400 group-hover:text-cyan-400" />
              </div>
              <span className="group-hover:font-semibold whitespace-nowrap">Services</span>
            </Link>

            <Link 
              to="/contact" 
              className="flex items-center space-x-2 text-gray-300 hover:text-gray-100 transition-colors font-medium group relative px-3 py-2 rounded-lg hover:bg-gray-800"
            >
              <div className="w-8 h-8 rounded-lg bg-gray-800 group-hover:bg-blue-600/20 flex items-center justify-center transition-colors">
                <Mail className="h-4 w-4 text-gray-400 group-hover:text-blue-400" />
              </div>
              <span className="group-hover:font-semibold whitespace-nowrap">Contact</span>
            </Link>
          </div>

          {/* Search Bar - Responsive */}
          {!isBlogDetail && !isMenuOpen && (
            <div className="hidden sm:flex flex-1 max-w-xs md:max-w-xl lg:max-w-2xl xl:max-w-4xl mx-1 sm:mx-2 md:mx-4 overflow-visible" ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className="relative w-full overflow-visible">
                <div className="relative group w-full overflow-visible">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => searchQuery.trim() && setShowSearchSuggestions(true)}
                    placeholder="Search tools, software..."
                    className="w-full px-3 sm:px-4 md:px-5 py-2 md:py-2.5 pl-9 sm:pl-10 md:pl-11 pr-10 sm:pr-12 md:pr-14 rounded-lg sm:rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm md:text-base bg-gray-800 text-gray-100 placeholder-gray-400 group-hover:bg-gray-700 transition-all duration-300"
                  />
                  <Search className="absolute left-2.5 sm:left-3 md:left-4 top-1/2 -translate-y-1/2 h-4 md:h-5 w-4 md:w-5 text-gray-500 group-hover:text-gray-400 transition-colors flex-shrink-0" />
                  
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="absolute right-8 sm:right-9 md:right-10 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-300 hover:bg-gray-700 rounded transition-colors flex-shrink-0"
                    >
                      <X className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* Navigation Icons - Responsive */}
          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 ml-auto flex-shrink-0">

            {/* Cart Icon */}
            <Link 
              to="/cart"
              className="p-2 sm:p-2.5 text-gray-300 hover:text-gray-100 transition-colors rounded-lg hover:bg-gray-800 relative group"
            >
              <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold shadow-sm">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
              <div className="hidden lg:block absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-700 text-gray-100 text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Cart ({cartCount})
              </div>
            </Link>

            {/* User Menu */}
            <div className="relative" ref={profileRef}>
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 p-2 text-gray-300 hover:text-gray-100 transition-colors rounded-lg hover:bg-gray-800 group"
                    aria-label="User menu"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold shadow-sm group-hover:shadow-md transition-shadow">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span className="hidden lg:block text-sm font-medium">Account</span>
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 sm:w-64 bg-gray-800 rounded-xl shadow-lg border border-white/10 py-2 z-50">
                      <div className="px-4 py-3 border-b border-white/10 bg-gray-900">
                        <p className="text-sm font-semibold text-gray-100 truncate flex items-center">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs mr-2">
                            {user?.name?.charAt(0)?.toUpperCase()}
                          </div>
                          {user?.name || 'User'}
                        </p>
                        <p className="text-xs text-gray-400 truncate mt-1">
                          {user?.email}
                        </p>
                        {isAdmin && (
                          <span className="inline-block mt-2 px-2.5 py-1 text-xs bg-purple-500/20 text-purple-300 rounded-full font-medium border border-purple-500/30">
                            ⚡ Administrator
                          </span>
                        )}
                      </div>
                      
                      <div className="py-1">
                        {isAdmin && (
                          <Link
                            to="/admin/dashboard"
                            className="flex items-center space-x-3 px-4 py-2.5 text-sm text-purple-300 hover:bg-purple-500/10 transition-colors group"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <Settings className="h-4 w-4 group-hover:rotate-180 transition-transform" />
                            <span>Admin Dashboard</span>
                          </Link>
                        )}
                        
                        <Link
                          to="/profile"
                          className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700 transition-colors group"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <User className="h-4 w-4 group-hover:scale-110 transition-transform" />
                          <span>My Profile</span>
                        </Link>
                      </div>
                      
                      <div className="border-t border-white/10 pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors group"
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
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Link
                    to="/login"
                    className="bg-gradient-to-r from-gray-900 to-black text-white px-2 sm:px-3 md:px-4 py-2 rounded-lg font-semibold hover:from-black hover:to-gray-900 transition-all duration-300 text-xs sm:text-sm shadow-sm hover:shadow-md"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isMenuOpen && (
          <div className="sm:hidden border-b border-white/10 pb-3 px-2">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => searchQuery.trim() && setShowSearchSuggestions(true)}
                  placeholder="Search tools..."
                  className="w-full px-3 py-2.5 pl-9 pr-16 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-800 text-gray-100 placeholder-gray-400"
                />
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-12 top-2.5 p-1 text-gray-500 hover:text-gray-300 hover:bg-gray-700 rounded transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                
                <button 
                  type="submit" 
                  className="absolute right-1 top-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-2 py-1 rounded text-xs font-semibold hover:from-blue-700 hover:to-purple-700 transition-colors"
                >
                  Go
                </button>
              </div>

              {(location.pathname === '/listings' && location.search) && (
                <button
                  onClick={handleClearFilters}
                  className="w-full mt-3 text-center py-2.5 text-sm text-gray-300 hover:text-gray-100 font-medium transition-colors bg-gray-800 rounded-lg hover:bg-gray-700"
                >
                  Clear All Filters
                </button>
              )}
            </form>
          </div>
        )}

        {/* Mobile Menu - Responsive */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-white/10 pt-2 pb-2 px-2 max-h-[calc(100vh-56px)] overflow-y-auto">
            <div className="flex flex-col space-y-1">
              <Link
                to="/"
                className="flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 text-gray-300 hover:text-gray-100 hover:bg-gray-800 transition-colors font-medium rounded-lg sm:rounded-xl"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center flex-shrink-0">
                  <Home className="h-4 w-4 text-blue-400" />
                </div>
                <span className="text-sm sm:text-base">Home</span>
              </Link>
              
              <Link
                to="/listings"
                className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-gray-100 hover:bg-gray-800 transition-colors rounded-xl"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="w-8 h-8 rounded-lg bg-cyan-600/20 flex items-center justify-center">
                  <Package className="h-4 w-4 text-cyan-400" />
                </div>
                <span>Listings</span>
              </Link>
              
              <Link
                to="/blogs"
                className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-gray-100 hover:bg-gray-800 transition-colors rounded-xl"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-blue-400" />
                </div>
                <span>Blogs</span>
              </Link>

              <Link
                to="/services"
                className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-gray-100 hover:bg-gray-800 transition-colors rounded-xl"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="w-8 h-8 rounded-lg bg-cyan-600/20 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-cyan-400" />
                </div>
                <span>Services</span>
              </Link>

              <Link
                to="/contact"
                className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-gray-100 hover:bg-gray-800 transition-colors rounded-xl"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center">
                  <Mail className="h-4 w-4 text-blue-400" />
                </div>
                <span>Contact</span>
              </Link>

              <Link
                to="/cart"
                className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-gray-100 hover:bg-gray-800 transition-colors rounded-xl"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center relative">
                  <ShoppingCart className="h-4 w-4 text-gray-400" />
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
                <div className="grid grid-cols-2 gap-2 sm:gap-3 px-4 py-3 border-t border-white/10">
                  <Link
                    to="/login"
                    className="text-center bg-gradient-to-r from-gray-700 to-gray-800 text-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:from-gray-800 hover:to-gray-900 transition-all duration-300 text-xs sm:text-sm shadow-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="text-center border border-white/10 text-gray-300 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:bg-gray-800 transition-colors text-xs sm:text-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div className="px-4 py-3 border-t border-white/10 bg-gray-800 rounded-lg sm:rounded-xl mt-2">
                  <p className="text-xs text-gray-400 mb-2">Signed in as</p>
                  <p className="text-sm font-semibold text-gray-100 truncate">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
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