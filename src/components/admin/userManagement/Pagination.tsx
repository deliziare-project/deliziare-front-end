"use client";
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}) => {
  const baseClasses =
    "flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 transition-all duration-200 shadow-sm";

  const activeClasses =
    "bg-[#708A58] text-white border-[#708A58] hover:bg-[#5A6F48] hover:border-[#5A6F48]";

  const disabledClasses =
    "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed";

  return (
    <div className="flex items-center justify-center gap-4 mt-6 px-4">
      {isLoading ? (
        <div className="flex items-center justify-center w-10 h-10 animate-spin text-[#708A58]">
          <svg
            className="w-6 h-6"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        </div>
      ) : (
        <>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
            className={`${baseClasses} ${
              currentPage === 1 || isLoading ? disabledClasses : activeClasses
            }`}
            aria-label="Previous page"
          >
            <ChevronLeft size={20} />
          </button>

          <p className="text-sm font-semibold text-gray-700">
            Page <span className="text-[#708A58]">{currentPage}</span> of{" "}
            <span className="text-[#708A58]">{totalPages}</span>
          </p>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
            className={`${baseClasses} ${
              currentPage === totalPages || isLoading ? disabledClasses : activeClasses
            }`}
            aria-label="Next page"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}
    </div>
  );
};

export default Pagination;