'use client'

import { getAllBids } from '@/features/bidSlice'
import { AppDispatch, RootState } from '@/redux/store'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DetailModal from './DetailModal'
import { CalendarDays, Clock, MapPin } from 'lucide-react'

function ReqUi() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { allbids, loading, error } = useSelector((state: RootState) => state.chefBids)
  const [selectedBidId, setSelectedBidId] = useState<string | null>(null)

  const [bids, setBids] = useState<any[]>([])

  useEffect(() => {
    dispatch(getAllBids())
  }, [dispatch])

  const completedBids = allbids?.filter(
    (bid) => bid.status === 'completed' && bid.postId?.deliveryStatus === 'pending'
  ) || []

  useEffect(() => {
  dispatch(getAllBids()).then((res: any) => {
    const filtered = res.payload?.filter(
      (bid: any) => bid.status === 'completed' && bid.postId?.deliveryStatus === 'pending'
    )
    setBids(filtered?.slice(0, 3) || [])
  })
}, [dispatch])

const removeBid = (bidIdToRemove: string) => {
  setBids((prevBids) => prevBids.filter((b) => b._id !== bidIdToRemove))
  closeModal()
}


  const displayedBids = bids

  const openModal = (id: string) => {
    setSelectedBidId(id)
  }

  const closeModal = () => {
    setSelectedBidId(null)
  }

  return (
    <div className="py-8 px-4 sm:px-6 md:px-12 lg:px-20 flex justify-center">
      <div className="w-full max-w-3xl">
        <h2 className="text-3xl font-semibold text-[#B8755D] mb-6  pb-2 ">
          Latest Order Requests
        </h2>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : completedBids.length === 0 ? (
          <p className="text-gray-500">No order requests found.</p>
        ) : (
          <>
            <ul className="space-y-4">
              {displayedBids?.map((bid) => (
                <li
                  key={bid._id}
                  onClick={() => openModal(bid._id)}
                  className="bg-white rounded-lg p-5 shadow-md border border-gray-100 hover:shadow-lg transition cursor-pointer"
                >
                  <h3 className="text-lg font-semibold text-[#B8755D] mb-2">
                    {bid.postId?.eventName}
                  </h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-gray-500" />
                      {bid.postId?.date}
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      {bid.postId?.time}
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      {bid.postId?.district}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

           {selectedBidId && (
            <DetailModal
              bidId={selectedBidId}
              onClose={closeModal}
              onActionComplete={removeBid} 
            />
          )}

            {completedBids.length > 3 && (
              <div className="mt-6 text-right">
                <button
                  onClick={() => router.push('/deliveryBoy/request')}
                  className="text-blue-600 underline hover:text-blue-800 transition"
                >
                  View All Orders →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ReqUi
