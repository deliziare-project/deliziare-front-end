// UserRoleDonutChart.tsx
'use client';

import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, Tooltip } from 'recharts';
import axiosInstance from '@/api/axiosInstance';
import Loader from '@/components/shared/Loader';
import { ChartPie } from 'lucide-react';

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const COLORS = ['#bf1111', '#0b7d28', '#f0a346'];

const UserRoleDonutChart = () => {
  const [data, setData] = useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get('/admin/getCount');
        const { host, chef, deliveryBoy } = res.data;

        setData([
          { name: 'Host', value: host },
          { name: 'Chef', value: chef },
          { name: 'Delivery', value: deliveryBoy },
        ]);
      } catch (err) {
        console.error('Failed to fetch role stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return (
    <div className="h-[400px] flex items-center justify-center">
      <Loader message='Loading user statistics...' />
    </div>
  );

  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="h-[400px] flex flex-col">
     <div className="flex items-center gap-2 mb-2">
      <div className="bg-[#de6d37] p-2 rounded-md shadow text-white">
      <ChartPie className="w-6 h-6" />
    </div>
      <h2 className="text-xl font-semibold text-gray-800">User Analytics</h2>
    </div>
    <p className="text-sm text-gray-500 mb-6">Distribution across user roles</p>
          
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [
                `${value} (${((value / total) * 100).toFixed(1)}%)`,
                'Count'
              ]}
              contentStyle={{
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                border: 'none'
              }}
            />
            <Legend 
              layout="horizontal" 
              verticalAlign="bottom" 
              align="center"
              wrapperStyle={{ paddingTop: '20px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="text-center text-sm text-gray-500 mt-2">
        Total users: {total}
      </div>
    </div>
  );
};

export default UserRoleDonutChart;