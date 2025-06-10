import axiosInstance from '@/api/axiosInstance'
import { showSuccess } from '@/components/shared/ToastUtilis'
import { acceptDelivery } from '@/features/deliverySlice'
import { AppDispatch } from '@/redux/store'
import {
  MapPinnedIcon,
  Clock,
  Users,
  List,
  X,
  Router,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

interface DetailModalProps {
  bidId: string
  onClose: () => void
  onActionComplete: (bidId: string) => void
}


function DetailModal({ bidId, onClose ,onActionComplete}: DetailModalProps) {
  const [bid, setBid] = useState<any>(null)
  const dispatch=useDispatch<AppDispatch>()
  const router=useRouter()

  useEffect(() => {
    if (bidId) {
      axiosInstance
        .get(`/bids/${bidId}`)
        .then((res) => setBid(res.data))
        .catch((err) => console.error('Failed to fetch bid:', err))
    }
  }, [bidId])

 const handleAccept = () => {
  dispatch(acceptDelivery(bidId))
    .then(() => {
      showSuccess('You accepted the order')
      onActionComplete(bidId) 
    })
    .catch((err) => console.error('Failed to accept delivery:', err))
}

const handleReject = () => {
  showSuccess('You rejected the order')
  onActionComplete(bidId) 
}



  if (!bid) return null

  return (
    <div className="fixed inset-0 backdrop-blur bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-[90%] max-w-md shadow-2xl relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 cursor-pointer right-3 text-gray-600 hover:text-black text-2xl"
        >
          <X />
        </button>

        {/* Event Info */}
        <h2 className="text-2xl font-bold mb-1 text-[#B8755D]">{bid.postId?.eventName}</h2>
        <p className="text-sm text-gray-600 mb-4 italic">{bid.postId?.description || "No additional details"}</p>

        {/* Details */}
        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <MapPinnedIcon className="w-4 h-4 text-[#B8755D]" />
            <span>{bid.postId?.district}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#B8755D]" />
            <span>{bid.postId?.date} at {bid.postId?.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#B8755D]" />
            <span>Food for {bid.postId?.quantity} people</span>
          </div>
        </div>

        <div className="mt-5">
          <div className="flex items-center gap-2 mb-2">
            <List className="w-4 h-4 text-[#B8755D]" />
            <h3 className="font-semibold">Menu Items:</h3>
          </div>
          <ul className="list-disc pl-5 text-sm text-gray-700">
            {bid.postId?.menu?.map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          {bid.postId?.deliveryStatus=='pending'?(
            <>
            <button
            className="px-4 py-2 bg-green-500 cursor-pointer text-white rounded-lg hover:bg-green-600 transition"
            onClick={handleAccept}
          >
            Accept
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            onClick={handleReject}
          >
            Reject
          </button>
          </>
          ):(
             <button
            className="px-4 py-2 cursor-not-allowed bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
        
          >
            Accepted
          </button>
          )}
          
        </div>
      </div>
    </div>
  )
}

export default DetailModal
