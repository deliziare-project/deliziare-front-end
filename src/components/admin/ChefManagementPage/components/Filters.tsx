import { Search } from 'lucide-react';
import { FilterStatus } from './chef';

interface FiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterDistrict: string;
  setFilterDistrict: (district: string) => void;
  filterBlocked: FilterStatus;
  setFilterBlocked: (status: FilterStatus) => void;
  districts: string[];
}

const Filters = ({
  searchTerm,
  setSearchTerm,
  filterDistrict,
  setFilterDistrict,
  filterBlocked,
  setFilterBlocked,
  districts
}: FiltersProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <h2 className="text-lg font-medium text-gray-700 mb-4">Filters</h2>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name"
            className="pl-10 w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex-1">
          <select
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white transition-all duration-200"
            value={filterDistrict}
            onChange={(e) => setFilterDistrict(e.target.value)}
          >
            <option value="">All Districts</option>
            {districts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex-1">
          <select
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white transition-all duration-200"
            value={filterBlocked}
            onChange={(e) => setFilterBlocked(e.target.value as FilterStatus)}
          >
            <option value="all">All Status</option>
            <option value="blocked">Blocked</option>
            <option value="unblocked">Active</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Filters;