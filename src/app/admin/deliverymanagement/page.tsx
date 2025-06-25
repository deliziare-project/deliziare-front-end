"use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { AppDispatch, RootState } from "@/redux/store"; 
import Pagination from "@/components/admin/userManagement/Pagination";
import SearchAndFilter from "@/components/admin/userManagement/SearchandFilter";
import UserTableRow from "@/components/admin/userManagement/UserTableRow";
import UserOverviewCard from "@/components/admin/userManagement/userOverview";
import UserMobileCard from "@/components/admin/userManagement/UserMobileview";
import { deliveryBoy, fetchDeliveryBoy, toggleBlockStatus } from "@/features/adminSlice";
import DeliveryTable from "@/components/admin/deliveryBoyManagement/DeliveryTable";

const USERS_PER_PAGE = 5;

function Page() {
  const dispatch = useDispatch<AppDispatch>();

  const { deliveryBoy, loading, error } = useSelector(
    (state: RootState) => state.admin
  ) as {
    deliveryBoy: deliveryBoy[];
    loading: boolean;
    error: string | null;
  };
  console.log('delivery',deliveryBoy)

  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchDeliveryBoy());
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

  const filteredUsers = deliveryBoy.filter((user) => {
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && !user.userId?.isBlock) || 
           (statusFilter === "inactive" && user.userId?.isBlock);

    const matchesSearch =
      user.userId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userId?.email.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const totalUsers = deliveryBoy.length;
  const activeUsers = deliveryBoy.filter((user) => !user.userId.isBlock).length;
  const inactiveUsers = deliveryBoy.filter((user) => user.userId.isBlock).length;

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  return (
   <div className="min-h-screen w-full bg-slate-50 p-6 font-sans text-slate-800">
      
      <div className="mb-6">
           <h2 className="text-3xl font-semibold text-red-900 mb-6">Delevary Boys Overview</h2>
           <p className="text-gray-600 text-sm">Manage all registered hosts on the platform.</p>
      </div>
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

      <div className="w-full overflow-x-auto">
   <table className="min-w-[600px] w-full bg-white shadow rounded-lg overflow-hidden">
     <thead> 
            <tr className="bg-[#de6d37] text-white">
              <th className="w-[10%] p-4 text-left">Profile</th>
              <th className="w-[20%] p-4 text-left">Name</th>
              <th className="w-[30%] p-4 text-left">Email</th>
              <th className="w-[20%] p-4 text-left">Lisence</th>
              <th className="w-[10%] p-4 text-left">ID Proof</th>
              <th className="w-[10%] p-4 text-left">Status</th>
              <th className="w-[20%] p-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
          {paginatedUsers.map((user) => (
            <DeliveryTable
              key={user.userId._id}
              user={user}
              openDropdownId={openDropdownId}
              toggleDropdown={toggleDropdown}
              handleBlockToggle={handleBlockToggle}
            />
          ))}
        </tbody>

        </table>
      </div>

    
       <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />

      
    </div>
  );
}

export default Page;
