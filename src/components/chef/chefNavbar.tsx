// 'use client';

// import React, { useEffect, useState, useRef } from 'react';
// import { Bell, CircleUser, CirclePlus } from 'lucide-react';
// import Link from 'next/link';
// import socket from '@/socket';
// import { useSelector, useDispatch } from 'react-redux';
// import { AppDispatch, RootState } from '@/redux/store';
// import {
//   addNotification,
//   fetchNotifications,
//   markNotificationAsRead,
// } from '@/features/notificationSlice';

// function ChefNavbar() {
//   const dispatch = useDispatch<AppDispatch>();
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   const userId = useSelector((state: RootState) => state.auth.currentUser?._id);
//   const { notifications, loading } = useSelector((state: RootState) => state.notifications);
//   console.log("noti",notifications);
  
//   const unreadCount = notifications.filter((n) => !n.isRead).length;

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setDropdownOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   // Fetch notifications from backend on load
//   useEffect(() => {
//     if (userId) {
//       dispatch(fetchNotifications());
//     }
//   }, [userId, dispatch]);

//   // Socket connection and real-time notification
//   useEffect(() => {
//     if (!userId) return;

//     const onConnect = () => {
//       socket.emit('register', userId);
//     };

//     if (socket.connected) {
//       onConnect();
//     } else {
//       socket.connect();
//       socket.once('connect', onConnect);
//     }

//     const handleNewNotification = (notification: any) => {
//       dispatch(addNotification(notification));
//     };

//     socket.on('new_notification', handleNewNotification);

//     return () => {
//       socket.off('new_notification', handleNewNotification);
//       socket.off('connect', onConnect);
//     };
//   }, [userId, dispatch]);

//   const toggleDropdown = () => {
//     setDropdownOpen((prev) => {
//       const newState = !prev;
//       if (newState) {
//         dispatch(markNotificationAsRead());
//       }
//       return newState;
//     });
//   };

//   return (
//     <div className="w-full p-4 flex justify-end items-center gap-6 relative" ref={dropdownRef}>
//       <Link href="/chef/create-post" className="hover:text-gray-600 transition">
//         <CirclePlus className="w-7 h-7" />
//       </Link>

//       <div className="relative ">
//         <button onClick={toggleDropdown} className="relative hover:text-gray-600 cursor-pointer transition">
//           <Bell className="w-6 h-6" />
//           {unreadCount > 0 && (
//             <span className="absolute -top-1 -right-1 text-xs bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center">
//               {unreadCount}
//             </span>
//           )}
//         </button>

//         {dropdownOpen && (
//           <div className="absolute right-0 mt-2 w-80 bg-white shadow-md rounded-md z-50 max-h-96 overflow-y-auto">
//             {loading ? (
//               <p className="p-4 text-sm text-gray-500">Loading...</p>
//             ) : notifications.length === 0 ? (
//               <p className="p-4 text-sm text-gray-500">No notifications</p>
//             ) : (
//               notifications.map((notification, index) => (
//                 <div
//                   key={index}
//                   className={`p-3 border-b text-sm ${
//                     !notification.isRead ? 'bg-gray-100 font-medium' : ''
//                   }`}
//                 >
//                   {notification.message || 'New Notification'}
//                 </div>
//               ))
//             )}
//           </div>
//         )}
//       </div>

//       <Link href="/chef/profile" className="hover:text-gray-600 transition">
//         <CircleUser className="w-7 h-7" />
//       </Link>
//     </div>
//   );
// }

// export default ChefNavbar;


// 'use client';

// import React, { useEffect, useState, useRef } from 'react';
// import { Bell, CircleUser, CirclePlus } from 'lucide-react';
// import Link from 'next/link';
// import socket from '@/socket';
// import { useSelector, useDispatch } from 'react-redux';
// import { AppDispatch, RootState } from '@/redux/store';
// import {
//   addNotification,
//   fetchNotifications,
//   markNotificationAsRead,
// } from '@/features/notificationSlice';
// import { useRouter } from 'next/navigation';

// function ChefNavbar() {
//   const dispatch = useDispatch<AppDispatch>();
//   const router = useRouter();
//   const [isHovered, setIsHovered] = useState(false);

//   const userId = useSelector((state: RootState) => state.auth.currentUser?._id);
//   const { notifications, loading } = useSelector((state: RootState) => state.notifications);

//   const unreadCount = notifications.filter((n) => !n.isRead).length;

//   // Fetch notifications on load
//   useEffect(() => {
//     if (userId) {
//       dispatch(fetchNotifications());
//     }
//   }, [userId, dispatch]);

//   // Socket logic
//   useEffect(() => {
//     if (!userId) return;

//     const onConnect = () => {
//       socket.emit('register', userId);
//     };

//     if (socket.connected) {
//       onConnect();
//     } else {
//       socket.connect();
//       socket.once('connect', onConnect);
//     }

//     const handleNewNotification = (notification: any) => {
//       dispatch(addNotification(notification));
//     };

//     socket.on('new_notification', handleNewNotification);

//     return () => {
//       socket.off('new_notification', handleNewNotification);
//       socket.off('connect', onConnect);
//     };
//   }, [userId, dispatch]);

//   const handleClick = () => {
//     router.push('/chef/notifications');
//   };

//   const handleMouseEnter = () => {
//     setIsHovered(true);
//     dispatch(markNotificationAsRead());
//   };

//   const handleMouseLeave = () => {
//     setIsHovered(false);
//   };

//   return (
//     <div className="w-full p-4 flex justify-end items-center gap-6 relative">
//       <Link href="/chef/create-post" className="hover:text-gray-600 transition">
//         <CirclePlus className="w-7 h-7" />
//       </Link>

//       {/* Notification Button */}
//       <div
//         className="relative"
//         onMouseEnter={handleMouseEnter}
//         onMouseLeave={handleMouseLeave}
//       >
//         <button
//           onClick={handleClick}
//           className="relative hover:text-gray-600 cursor-pointer transition"
//         >
//           <Bell className="w-6 h-6" />
//           {unreadCount > 0 && (
//             <span className="absolute -top-1 -right-1 text-xs bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center">
//               {unreadCount}
//             </span>
//           )}
//         </button>

//         {isHovered && (
//           <div className="absolute right-0 mt-2 w-80 bg-white shadow-md rounded-md z-50 max-h-96 overflow-y-auto">
//             {loading ? (
//               <p className="p-4 text-sm text-gray-500">Loading...</p>
//             ) : notifications.length === 0 ? (
//               <p className="p-4 text-sm text-gray-500">No notifications</p>
//             ) : (
//               notifications.map((notification, index) => (
//                 <div
//                   key={index}
//                   className={`p-3 border-b text-sm ${
//                     !notification.isRead ? 'bg-gray-100 font-medium' : ''
//                   }`}
//                 >
//                   {notification.message || 'New Notification'}
//                 </div>
//               ))
//             )}
//           </div>
//         )}
//       </div>

//       <Link href="/chef/profile" className="hover:text-gray-600 transition">
//         <CircleUser className="w-7 h-7" />
//       </Link>
//     </div>
//   );
// }

// export default ChefNavbar;




'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Bell, CircleUser, CirclePlus, Clock } from 'lucide-react';
import Link from 'next/link';
import socket from '@/socket';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  addNotification,
  fetchNotifications,
  markNotificationAsRead,
} from '@/features/notificationSlice';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';

function ChefNavbar() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const userId = useSelector((state: RootState) => state.auth.currentUser?._id);
  const { notifications, loading } = useSelector((state: RootState) => state.notifications);

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const displayedNotifications = notifications.slice(0, 10); // Show only first 10 notifications

  // Fetch notifications on load
  useEffect(() => {
    if (userId) {
      dispatch(fetchNotifications());
    }
  }, [userId, dispatch]);

  // Socket logic
  useEffect(() => {
    if (!userId) return;

    const onConnect = () => {
      socket.emit('register', userId);
    };

    if (socket.connected) {
      onConnect();
    } else {
      socket.connect();
      socket.once('connect', onConnect);
    }

    const handleNewNotification = (notification: any) => {
      dispatch(addNotification(notification));
    };

    socket.on('new_notification', handleNewNotification);

    return () => {
      socket.off('new_notification', handleNewNotification);
      socket.off('connect', onConnect);
    };
  }, [userId, dispatch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && 
          !dropdownRef.current.contains(event.target as Node) &&
          buttonRef.current &&
          !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0) {
      dispatch(markNotificationAsRead());
    }
  };

  const handleViewAllClick = () => {
    setIsOpen(false);
    router.push('/chef/notifications');
  };

  return (
    <div className="w-full p-4 bg-white shadow-sm flex justify-end items-center gap-6 relative">
      <Link
        href="/chef/create-post"
        className="text-gray-600 hover:text-amber-800 transition-colors duration-200"
        aria-label="Create new post"
      >
        <CirclePlus className="w-7 h-7" />
      </Link>

      {/* Notification Button */}
      <div className="relative" ref={dropdownRef}>
        <button
          ref={buttonRef}
          onClick={toggleDropdown}
          className="relative text-gray-600 hover:text-amber-800 cursor-pointer transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-600 rounded-full p-1"
          aria-label={`Notifications, ${unreadCount} unread`}
        >
          <Bell className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 text-xs bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center font-medium">
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
          {loading ? (
            <div className="p-4 flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-amber-600 mr-2"></div>
              <p className="text-sm text-gray-500">Loading...</p>
            </div>
          ) : displayedNotifications.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-sm text-gray-500">No notifications</p>
            </div>
          ) : (
            displayedNotifications.map((notification, index) => (
              <div
                key={index}
                className={`p-4 border-b border-gray-200 last:border-b-0 hover:bg-amber-50/50 transition-colors duration-150 ${
                  !notification.isRead ? 'bg-amber-50 font-medium' : 'bg-white'
                }`}
              >
                <p className="text-sm text-gray-800 leading-5" 
                onClick={() => {
                  if (notification.type === 'event_available' && notification.postId) {
                    router.push(`/chef/postDetails/${notification.postId}`);
                  } else if (notification.type === 'bid_accepted') {
                    router.push('/chef/bid-requests?section=accepted');
                  } else if (notification.type === 'delivery_accepted') {
                    router.push('/delivery/accepted');
                  } else if (notification.type === 'delivered') {
                    router.push('/delivery/history');
                  } else {
                    router.push('/chef/notifications');
                  }
                  setIsOpen(false);
                }}
                >
                  {notification.message || 'New Notification'}
                </p>
                {notification.createdAt && (
                  <p className="mt-1 text-xs text-gray-500 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatDistanceToNow(new Date(notification.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                )}
              </div>
            ))
          )}
          
          {/* Always show View All button regardless of notification count */}
          <div className="p-4 border-t border-gray-200 text-center">
            <button
              onClick={handleViewAllClick}
              className="text-sm text-amber-600 hover:text-amber-800 font-medium"
            >
              View all notifications ({notifications.length})
            </button>
          </div>
        </div>
      </div>

      <Link
        href="/chef/profile"
        className="text-gray-600 hover:text-amber-800 transition-colors duration-200"
        aria-label="Profile"
      >
        <CircleUser className="w-7 h-7" />
      </Link>
    </div>
  );
}

export default ChefNavbar;