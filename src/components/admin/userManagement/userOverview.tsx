import React from "react";

interface Props {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
}

const UserOverviewCard: React.FC<Props> = ({ totalUsers, activeUsers, inactiveUsers }) => {
  return (
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
  );
};

export default UserOverviewCard;
