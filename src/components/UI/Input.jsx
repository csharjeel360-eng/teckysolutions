import React, { forwardRef } from 'react';
import { Eye, EyeOff, Search, Calendar, DollarSign, User, Mail, Lock } from 'lucide-react';

const Input = forwardRef(({
  label,
  type = 'text',
  error,
  helperText,
  icon,
  fullWidth = true,
  className = '',
  size = 'medium',
  variant = 'default',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const getInputType = () => {
    if (type === 'password' && showPassword) {
      return 'text';
    }
    return type;
  };

  const getIconComponent = () => {
    const iconProps = {
      search: Search,
      calendar: Calendar,
      dollar: DollarSign,
      user: User,
      mail: Mail,
      lock: Lock,
    };

    if (icon && iconProps[icon]) {
      const IconComponent = iconProps[icon];
      return <IconComponent className="w-4 h-4 text-gray-400" />;
    }
    return null;
  };

  const sizeClasses = {
    small: 'px-3 py-2 text-sm',
    medium: 'px-4 py-3 text-base',
    large: 'px-4 py-4 text-lg'
  };

  const variantClasses = {
    default: 'border-gray-300 focus:border-temu-red focus:ring-temu-red',
    error: 'border-red-500 focus:border-red-500 focus:ring-red-500',
    success: 'border-green-500 focus:border-green-500 focus:ring-green-500'
  };

  const baseClasses = `
    block rounded-2xl border bg-white placeholder-gray-400 
    focus:outline-none focus:ring-2 transition-colors duration-200
    disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50
    ${fullWidth ? 'w-full' : ''}
    ${sizeClasses[size]}
    ${variantClasses[error ? 'error' : variant]}
  `;

  const hasIcon = icon || type === 'password';

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {/* Label */}
      {label && (
        <label 
          htmlFor={props.id} 
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Icon (left) */}
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {getIconComponent()}
          </div>
        )}

        {/* Input Field */}
        <input
          ref={ref}
          type={getInputType()}
          className={`
            ${baseClasses}
            ${hasIcon ? (type === 'password' ? 'pr-10' : 'pl-10') : ''}
            ${error ? 'pr-10' : ''}
          `}
          {...props}
        />

        {/* Password Toggle */}
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        )}

        {/* Error Icon */}
        {error && type !== 'password' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>

      {/* Helper Text & Error Message */}
      {(helperText || error) && (
        <p className={`mt-2 text-sm ${
          error ? 'text-red-600' : 'text-gray-500'
        }`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
