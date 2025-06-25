// "use client";

// import React, { useState } from "react";
// import { ChefHat, BookOpen, Bell, User, Menu, X, Box } from "lucide-react";
// import NavLink from "../ui/NavLink";
// import Image from "next/image";

// import { useRouter } from 'next/navigation';
// import { FaComments } from "react-icons/fa";

// // import { useRouter } from 'next/navigation';

// const Navbar: React.FC = () => {
//   const [isOpen, setIsOpen] = useState(false);
// const router=useRouter()

//   const toggleMenu = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <nav className=" sticky top-0 z-50 bg-[linear-gradient(to_right,rgba(255,200,150,0.6),rgba(255,255,255,0.6))] backdrop-blur">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
//           {/* Logo and Brand */}
//           <div className="flex-shrink-0 flex items-center">
//             <div className="flex items-center">
//               {/* < className="h-8 w-8 text-orange-500" /> */}
//               <Image
//                 src="/logo/delizaire-logo.png"
//                 alt="Deliziare Logo"
//                 width={150} // specify width
//                 height={100} // specify height
//               />
            
//             </div>
//           </div>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-8">

//             <NavLink href="/user/home" icon={<BookOpen size={18} />} label="Home" />
//             <NavLink href="/user/chefs" icon={<ChefHat size={18} />} label="Chef" />
//             <NavLink href="/user/posts" icon={<BookOpen size={18} />} label="Posts" />   
//             {/* Icons */}
//             <div className="flex items-center space-x-4 ml-4">
            

//               <button className="p-1 rounded-full cursor-pointer text-gray-600 hover:text-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors" onClick={()=>router.push('/user/profile')}>

//                 <span className="sr-only">View profile</span>
//                 <User className="h-6 w-6" />
//               </button>
//             </div>
//           </div>


//           <div className="md:hidden flex items-center">
//             <button
//               onClick={toggleMenu}
//               className="p-2 rounded-md text-gray-600 hover:text-orange-500 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500 transition-colors"
//             >
//               <span className="sr-only">Open main menu</span>
//               {isOpen ? (
//                 <X className="block cursor-pointer h-6 w-6" aria-hidden="true" />
//               ) : (
//                 <Menu className="block cursor-pointer h-6 w-6" aria-hidden="true" />
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Navigation */}
//       <div className={`md:hidden ${isOpen ? "block" : "hidden"}`}>
//         <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 ">
//           <NavLink href="/user/home" icon={<BookOpen size={18} />} label="Home" mobile />
//           <NavLink
//             href="/user/chefs"
//             icon={<ChefHat size={18} />}
//             label="Chef"
//             mobile
//           />
//           <NavLink
//             href="/user/posts"
//             icon={<BookOpen size={18} />}
//             label="Posts"
//             mobile
//           />


          
//           <NavLink
//             href="/user/profile"
//             icon={<User size={18} />}
//             label="Profile"
//             mobile
//           />

//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;




// "use client";

// import React, { useState, useEffect } from "react";
// import { ChefHat, BookOpen, Bell, User, Menu, X } from "lucide-react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import NavLink from "../ui/NavLink";
// import { useDispatch, useSelector } from "react-redux";
// import socket from "@/socket";
// import { AppDispatch, RootState } from "@/redux/store";
// import { addNotification, fetchNotifications, markNotificationAsRead } from "@/features/notificationSlice";

// const Navbar: React.FC = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const { notifications, loading } = useSelector((state: RootState) => state.notifications);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const router = useRouter();
//   const dispatch = useDispatch<AppDispatch>();

//   const userId = useSelector((state: RootState) => state.auth.currentUser?._id);

//   const toggleMenu = () => {
//     setIsOpen(!isOpen);
//   };

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
//       setIsDropdownOpen((prev) => {
//         const newState = !prev;
//         if (newState) {
//           dispatch(markNotificationAsRead());
//         }
//         return newState;
//       });
//     };

//     useEffect(() => {
//         if (userId) {
//           dispatch(fetchNotifications());
//         }
//       }, [userId, dispatch]);

//     const unreadCount = notifications.filter((n) => !n.isRead).length;
//   return (
//     // <nav className=" sticky top-0 z-50 bg-[linear-gradient(to_right,rgba(255,200,150,0.6),rgba(255,255,255,0.6))] backdrop-blur">
//     <nav className="sticky top-0 z-50 backdrop-blur bg-transparent border-0" style={{backgroundColor: 'rgba(0,0,0,0)', border: 'none'}}>
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
//           {/* Logo */}
//           <div className="flex-shrink-0 flex items-center">
//             <Image
//               src="/logo/delizaire-logo.png"
//               alt="Deliziare Logo"
//               width={150}
//               height={100}
//             />
//           </div>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-8">
//             <NavLink href="/user/home" icon={<BookOpen size={18} />} label="Home" />
//             <NavLink href="/user/chefs" icon={<ChefHat size={18} />} label="Chef" />
//             <NavLink href="/user/posts" icon={<BookOpen size={18} />} label="Posts" />

//             <div className="flex items-center space-x-4 ml-4">
//               {/* Notification Bell */}
//               {/* Notification Bell */}
// <div
//   className="relative"
//   onMouseEnter={() => setIsDropdownOpen(true)}
//   onMouseLeave={() => setIsDropdownOpen(false)}
// >
//   <button
//     className="relative p-1 rounded-full text-gray-600 hover:text-orange-500 focus:outline-none"
//     onClick={() => router.push("/user/notifications")}
//   >
//     <Bell className="h-6 w-6" />
//     {unreadCount > 0 && (
//       <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
//         {unreadCount}
//       </span>
//     )}
//   </button>

//   {/* Notification Dropdown on Hover */}
//   {isDropdownOpen && (
//     <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg z-50">
//       {notifications.length === 0 ? (
//         <p className="p-2 text-sm text-gray-500">No notifications</p>
//       ) : (
//         <ul className="max-h-60 overflow-y-auto">
//           {notifications.map((notif, index) => (
//             <li
//               key={notif._id || index}
//               className="p-2 text-sm border-b last:border-b-0 cursor-pointer hover:bg-orange-50"
//               onClick={() => {
//                 if (notif.postId) router.push(`/user/posts/${notif.postId}`);
//                 setIsDropdownOpen(false);
//               }}
//             >
//               {notif.message}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   )}
// </div>


              


//               {/* Profile Icon */}
//               <button
//                 className="p-1 rounded-full text-gray-600 hover:text-orange-500 focus:outline-none"
//                 onClick={() => router.push("/user/profile")}
//               >
//                 <span className="sr-only">View profile</span>
//                 <User className="h-6 w-6" />
//               </button>
//             </div>
//           </div>

//           {/* Mobile Hamburger */}
//           <div className="md:hidden flex items-center">
//             <button
//               onClick={toggleMenu}
//               className="p-2 rounded-md text-gray-600 hover:text-orange-500 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
//             >
//               <span className="sr-only">Open main menu</span>
//               {isOpen ? (
//                 <X className="h-6 w-6" />
//               ) : (
//                 <Menu className="h-6 w-6" />
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Navigation */}
//       <div className={`md:hidden ${isOpen ? "block" : "hidden"}`}>
//         <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
//           <NavLink href="/user/home" icon={<BookOpen size={18} />} label="Home" mobile />
//           <NavLink href="/user/chefs" icon={<ChefHat size={18} />} label="Chef" mobile />
//           <NavLink href="/user/posts" icon={<BookOpen size={18} />} label="Posts" mobile />
//           <NavLink href="/user/profile" icon={<User size={18} />} label="Profile" mobile />
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;



"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChefHat, BookOpen, Bell, User, Menu, X, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import NavLink from "../ui/NavLink";
import { useDispatch, useSelector } from "react-redux";
import socket from "@/socket";
import { AppDispatch, RootState } from "@/redux/store";
import { addNotification, fetchNotifications, markNotificationAsRead } from "@/features/notificationSlice";
import { formatDistanceToNow } from "date-fns";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { notifications, loading } = useSelector((state: RootState) => state.notifications);
  const userId = useSelector((state: RootState) => state.auth.currentUser?._id);
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const displayedNotifications = notifications.slice(0, 10); // Always show max 10 notifications

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Fetch notifications and setup socket
  useEffect(() => {
    if (userId) {
      dispatch(fetchNotifications());
    }
  }, [userId, dispatch]);

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
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleNotificationDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    if (!isDropdownOpen && unreadCount > 0) {
      dispatch(markNotificationAsRead());
    }
  };

  const handleViewAllClick = () => {
    setIsDropdownOpen(false);
    router.push('/user/notifications');
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur bg-transparent border-0" style={{backgroundColor: 'rgba(0,0,0,0)', border: 'none'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Image
              src="/logo/delizaire-logo.png"
              alt="Deliziare Logo"
              width={150}
              height={100}
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink href="/user/home" icon={<BookOpen size={18} />} label="Home" />
            <NavLink href="/user/chefs" icon={<ChefHat size={18} />} label="Chef" />
            <NavLink href="/user/posts" icon={<BookOpen size={18} />} label="Posts" />

            <div className="flex items-center space-x-4 ml-4">
              {/* Notification Bell with Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  ref={buttonRef}
                  onClick={toggleNotificationDropdown}
                  className="relative p-1 rounded-full text-gray-600 hover:text-orange-500 focus:outline-none"
                >
                  <Bell className="h-6 w-6" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="p-3 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                      {notifications.length > 10 && (
                        <p className="text-xs text-gray-500 mt-1">
                          Showing 10 of {notifications.length} notifications
                        </p>
                      )}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {loading ? (
                        <div className="p-4 flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500 mr-2"></div>
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
                            className={`p-3 border-b border-gray-200 last:border-b-0 hover:bg-orange-50/50 ${
                              !notification.isRead ? 'bg-orange-50 font-medium' : 'bg-white'
                            }`}
                            onClick={() => {
                              if (notification.type === 'order-picked') {
                                router.push('/user/order');
                              } else if (notification.type=='delivered') {
                                router.push('/user/order');
                              }
                              else{
                                router.push('/user/notifications')
                              }
                              setIsDropdownOpen(false);
                            }}
                            
                          >
                            <p className="text-sm text-gray-800">
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
                    </div>
                    {/* Always show View All button regardless of notification count */}
                    <div className="p-3 border-t border-gray-200 text-center">
                      <button
                        onClick={handleViewAllClick}
                        className="text-sm text-orange-600 hover:text-orange-800 font-medium"
                      >
                        View all notifications ({notifications.length})
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Icon */}
              <button
                className="p-1 rounded-full text-gray-600 hover:text-orange-500 focus:outline-none"
                onClick={() => router.push("/user/profile")}
              >
                <span className="sr-only">View profile</span>
                <User className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-600 hover:text-orange-500 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden ${isOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <NavLink href="/user/home" icon={<BookOpen size={18} />} label="Home" mobile />
          <NavLink href="/user/chefs" icon={<ChefHat size={18} />} label="Chef" mobile />
          <NavLink href="/user/posts" icon={<BookOpen size={18} />} label="Posts" mobile />
          <NavLink href="/user/profile" icon={<User size={18} />} label="Profile" mobile />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;