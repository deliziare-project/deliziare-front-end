import React, { useEffect } from 'react';
import { Mail, Phone } from 'lucide-react';
import { formatRelativeTime } from '../../utils/dateUtils';
import { Replay } from '@/types/Replay';
import StatusBadge from './StatusBadge';
import axiosInstance from '@/api/axiosInstance';
import { useRouter } from 'next/navigation'; 
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { getAllPay } from '@/features/paymentSlice';

interface ReplayCardProps {
  replay: Replay;
 
}

const ReplayCard: React.FC<ReplayCardProps> = ({ replay }) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { pay } = useSelector((state: RootState) => state.payment);

  useEffect(() => {
    dispatch(getAllPay());
  }, [dispatch]);

  const handleClickAccept = async (value: Replay) => {
    try {
      await axiosInstance.patch('/bids/accept-bid', {
        bidId: value._id,
        postId: value.postId,
      });
      
    } catch (error) {
      console.error('Error accepting bid:', error);
    }
  };

  const handlePayment = () => {
    router.push(`/payment?bidId=${replay._id}`); 
  };

  // console.log('pay',pay)
  // console.log(pay[0]?.bid);
  //  console.log(pay[0]?.bid?.bidId);
  //   console.log(replay._id);
  
  
  const bidPayment = pay?.find(
    (payment) => payment?.bid?.bidId._id == replay._id
  );

  // console.log(bidPayment)
  const isPaymentPending = bidPayment?.status === 'pending';
  const isPaymentSuccess = bidPayment?.status === 'success';

  return (
    <div className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow replay-card">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-medium text-gray-900">{replay.chefId?.name}</h3>
        </div>

        <div className="flex flex-col items-end">
          <StatusBadge status={replay.status} />
          <div className="mt-1 text-sm text-gray-500">
            {replay.createdAt ? formatRelativeTime(replay.createdAt) : 'Just now'}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div>
          <div className="text-2xl font-bold text-gray-900">
            <span className="text-sm text-gray-600">Bid Amount :</span>{' '}
            ${replay.bidAmount.toLocaleString()}
          </div>
          <p className="text-sm text-gray-700">{replay.description}</p>
        </div>

        {replay.status === 'pending' ? (
          <button
            className="px-4 py-2 mt-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            onClick={() => handleClickAccept(replay)}
          >
            Accept
          </button>
        ) : (
          <p
            className={`inline-block text-sm font-medium px-2 py-1 rounded-full ${
              replay.status === 'accepted'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {replay.status}
          </p>
        )}

        {isPaymentSuccess ? (
          <button
            className="px-4 py-2 mt-2 bg-gray-300 text-gray-700 rounded-lg cursor-not-allowed"
            disabled
          >
            Paid
          </button>
        ) : (replay.status === 'accepted' || isPaymentPending) && (
          <button
            className="px-4 py-2 mt-2 bg-blue-600 cursor-pointer hover:bg-blue-700 text-white rounded-lg transition-colors"
            onClick={handlePayment}
          >
            Pay
          </button>
        )}
      </div>
    </div>
  );
};

export default ReplayCard;
