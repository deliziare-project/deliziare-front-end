'use client'
import { checkCurrentUser, logoutUser } from '@/features/authSlice'
import { addNotification, fetchNotifications, markNotificationAsRead, NotificationType } from '@/features/notificationSlice'
import { AppDispatch, RootState } from '@/redux/store'
import socket, { connectSocket } from '@/socket'
import { Bell, Clock, LogOut, User } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { formatDistanceToNow } from 'date-fns';
import { useRef, useState } from 'react';


function Navbar() {
  const { currentUser } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter();
  const { notifications } = useSelector((state: RootState) => state.notifications)
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);


  useEffect(() => {
    dispatch(checkCurrentUser());
    dispatch(fetchNotifications());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0) {
      dispatch(markNotificationAsRead());
    }
  };
  
  
  useEffect(() => {
    if (currentUser?._id) {
      connectSocket(currentUser._id);
      socket.emit('register', currentUser._id);
  
      const handleNotification = (notification:NotificationType) => {
        console.log("📨 New notification received:", notification);
        dispatch(addNotification(notification));
      };
  
      socket.on('new_notification', handleNotification);
  
      return () => {
        socket.off('new_notification', handleNotification);
      };
    }
  }, [currentUser?._id, dispatch]);
  
  const handleBellClick = () => {
    dispatch(markNotificationAsRead());
  };
  

  const performLogout = async () => {
    const resultAction = await dispatch(logoutUser());
    if (logoutUser.fulfilled.match(resultAction)) {
      router.push("/login")
    } else {
      console.error("logout failed", resultAction.payload);
    }
  };
  const handleLogout = () => {
    performLogout();
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
   <div className="sticky top-0 z-50 bg-white shadow-md backdrop-blur w-full">
    <nav className="px-4 sm:px-8 py-3 border-b border-gray-100">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
       
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-orange-50 shadow-sm">
              <Image
                src="/logo/delizaire-logo.png"
                alt="Deliziare Logo"
                width={40}
                height={40}
                className="object-contain"
                priority
              />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-gray-800 tracking-tight">Deliziare</h1>
              <p className="text-xs text-orange-500 font-medium tracking-wider">Delivery Partner</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
          <div className="relative" ref={dropdownRef}>
  <button
    ref={buttonRef}
    onClick={toggleDropdown}
    className="relative p-2 rounded-full hover:bg-orange-50 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400"
  >
    <Bell className="w-5 h-5 text-gray-600" />
    {unreadCount > 0 && (
      <span className="absolute top-1 right-1 min-w-[18px] h-5 px-1 bg-[#FF4D00] text-white text-xs rounded-full flex items-center justify-center border-2 border-white">
        {unreadCount}
      </span>
    )}
  </button>

  <div
    className={`absolute right-0 mt-3 w-80 bg-white shadow-lg rounded-xl z-50 max-h-96 overflow-y-auto border border-gray-100 transition-all duration-200 ease-in-out ${
      isOpen
        ? 'opacity-100 translate-y-0 pointer-events-auto'
        : 'opacity-0 -translate-y-2 pointer-events-none'
    }`}
  >
    <div className="p-4 border-b border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
      {notifications.length > 10 && (
        <p className="text-xs text-gray-500 mt-1">
          Showing 10 of {notifications.length} notifications
        </p>
      )}
    </div>

    {notifications.length === 0 ? (
      <div className="p-4 text-center text-sm text-gray-500">No notifications</div>
    ) : (
      notifications.slice(0, 10).map((n) => (
        <div
          key={n._id}
          className={`p-4 border-b border-gray-200 last:border-b-0 hover:bg-orange-50 transition-colors duration-150 ${
            !n.isRead ? 'bg-orange-50 font-medium' : 'bg-white'
          }`}
          onClick={() => {
            if (n.type === 'deliveryboy-order' && n.postId) {
              router.push(`/deliveryBoy/request`);
            } 
             else if (n.type === 'withdrawal-approved') {
              router.push(`/deliveryBoy/earning`);
            } else {
              router.push(`/deliveryBoy/notifications`);
            }
            setIsOpen(false);
          }}
        >
          <p className="text-sm text-gray-800 leading-5">{n.message}</p>
          {n.createdAt && (
            <p className="mt-1 text-xs text-gray-500 flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
            </p>
          )}
        </div>
      ))
    )}

    <div className="p-4 border-t border-gray-200 text-center">
      <button
        onClick={() => {
          setIsOpen(false);
          router.push('/deliveryBoy/notifications');
        }}
        className="text-sm text-orange-600 hover:text-orange-800 font-medium"
      >
        View all notifications ({notifications.length})
      </button>
    </div>
  </div>
</div>



            <div className="flex items-center space-x-3">
              <div className="relative" 
              onClick={()=>router.push('/deliveryBoy/profile')}
              >
                <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-orange-100 shadow">
                  <User/>
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></span>
              </div>
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-gray-700 leading-tight">{currentUser?.name}</p>
                <p className="text-xs text-gray-400">Online</p>
              </div>
              <div
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-red-600 hover:bg-red-50 hover:shadow transition-all duration-200 cursor-pointer border border-red-100 hover:border-red-200 group"
              >
                <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-sm font-semibold tracking-tight">Logout</span>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navbar