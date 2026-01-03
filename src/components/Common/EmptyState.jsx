import React from 'react';
import { Search, ShoppingBag, FileText, Frown } from 'lucide-react';
import Button from '../UI/Button';

const EmptyState = ({
  icon = 'search',
  title = "No results found",
  message = "Try adjusting your search or filter to find what you're looking for.",
  actionText = "Browse Products",
  onAction,
  action, // optional JSX action (e.g., <Link><Button/></Link>)
  size = 'medium'
}) => {
  const getIcon = () => {
    const iconProps = {
      search: { icon: Search, color: 'text-gray-400' },
      shopping: { icon: ShoppingBag, color: 'text-gray-400' },
      document: { icon: FileText, color: 'text-gray-400' },
      error: { icon: Frown, color: 'text-gray-400' }
    };

    const config = iconProps[icon] || iconProps.search;
    const IconComponent = config.icon;

    return <IconComponent className={`${config.color} ${size === 'large' ? 'w-24 h-24' : 'w-16 h-16'}`} />;
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'py-8';
      case 'large':
        return 'py-20';
      default:
        return 'py-12';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small':
        return 'text-lg';
      case 'large':
        return 'text-2xl';
      default:
        return 'text-xl';
    }
  };

  return (
    <div className={`text-center ${getSizeClasses()}`}>
      {/* Icon */}
      <div className="mb-6 flex justify-center">
        <div className={`${size === 'large' ? 'p-6' : 'p-4'} bg-gray-100 rounded-3xl inline-flex`}>
          {getIcon()}
        </div>
      </div>

      {/* Title */}
      <h3 className={`font-bold text-gray-900 mb-3 ${getTextSize()}`}>
        {title}
      </h3>

      {/* Message */}
      <p className="text-gray-600 max-w-md mx-auto mb-6">
        {message}
      </p>

      {/* Action Button or custom action JSX */}
      {action ? (
        action
      ) : (
        actionText && onAction && (
          <Button
            onClick={onAction}
            variant="primary"
            size={size === 'large' ? 'large' : 'medium'}
          >
            {actionText}
          </Button>
        )
      )}

      {/* Additional Help */}
      {size === 'large' && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-temu-red bg-opacity-10 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6 text-temu-red" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Search Products</h4>
            <p className="text-sm text-gray-600">
              Use our search to find specific items
            </p>
          </div>
          
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-temu-blue bg-opacity-10 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <ShoppingBag className="w-6 h-6 text-temu-blue" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Browse Categories</h4>
            <p className="text-sm text-gray-600">
              Explore products by category
            </p>
          </div>
          
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-temu-green bg-opacity-10 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6 text-temu-green" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Read Blogs</h4>
            <p className="text-sm text-gray-600">
              Check out our latest blog posts
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
