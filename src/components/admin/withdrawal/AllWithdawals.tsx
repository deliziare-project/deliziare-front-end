'use client';

import { showError, showSuccess } from '@/components/shared/ToastUtilis';
import { approveRequest, getAllWithdrawals } from '@/features/adminSlice';
import { AppDispatch, RootState } from '@/redux/store';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '@/components/shared/Loader';

function AllWithdrawals() {
  const { withdrawal, withdrawLoading, withdrawError } = useSelector(
    (state: RootState) => state.admin
  );

  const dispatch = useDispatch<AppDispatch>();
  const [approvingId, setApprovingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(getAllWithdrawals());
  }, [dispatch]);

  const handleRequest = async (id: string) => {
    try {
      setApprovingId(id);
      await dispatch(approveRequest(id)).unwrap();
      showSuccess('Withdrawal request approved successfully');
      dispatch(getAllWithdrawals());
    } catch (error: any) {
      showError('Not enough amount in the wallet');
    } finally {
      setApprovingId(null);
    }
  };

  const withdraws = withdrawal.filter((w) => w.status === 'pending');

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className=" rounded-xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h1 className="text-2xl font-semibold text-red-800">Withdrawal Requests</h1>
          <p className="text-sm text-gray-500 mt-1">Pending requests from users</p>
        </div>

        {/* Content */}
        <div className="p-6">
          {withdrawLoading ? (
            <div className="flex justify-center py-12">
              <Loader message="Loading withdrawals..." />
            </div>
          ) : withdrawError ? (
            <div className="bg-red-50 p-4 mb-6">
              <p className="text-red-700">Error: {withdrawError}</p>
            </div>
          ) : withdraws.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {withdraws.map((v) => (
                <div
                  key={v._id}
                  className="bg-white border border-orange-100 rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Profile */}
                  <div className="flex items-center gap-4 mb-5">
                    {v.userId?.profileImage ? (
                      <img
                        src={v.userId.profileImage}
                        alt={v.userId.name || 'User'}
                        className="w-12 h-12 rounded-full object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-red-800 font-bold">
                        {v.userId?.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-red-800">
                        {v.userId?.name || 'Unknown User'}
                      </h3>
                      <span className="text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full capitalize">
                        {v.role}
                      </span>
                    </div>
                  </div>

                  {/* Amount Info */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Amount</p>
                    <p className="text-2xl font-bold text-green-600">₹{v.amount.toLocaleString()}</p>
                  </div>

                  {/* Approve Button */}
                  <button
                    onClick={() => handleRequest(v._id)}
                    disabled={approvingId === v._id}
                    className={`w-full py-2 px-4 text-sm font-medium rounded-lg transition-colors duration-300 ${
                      approvingId === v._id
                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {approvingId === v._id ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="animate-spin h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        <span>Processing...</span>
                      </span>
                    ) : (
                      'Approve Request'
                    )}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 text-gray-300 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-700">No pending withdrawals</h3>
              <p className="text-gray-500 mt-1">All requests have been processed</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AllWithdrawals;
