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
    <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-6">
      <div className="text-sm font-medium text-[#3a3886]">
        Showing <span className="font-bold text-[#F97316]">{startIndex + 1}</span> to{" "}
        <span className="font-bold text-[#F97316]">{endIndex}</span> of{" "}
        <span className="font-bold text-[#F97316]">{totalItems}</span> items
      </div>

      <div className="flex space-x-2 items-center">
        {/* Prev Button */}
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="inline-flex items-center px-4 py-2 border-2 border-gray-200 rounded-lg text-sm font-medium text-[#3a3886] bg-white hover:bg-[#3a3886] hover:text-white hover:border-[#3a3886] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-[#3a3886] disabled:hover:border-gray-200"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </button>

        {/* Page Numbers */}
        <div className="flex items-center space-x-1.5">
          {getVisiblePages().map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => goToPage(pageNum)}
              className={`min-w-[40px] px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                currentPage === pageNum
                  ? "bg-[#F97316] text-white shadow-md scale-105"
                  : "text-[#3a3886] hover:bg-[#3a3886]/10 border-2 border-gray-200 hover:border-[#3a3886]"
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
          className="inline-flex items-center px-4 py-2 border-2 border-gray-200 rounded-lg text-sm font-medium text-[#3a3886] bg-white hover:bg-[#3a3886] hover:text-white hover:border-[#3a3886] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-[#3a3886] disabled:hover:border-gray-200"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>
    </div>
  );
}