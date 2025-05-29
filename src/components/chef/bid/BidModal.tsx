'use client';

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { createBid } from '@/features/bidSlice';

const BidModal = ({ postId, onClose }: { postId: string; onClose: () => void }) => {
  const [bidAmount, setBidAmount] = useState('');
  const [description,setDescription]=useState('')
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async () => {
    if (!bidAmount) return alert('Enter a valid amount');
    await dispatch(createBid({ postId, bidAmount: Number(bidAmount) ,description}));
    onClose();
  };

  return (
    <div className="fixed inset-0  bg-opacity-40 flex items-center justify-center z-50 backdrop-blur">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-[#B8755D]">Place Your Amount</h2>
        <input
          type="number"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          className="border w-full p-2 mb-4 text-gray-500"
          placeholder="Enter amount"
        />
        <input
          type="string"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border w-full p-2 mb-4 text-gray-500"
          placeholder="add a description(optional)"
        />
        
        <div className="flex justify-end gap-2">
          <button className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>Cancel</button>
          <button className="bg-[#B8755D] text-white px-4 py-2 rounded" onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default BidModal;
