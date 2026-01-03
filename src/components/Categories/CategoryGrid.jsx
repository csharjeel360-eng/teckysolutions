import React from 'react';
import CategoryCard from './CategoryCard';
import EmptyState from '../Common/EmptyState';
import LoadingSpinner from '../Layout/LoadingSpinner';

const CategoryGrid = ({ 
  categories = [], 
  loading = false, 
  error = null,
  columns = 4,
  size = 'medium',
  showDescription = true,
  showProductCount = false
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        title="Error Loading Categories"
        message={error}
        actionText="Try Again"
        onAction={() => window.location.reload()}
      />
    );
  }

  if (categories.length === 0) {
    return (
      <EmptyState
        title="No Categories Found"
        message="There are no categories available at the moment."
        actionText="Go Home"
        onAction={() => window.location.href = '/'}
      />
    );
  }

  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 sm:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-3 sm:grid-cols-4 lg:grid-cols-5',
    6: 'grid-cols-3 sm:grid-cols-4 lg:grid-cols-6'
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-4 sm:gap-6`}>
      {categories.map((category) => (
        <CategoryCard
          key={category._id}
          category={category}
          size={size}
          showDescription={showDescription}
          showProductCount={showProductCount}
        />
      ))}
    </div>
  );
};

export default CategoryGrid;
