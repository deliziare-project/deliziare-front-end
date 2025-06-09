'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Bell, CircleUser, CirclePlus } from 'lucide-react';
import Link from 'next/link';
import socket from '@/socket';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  addNotification,
  fetchNotifications,
  markNotificationAsRead,
} from '@/features/notificationSlice';

function ChefNavbar() {
  const dispatch = useDispatch<AppDispatch>();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const userId = useSelector((state: RootState) => state.auth.currentUser?._id);
  const { notifications, loading } = useSelector((state: RootState) => state.notifications);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch notifications from backend on load
  useEffect(() => {
    if (userId) {
      dispatch(fetchNotifications());
    }
  }, [userId, dispatch]);

  // Socket connection and real-time notification
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

  const toggleDropdown = () => {
    setDropdownOpen((prev) => {
      const newState = !prev;
      if (newState) {
        dispatch(markNotificationAsRead());
      }
      return newState;
    });
  };

  return (
    <div className="w-full p-4 flex justify-end items-center gap-6 relative" ref={dropdownRef}>
      <Link href="/chef/create-post" className="hover:text-gray-600 transition">
        <CirclePlus className="w-7 h-7" />
      </Link>

      <div className="relative">
        <button onClick={toggleDropdown} className="relative hover:text-gray-600 transition">
          <Bell className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 text-xs bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-80 bg-white shadow-md rounded-md z-50 max-h-96 overflow-y-auto">
            {loading ? (
              <p className="p-4 text-sm text-gray-500">Loading...</p>
            ) : notifications.length === 0 ? (
              <p className="p-4 text-sm text-gray-500">No notifications</p>
            ) : (
              notifications.map((notification, index) => (
                <div
                  key={index}
                  className={`p-3 border-b text-sm ${
                    !notification.isRead ? 'bg-gray-100 font-medium' : ''
                  }`}
                >
                  {notification.message || 'New Notification'}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <Link href="/chef/profile" className="hover:text-gray-600 transition">
        <CircleUser className="w-7 h-7" />
      </Link>
    </div>
  );
}

export default ChefNavbar;
