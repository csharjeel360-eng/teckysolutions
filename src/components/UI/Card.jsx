import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  hover = false, 
  padding = 'medium',
  ...props 
}) => {
  const paddingClasses = {
    none: '',
    small: 'p-3',
    medium: 'p-6',
    large: 'p-8',
  };

  return (
    <div
      className={`
        bg-white rounded-2xl shadow-sm border border-gray-200
        ${hover ? 'hover:shadow-lg hover:scale-105 transition-all duration-300' : ''}
        ${paddingClasses[padding]}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
