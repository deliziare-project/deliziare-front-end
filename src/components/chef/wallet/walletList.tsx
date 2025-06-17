'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState, AppDispatch } from '@/redux/store';
import { fetchWallet } from '@/features/walletSlice';
import ChefWithdrawalForm from './Withdraw';

const WalletInfo = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { wallet, loading, error } = useSelector((state: RootState) => state.wallet);
  const [activeTab, setActiveTab] = useState<'credit' | 'debit'>('credit');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  useEffect(() => {
    dispatch(fetchWallet());
  }, [dispatch]);

  const openWithdrawModal = () => setShowWithdrawModal(true);
  const closeWithdrawModal = () => setShowWithdrawModal(false);

  const filteredTransactions = wallet?.transactions.filter(tx => tx.type === activeTab) || [];

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#B8755D]"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 max-w-5xl mx-auto mt-6">
      <p className="text-sm text-red-700">Error loading wallet: {error}</p>
    </div>
  );

  if (!wallet) return (
    <div className="text-center mt-6 p-6 bg-gray-50 rounded-lg max-w-5xl mx-auto">
      <h3 className="text-sm font-medium text-gray-900">No wallet found</h3>
      <p className="text-sm text-gray-500">Create a wallet to get started.</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-[#B8755D] mb-2">Wallet Summary</h2>
        <div className="inline-block bg-[#F8F1EE] px-6 py-3 rounded-full">
          <p className="text-lg font-medium">
            <span className="text-gray-600">Current Balance:</span>{' '}
            <span className="text-2xl font-bold text-[#B8755D]">₹{wallet.balance.toFixed(2)}</span>
          </p>
        </div>
        <div className="mt-4">
          <button
            onClick={openWithdrawModal}
            className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition duration-200"
          >
            Withdraw Now
          </button>
        </div>
      </div>

      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setActiveTab('credit')}
          className={`px-6 py-3 cursor-pointer rounded-full font-medium transition-all duration-200 ${
            activeTab === 'credit' 
              ? 'bg-[#B8755D] text-white shadow-md' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Credit
        </button>
        <button
          onClick={() => setActiveTab('debit')}
          className={`px-6 py-3 rounded-full cursor-pointer font-medium transition-all duration-200 ${
            activeTab === 'debit' 
              ? 'bg-[#B8755D] text-white shadow-md' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Debit
        </button>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900">No {activeTab} transactions</h3>
          <p className="text-sm text-gray-500">Your {activeTab} transactions will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
          {filteredTransactions.map((tx, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-lg transition-all duration-200 hover:shadow-md ${
                tx.type === 'credit' 
                  ? 'bg-[#F8F1EE] border-l-4 border-amber-700' 
                  : 'bg-red-50 border-l-4 border-red-500'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-600">{tx.reason}</p>
                  {tx.date && (
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(tx.date).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  )}
                </div>
                <span className={`text-lg font-bold ${
                  tx.type === 'credit' ? 'text-green-700' : 'text-red-700'
                }`}>
                  {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showWithdrawModal && (
        <ChefWithdrawalForm
          onClose={() => setShowWithdrawModal(false)}
          balance={wallet.balance}
      />
      )}

    </div>
  );
};

export default WalletInfo;
