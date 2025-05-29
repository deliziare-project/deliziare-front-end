'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState, AppDispatch } from '@/redux/store';
import { fetchWallet } from '@/features/walletSlice';

const WalletInfo = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { wallet, loading, error } = useSelector((state: RootState) => state.wallet);

  const [activeTab, setActiveTab] = useState<'credit' | 'debit'>('credit');

  useEffect(() => {
    dispatch(fetchWallet());
  }, [dispatch]);

  if (loading) return <p className="text-center mt-6">Loading wallet...</p>;
  if (error) return <p className="text-center mt-6 text-red-500">Error: {error}</p>;
  if (!wallet) return <p className="text-center mt-6">No wallet found</p>;

  const filteredTransactions = wallet.transactions.filter(tx => tx.type === activeTab);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-[#B8755D]">Wallet</h2>
      <p className="text-lg mb-6">
        <span className="font-semibold">Balance:</span>{' '}
        <span className="text-[#B8755D]">₹{wallet.balance.toFixed(2)}</span>
      </p>

      
      <div className="flex justify-center gap-6 mb-6">
        <button
          onClick={() => setActiveTab('credit')}
          className={`px-4 py-2 rounded-full ${
            activeTab === 'credit' 
              ? 'bg-[#B8755D] text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Credit
        </button>
        <button
          onClick={() => setActiveTab('debit')}
          className={`px-4 py-2 rounded-full ${
            activeTab === 'debit' 
              ?  'bg-[#B8755D] text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Debit
        </button>
      </div>

     
      {filteredTransactions.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No {activeTab} transactions found.</p>
      ) : (
        <ul className="space-y-3 max-h-64 overflow-y-auto">
          {filteredTransactions.map((tx, idx) => (
            <li
              key={idx}
              className={`p-4 rounded shadow-sm ${
                tx.type === 'credit' ? 'bg-white border border-[#e2d4cf] rounded-xl shadow-md' : 'bg-red-50 border border-red-200'
              }`}
            >
              <div className="flex justify-between items-center">
                {/* <span className="font-semibold">{tx.type.toUpperCase()}</span> */}
                <span className={`font-bold ${tx.type === 'credit' ? 'text-green-700' : 'text-red-700'}`}>
                  ₹{tx.amount.toFixed(2)}
                </span>
              </div>
              <p className="text-gray-600">{tx.reason}</p>
              {tx.date && <small className="text-gray-400">{new Date(tx.date).toLocaleString()}</small>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WalletInfo;
