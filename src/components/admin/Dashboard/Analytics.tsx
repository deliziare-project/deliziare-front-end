'use client'
import axiosInstance from '@/api/axiosInstance';
import React, { useEffect, useState } from 'react';
import { ChefHat, Truck, Users } from 'lucide-react';
import Link from 'next/link';

const iconMap: Record<string, React.ReactNode> = {
  'Total Hosts': <Users size={28} className="text-white" />,
  'Total Chefs': <ChefHat size={28} className="text-white" />,
  'Total Delivery Boys': <Truck size={28} className="text-white" />,
};

const linkMap: Record<string, string> = {
  'Total Hosts': '/admin/usermanagement',
  'Total Chefs': '/admin/chefmanagement',
  'Total Delivery Boys': '/admin/deliverymanagement',
};

function Analytics() {
  const [data, setData] = useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get('/admin/getCount');
        const { host, chef, deliveryBoy } = res.data;

        setData([
          { name: 'Total Hosts', value: host },
          { name: 'Total Chefs', value: chef },
          { name: 'Total Delivery Boys', value: deliveryBoy },
        ]);
      } catch (err) {
        console.error('Failed to fetch role stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p className="text-center mt-6 text-gray-500">Loading...</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
      {data.map((item) => (
        <Link href={linkMap[item.name]} key={item.name}>
          <div
            className="bg-white shadow rounded-lg p-6 border-l-4 border-red-800 hover:shadow-lg hover:bg-gray-50 transition cursor-pointer flex items-center gap-4"
          >
            <div className="bg-[#fa834b] rounded-full p-3">
              {iconMap[item.name]}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">{item.name}</h3>
              <p className="text-2xl font-bold text-gray-800 mt-1">{item.value}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default Analytics;
