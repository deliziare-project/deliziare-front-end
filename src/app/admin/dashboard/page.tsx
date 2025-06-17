import UserRoleDonutChart from "@/components/admin/Dashboard/PieChart";
import PopularChef from "@/components/admin/Dashboard/PopularChef";

function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Welcome to Admin Dashboard</h1>
      
      <div className=" shadow rounded-lg p-4">
        <UserRoleDonutChart />
        
      </div>
      <PopularChef/>
    </div>
  );
}

export default Dashboard;
