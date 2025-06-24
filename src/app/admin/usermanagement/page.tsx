"use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchHosts, Host, toggleBlockStatus } from "@/features/userManagementSlice";
import { AppDispatch, RootState } from "@/redux/store";
import Pagination from "@/components/admin/userManagement/Pagination";
import SearchAndFilter from "@/components/admin/userManagement/SearchandFilter";
import UserTableRow from "@/components/admin/userManagement/UserTableRow";
import UserOverviewCard from "@/components/admin/userManagement/userOverview";
import UserMobileCard from "@/components/admin/userManagement/UserMobileview";
import { Skeleton } from "@/components/loaders/Skeleton";

const USERS_PER_PAGE = 5;

function UserManagement() {
  const dispatch = useDispatch<AppDispatch>();
  const { hosts, loading, error } = useSelector(
    (state: RootState) => state.hosts
  ) as { hosts: Host[]; loading: boolean; error: string | null };

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
    <div className="min-h-screen w-full bg-slate-50 p-6 md:p-8 font-sans text-slate-800">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-red-900 mb-1">Host Overview</h2>
        <p className="text-gray-600 text-sm">Manage all registered hosts on the platform.</p>
      </div>

      {/* Stats Cards */}
      <div className="mb-6">
        <UserOverviewCard
          totalUsers={totalUsers}
          activeUsers={activeUsers}
          inactiveUsers={inactiveUsers}
        />
      </div>

      {/* Search and Filters */}
      <div className="mb-4">
        <SearchAndFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onFilterChange={(value) => setStatusFilter(value)}
        />
      </div>

      {/* Table & Mobile List */}
      {loading ? (
        <Skeleton />
      ) : (
        <>
          {error && <p className="text-red-600 mb-4">Error: {error}</p>}

          {/* Desktop View */}
          <div className="hidden md:block rounded-lg overflow-hidden shadow-md border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-[#de6d37] text-white">
                <tr>
                  <th className="p-4 text-left w-[10%]">Profile</th>
                  <th className="p-4 text-left w-[20%]">Name</th>
                  <th className="p-4 text-left w-[30%]">Email</th>
                  <th className="p-4 text-left w-[20%]">Status</th>
                  <th className="p-4 text-left w-[20%]">Action</th>
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

          {/* Mobile View */}
          <div className="block md:hidden space-y-4 mt-4">
            {paginatedUsers.map((user) => (
              <UserMobileCard
                key={user._id}
                user={user}
                openDropdownId={openDropdownId}
                toggleDropdown={toggleDropdown}
                handleBlockToggle={handleBlockToggle}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default UserManagement;
