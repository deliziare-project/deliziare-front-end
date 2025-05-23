import React from 'react';
import { Bell, CircleUser } from 'lucide-react';
import { CirclePlus } from 'lucide-react';

import Link from 'next/link';

function ChefNavbar() {
  return (
    <div className="w-full  p-4 flex justify-end items-center gap-6">
    {/* <CirclePlus/> */}
    <Link href="/chef/create-post" className="hover:text-gray-600 transition">
        <CirclePlus className="w-7 h-7"/>
      </Link>
      <button className="relative group hover:text-gray-600 transition">
        <Bell className="w-6 h-6" />
      </button>

      <Link href="/chef/profile" className="hover:text-gray-600 transition">
        <CircleUser className="w-7 h-7"/>
      </Link>
      
    </div>
  );
}

export default ChefNavbar;
