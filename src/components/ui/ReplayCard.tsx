import React from 'react';
import { Mail, Phone } from 'lucide-react';
import { formatRelativeTime } from '../../utils/dateUtils';
import { Replay } from '@/types/Replay';
import StatusBadge from './StatusBadge';
import axiosInstance from '@/api/axiosInstance';
import { useRouter } from 'next/navigation'; 

interface ReplayCardProps {
  replay: Replay;
}

const ReplayCard: React.FC<ReplayCardProps> = ({ replay }) => {
  const router = useRouter();
  console.log(replay)

  const handleClickAccept = async (value: Replay) => {
    try {
      await axiosInstance.patch('/bids/accept-bid', {
        bidId: value._id,
        postId: value.postId,
      });
      router.push(`/payment?bidId=${value._id}`); 
    } catch (error) {
      console.error('Error accepting bid:', error);
    }
  };
console.log('replay of bid',replay)
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
      </div>
    </div>
  );
};

export default ReplayCard;
