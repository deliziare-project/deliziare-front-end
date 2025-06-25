import React from "react";

interface Props {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
}

const UserOverviewCard: React.FC<Props> = ({
  totalUsers,
  activeUsers,
  inactiveUsers,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
      {/* Total Users */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-gray-600 text-sm font-medium uppercase mb-2">
          Total 
        </h3>
        <p className="text-3xl font-bold text-[#5a2e0e]">{totalUsers}</p>
      </div>

      {/* Active Users */}
      <div className="bg-green-50 rounded-xl shadow-sm border border-green-100 p-6">
        <h3 className="text-green-800 text-sm font-medium uppercase mb-2">
          Active 
        </h3>
        <p className="text-3xl font-bold text-green-700">{activeUsers}</p>
      </div>

      {/* Inactive Users */}
      <div className="bg-red-50 rounded-xl shadow-sm border border-red-100 p-6">
        <h3 className="text-red-800 text-sm font-medium uppercase mb-2">
          Inactive 
        </h3>
        <p className="text-3xl font-bold text-red-700">{inactiveUsers}</p>
      </div>
    </div>
  );
};

export default UserOverviewCard;
