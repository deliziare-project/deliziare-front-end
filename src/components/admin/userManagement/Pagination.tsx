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
  const baseClasses =
    "flex items-center px-3 py-1 rounded-md border transition-colors";

  const activeClasses =
    "border-[#f78752] text-white bg-[#f78752] hover:bg-[#e57240]";

  const disabledClasses =
    "border-[#f78752] text-slate-400 bg-white cursor-not-allowed";

  return (
    <div className="flex items-center justify-between mt-6 px-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${baseClasses} ${
          currentPage === 1 ? disabledClasses : activeClasses
        }`}
      >
        <ChevronLeft size={18} className="mr-1" />
        
      </button>

      <p className="text-sm font-medium text-slate-600">
        Page <span className="text-slate-800">{currentPage}</span> of{" "}
        <span className="text-slate-800">{totalPages}</span>
      </p>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${baseClasses} ${
          currentPage === totalPages ? disabledClasses : activeClasses
        }`}
      >
        
        <ChevronRight size={18} className="ml-1" />
      </button>
    </div>
  );
};

export default Pagination;
