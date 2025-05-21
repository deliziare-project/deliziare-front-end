import React from 'react';
import { Bell, CircleUser } from 'lucide-react';
import { CirclePlus } from 'lucide-react';

import Link from 'next/link';

function ChefNavbar() {
  return (
    <div className="w-full  p-4 flex justify-end items-center gap-6">
    <CirclePlus/>
      <button className="relative group hover:text-gray-600 transition">
        <Bell className="w-6 h-6" />
        {/* Optional notification dot
        <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full group-hover:scale-110 transition" /> */}
      </button>

      <Link href="/chef/profile" className="hover:text-gray-600 transition">
        <CircleUser className="w-7 h-7"/>
      </Link>
      
    </div>
  );
}

export default ChefNavbar;
