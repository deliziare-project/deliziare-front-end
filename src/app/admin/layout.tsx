'use client'
import Sidebar from '@/components/admin/Sidebar';
import ToastProvider from '@/components/shared/ToastProvider';
import { addNotification, fetchNotifications, markNotificationAsRead } from '@/features/notificationSlice';
import { AppDispatch, RootState } from '@/redux/store';
import socket from '@/socket';
import { Bell, Clock } from 'lucide-react';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import { checkCurrentUser } from '@/features/authSlice';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const userId = useSelector((state: RootState) => state.auth.currentUser?._id);
  const { notifications } = useSelector((state: RootState) => state.notifications);
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const displayedNotifications = notifications.slice(0, 10);

  useEffect(() => {
    if (userId) {
      dispatch(fetchNotifications());
    }
  }, [userId, dispatch]);

  useEffect(() => {
    dispatch(checkCurrentUser());
  }, [dispatch]);
  

  useEffect(() => {
    if (!userId){
      console.log("Admin userId is missing. Cannot register socket.");
      return
    } 

    const onConnect = () => {
      console.log("Registering admin socket with ID:", userId);
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

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
    if (!dropdownOpen && unreadCount > 0) {
      dispatch(markNotificationAsRead());
    }
  };

  return (
    <ToastProvider>
      <div className="flex bg-gray-50 min-h-screen">
        <Sidebar />

        <main className="flex-1 md:ml-64 min-h-screen">
          {/* Top bar */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 md:px-6 py-4 flex justify-end items-center shadow-sm">
            <div className="relative" ref={dropdownRef}>
              <button
                ref={buttonRef}
                className="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none"
                onClick={toggleDropdown}
              >
                <Bell className="w-6 h-6 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 text-xs bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                    {notifications.length > 10 && (
                      <p className="text-xs text-gray-500 mt-1">
                        Showing 10 of {notifications.length} notifications
                      </p>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {displayedNotifications.length === 0 ? (
                      <div className="p-4 text-sm text-gray-500 text-center">No notifications</div>
                    ) : (
                      displayedNotifications.map((n) => (
                        <div
                          key={n._id}
                          className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                            !n.isRead ? 'bg-orange-50 font-medium' : 'bg-white'
                          }`}
                          onClick={() => {
                            setDropdownOpen(false);
                            if (n.type === 'chef-withdrawal') {
                              router.push('/admin/withdrawals');
                            } 
                            else if (n.type === 'deliveryboy-withdrawal'){
                              router.push('/admin/withdrawals')
                            }else {
                              router.push('/admin/notifications');
                            }
                          }}
                          
                        >
                          <p className="text-sm text-gray-800">{n.message}</p>
                          {n.createdAt && (
                            <p className="mt-1 text-xs text-gray-500 flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                            </p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-4 border-t border-gray-200 text-center">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        router.push('/admin/notifications');
                      }}
                      className="text-sm text-orange-600 hover:text-orange-800 font-medium"
                    >
                      View all notifications ({notifications.length})
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="px-4 md:px-6 py-6">{children}</div>
        </main>
      </div>
    </ToastProvider>
  );
}
