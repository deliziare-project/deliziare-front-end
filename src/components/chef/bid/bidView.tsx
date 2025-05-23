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

  if (loading) return <div className="p-4 text-center text-gray-600">Loading bids...</div>;
  if (error) return <div className="p-4 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">My Bids</h2>

      {bids.length === 0 ? (
        <p className="text-gray-500 text-center">No bids found.</p>
      ) : (
        <ul className="space-y-6">
          {bids.map((bid) => (
            <li
              key={bid._id}
              className="border rounded-xl shadow-md p-6 bg-white hover:shadow-lg transition"
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {bid.postId.eventName}
                </h3>
                <p className="text-sm text-gray-500">
                  {bid.postId.date} at {bid.postId.time} • {bid.postId.district}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <strong>Location:</strong> {bid.postId.district}
                </div>
                <div>
                  <strong>Menu:</strong> {bid.postId.menu}
                </div>
                <div>
                  <strong>Quantity:</strong> {bid.postId.quantity}
                </div>
                <div>
                  <strong>Description:</strong> {bid.postId.description}
                </div>
              </div>

              <div className="mt-4 flex justify-between items-center text-sm font-medium">
                <div>
                  <span className="text-gray-600">Suggested Amount:</span>{' '}
                  <span className="text-green-600">₹{bid.bidAmount}</span>
                </div>
                <div>
                  <span className="text-gray-600">Status:</span>{' '}
                  <span
                    className={`${
                      bid.status === 'accepted'
                        ? 'text-green-600'
                        : bid.status === 'rejected'
                        ? 'text-red-500'
                        : 'text-yellow-600'
                    } capitalize`}
                  >
                    {bid.status}
                  </span>
                </div>
                <div className="text-gray-500">
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
