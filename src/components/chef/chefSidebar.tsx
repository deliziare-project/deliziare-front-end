
"use client"
import React ,{useState} from 'react';
import {
  LayoutDashboard,
  Utensils,
  CalendarCheck,
  GitPullRequestDraft,
  LogOut,
  CalendarSearch,
  Wallet,
} from 'lucide-react';

import Image from 'next/image';
import Link from 'next/link';
import { logoutUser } from '@/features/authSlice';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';


import socket from '@/socket';
import { AppDispatch } from '@/redux/store';


const sidebarItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/chef/home' },
  { label: 'My Posts', icon: Utensils, path: '/chef/post' },
  { label: 'Bid requests', icon: GitPullRequestDraft, path: '/chef/Bids' },
  { label: 'Orders', icon: CalendarCheck, path: '/chef/orders' },
  {label:'Track work',icon:CalendarSearch,path:'/chef/calender'},
  {label:'Wallet',icon:Wallet,path:'/chef/wallet'}
];

function ChefSidebar() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  // const handleLogout = () => {
  //   dispatch(logoutUser());
  //   router.push("/login");
  // };

  
  const performLogout = async () => {
    if (socket.connected) {
      socket.disconnect();
      console.log("Socket disconnected on logout");
    }
  
    const resultAction = await dispatch(logoutUser());
  
    if (logoutUser.fulfilled.match(resultAction)) {
      router.push("/login");
    } else {
      console.error("Logout failed:", resultAction.payload);
    }
  };

const handleLogout = () => {
  performLogout();
};

  const [isMinimized, setIsMinimized] = useState(false);
  const toggleSidebar = () => setIsMinimized(!isMinimized);
  return (
     <div className="w-64   bg-white text-gray-900 p-6 flex flex-col gap-4 shadow-xl">

      <div className="flex justify-center mb-6">
        <img
          src="/logo/delizaire-logo.png"
          alt="Deliziare Logo"
          className="w-35 h-30 object-contain mr-22"
        />
      </div>
      {sidebarItems.map(({ label, icon: Icon, path }, idx) => (
        <Link href={path} key={idx} className="no-underline text-gray-900">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:text-[#B8755D] transition-colors duration-200 cursor-pointer">
            <Icon className="w-5 h-5 text-[#B8755D]"/>
            <span  className="text-sm font-medium">{label}</span>
          </div>
        </Link>
      ))}
       <div
       onClick={handleLogout}
       className="mt-auto flex items-center gap-3 px-5 py-3 rounded-xl bg-white text-red-600 hover:bg-red-50 hover:shadow-md transition-all duration-300 cursor-pointer animate-fadeIn border border-red-100 hover:border-red-200 group mb-7">
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform duration-200"  />
            <span className="text-sm font-semibold tracking-tight">Logout</span>
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
