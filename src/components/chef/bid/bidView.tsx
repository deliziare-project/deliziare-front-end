'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { getChefBids } from '@/features/bidSlice';
import { getAllPay } from '@/features/paymentSlice';

const TABS = ['pending', 'accepted', 'rejected'];

const ChefBids = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { bids=[], loading, error } = useSelector((state: RootState) => state.chefBids);

 
    const { pay } = useSelector((state: RootState) => state.payment);
  
    useEffect(() => {
      dispatch(getAllPay());
    }, [dispatch]);

  const [activeTab, setActiveTab] = useState('pending');

  console.log(bids)

  useEffect(() => {
    dispatch(getChefBids());
  }, [dispatch]);

const filteredBids = Array.isArray(bids)
  ? bids.filter((bid) => bid.status === activeTab)
  : [];

  console.log('filtered by tabs',filteredBids)

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-[#B8755D]">My Bids</h2>

      <div className="flex justify-center gap-4 mb-8">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 text-sm font-medium rounded-full transition ${
              activeTab === tab
                ? 'bg-[#B8755D] text-white'
                : 'bg-[#f0e6e2] text-[#B8755D] hover:bg-[#e5d4ce]'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center text-[#B8755D]">Loading bids...</div>
      ) : error ? (
        <div className="text-center text-red-500">Error: {error}</div>
      ) : filteredBids.length === 0 ? (
        <p className="text-gray-500 text-center">No {activeTab} bids found.</p>
      ) : (
        <ul className="space-y-6">
          {filteredBids.map((bid) => (
            <li
              key={bid._id}
              className="border border-[#e2d4cf] rounded-xl shadow-md p-6 bg-white hover:shadow-lg transition"
            >
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-[#B8755D]">
                  {bid?.postId?.eventName}
                </h3>
                <p className="text-sm text-gray-500">
                  {/* {bid?.postId?.date} at {bid?.postId?.time} 
                   */}

                    {new Date(bid?.postId?.date).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })} at  {new Date(`1970-01-01T${bid?.postId?.time}`).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true,
                        })}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <span className="font-medium text-[#B8755D]">Location:</span>{' '}
                  {bid?.postId?.district}
                </div>
                <div>
                  <span className="font-medium text-[#B8755D]">Menu:</span>{' '}
                  {bid?.postId?.menu.join(', ')}
                </div>
                <div>
                  <span className="font-medium text-[#B8755D]">Quantity:</span>{' '}
                  {bid?.postId?.quantity}
                </div>
                <div>
                  <span className="font-medium text-[#B8755D]">Description:</span>{' '}
                  {bid.postId?.description}
                </div>
              </div>

              <div className="mt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-sm font-medium">
                <div>
                  <span className="text-gray-600">Suggested Amount:</span>{' '}
                  <span className="text-green-600 font-semibold">₹{bid?.bidAmount}</span>
                </div>
                <div>
                  <span className="text-gray-600">Status:</span>{' '}
                  <span
                    className={`font-semibold capitalize ${
                      bid?.status === 'accepted'
                        ? 'text-green-600'
                        : bid?.status === 'rejected'
                        ? 'text-red-500'
                        : 'text-yellow-600'
                    }`}
                  >
                    {bid?.status}
                  </span>
                </div>
                <div className="text-gray-500 text-sm">
                  {/* {new Date(bid?.createdAt).toLocaleString()} */}
                   {new Date(bid?.createdAt).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}
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
