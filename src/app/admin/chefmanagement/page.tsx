'use client'

import React, { useEffect, useState } from 'react';
import axiosInstance from '@/api/axiosInstance';
import ChefManagementPage from '@/components/admin/ChefManagementPage/ChefManagementPage';


const Page = () => {
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChefs = async () => {
      try {
        const response = await axiosInstance.get('/admin/getchefs', { withCredentials: true });
        setChefs(response.data);
      } catch (error) {
        console.error('Error fetching chefs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChefs();
  }, []);

  if (loading) return <Skeleton />;

  return (
    <div>
      <ChefManagementPage initialChefs={chefs} />
    </div>
  );
};

export default Page;

export const Skeleton = () => (
  <div className="animate-pulse space-y-5 p-4">
    <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto" />
    <div className="space-y-3">
      <div className="h-4 bg-gray-300 rounded w-full" />
      <div className="h-10 bg-gray-200 rounded-xl w-full" />
    </div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-300 rounded w-full" />
      <div className="h-10 bg-gray-200 rounded-xl w-full" />
    </div>
    <div className="h-10 bg-gray-300 rounded-xl w-full" />
    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
  </div>
);
