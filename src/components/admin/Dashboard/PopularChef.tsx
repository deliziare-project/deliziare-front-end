'use client';

import { getpopularChef } from '@/features/adminSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { Award } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function PopularChef() {
  const dispatch = useDispatch<AppDispatch>();
  const { popularChef, chefLoading } = useSelector((state: RootState) => state.admin);

  useEffect(() => {
    dispatch(getpopularChef());
  }, [dispatch]);

  const topChefs = popularChef?.length > 5 ? popularChef.slice(0, 5) : popularChef;

  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-[#de6d37] p-2 rounded-md shadow text-white">
      <Award className="w-6 h-6" />
    </div>
        <h2 className="text-lg font-semibold text-gray-800">Top Chefs</h2>
      </div>
      <p className="text-sm text-gray-500 mb-4">Most active chefs on the platform</p>

      {/* Chefs List */}
      <div className="space-y-4">
        {topChefs?.map((chef, index) => (
          <Link
            key={chef.chefId}
            href={`/admin/chefProfile/${chef.chefId}`}
            className="block group"
          >
            <div className="flex items-center gap-4 bg-gray-50 hover:bg-red-50 p-4 rounded-lg transition border border-transparent hover:border-orange-200 shadow-sm">
              {/* Ranking Number */}
              <div className="w-6 text-center font-semibold text-orange-500">{index + 1}</div>

              {/* Profile Image */}
              <div className="relative">
                {chef.profileImage ? (
                  <Image
                    src={chef.profileImage}
                    alt={chef.name || 'Chef'}
                    width={48}
                    height={48}
                    className="rounded-full border-2 border-white shadow-md object-cover w-12 h-12"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-orange-600 font-bold text-lg">
                    {chef.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
              </div>

              {/* Name + Email */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-800 group-hover:text-red-600 truncate">
                  {chef.name || 'Unknown Chef'}
                </h3>
                <p className="text-sm text-gray-500 truncate">{chef.email}</p>
              </div>

              {/* Arrow */}
              <div className="ml-auto text-gray-400 group-hover:text-red-700 transition">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default PopularChef;
