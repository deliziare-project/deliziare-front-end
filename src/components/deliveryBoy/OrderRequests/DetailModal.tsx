'use client';

import axiosInstance from '@/api/axiosInstance';
import { showSuccess } from '@/components/shared/ToastUtilis';
import { acceptDelivery } from '@/features/deliverySlice';
import { AppDispatch } from '@/redux/store';
import {
  MapPinnedIcon,
  Clock,
  Users,
  List,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

interface DetailModalProps {
  bidId: string;
  onClose: () => void;
  onActionComplete: (bidId: string) => void;
}

function DetailModal({ bidId, onClose, onActionComplete }: DetailModalProps) {
  const [bid, setBid] = useState<any>(null);
  const dispatch = useDispatch<AppDispatch>();
  const router= useRouter()
  console.log(bid)

  useEffect(() => {
    if (bidId) {
      axiosInstance
        .get(`/bids/${bidId}`)
        .then((res) => setBid(res.data))
        .catch((err) => console.error('Failed to fetch bid:', err));
    }
  }, [bidId]);

  const handleAccept = () => {
    dispatch(acceptDelivery(bidId))
   
      .then(() => {
         router.push('/deliveryBoy/orders')
        showSuccess('You accepted the order');
       
      })
      .catch((err) => console.error('Failed to accept delivery:', err));
  };

 const handleReject = async () => {
  try {
    await axiosInstance.post('/delivery/orderReject', { bidId }); 
    showSuccess('You rejected the order');
    onActionComplete(bidId); 
  } catch (err) {
    console.error('Failed to reject delivery:', err);
  }
};


  if (!bid) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-[90%] max-w-md shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-600 hover:text-white hover:bg-red-500 hover:rounded-full p-1 text-2xl"
        >
          <X />
        </button>

        <h2 className="text-2xl font-bold mb-1 text-red-700">
          {bid.postId?.eventName}
        </h2>
        <p className="text-sm text-gray-600 mb-4 italic">
          {bid.postId?.description || 'No additional details'}
        </p>

        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <div className="bg-red-50 p-2 rounded-lg">
              <MapPinnedIcon className="w-4 h-4 text-[#E53935]" />
            </div>
            <span>{bid.postId?.district}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-red-50 p-2 rounded-lg">
              <Clock className="w-4 h-4 text-[#E53935]" />
            </div>
            <span>
              {new Date(bid.postId?.date).toLocaleDateString('en-GB')} at{' '}
              {new Date(`1970-01-01T${bid.postId?.time}`).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              })}
            </span>

          </div>
          <div className="flex items-center gap-2">
            <div className="bg-red-50 p-2 rounded-lg">
              <Users className="w-4 h-4 text-[#E53935]" />
            </div>
            <span>Food for {bid.postId?.quantity} people</span>
          </div>
        </div>

        <div className="mt-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-red-50 p-2 rounded-lg">
              <List className="w-4 h-4 text-[#E53935]" />
            </div>
            <h3 className="font-semibold">Menu Items:</h3>
          </div>
          <ul className="list-disc pl-5 text-sm text-gray-700">
            {bid.postId?.menu?.map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="flex items-center gap-2 mt-5">
        <div className="bg-red-50 p-2 rounded-lg">
          <svg className="w-4 h-4 text-[#E53935]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-10v2m0 12v2m8-10a8 8 0 11-16 0 8 8 0 0116 0z" />
          </svg>
        </div>
        <div>
          <p className="text-sm text-gray-500">Delivery Charge</p>
          <p className="font-semibold text-gray-700">₹ {bid.deliveryCharge}</p>
        </div>
      </div>


        <div className="mt-6 flex justify-end gap-3">
          {bid.postId?.deliveryStatus === 'pending' ? (
            <>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                onClick={handleAccept}
              >
                Accept
              </button>
              <button
                className="px-4 py-2 bg-[#E53935] text-white rounded-lg hover:bg-red-600 transition"
                onClick={handleReject}
              >
                Reject
              </button>
            </>
          ) : (
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded-lg cursor-not-allowed"
              disabled
            >
              Accepted
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default DetailModal;
