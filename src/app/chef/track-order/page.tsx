'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { getChefBids } from '@/features/bidSlice';
import { Truck, Calendar, MapPin, User, Package, CheckCircle, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bid } from '@/features/bidSlice';

const ChefTrackOrders = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { bids, loading } = useSelector((state: RootState) => state.chefBids);
  const [trackOrders, setTrackOrders] = useState<Bid[]>([]);


  useEffect(() => {
    dispatch(getChefBids());
  }, [dispatch]);

  useEffect(() => {
    const filtered = bids.filter((bid) => bid.deliveryBoyId && bid.postId?.deliveryStatus);
    setTrackOrders(filtered);
  }, [bids]);

  const getStatusProgress = (status: string) => {
    switch (status) {
      case 'accepted':
        return 25;
      case 'picked up':
        return 65;
      case 'delivered':
        return 100;
      default:
        return 0;
    }
  };

  const getStatusDot = (status: string, currentStatus: string): React.ReactElement => {
    const isActive = getStatusProgress(currentStatus) >= getStatusProgress(status);
    return isActive ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <Circle className="h-4 w-4 text-gray-300" />
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Track Your Orders</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Monitor your catering deliveries in real-time and stay updated on every step of the journey
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#B8755D] to-[#B8755D] mx-auto mt-6 rounded-full"></div>
        </motion.div>

        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center h-64"
            >
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-200"></div>
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#B8755D] absolute top-0 left-0"></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!loading && trackOrders.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-12 rounded-2xl shadow-sm text-center border border-gray-100"
          >
            <div className="bg-gray-100 rounded-full p-4 w-20 h-20 mx-auto mb-6">
              <Truck className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">No Active Deliveries</h3>
            <p className="text-gray-500 text-lg">
              You'll see delivery tracking here once a delivery partner accepts your order.
            </p>
          </motion.div>
        )}

        <div className="space-y-8">
          {trackOrders.map((bid, index) => (
            <motion.div
              key={bid._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="bg-gradient-to-r from-[#c0988a] via-[#A06852] to-[#8A5A47] px-8 py-6 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{bid.postId?.eventName || 'Event Deleted'}</h3>
                    <p className="text-orange-100">Order #{bid._id?.slice(-4)}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-white text-[#F15A24] capitalize">
                      {bid.postId.deliveryStatus || 'Not Started'}
                    </span>
                    <p className="text-orange-100 mt-2 text-lg font-semibold">₹{bid?.bidAmount|| '---'}</p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">Delivery Progress</h4>
                  </div>
                  <div className="relative mb-6">
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-[#B8755D] rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${getStatusProgress(String(bid.postId.deliveryStatus))}%` }}
                        transition={{ duration: 1.5, ease: 'easeInOut' }}
                      />
                    </div>
                    <motion.div
                      className="absolute -top-2 transform -translate-x-1/2"
                      initial={{ left: '0%' }}
                      animate={{ left: `${getStatusProgress(String(bid.postId.deliveryStatus))}%` }}
                      transition={{ duration: 1.5, ease: 'easeInOut' }}
                    >
                      <div className="bg-white rounded-full p-2 shadow-lg border-2 border-[#B8755D]">
                        <Truck className="h-4 w-4 text-[#B8755D]" />
                      </div>
                    </motion.div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      {getStatusDot('accepted', String(bid.postId.deliveryStatus))}
                      <span className={getStatusProgress(String(bid.postId.deliveryStatus)) >= 25 ? 'text-gray-900 font-medium' : 'text-gray-500'}>
                        Order Accepted
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusDot('picked up', String(bid.postId.deliveryStatus))}
                      <span className={getStatusProgress(String(bid.postId.deliveryStatus)) >= 65 ? 'text-gray-900 font-medium' : 'text-gray-500'}>
                        Picked Up
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusDot('delivered', String(bid.postId.deliveryStatus))}
                      <span className={getStatusProgress(String(bid.postId.deliveryStatus)) >= 100 ? 'text-gray-900 font-medium' : 'text-gray-500'}>
                        Delivered
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <div className="bg-[#F8F1EE] p-2 rounded-lg">
                      <Calendar className="h-5 w-5 text-[#B8755D]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Event Date</p>
                      <p className="font-medium">
                        {new Date(bid.postId.date).toLocaleDateString('en-GB', {
                          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-[#F8F1EE] p-2 rounded-lg">
                      <MapPin className="h-5 w-5 text-[#B8755D]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Delivery Location</p>
                      <p className="font-medium">{bid.postId.district}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-[#F8F1EE] p-2 rounded-lg">
                      <User  className="h-5 w-5 text-[#B8755D]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Delivery Partner</p>
                      <p className="font-medium">{bid.deliveryBoyId?.name || 'Not Assigned'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-[#F8F1EE] p-2 rounded-lg">
                      <Package className="h-5 w-5 text-[#B8755D]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="font-medium capitalize">{bid.postId.deliveryStatus}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChefTrackOrders;
