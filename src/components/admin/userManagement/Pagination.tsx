"use client";
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="flex justify-between mt-4 items-center">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 shadow-lg py-1 bg-[#e5c8b4] text-[#5a2e0e] rounded disabled:opacity-50"
      >
        <ChevronLeft size={16} />
      </button>

      <p className="text-[#5a2e0e]">
        Page {currentPage} of {totalPages}
      </p>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 shadow-lg py-1 bg-[#e5c8b4] text-[#5a2e0e] rounded disabled:opacity-50"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
