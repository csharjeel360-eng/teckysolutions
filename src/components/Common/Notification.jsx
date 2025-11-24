 import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const Notification = ({ 
  notification, 
  onClose,
  // Support both old and new prop structures
  type,
  message,
  duration = 5000
}) => {
  // Handle both prop structures
  const notificationData = notification || { type, message, duration };
  const { id, type: notifType = type, title, message: notifMessage = message, duration: notifDuration = duration } = notificationData;

  useEffect(() => {
    if (notifDuration && notifDuration > 0) {
      const timer = setTimeout(() => {
        onClose ? (id ? onClose(id) : onClose()) : null;
      }, notifDuration);

      return () => clearTimeout(timer);
    }
  }, [id, notifDuration, onClose]);

  const getIcon = () => {
    switch (notifType) {
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
    switch (notifType) {
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

  const getTextColor = () => {
    switch (notifType) {
      case 'success':
        return 'text-green-900';
      case 'error':
        return 'text-red-900';
      case 'warning':
        return 'text-yellow-900';
      case 'info':
      default:
        return 'text-blue-900';
    }
  };

  return (
    <div className={`
      relative flex items-start space-x-3 p-4 rounded-lg border shadow-md
      ${getBackgroundColor()}
      animate-fade-in
    `}>
      {/* Icon */}
      <div className="flex-shrink-0 mt-0.5">
        {getIcon()}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {title && (
          <h4 className={`font-semibold text-sm mb-1 ${getTextColor()}`}>
            {title}
          </h4>
        )}
        <p className={`text-sm ${getTextColor()}`}>
          {notifMessage}
        </p>
      </div>

      {/* Close Button */}
      <button
        onClick={() => onClose ? (id ? onClose(id) : onClose()) : null}
        className="flex-shrink-0 p-1 hover:bg-black hover:bg-opacity-10 transition-colors rounded-lg"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// Notification Container Component
export const NotificationContainer = ({ notifications, onCloseNotification }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          notification={notification}
          onClose={onCloseNotification}
        />
      ))}
    </div>
  );
};

export default Notification;