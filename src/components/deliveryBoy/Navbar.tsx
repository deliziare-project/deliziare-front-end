'use client'
import { checkCurrentUser, logoutUser } from '@/features/authSlice'
import { addNotification, fetchNotifications, markNotificationAsRead, NotificationType } from '@/features/notificationSlice'
import { AppDispatch, RootState } from '@/redux/store'
import socket, { connectSocket } from '@/socket'
import { Bell, LogOut } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

function Navbar() {
  const { currentUser } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter();
  const { notifications } = useSelector((state: RootState) => state.notifications)

  useEffect(() => {
    dispatch(checkCurrentUser());
    dispatch(fetchNotifications());
  }, [dispatch]);
  
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
    <div>
      <nav className="bg-white px-4 sm:px-8 py-3 border-b border-gray-100 sticky top-0 z-20 shadow-md">
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
          <div className="relative group" onMouseEnter={handleBellClick}>
  <button className="relative p-2 rounded-full hover:bg-orange-50 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400">
    <Bell className="w-5 h-5 text-gray-600" />
    {unreadCount > 0 && (
      <span className="absolute top-1 right-1 min-w-[18px] h-5 px-1 bg-[#FF4D00] text-white text-xs rounded-full flex items-center justify-center border-2 border-white">
        {unreadCount}
      </span>
    )}
  </button>

  {/* Dropdown on hover */}
  <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-300">
    <div className="max-h-80 overflow-y-auto">
      {notifications.length === 0 ? (
        <div className="p-4 text-sm text-gray-500 text-center">No notifications</div>
      ) : (
        notifications.slice(0, 5).map((n) => (
          <div key={n._id} className="px-4 py-2 text-sm text-gray-700 border-b last:border-b-0 hover:bg-orange-50">
            {n.message}
          </div>
        ))
      )}
    </div>
    <div className="border-t text-center">
      <button
        onClick={() => router.push('/notifications')}
        className="text-xs text-orange-500 py-2 w-full hover:underline"
      >
        View All
      </button>
    </div>
  </div>
</div>


            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-orange-100 shadow">
                  <Image
                    src="/userSideImage/deliveryMan.jpg"
                    alt="User Profile"
                    width={36}
                    height={36}
                    className="object-cover"
                    priority
                  />
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