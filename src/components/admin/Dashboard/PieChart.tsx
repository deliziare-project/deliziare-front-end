'use client';

import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, Tooltip } from 'recharts';
import axios from 'axios';
import axiosInstance from '@/api/axiosInstance';

const COLORS = ['#00C49F', '#FFBB28', '#FF8042'];

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
          { name: 'Delivery Boy', value: deliveryBoy },
        ]);
      } catch (err) {
        console.error('Failed to fetch role stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="text-center">Loading...</div>;

  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className=" h-82">
      <h2 className="text-lg font-semibold mb-4 text-center">Total Users</h2>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `${((value / total) * 100).toFixed(2)}%`} />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserRoleDonutChart;
