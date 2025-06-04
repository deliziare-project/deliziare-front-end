'use client'
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Replay } from '@/types/Replay';
import { AppDispatch ,RootState} from '@/redux/store';
import { createPayment, verifyPayment } from '@/features/paymentSlice';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import PaymentSummary from './paymentSummary';
import axiosInstance from '@/api/axiosInstance';
import { showSuccess } from '../shared/ToastUtilis';

declare global {
  interface Window {
    Razorpay?: any;
  }
}

const PaymentForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, razorpayOrder, payment, success, error } = useSelector(
    (state: RootState) => state.payment
  );

  console.log(razorpayOrder)
const searchParams = useSearchParams();
const bidIdFromQuery = searchParams.get('bidId') || '';
const [bidId, setBidId] = useState(bidIdFromQuery);
const [paymentMethod, setPaymentMethod] = useState('razorpay');
const [bid, setBid] = useState<Replay | null>(null);

console.log('payment data',payment);
 useEffect(() => {
    if (bidId) {
      axiosInstance
        .get(`/bids/${bidId}`)
        .then((res) => setBid(res.data))
        .catch((err) => console.error('Failed to fetch bid:', err));
    }
  }, [bidId]);
  console.log(bid)

const router=useRouter()
  const openRazorpay = () => {
    if (!razorpayOrder) {
      alert('No order found. Please create payment first.');
      return;
    }

    console.log('razorpay key',process.env.NEXT_PUBLIC_RAZORPAY_KEY)
    console.log('razorpay amount',razorpayOrder.amount);
    
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY, 
      amount: razorpayOrder.amount, 
      currency: razorpayOrder.currency,
      name: 'Deliziare',
      description: '',
      order_id: razorpayOrder.id,
      handler: function (response: any) {
       
        dispatch(
          verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          })
        );
      },
      prefill: {
        
      },
      theme: {
        color: '#3399cc',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handleCreatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bidId || !paymentMethod) {
      alert('Please fill bidId and payment method');
      return;
    }
    dispatch(createPayment({ bidId, paymentMethod }));
    showSuccess('payment completed successfully')
  };

  useEffect(() => {
    if (razorpayOrder) {
      openRazorpay();
    }
  }, [razorpayOrder]);

  useEffect(() => {
  if (success && payment) {
    router.push('/user/posts');
  }
}, [success, payment]);

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow-md">
     <button
      onClick={() => router.back()}
      className="mb-4 text-sm text-[#B8755D]  flex items-center"
    >
      ← Back
    </button>

      <h2 className="text-xl font-semibold mb-4">Proceed Payment </h2>

      <form onSubmit={handleCreatePayment} className="space-y-4">

       {bid?.chefProfile?.location?.lat !== undefined &&
          bid?.chefProfile?.location?.lng !== undefined &&
          bid?.postId?.location?.lat !== undefined &&
          bid?.postId?.location?.lng !== undefined && (
            <PaymentSummary
              bidAmount={Number(bid.bidAmount)}
              chefLocation={{
                lat: bid.chefProfile.location.lat,
                lng: bid.chefProfile.location.lng,
              }}
              eventLocation={{
                lat: bid.postId.location.lat,
                lng: bid.postId.location.lng,
              }}
            />
          )}

{!bidIdFromQuery && (
  <div>
    <label htmlFor="bidId" className="block mb-1 font-medium">
      Bid ID
    </label>
    <input
      type="text"
      id="bidId"
      value={bidId}
      onChange={(e) => setBidId(e.target.value)}
      className="w-full border px-3 py-2 rounded"
      required
    />
  </div>
)}


        <div>
          <label htmlFor="paymentMethod" className="block mb-1 font-medium">
            Payment Method
          </label>
          <select
            id="paymentMethod"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="razorpay">Razorpay</option>
            
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#B8755D] text-white py-2 rounded  disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
      </form>

      {error && <p className="mt-4 text-red-600">Error: {error}</p>}
{/* 
      {success && payment && (
        <p className="mt-4 text-green-600">
          Payment successful! Payment ID: {payment.razorpayPaymentId}
        </p>
      )} */}
    </div>
  );
};

export default PaymentForm;
