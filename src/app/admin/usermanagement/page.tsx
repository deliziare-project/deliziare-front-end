"use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchHosts, toggleBlockStatus } from "@/features/userManagementSlice";
import { RootState } from "@/redux/store"; 
import Pagination from "@/components/admin/userManagement/pagination";
import SearchAndFilter from "@/components/admin/userManagement/SearchandFilter";
import UserTableRow from "@/components/admin/userManagement/UserTableRow";
import UserOverviewCard from "@/components/admin/userManagement/userOverview";
import UserMobileCard from "@/components/admin/userManagement/UserMobileview";

const USERS_PER_PAGE = 5;

function UserManagement() {
  const dispatch = useDispatch();

  const { hosts, loading, error } = useSelector(
    (state: RootState) => state.hosts
  );

  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchHosts());
  }, [dispatch]);

  const toggleDropdown = (userId: string) => {
    setOpenDropdownId((prev) => (prev === userId ? null : userId));
  };

        const handleBlockToggle = (userId: string) => {
          if (window.confirm("Are you sure you want to block/unblock this user?")) {
        dispatch(toggleBlockStatus(userId));
        setOpenDropdownId(null);
      }
  };

  const filteredUsers = hosts.filter((user) => {
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && !user.isBlock) || 
           (statusFilter === "inactive" && user.isBlock);

    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const totalUsers = hosts.length;
  const activeUsers = hosts.filter((user) => !user.isBlock).length;
  const inactiveUsers = hosts.filter((user) => user.isBlock).length;

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  return (
    <div className="min-h-screen w-full bg-[#f9f5f0] p-6 font-sans">
      <h2 className="text-3xl font-semibold text-[#8b3e0f] mb-6">
        Customer Overview
      </h2>

          <UserOverviewCard
          totalUsers={totalUsers}
          activeUsers={activeUsers}
          inactiveUsers={inactiveUsers}
        />
          <SearchAndFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onFilterChange={(value) => setStatusFilter(value)}
      />

      {loading && <p className="text-[#5a2e0e]">Loading users...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      <div className="hidden md:block">
        <table className="w-full table-fixed bg-white shadow rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-[#f0d9c6] text-[#5a2e0e]">
              <th className="w-[10%] p-4 text-left">Profile</th>
              <th className="w-[20%] p-4 text-left">Name</th>
              <th className="w-[30%] p-4 text-left">Email</th>
              <th className="w-[20%] p-4 text-left">Status</th>
              <th className="w-[20%] p-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
          {paginatedUsers.map((user) => (
            <UserTableRow
              key={user._id}
              user={user}
              openDropdownId={openDropdownId}
              toggleDropdown={toggleDropdown}
              handleBlockToggle={handleBlockToggle}
            />
          ))}
        </tbody>

        </table>
      </div>

        <div className="block md:hidden space-y-4">
          {paginatedUsers.map((user) => (
            <UserMobileCard key={user._id} user={user} />
          ))}
        </div>
    
       <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />

      
    </div>
  );
}

export default UserManagement;
