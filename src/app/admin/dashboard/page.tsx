// Dashboard.tsx
import Analytics from "@/components/admin/Dashboard/Analytics";
import UserRoleDonutChart from "@/components/admin/Dashboard/PieChart";
import PopularChef from "@/components/admin/Dashboard/PopularChef";
import { BarChartHorizontalBig, ChartColumn } from "lucide-react";

function Dashboard() {
  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <div className="space-y-2">
  <div className="flex items-center gap-3">
    <div className="bg-[#de6d37] p-2 rounded-md shadow text-white">
      <ChartColumn className="w-6 h-6" />
    </div>
    <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
  </div>
  <p className="text-gray-600">Overview of platform statistics and activity</p>
</div>

      <Analytics/>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <UserRoleDonutChart />
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <PopularChef />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;