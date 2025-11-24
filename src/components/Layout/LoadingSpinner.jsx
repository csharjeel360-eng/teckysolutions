import React from 'react';

const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'temu-red',
  className = '' 
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