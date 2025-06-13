'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState, AppDispatch } from '@/redux/store';
import { fetchEarning, fetchWallet } from '@/features/walletSlice';
import DeliveryWithdrawalForm from './WithdrawalForm';

const WalletInfo = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { earning, loading, error } = useSelector((state: RootState) => state.wallet);
  console.log(earning)

  const [activeTab, setActiveTab] = useState<'credit' | 'debit'>('credit');

  useEffect(() => {
    dispatch(fetchEarning());
  }, [dispatch]);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#B8755D]"></div>
    </div>
  );
  
  if (error) return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 max-w-5xl mx-auto mt-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">Error loading wallet: {error}</p>
        </div>
      </div>
    </div>
  );
  
  if (!earning) return (
    <div className="text-center mt-6 p-6 bg-gray-50 rounded-lg max-w-5xl mx-auto">
      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 className="mt-2 text-sm font-medium text-gray-900">No wallet found</h3>
      <p className="mt-1 text-sm text-gray-500">Create a wallet to get started.</p>
    </div>
  );

  const filteredTransactions = earning.transactions.filter(tx => tx.type === activeTab);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-[#E53935] mb-2">Wallet Summary</h2>
        <div className="inline-block bg-red-50 px-6 py-3 rounded-full">
          <p className="text-lg font-medium">
            <span className="text-gray-600">Current Balance:</span>{' '}
            <span className="text-2xl font-bold text-[#E53935]">₹{earning.balance.toFixed(2)}</span>
          </p>
        </div>
      </div>

      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setActiveTab('credit')}
          className={`px-6 py-3 cursor-pointer rounded-full font-medium transition-all duration-200 ${
            activeTab === 'credit' 
              ? 'bg-[#E53935] text-white shadow-md' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Credit
          </div>
        </button>
        <button
          onClick={() => setActiveTab('debit')}
          className={`px-6 py-3 rounded-full cursor-pointer font-medium transition-all duration-200 ${
            activeTab === 'debit' 
              ? 'bg-[#E53935] text-white shadow-md' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Debit
          </div>
        </button>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No {activeTab} transactions</h3>
          <p className="mt-1 text-sm text-gray-500">Your {activeTab} transactions will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
          {filteredTransactions.map((tx, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-lg transition-all duration-200 hover:shadow-md ${
                tx.type === 'credit' 
                  ? 'bg-red-50 border-l-4 border-red-700' 
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
      <DeliveryWithdrawalForm/>
    </div>
  );
};

export default WalletInfo;