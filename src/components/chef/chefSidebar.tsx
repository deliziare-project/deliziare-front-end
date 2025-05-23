"use client"
import React from 'react';
import {
  LayoutDashboard,
  Utensils,
  CalendarCheck,
  GitPullRequestDraft,
  LogOut,
} from 'lucide-react';

import Image from 'next/image';
import Link from 'next/link';
import { logoutUser } from '@/features/authSlice';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';

const sidebarItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/chef/home' },
  { label: 'My Posts', icon: Utensils, path: '/chef/post' },
  { label: 'Bid requests', icon: GitPullRequestDraft, path: '/chef/Bids' },
  { label: 'Orders', icon: CalendarCheck, path: '/chef/orders' },
];

function ChefSidebar() {
 const dispatch=useDispatch()
 const router=useRouter()

   const handleLogout=()=>{
      dispatch(logoutUser())
       router.push('/login')
    }

  return (
    <div className="w-64 h-screen bg-white text-black p-6 flex flex-col gap-4 shadow-lg">
      <Image src="/deliziare.jpg" alt="deliziare-logo" width={64} height={50} className="mx-auto mb-6" />

      {sidebarItems.map(({ label, icon: Icon, path }, idx) => (
        <Link href={path} key={idx} className="no-underline text-black">
          <div className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-100 transition cursor-pointer">
            <Icon className="w-5 h-5" />
            <span className="text-sm font-medium">{label}</span>
          </div>
        </Link>
        
      ))}
       <div
       onClick={handleLogout}
       className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-100 transition cursor-pointer">
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Logout</span>
          </div>

          <div className="mt-24">
        <Image
          src="/sidebarChef.png"
          alt="Chef Image"
          width={250}
          height={250}
          className="mx-auto"
        />
      </div>
    </div>
  );
}

export default ChefSidebar;
