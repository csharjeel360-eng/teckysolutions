import React from 'react';

const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'temu-red',
  className = '',
  showBrand = false,
  brandText = 'TrendyBreeze'
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  const colorClasses = {
    'temu-red': 'border-temu-red',
    white: 'border-white',
    gray: 'border-gray-400',
  };

  // If brand display is enabled, show spinning brand text
  if (showBrand) {
    return (
      <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
        {/* Outer spinning ring */}
        <div className="relative w-20 h-20 md:w-24 md:h-24">
          {/* Background ring */}
          <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
          
          {/* Gradient spinning ring */}
          <svg className="absolute inset-0 w-full h-full animate-spin" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="spinnerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="50%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
            </defs>
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#spinnerGradient)"
              strokeWidth="4"
              strokeDasharray="70 30"
              strokeLinecap="round"
            />
          </svg>
          
          {/* Center text spinning */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs md:text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
              {brandText.substring(0, 3)}
            </span>
          </div>
        </div>
        
        {/* Brand name below */}
        <div className="text-center">
          <h3 className="text-sm md:text-base font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            {brandText}
          </h3>
          <p className="text-xs text-gray-500 mt-2">Loading amazing deals...</p>
        </div>
      </div>
    );
  }

  // Standard spinner (original)
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`
          border-2 border-t-2 border-transparent rounded-full animate-spin
          ${sizeClasses[size]}
          ${colorClasses[color]}
        `}
      />
    </div>
  );
};

export default LoadingSpinner;
