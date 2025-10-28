"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  if (totalPages <= 1) return null; // hide if not needed

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  const getVisiblePages = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5];
    }
    if (currentPage >= totalPages - 2) {
      return [
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }
    return [
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2,
    ];
  };

  return (
    <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
      <div className="text-sm text-gray-700">
        Showing {startIndex + 1} to {endIndex} of {totalItems} items
      </div>

      <div className="flex space-x-2 items-center">
        {/* Prev Button */}
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </button>

        {/* Page Numbers */}
        <div className="flex items-center space-x-1">
          {getVisiblePages().map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => goToPage(pageNum)}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                currentPage === pageNum
                  ? "bg-indigo-600 text-white"
                  : "text-gray-700 hover:bg-gray-50 border border-gray-300"
              }`}
            >
              {pageNum}
            </button>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>
    </div>
  );
}
