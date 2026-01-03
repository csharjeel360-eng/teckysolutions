// components/UI/SkeletonProductCard.jsx
// Lightweight skeleton that mimics ProductGrid card structure (no animation needed)
const SkeletonProductCard = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      {/* Image placeholder */}
      <div className="w-full aspect-square bg-gray-200" />
      
      {/* Info section */}
      <div className="p-4">
        {/* Title */}
        <div className="h-4 bg-gray-200 rounded mb-2" />
        <div className="h-3 bg-gray-200 rounded w-2/3 mb-3" />
        
        {/* Description lines */}
        <div className="h-3 bg-gray-200 rounded mb-1" />
        <div className="h-3 bg-gray-200 rounded w-4/5 mb-3" />
        
        {/* Price and rating */}
        <div className="flex items-center justify-between">
          <div className="h-5 bg-gray-200 rounded w-1/3" />
          <div className="h-3 bg-gray-200 rounded w-1/4" />
        </div>
        
        {/* Stock status */}
        <div className="mt-2 h-3 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  );
};

export default SkeletonProductCard;

