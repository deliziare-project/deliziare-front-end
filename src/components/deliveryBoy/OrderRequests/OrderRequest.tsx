'use client'

import DetailModal from '@/components/deliveryBoy/OrderRequests/DetailModal'
import { getAllBids } from '@/features/bidSlice'
import { AppDispatch, RootState } from '@/redux/store'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Clock, MapPin, Calendar, ChefHat } from 'lucide-react'

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
    <div className="p-6 h-screen overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-[#B8755D] hover:text-[#9c5942] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">Back</span>
        </button>

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-[#E53935]">Order Requests</h2>
          <span className="bg-red-50 shadow-md text-[#E53935] px-3 py-1 rounded-full text-sm font-medium">
            {completedBids.length} {completedBids.length === 1 ? 'Request' : 'Requests'}
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E53935]"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-red-500 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-700 font-medium">Error: {error}</p>
            </div>
          </div>
        ) : completedBids.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-sm text-center border border-gray-200">
            <ChefHat className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No delivery requests available</h3>
            <p className="mt-2 text-gray-500">There are currently no completed orders needing delivery.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6">
              {completedBids.map((bid) => (
                <div
                  key={bid._id}
                  onClick={() => openModal(bid._id)}
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-red-700 mb-2">{bid.postId?.eventName}</h3>
                    <span className="bg-green-100 text-green-800 text-xs px-2.5 py-0.5 shadow-sm rounded-full">
                      Ready for delivery
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-red-50 p-2 rounded-lg">
                        <Calendar className="h-5 w-5 text-[#E53935]" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Event Date</p>
                        <p className="font-medium">
                          {new Date(bid.postId?.date).toLocaleDateString('en-GB')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="bg-red-50 p-2 rounded-lg">
                        <Clock className="h-5 w-5 text-[#E53935]" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Time</p>
                        <p className="font-medium">
                          {new Date(`1970-01-01T${bid.postId?.time}`).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true,
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="bg-red-50 p-2 rounded-lg">
                        <MapPin className="h-5 w-5 text-[#E53935]" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium">{bid.postId?.district}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button className="text-sm text-[#E53935] font-medium hover:text-[#9c5942] transition-colors flex items-center gap-1">
                      View details
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {selectedBidId && (
              <DetailModal 
                bidId={selectedBidId} 
                onClose={closeModal} 
                onActionComplete={removeBid}  
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default OrderRequest