import React from 'react';

const SimpleSpinner = ({ size = 'md', colorClass = 'text-blue-500', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
  };

  const sizeClass = sizes[size] || sizes.md;

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizeClass} rounded-full ${colorClass}`}
        style={{
          borderWidth: '3px',
          borderStyle: 'solid',
          borderColor: 'rgba(0,0,0,0.12)',
          borderTopColor: 'currentColor',
          animation: 'spin 1s linear infinite',
        }}
      />

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SimpleSpinner;
