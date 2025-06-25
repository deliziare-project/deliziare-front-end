'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  fetchNotifications,
  markNotificationAsRead,
} from '@/features/notificationSlice';
import { formatDistanceToNow } from 'date-fns';
import { Bell, CheckCircle2, Clock, Loader2, ChevronDown } from 'lucide-react';
import Navbar from '@/components/deliveryBoy/Navbar';
import BottomBar from '@/components/deliveryBoy/bottomBar';
import { useRouter } from 'next/navigation';

export default function NotificationsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { notifications, loading } = useSelector(
    (state: RootState) => state.notifications
  );
  const userId = useSelector((state: RootState) => state.auth.currentUser?._id);
  const [visibleCount, setVisibleCount] = useState(10); // Initial number of notifications to show
  const router = useRouter()
  useEffect(() => {
    if (userId) {
      dispatch(fetchNotifications());
      dispatch(markNotificationAsRead());
    }
  }, [userId, dispatch]);

  const handleViewMore = () => {
    setVisibleCount((prev) => prev + 10); // Increment by 10 to show the next set
  };

  // Slice notifications to show only the current set of 10
  const visibleNotifications = notifications.slice(0, visibleCount);
  const hasMore = notifications.length > visibleCount; // Check if more notifications exist

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar/>
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="flex items-center mb-8">
          <Bell className="h-10 w-10 text-indigo-700 mr-4 animate-pulse" />
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Notifications
          </h1>
          {notifications.length > 0 && (
            <span className="ml-auto text-sm font-medium text-gray-600 bg-gray-200 px-3 py-1 rounded-full">
              {notifications.length} total
            </span>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm">
            <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mb-4" />
            <p className="text-gray-600 text-lg font-medium">
              Loading your notifications...
            </p>
          </div>
        ) : notifications.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <CheckCircle2 className="mx-auto h-16 w-16 text-indigo-300" />
            <h3 className="mt-3 text-xl font-semibold text-gray-900">
              No notifications
            </h3>
            <p className="mt-2 text-gray-500">
              You're all caught up! Check back later.
            </p>
          </div>
        ) : (
          /* Notifications List */
          <>
            <div className="space-y-4">
              {visibleNotifications.map((notification, index) => (
                <div
                  key={index}
                  onClick={() => {
                    if (notification.type === 'deliveryboy-order' && notification.postId) {
                      router.push(`/deliveryBoy/request`);
                    } 
                     else if (notification.type === 'withdrawal-approved') {
                      router.push(`/deliveryBoy/earning`);
                    } else {
                      router.push(`/deliveryBoy/notifications`);
                    }
                    
                  }}
                  className={`p-5 rounded-xl transition-all duration-300 transform hover:scale-[1.02] ${
                    !notification.isRead
                      ? 'bg-indigo-50 border-l-4 border-indigo-700 shadow-md'
                      : 'bg-white border border-gray-200 shadow-sm hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start"
                  
                  >
                    <div
                      className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center transition-colors duration-200 ${
                        !notification.isRead
                          ? 'bg-indigo-200 text-indigo-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      <Bell className="h-6 w-6" />
                    </div>
                    <div className="ml-4 flex-1">
                      <p
                        className={`text-base leading-6 ${
                          !notification.isRead
                            ? 'font-semibold text-gray-900'
                            : 'text-gray-700'
                        }`}
                      >
                        {notification.message || 'New notification'}
                      </p>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1.5" />
                        {notification.createdAt && (
                          <span>
                            {formatDistanceToNow(new Date(notification.createdAt), {
                              addSuffix: true,
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                    {!notification.isRead && (
                      <span className="ml-3 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-600 text-white">
                        New
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* View More Button */}
            {hasMore && (
              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleViewMore}
                  className="group inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-full shadow-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                >
                  View More
                  <ChevronDown className="ml-2 h-5 w-5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <BottomBar/>
    </div>
  );
}