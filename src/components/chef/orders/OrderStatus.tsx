'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { getChefBids, updateBidStatus } from '@/features/bidSlice';

const OrderStatus = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { bids, loading, error } = useSelector((state: RootState) => state.chefBids);

  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    dispatch(getChefBids());
  }, [dispatch]);

  const pendingBids = bids.filter(
    (bid) => bid.status === 'accepted' &&
      (!filterDate || new Date(bid.postId.date).toISOString().split('T')[0] === filterDate)
  );

  const completedBids = bids.filter((bid) => bid.status === 'completed');

  console.log('completed bids',completedBids)
  const handleComplete = (bidId: string) => {
    dispatch(updateBidStatus({ id: bidId, status: 'completed' }));
  };

  const displayedBids = activeTab === 'pending' ? pendingBids : completedBids;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-[#B8755D]">My Orders</h2>

      <div className="flex justify-center gap-6 mb-6">
        <button
          className={`px-4 py-2 rounded-full ${activeTab === 'pending' ? 'bg-[#B8755D] text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending Orders
        </button>
        <button
          className={`px-4 py-2 rounded-full ${activeTab === 'completed' ? 'bg-[#B8755D] text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed Orders
        </button>
      </div>

    <div className="flex flex-col gap-6">
        {displayedBids.length === 0 ? (
          <p className="text-center text-gray-500">No orders found.</p>
        ) : (
          displayedBids.map((bid) => (
            <div
              key={bid._id}
              className="border border-[#e2d4cf] rounded-xl shadow-md p-6 bg-white hover:shadow-lg transition"
            >
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-[#B8755D]">
                  {bid.postId.eventName}
                </h3>
                <p className="text-sm text-gray-500">
                  {bid.postId.date} at {bid.postId.time} • {bid.postId.district}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <span className="font-medium text-[#B8755D]">Location:</span>{' '}
                  {bid.postId.district}
                </div>
                <div>
                  <span className="font-medium text-[#B8755D]">Menu:</span>{' '}
                  {bid.postId.menu}
                </div>
                <div>
                  <span className="font-medium text-[#B8755D]">Quantity:</span>{' '}
                  {bid.postId.quantity}
                </div>
                <div>
                  <span className="font-medium text-[#B8755D]">Description:</span>{' '}
                  {bid.postId.description}
                </div>
              </div>

              <div className="mt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-sm font-medium">
                <div>
                  <span className="text-gray-600">Suggested Amount:</span>{' '}
                  <span className="text-green-600 font-semibold">₹{bid.bidAmount}</span>
                </div>
                <div className="text-gray-500 text-sm">
                  {new Date(bid.createdAt).toLocaleString()}
                </div>
                {activeTab === 'pending' && (
                  <button
                    onClick={() => handleComplete(bid._id)}
                    className="bg-[#B8755D] hover:bg-[#a3614c] text-white px-4 py-2 rounded-md transition"
                  >
                    Mark as Completed
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
          {/* Date Filter (Only for Pending) */}
      {/* {activeTab === 'pending' && (
        <div className="mb-6 flex justify-end">
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-md"
          />
        </div>
      )} */}

      
    </div>
  );
};

export default OrderStatus;
