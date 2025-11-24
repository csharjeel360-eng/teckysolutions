// components/Common/SimpleNotification.jsx
import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const SimpleNotification = ({ 
  type = 'info',
  message = '',
  onClose,
  duration = 5000,
  position = 'top-center'
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'fixed top-4 right-4';
      case 'top-left':
        return 'fixed top-4 left-4';
      case 'bottom-right':
        return 'fixed bottom-4 right-4';
      case 'bottom-left':
        return 'fixed bottom-4 left-4';
      case 'top-center':
      default:
        return 'fixed top-4 left-1/2 transform -translate-x-1/2';
    }
  };

  return (
    <div className={`
      ${getPositionClasses()} 
      z-50 max-w-sm w-full
    `}>
      <div className={`
        flex items-start space-x-3 p-4 rounded-2xl border shadow-lg
        transform transition-all duration-300 ease-in-out
        ${getBackgroundColor()}
        animate-slide-in
      `}>
        {/* Icon */}
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-gray-700 text-sm">
            {message}
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-white hover:bg-opacity-50"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default SimpleNotification;