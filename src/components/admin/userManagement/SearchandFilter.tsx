
import { Funnel } from "lucide-react";

interface Props {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: "all" | "active" | "inactive";
  onFilterChange: (value: "all" | "active" | "inactive") => void;
}

const SearchAndFilter = ({ searchTerm, onSearchChange, statusFilter, onFilterChange }: Props) => (
  <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-6 mb-4">
    <input
      type="text"
      placeholder="Search by name or email"
      className="p-2 border rounded text-sm w-full max-w-xs border-[#e5c8b4] text-[#5a2e0e]"
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
    />
    <div className="flex items-center gap-2">
      <Funnel size={16} className="text-[#5a2e0e]" />
      <label className="text-[#5a2e0e] text-sm font-medium">Filter:</label>
      <select
        value={statusFilter}
        onChange={(e) => onFilterChange(e.target.value as "all" | "active" | "inactive")}
        className="text-sm p-1 rounded border border-[#e5c8b4] bg-white text-[#5a2e0e]"
      >
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>
  </div>
);

export default SearchAndFilter;
