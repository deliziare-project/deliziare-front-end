'use client'

import { getAllBids } from '@/features/bidSlice'
import { AppDispatch, RootState } from '@/redux/store'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DetailModal from './DetailModal'
import { CalendarDays, Clock, MapPin } from 'lucide-react'
import Image from 'next/image'

function ReqUi() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { allbids, loading, error } = useSelector((state: RootState) => state.chefBids)
  const [selectedBidId, setSelectedBidId] = useState<string | null>(null)
  const [bids, setBids] = useState<any[]>([])

  // Fetch and filter bids
  useEffect(() => {
    dispatch(getAllBids()).then((res: any) => {
      const filtered = res.payload?.filter(
        (bid: any) => bid.status === 'completed' && bid.postId?.deliveryStatus === 'pending'
      )
      setBids([...filtered]?.reverse().slice(0, 3) || [])
    })
  }, [dispatch])

  const openModal = (id: string) => setSelectedBidId(id)
  const closeModal = () => setSelectedBidId(null)

  const removeBid = (bidIdToRemove: string) => {
    setBids((prevBids) => prevBids.filter((b) => b._id !== bidIdToRemove))
    closeModal()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b py-6 px-4 sm:px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#E53935] mb-4">Latest Delivery Requests</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            View and manage your pending delivery orders
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E53935]"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg max-w-2xl mx-auto">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">Error: {error}</p>
              </div>
            </div>
          </div>
        ) : bids.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative w-64 h-64 mb-6">
              <Image
                src="/deliveryImages/noOrder.jpg"
                alt="No orders available"
                fill
                className="object-contain"
                priority
              />
            </div>
            <h3 className="text-xl font-medium text-red-600 mb-2">No delivery requests found</h3>
            <p className="text-gray-500 max-w-md text-center">
              Currently there are no pending delivery orders. Check back later for new requests.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bids.map((bid) => (
              <div
                key={bid._id}
                onClick={() => openModal(bid._id)}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-red-700 mb-3">
                    {bid.postId?.eventName}
                  </h3>
                  <div className="space-y-3 text-gray-600">
                    <div className="flex items-center">
                      <CalendarDays className="w-5 h-5 text-gray-500 mr-2" />
                      <span>{bid.postId?.date}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-gray-500 mr-2" />
                      <span>{bid.postId?.time}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 text-gray-500 mr-2" />
                      <span>{bid.postId?.district}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <span className="inline-block bg-red-50 text-red-500 px-3 py-1 rounded-full text-sm font-medium">
                      Pending Delivery
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedBidId && (
          <DetailModal
            bidId={selectedBidId}
            onClose={closeModal}
            onActionComplete={removeBid}
          />
        )}

        {allbids?.filter(
          (bid) => bid.status === 'completed' && bid.postId?.deliveryStatus === 'pending'
        )?.length > 3 && (
          <div className="mt-12 text-center">
            <button
              onClick={() => router.push('/deliveryBoy/request')}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#E53935] hover:bg-[#D32F2F] transition-colors duration-200"
            >
              View All Orders
              <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReqUi
