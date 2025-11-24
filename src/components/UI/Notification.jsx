import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  X,
  Loader2
} from 'lucide-react';

/**
 * Enhanced Notification Component
 * Displays temporary notification messages with different types and auto-dismiss functionality
 * 
 * @param {Object} props
 * @param {string} props.type - Type of notification: 'success', 'error', 'warning', 'info', 'loading'
 * @param {string} props.title - Optional title for the notification
 * @param {string|React.ReactNode} props.message - The main notification message (supports HTML/JSX)
 * @param {number} props.duration - Auto-dismiss duration in milliseconds (0 for no auto-dismiss)
 * @param {boolean} props.show - Whether to show the notification
 * @param {Function} props.onClose - Callback when notification is closed
 * @param {boolean} props.dismissible - Whether the notification can be manually dismissed
 * @param {string} props.position - Position on screen: 'top-right', 'top-left', 'bottom-right', 'bottom-left', 'top-center', 'bottom-center'
 * @param {React.ReactNode} props.icon - Custom icon to display
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.style - Additional inline styles
 * @param {boolean} props.showProgress - Show progress bar for auto-dismiss
 * @param {string} props.actionText - Text for action button
 * @param {Function} props.onAction - Callback for action button click
 * @param {boolean} props.pauseOnHover - Pause auto-dismiss when hovered
 */
const Notification = ({
  type = 'info',
  title,
  message,
  duration = 5000,
  show = false,
  onClose,
  dismissible = true,
  position = 'top-right',
  icon,
  className = '',
  style = {},
  showProgress = true,
  actionText,
  onAction,
  pauseOnHover = true,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(Boolean(show || message));
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);

  // Notification type configurations
  const notificationTypes = {
    success: {
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
      textColor: 'text-green-800 dark:text-green-300',
      iconColor: 'text-green-500 dark:text-green-400',
      progressColor: 'bg-green-500',
      defaultIcon: <CheckCircle className="w-5 h-5" />,
    },
    error: {
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-800',
      textColor: 'text-red-800 dark:text-red-300',
      iconColor: 'text-red-500 dark:text-red-400',
      progressColor: 'bg-red-500',
      defaultIcon: <XCircle className="w-5 h-5" />,
    },
    warning: {
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      textColor: 'text-yellow-800 dark:text-yellow-300',
      iconColor: 'text-yellow-500 dark:text-yellow-400',
      progressColor: 'bg-yellow-500',
      defaultIcon: <AlertTriangle className="w-5 h-5" />,
    },
    info: {
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      textColor: 'text-blue-800 dark:text-blue-300',
      iconColor: 'text-blue-500 dark:text-blue-400',
      progressColor: 'bg-blue-500',
      defaultIcon: <Info className="w-5 h-5" />,
    },
    loading: {
      bgColor: 'bg-gray-50 dark:bg-gray-900/20',
      borderColor: 'border-gray-200 dark:border-gray-800',
      textColor: 'text-gray-800 dark:text-gray-300',
      iconColor: 'text-gray-500 dark:text-gray-400',
      progressColor: 'bg-gray-500',
      defaultIcon: <Loader2 className="w-5 h-5 animate-spin" />,
    },
  };

  // Position configurations
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
  };

  const currentType = notificationTypes[type] || notificationTypes.info;

  useEffect(() => {
    // Auto-show when either explicit `show` is true or a `message` exists
    const shouldShow = Boolean(show || message);

    if (shouldShow) {
      setIsVisible(true);
      setIsExiting(false);
      setProgress(100);

      // Auto-dismiss after duration
      if (duration > 0 && type !== 'loading') {
        const startTime = Date.now();
        const progressInterval = setInterval(() => {
          if (!isPaused) {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
            setProgress(remaining);
          }
        }, 50);

        const timer = setTimeout(() => {
          if (!isPaused) {
            handleClose();
          }
        }, duration);

        return () => {
          clearTimeout(timer);
          clearInterval(progressInterval);
        };
      }
    } else {
      handleClose();
    }
  }, [show, message, duration, type, isPaused]);

  const handleClose = () => {
    if (!isExiting) {
      setIsExiting(true);
      
      // Wait for exit animation to complete before hiding
      setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, 300);
    }
  };

  const handleMouseEnter = () => {
    if (pauseOnHover && duration > 0) {
      setIsPaused(true);
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover && duration > 0) {
      setIsPaused(false);
    }
  };

  const handleActionClick = () => {
    onAction?.();
    handleClose();
  };

  // Don't render if not visible
  if (!isVisible) {
    return null;
  }

  const notificationContent = (
    <div
      className={`
        fixed z-50 max-w-sm w-full mx-4
        transition-all duration-300 ease-in-out
        ${isExiting ? 'opacity-0 scale-95 translate-y-2' : 'opacity-100 scale-100 translate-y-0'}
        ${positionClasses[position]}
        ${className}
      `}
      style={style}
      role="alert"
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <div
        className={`
          relative flex p-4 rounded-lg shadow-lg border
          ${currentType.bgColor}
          ${currentType.borderColor}
          ${currentType.textColor}
          transform transition-all duration-300
          hover:shadow-xl
        `}
      >
        {/* Icon */}
        <div className={`flex-shrink-0 ${currentType.iconColor}`}>
          {icon || currentType.defaultIcon}
        </div>

        {/* Content */}
        <div className="ml-3 flex-1 min-w-0">
          {title && (
            <h3 className="text-sm font-semibold mb-1 truncate">
              {title}
            </h3>
          )}
          <div className={`text-sm ${title ? '' : 'mt-1'} break-words`}>
            {message}
          </div>

          {/* Action Button */}
          {actionText && onAction && (
            <div className="mt-3">
              <button
                onClick={handleActionClick}
                className={`
                  px-3 py-1.5 text-xs font-medium rounded-md
                  ${currentType.textColor} border ${currentType.borderColor}
                  hover:bg-white hover:bg-opacity-20
                  focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-current
                  transition-colors duration-200
                `}
              >
                {actionText}
              </button>
            </div>
          )}
        </div>

        {/* Close Button */}
        {dismissible && (
          <button
            type="button"
            onClick={handleClose}
            className={`
              inline-flex flex-shrink-0 ml-3 -mr-1 p-1 rounded-md
              hover:bg-black hover:bg-opacity-10 dark:hover:bg-white dark:hover:bg-opacity-10
              focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-opacity-50
              ${currentType.textColor} focus:ring-current
              transition-colors duration-200
            `}
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Progress Bar */}
      {showProgress && duration > 0 && type !== 'loading' && (
        <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full mt-2 overflow-hidden">
          <div
            className={`h-full ${currentType.progressColor} transition-all duration-100 ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );

  // Render using portal to body to avoid z-index issues
  return createPortal(notificationContent, document.body);
};

export default Notification;