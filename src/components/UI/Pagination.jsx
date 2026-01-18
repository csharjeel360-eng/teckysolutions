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
          className="px-2 py-2 text-gray-400"
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
        className={`min-w-10 h-10 rounded-lg font-semibold transition-all duration-300 ${
          isCurrent
            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl scale-105'
            : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50'
        }`}
        aria-current={isCurrent ? 'page' : undefined}
      >
        {page}
      </button>
    );
  };

  return (
    <nav 
      className={`flex items-center justify-center px-4 py-3 sm:px-6 ${className}`}
      aria-label="Pagination"
    >
      {/* Mobile View */}
      <div className="flex flex-1 justify-between sm:hidden gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="inline-flex items-center px-4 py-2 rounded-lg font-semibold bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200 disabled:hover:text-gray-700 transition-all duration-300 text-sm"
        >
          Previous
        </button>
        
        <div className="text-sm text-gray-700 flex items-center px-3 py-2 bg-white rounded-lg border-2 border-gray-200">
          <span className="font-semibold">{currentPage}</span>
          <span className="mx-2">/</span>
          <span className="font-semibold">{totalPages}</span>
        </div>
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="inline-flex items-center px-4 py-2 rounded-lg font-semibold bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200 disabled:hover:text-gray-700 transition-all duration-300 text-sm"
        >
          Next
        </button>
      </div>

      {/* Desktop View */}
      <div className="hidden sm:flex sm:items-center sm:justify-center">
        <div className="flex items-center gap-2">
          {/* First Page */}
          {showFirst && (
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage <= 1}
              className="p-2 rounded-lg bg-white border-2 border-gray-200 text-gray-600 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200 disabled:hover:text-gray-600 transition-all duration-300"
              aria-label="First page"
              title="First page"
            >
              <span className="sr-only">First</span>
              <ChevronLeft className="w-5 h-5" />
              <ChevronLeft className="w-5 h-5 -ml-2" />
            </button>
          )}

          {/* Previous Page */}
          {showPrevNext && (
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="p-2 rounded-lg bg-white border-2 border-gray-200 text-gray-600 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200 disabled:hover:text-gray-600 transition-all duration-300"
              aria-label="Previous page"
              title="Previous page"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Page Numbers */}
          {itemList.map((page, index) => renderPageItem(page, index))}

          {/* Next Page */}
          {showPrevNext && (
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="p-2 rounded-lg bg-white border-2 border-gray-200 text-gray-600 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200 disabled:hover:text-gray-600 transition-all duration-300"
              aria-label="Next page"
              title="Next page"
            >
              <span className="sr-only">Next</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          {/* Last Page */}
          {showLast && (
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage >= totalPages}
              className="p-2 rounded-lg bg-white border-2 border-gray-200 text-gray-600 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200 disabled:hover:text-gray-600 transition-all duration-300"
              aria-label="Last page"
              title="Last page"
            >
              <span className="sr-only">Last</span>
              <ChevronRight className="w-5 h-5" />
              <ChevronRight className="w-5 h-5 -ml-2" />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Pagination;
