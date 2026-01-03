import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Filter, Clock, TrendingUp } from 'lucide-react';
import { debounce } from '../../utils/helpers';

const SearchBar = ({
  onSearch,
  onChange: onChangeProp,
  placeholder = "Search for products, brands, and categories...",
  size = 'medium',
  variant = 'default',
  showSuggestions = true,
  showFilters = false,
  recentSearches = [],
  popularSearches = [],
  className = '',
  autoFocus = false,
  initialValue = '',
  onClear,
  ...props
}) => {
  const [query, setQuery] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestionsPanel, setShowSuggestionsPanel] = useState(false);
  const inputRef = useRef(null);

  const sizeClasses = {
    small: 'py-2 text-sm',
    medium: 'py-3 text-base',
    large: 'py-4 text-lg'
  };

  const variantClasses = {
    default: 'bg-white border-gray-300 focus-within:border-temu-red focus-within:ring-2 focus-within:ring-temu-red',
    filled: 'bg-gray-100 border-transparent focus-within:bg-white focus-within:border-temu-red focus-within:ring-2 focus-within:ring-temu-red',
    outline: 'bg-transparent border-gray-300 focus-within:border-temu-red focus-within:ring-2 focus-within:ring-temu-red'
  };

  // Debounced search function
  const debouncedSearch = debounce((searchQuery) => {
    if (onSearch) {
      onSearch(searchQuery);
    }
  }, 300);

  useEffect(() => {
    if (query !== initialValue) {
      debouncedSearch(query);
    }
  }, [query, initialValue]);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  const handleInputChange = (e) => {
    const value = e?.target?.value ?? '';
    setQuery(value);
    setShowSuggestionsPanel(value.length > 0 && showSuggestions);
    // If parent passed an onChange prop, call it with the string value (not the event)
    try {
      if (typeof onChangeProp === 'function') onChangeProp(value);
    } catch (err) {
      // swallow any errors from parent handler
      console.warn('SearchBar: parent onChange handler threw', err);
    }
  };

  const handleClear = () => {
    setQuery('');
    setShowSuggestionsPanel(false);
    // Notify parent about cleared value so controlled parents can reset
    try {
      if (typeof onChangeProp === 'function') onChangeProp('');
    } catch (err) {
      console.warn('SearchBar: parent onChange handler threw', err);
    }
    if (onSearch) {
      try {
        onSearch('');
      } catch (err) {
        console.warn('SearchBar: parent onSearch handler threw', err);
      }
    }
    if (onClear) {
      onClear();
    }
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setShowSuggestionsPanel(false);
    try {
      if (typeof onChangeProp === 'function') onChangeProp(suggestion);
    } catch (err) {
      console.warn('SearchBar: parent onChange handler threw', err);
    }
    if (onSearch) {
      try {
        onSearch(suggestion);
      } catch (err) {
        console.warn('SearchBar: parent onSearch handler threw', err);
      }
    }
    inputRef.current?.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuggestionsPanel(false);
    if (onSearch) {
      onSearch(query);
    }
  };

  const hasRecentSearches = recentSearches && recentSearches.length > 0;
  const hasPopularSearches = popularSearches && popularSearches.length > 0;
  const showSuggestionsContent = showSuggestionsPanel && (hasRecentSearches || hasPopularSearches || query.length > 0);

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={`
            flex items-center border rounded-2xl transition-all duration-200
            ${sizeClasses[size]}
            ${variantClasses[variant]}
            ${isFocused ? 'shadow-sm' : ''}
          `}
        >
          {/* Search Icon */}
          <div className="flex-shrink-0 pl-3 pr-2 text-gray-400">
            <Search className="w-5 h-5" />
          </div>

          {/* Input Field */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                handleClear();
              }
            }}
            onFocus={() => {
              setIsFocused(true);
              if (query.length > 0 && showSuggestions) {
                setShowSuggestionsPanel(true);
              }
            }}
            onBlur={() => {
              setIsFocused(false);
              // Delay hiding suggestions to allow for clicks
              setTimeout(() => setShowSuggestionsPanel(false), 200);
            }}
            placeholder={placeholder}
            autoFocus={autoFocus}
            className={`
              flex-1 bg-transparent border-0 focus:outline-none focus:ring-0
              placeholder-gray-400 text-gray-900
              ${size === 'small' ? 'pr-8' : 'pr-12'}
            `}
            {...props}
          />

          {/* Clear Button */}
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="flex-shrink-0 pr-3 pl-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Filter Button */}
          {showFilters && (
            <button
              type="button"
              className="flex-shrink-0 px-3 border-l border-gray-300 text-black-400 hover:text-gray-600 transition-colors"
            >
              <Filter className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Search Button (for mobile) */}
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 sm:hidden bg-temu-red text-white p-1 rounded-lg hover:bg-red-600 transition-colors"
        >
          <Search className="w-4 h-4" />
        </button>
      </form>

      {/* Suggestions Panel */}
      {showSuggestionsContent && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 max-h-96 overflow-y-auto">
          {/* Current Search Suggestions */}
          {query.length > 0 && (
            <div className="p-3 border-b border-gray-100">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                Search for "{query}"
              </div>
              <button
                onClick={() => handleSuggestionClick(query)}
                className="w-full text-left p-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
              >
                <Search className="w-4 h-4 inline mr-2 text-gray-400" />
                Search for "{query}"
              </button>
            </div>
          )}

          {/* Recent Searches */}
          {hasRecentSearches && (
            <div className="p-3 border-b border-gray-100">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                Recent Searches
              </div>
              <div className="space-y-1">
                {recentSearches.slice(0, 5).map((search, index) => (
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
          {hasPopularSearches && (
            <div className="p-3">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                Popular Searches
              </div>
              <div className="space-y-1">
                {popularSearches.slice(0, 5).map((search, index) => (
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

          {/* Quick Categories */}
          <div className="p-3 border-t border-gray-100">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              Popular Categories
            </div>
            <div className="flex flex-wrap gap-2">
              {['Electronics', 'Fashion', 'Home', 'Beauty', 'Sports'].map((category) => (
                <button
                  key={category}
                  onClick={() => handleSuggestionClick(category)}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-temu-red hover:text-white transition-colors"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
