import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  siblingCount = 1,
  boundaryCount = 1,
  showFirst = true,
  showLast = true,
  showPrevNext = true,
  className = ''
}) => {
  if (totalPages <= 1) return null;

  // Generate page numbers to display
  const range = (start, end) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, idx) => idx + start);
  };

  const startPages = range(1, Math.min(boundaryCount, totalPages));
  const endPages = range(Math.max(totalPages - boundaryCount + 1, boundaryCount + 1), totalPages);

  const siblingsStart = Math.max(
    Math.min(
      currentPage - siblingCount,
      totalPages - boundaryCount - siblingCount * 2 - 1
    ),
    boundaryCount + 2
  );

  const siblingsEnd = Math.min(
    Math.max(
      currentPage + siblingCount,
      boundaryCount + siblingCount * 2 + 2
    ),
    endPages.length > 0 ? endPages[0] - 2 : totalPages - 1
  );

  const itemList = [
    ...startPages,
    ...(siblingsStart > boundaryCount + 2
      ? ['start-ellipsis']
      : boundaryCount + 1 < totalPages - boundaryCount
      ? [boundaryCount + 1]
      : []
    ),
    ...range(siblingsStart, siblingsEnd),
    ...(siblingsEnd < totalPages - boundaryCount - 1
      ? ['end-ellipsis']
      : totalPages - boundaryCount > boundaryCount
      ? [totalPages - boundaryCount]
      : []
    ),
    ...endPages,
  ];

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const renderPageItem = (page, index) => {
    if (page === 'start-ellipsis' || page === 'end-ellipsis') {
      return (
        <span
          key={index}
          className="px-3 py-2 text-gray-500"
        >
          <MoreHorizontal className="w-4 h-4" />
        </span>
      );
    }

    const isCurrent = page === currentPage;

    return (
      <button
        key={index}
        onClick={() => handlePageChange(page)}
        className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
          isCurrent
            ? 'bg-temu-red text-white shadow-sm'
            : 'text-gray-700 hover:bg-gray-100 hover:text-temu-red'
        }`}
        aria-current={isCurrent ? 'page' : undefined}
      >
        {page}
      </button>
    );
  };

  return (
    <nav 
      className={`flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 ${className}`}
      aria-label="Pagination"
    >
      {/* Mobile View */}
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        
        <div className="text-sm text-gray-700 flex items-center">
          <span className="font-medium">{currentPage}</span>
          <span className="mx-1">of</span>
          <span className="font-medium">{totalPages}</span>
        </div>
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>

      {/* Desktop View */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing page <span className="font-medium">{currentPage}</span> of{' '}
            <span className="font-medium">{totalPages}</span>
          </p>
        </div>
        
        <div className="flex items-center space-x-1">
          {/* First Page */}
          {showFirst && (
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage <= 1}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="First page"
            >
              <span className="sr-only">First</span>
              <ChevronLeft className="w-4 h-4" />
              <ChevronLeft className="w-4 h-4 -ml-2" />
            </button>
          )}

          {/* Previous Page */}
          {showPrevNext && (
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          {/* Page Numbers */}
          {itemList.map((page, index) => renderPageItem(page, index))}

          {/* Next Page */}
          {showPrevNext && (
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              <span className="sr-only">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {/* Last Page */}
          {showLast && (
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage >= totalPages}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Last page"
            >
              <span className="sr-only">Last</span>
              <ChevronRight className="w-4 h-4" />
              <ChevronRight className="w-4 h-4 -ml-2" />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Pagination;