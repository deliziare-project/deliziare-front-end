'use client';

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { createBid } from '@/features/bidSlice';

const BidModal = ({ postId, onClose }: { postId: string; onClose: () => void }) => {
  const [bidAmount, setBidAmount] = useState('');
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async () => {
    if (!bidAmount) return alert('Enter a valid amount');
    await dispatch(createBid({ postId, bidAmount: Number(bidAmount) }));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Place Your Amount</h2>
        <input
          type="number"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          className="border w-full p-2 mb-4"
          placeholder="Enter amount"
        />
        <div className="flex justify-end gap-2">
          <button className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>Cancel</button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default BidModal;
