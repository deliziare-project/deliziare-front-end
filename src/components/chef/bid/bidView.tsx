'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { getChefBids } from '@/features/bidSlice';

const ChefBids = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { bids, loading, error } = useSelector((state: RootState) => state.chefBids);

  useEffect(() => {
    dispatch(getChefBids());
  }, [dispatch]);

  if (loading) return <div className="p-4 text-center text-[#B8755D]">Loading bids...</div>;
  if (error) return <div className="p-4 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center text-[#B8755D]">My Bids</h2>

      {bids.length === 0 ? (
        <p className="text-gray-500 text-center">No bids found.</p>
      ) : (
        <ul className="space-y-6">
          {bids.map((bid) => (
            <li
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
                <div>
                  <span className="text-gray-600">Status:</span>{' '}
                  <span
                    className={`font-semibold capitalize ${
                      bid.status === 'accepted'
                        ? 'text-green-600'
                        : bid.status === 'rejected'
                        ? 'text-red-500'
                        : 'text-yellow-600'
                    }`}
                  >
                    {bid.status}
                  </span>
                </div>
                <div className="text-gray-500 text-sm">
                  {new Date(bid.createdAt).toLocaleString()}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChefBids;
