'use client'

import DetailModal from '@/components/deliveryBoy/OrderRequests/DetailModal'
import { getAllBids } from '@/features/bidSlice'
import { AppDispatch, RootState } from '@/redux/store'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

function OrderRequest() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const [selectedBidId, setSelectedBidId] = useState<string | null>(null)

  const { allbids, loading, error } = useSelector((state: RootState) => state.chefBids)

    const [bids, setBids] = useState<any[]>([])
    
  useEffect(() => {
    dispatch(getAllBids())
  }, [dispatch])

  const completedBids = allbids?.filter((bid) => bid.status === 'completed' && bid.postId?.deliveryStatus === 'pending') || []

  const openModal = (id: string) => {
    setSelectedBidId(id)
  }

  const closeModal = () => {
    setSelectedBidId(null)
  }

  const removeBid = (bidIdToRemove: string) => {
  setBids((prevBids) => prevBids.filter((b) => b._id !== bidIdToRemove))
  closeModal()
}

  return (
    <div className="p-4 h-screen overflow-y-auto">
      <button
        onClick={() => router.back()}
        className="mb-4 text-sm text-[#B8755D] cursor-pointer flex items-center"
      >
        ← Back
      </button>

      <h2 className="text-2xl font-bold mb-4">Order Requests</h2>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : completedBids.length === 0 ? (
        <p className="text-gray-500">No request found.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {completedBids.map((bid) => (
              <li
                key={bid._id}
                onClick={() => openModal(bid._id)}
                className="border rounded p-4 shadow-sm cursor-pointer hover:bg-gray-100"
              >
                <h3 className="font-semibold text-[#B8755D]">{bid.postId?.eventName}</h3>
                <p className="text-sm text-gray-600">
                  {bid.postId?.date} at {bid.postId?.time} • {bid.postId?.district}
                </p>
              </li>
            ))}
          </ul>

          {selectedBidId && <DetailModal bidId={selectedBidId} onClose={closeModal} onActionComplete={removeBid}  />}
        </>
      )}
    </div>
  )
}

export default OrderRequest
