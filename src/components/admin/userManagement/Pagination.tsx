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
    "flex items-center px-3 py-1 rounded-md border transition-colors";

  const activeClasses =
    "border-[#f78752] text-white bg-[#f78752] hover:bg-[#e57240]";

  const disabledClasses =
    "border-[#f78752] text-slate-400 bg-white cursor-not-allowed";

  return (
    <div className="flex items-center justify-between mt-6 px-2">
      {isLoading ? (
        <div className="ml-4 animate-spin text-[#f78752]">
          <svg
            className="h-5 w-5"
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
          >
            <ChevronLeft size={18} className="mr-1" />
          </button>

          <p className="text-sm font-medium text-slate-600 mx-4">
            Page <span className="text-slate-800">{currentPage}</span> of{" "}
            <span className="text-slate-800">{totalPages}</span>
          </p>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
            className={`${baseClasses} ${
              currentPage === totalPages || isLoading
                ? disabledClasses
                : activeClasses
            }`}
          >
            <ChevronRight size={18} className="ml-1" />
          </button>
        </>
      )}
    </div>
  );
};

export default Pagination;
