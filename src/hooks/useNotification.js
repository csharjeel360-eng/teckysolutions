 import { useState, useCallback } from 'react';

/**
 * Custom hook for managing notifications
 */
const useNotification = () => {
  const [notifications, setNotifications] = useState([]);

  // Add a new notification
  const addNotification = useCallback((notification) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newNotification = {
      id,
      type: 'info',
      duration: 5000,
      dismissible: true,
      position: 'top-right',
      ...notification,
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto-remove if duration is set
    if (newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  }, []);

  // Remove a specific notification
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  // Clear all notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Helper methods for different notification types
  const notify = {
    success: (message, options = {}) => 
      addNotification({ type: 'success', message, ...options }),
    
    error: (message, options = {}) => 
      addNotification({ type: 'error', message, ...options }),
    
    warning: (message, options = {}) => 
      addNotification({ type: 'warning', message, ...options }),
    
    info: (message, options = {}) => 
      addNotification({ type: 'info', message, ...options }),
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    notify,
  };
};

export default useNotification;