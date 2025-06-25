import { ChevronDown, Funnel } from "lucide-react";

interface Props {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: "all" | "active" | "inactive";
  onFilterChange: (value: "all" | "active" | "inactive") => void;
}

const SearchAndFilter = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onFilterChange,
}: Props) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
    <input
      type="text"
      placeholder="Search by name or email..."
      className="p-2.5 border border-slate-200 rounded-md text-sm w-full sm:w-64 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-transparent transition-all"
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
    />

    <div className="flex items-center gap-3 w-full sm:w-auto">
      <div className="relative flex-1 sm:flex-none">
        <Funnel size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-900" />
        <select
          value={statusFilter}
          onChange={(e) => onFilterChange(e.target.value as "all" | "active" | "inactive")}
          className="pl-10 pr-8 py-2.5 text-sm border border-slate-200 rounded-md text-red-700 bg-white focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-transparent appearance-none w-full
                    focus:bg-white active:bg-white"
        >

          <option value="all">All Users</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
        </select>
        <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 pointer-events-none" />
      </div>
    </div>
  </div>
);

export default SearchAndFilter;