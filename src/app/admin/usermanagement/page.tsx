"use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Ellipsis, Funnel, ChevronRight, ChevronLeft } from "lucide-react";
import { fetchHosts, toggleBlockStatus } from "@/features/userManagementSlice";
import { RootState } from "@/redux/store"; 

const USERS_PER_PAGE = 10;

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
      alert("are you sure want to block");
    dispatch(toggleBlockStatus(userId))
    setOpenDropdownId(null);
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-[#8b3e0f] text-lg font-semibold">Total Customers</h3>
          <p className="text-2xl font-bold text-[#5a2e0e]">{totalUsers}</p>
        </div>
        <div className="bg-green-50 rounded-lg shadow p-4">
          <h3 className="text-green-800 text-lg font-semibold">Active Customers</h3>
          <p className="text-2xl font-bold text-green-700">{activeUsers}</p>
        </div>
        <div className="bg-red-50 rounded-lg shadow p-4">
          <h3 className="text-red-800 text-lg font-semibold">Inactive Customers</h3>
          <p className="text-2xl font-bold text-red-700">{inactiveUsers}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-6 mb-4">
        <input
          type="text"
          placeholder="Search by name or email"
          className="p-2 border rounded text-sm w-full max-w-xs border-[#e5c8b4] text-[#5a2e0e]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex items-center gap-2">
          <Funnel size={16} className="text-[#5a2e0e]" />
          <label className="text-[#5a2e0e] text-sm font-medium">Filter:</label>
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "all" | "active" | "inactive")
            }
            className="text-sm p-1 rounded border border-[#e5c8b4] bg-white text-[#5a2e0e]"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

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
              <tr
                key={user._id}
                className="hover:bg-[#fff6f0] transition duration-150"
              >
                <td className="p-4 truncate">👤</td>
                <td className="p-4 truncate">{user.name}</td>
                <td className="p-4 truncate">{user.email}</td>
                <td className="p-4">
                  {!user.isBlock ? (
                    <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-sm">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded bg-red-100 text-red-700 text-sm">
                      Inactive
                    </span>
                  )}
                </td>
                <td className="p-4">
                  <div className="relative">
                    <button onClick={() => toggleDropdown(user._id)}>
                      <Ellipsis className="text-[#8b3e0f]" />
                    </button>

                    {openDropdownId === user._id && (
                      <div className="absolute right-0 mt-2 w-40 bg-white border border-[#e5c8b4] rounded shadow-lg z-20">
                        <ul className="text-sm text-[#5a2e0e]">
                          <li
                            className="px-4 py-2 hover:bg-[#fef3e5] cursor-pointer"
                            onClick={() => handleBlockToggle(user._id)}
                          >
                            {!user.isBlock ? "Block" : "Unblock"}
                          </li>
                          <li
                            className="px-4 py-2 hover:bg-[#fef3e5] cursor-pointer"
                            onClick={() => alert(`Viewing profile of ${user.name}`)}
                          >
                            View Profile
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="block md:hidden space-y-4">
        {paginatedUsers.map((user) => (
          <div
            key={user._id}
            className="bg-white rounded-lg shadow-lg p-4 cursor-pointer"
          >
            <p className="text-lg font-semibold">
              Name: <span className="font-normal">{user.name}</span>
            </p>
            <p className="text-lg font-semibold">
              Email: <span className="font-normal">{user.email}</span>
            </p>
            <p className="text-lg font-semibold">
              Status:{" "}
              <span
                className={`font-bold ${
                  !user.isBlock ? "text-green-600" : "text-red-600"
                }`}
              >
                {!user.isBlock ? "Active" : "Inactive"}
              </span>
            </p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between mt-4 items-center">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 shadow-lg py-1 bg-[#e5c8b4] text-[#5a2e0e] rounded disabled:opacity-50"
        >
          <ChevronLeft size={16} />
        </button>

        <p className="text-[#5a2e0e]">
          Page {currentPage} of {totalPages}
        </p>

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 shadow-lg py-1 bg-[#e5c8b4] text-[#5a2e0e] rounded disabled:opacity-50"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

export default UserManagement;
