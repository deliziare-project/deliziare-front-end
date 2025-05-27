import React from 'react';
import { Mail, Phone } from 'lucide-react';
import { formatRelativeTime } from '../../utils/dateUtils';
import {Replay} from '@/types/Replay'
import StatusBadge from './StatusBadge';
import axiosInstance from '@/api/axiosInstance';

interface ReplayCardProps {
  replay: Replay;
}
const handleClickAccept=async(value:any)=>{

try {
    await axiosInstance.patch('/bids/accept-bid',{bidId:value._id,postId:value.postId})
    //getCurrentUser()
} catch (error) {
    console.log(error)
}
}
const ReplayCard: React.FC<ReplayCardProps> = ({ replay }) => {
  return (
    <div className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow replay-card">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-medium text-gray-900">{replay.chefId.name}</h3>
        </div>
        
        <div className="flex flex-col items-end">
          <StatusBadge status={replay.status} />
          
          <div className="mt-1 text-sm text-gray-500">
            {replay.createdAt ? formatRelativeTime(replay.createdAt) : 'Just now'}
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex justify-between items-center">
        <div>
          <div className="text-2xl font-bold text-gray-900">
            ${replay.bidAmount.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Bid Amount</div>
        </div>
        {
            replay.status=='pending'?(
                <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors" onClick={()=>handleClickAccept(replay)}>
                 accept
               </button>
            ):(
                <>
                <p
  className={`inline-block text-sm font-medium px-2 py-1 rounded-full
    ${
      replay.status === 'accepted'
        ? 'bg-green-100 text-green-800'
        : 'bg-red-100 text-red-800'
     }
  `}
>
  {replay.status}
</p>
              
                </>
            )
        }
       
      </div>
    </div>
  );
};

export default ReplayCard;