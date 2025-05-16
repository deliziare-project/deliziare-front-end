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
        const response = await axiosInstance.get('/admin/getchefs');
        setChefs(response.data);
      } catch (error) {
        console.error('Error fetching chefs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChefs();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <ChefManagementPage initialChefs={chefs} />
    </div>
  );
};

export default Page;
