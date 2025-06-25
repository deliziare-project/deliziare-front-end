'use-client'
import React, { useState } from 'react';
import { MessageBubble } from './animations/MessageAnimations';
import { Message } from '../../types/message';
import { Check, CheckCheck } from 'lucide-react';
import axiosInstance from '@/api/axiosInstance';
import { AcceptRequestModal } from './AcceptRequestModal';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { updateMessage } from '@/features/chatSlice';

interface MessageItemProps {
  message: Message;
  isCurrentUser: boolean;
  showAvatar?: boolean;
  avatar?: string;
  currentUserId: string;
}

export default function MessageItem({
  message,
  isCurrentUser,
  showAvatar = true,
  avatar,
  currentUserId,
}: MessageItemProps) {
    const dispatch = useDispatch<AppDispatch>();
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const timestamp =
    typeof message.timestamp === 'string'
      ? new Date(message.timestamp)
      : message.timestamp;

  const formattedTime = timestamp.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleReject = async () => {
    if (!message.requstId) return;
    try {
      await axiosInstance.post('/messages/rejectreqmessage', { chatRequstId: message.requstId._id ,status:'rejected'});
      console.log('Request rejected via API');
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

 const handleAcceptSuccess =async () => {
  if (message.requstId) {
    
    const updatedMessage = {
      ...message,
      requstId: {
        ...message.requstId,
        isAddressAdd: true,
      
      }
    };
    
    
    dispatch(updateMessage(updatedMessage));
 
    setShowAcceptModal(false);
  }
};

const handleStatusaccept=()=>{
    const updatedMessage = {
      ...message,
      requstId: {
        ...message.requstId,
        status: 'accepted',
      
      }
    };
    
    
    dispatch(updateMessage(updatedMessage));
}
const handleAsseptClick=async()=>{
  if(!message.requstId.isAddressAdd){
    setShowAcceptModal(true)
  }else{
   const loadScript = () =>
    new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
   const res = await loadScript();
  if (!res) return alert('Razorpay SDK failed to load');
  const { data: order } = await axiosInstance.post('/chatpayment/create-order', {
    bidId:message.requstId._id,
    receipt: `receipt_${message.requstId._id}`,
  });
 
  const options = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY!,
    amount: order.amount,
    currency: order.currency,
    name: 'Chat Request Payment',
    description: message.requstId.description,
    order_id: order.id,
    handler: async (response: any) => {
     
      const verifyRes = await axiosInstance.post('/chatpayment/verify', {
        order_id: response.razorpay_order_id,
        payment_id: response.razorpay_payment_id,
        signature: response.razorpay_signature,
        bidId:message.requstId._id
      });

      if (verifyRes.status === 200) {
        
        handleStatusaccept()
        alert('pyment success');
      } 
    },
    prefill: {
      name: 'Ijas',
      email: 'ijas@example.com',
      contact: '9999999999',
    },
    theme: {
      color: '#213D72',
    },
  };

  const razorpay = new (window as any).Razorpay(options);
  razorpay.open();

  }
  
} 
  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4 relative`}>
      <div className={`flex max-w-[80%] gap-3 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {!isCurrentUser && showAvatar && (
          <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0 flex items-center justify-center overflow-hidden">
            <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
          </div>
        )}

        <MessageBubble isCurrentUser={isCurrentUser}>
          <div
            className={`rounded-2xl p-3 ${
              isCurrentUser
                ? 'bg-blue-500 text-white rounded-tr-none shadow-sm'
                : 'bg-white text-gray-800 rounded-tl-none shadow-sm'
            }`}
          >
            {message.requstId && (
              <div className="mb-2 rounded-lg border border-yellow-300 bg-yellow-50 p-2">
                <p className="text-sm font-semibold text-yellow-800">Request</p>
                <p className="text-sm text-gray-700"><span className="font-medium">Description:</span> {message.requstId.description}</p>
                <p className="text-sm text-gray-700"><span className="font-medium">Amount:</span> ₹{message.requstId.amount}</p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Status:</span>{' '}
                  <span
                    className={`font-semibold ${
                      message.requstId.status === 'pending' ? 'text-yellow-600' :
                      message.requstId.status === 'accepted' ? 'text-green-600' :
                      'text-red-600'
                    }`}
                  >
                    {message.requstId.status}
                  </span>
                </p>

                {message.requstId.status === 'pending' && !isCurrentUser && (
                  <div className="mt-2 flex gap-2">
                    <button
                      className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                      onClick={handleAsseptClick}
                    >
                     {message.requstId.isAddressAdd?" pay ":' Accept'}
                    </button>
                    <button
                      className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                      onClick={handleReject}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            )}

            {message.postId && (
              <div className="mb-2 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                {message.postId.images?.length > 0 && (
                  <img
                    src={message.postId.images[0].url}
                    alt={message.postId.images[0].altText || 'Post image'}
                    className="w-full h-24 object-cover"
                  />
                )}
                <div className="px-2 py-1">
                  <p className="text-sm font-medium text-gray-800">{message.postId.title}</p>
                </div>
              </div>
            )}

            <p className="text-sm text-black">{message.content}</p>

            <div
              className={`flex justify-end items-center mt-1 ${
                isCurrentUser ? 'text-blue-100' : 'text-gray-400'
              }`}
            >
              <span className="text-[10px] mr-1">{formattedTime}</span>
              {isCurrentUser && (
                message.isRead ? (
                  <CheckCheck className="w-3 h-3" />
                ) : (
                  <Check className="w-3 h-3" />
                )
              )}
            </div>
          </div>
        </MessageBubble>
      </div>

      {showAcceptModal && message.requstId && !message.requstId.isAddressAdd&&(
        <div className="absolute z-50 top-0 left-0 w-full">
          <AcceptRequestModal
            requestId={message.requstId._id}
            onClose={() => setShowAcceptModal(false)}
            onSuccess={handleAcceptSuccess}
          />
        </div>
      )}
    </div>
  );
}