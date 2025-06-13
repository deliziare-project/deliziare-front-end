'use client';

import { getpopularChef } from '@/features/adminSlice';
import { AppDispatch, RootState } from '@/redux/store';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function PopularChef() {
  const dispatch = useDispatch<AppDispatch>();
  const { popularChef, chefLoading } = useSelector((state: RootState) => state.admin);

  useEffect(() => {
    dispatch(getpopularChef());
  }, []);

//   if (chefLoading) return <p className="text-center text-gray-500 mt-4">Loading popular chefs...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Popular Chefs</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {popularChef?.map((chef) => (
          <div
            key={chef.chefId}
            className="bg-white shadow-md p-4 rounded-lg flex items-center gap-4 hover:shadow-lg transition"
          >
            <div className="">
              {chef.profileImage ? (
                <Link  href={`/admin/chefProfile/${chef.chefId}`} className="w-12 h-12 rounded-full overflow-hidden border border-gray-300 block">
                
                <Image
                  src={chef.profileImage}
                  alt="chef-avatar"
                  width={100}
                  height={100}
                  className="w-12 h-12 object-cover rounded-full border-4 border-gray-300 shadow-md transition-transform duration-300 group-hover:scale-105"
            />
            </Link>
              ) : (
                 <Link  href={`/admin/chefProfile/${chef.chefId}`} className="w-12 h-12 rounded-full overflow-hidden border border-gray-300 block">
                
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-white text-lg font-bold">
                  {chef.name?.[0]?.toUpperCase() || 'U'}
                </div>
                </Link>
              )}
            </div>
            <div>
              <h3 className="font-medium text-lg">{chef.name}</h3>
              <p className="text-sm text-gray-500">{chef.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PopularChef;
