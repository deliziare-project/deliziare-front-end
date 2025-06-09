'use client'

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { getOrder } from '@/features/deliverySlice'
import OrderDetailsModal from './orderDetails'
import {
  MapPin,
  CalendarDays,
  ChefHat,
  Truck,
} from 'lucide-react'

function DeliveryUi() {
  const dispatch = useDispatch<AppDispatch>()
  const { order, loading, error } = useSelector((state: RootState) => state.delivery)

  const [showModal, setShowModal] = useState(false)
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)

  useEffect(() => {
    dispatch(getOrder())
  }, [dispatch])

  const orders = order.slice(0, 4)

  const handleViewDetails = (postId: string) => {
    setSelectedPostId(postId)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedPostId(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100  py-8 flex justify-center">
      <div className="w-full ">
        <h2 className="text-3xl font-bold text-[#B8755D]  pb-2  mb-8">
          My Delivery Orders
        </h2>

        {loading ? (
          <p className="text-center text-gray-500 text-sm">Loading orders...</p>
        ) : error ? (
          <p className="text-center text-red-500 text-sm">Error: {error}</p>
        ) : orders?.length === 0 ? (
          <p className="text-center text-gray-500 text-sm">No delivery orders assigned.</p>
        ) : (
          <div className="space-y-6">
            {orders?.map((item) => {
              const bid = item.bidId
              const post = bid?.postId

              return (
                <div
                  key={item._id}
                  className="bg-white shadow-md rounded-xl p-5 border border-gray-200 hover:shadow-xl transition-all duration-300"
                >
                  <h3 className="text-xl font-semibold text-[#B8755D] mb-2">
                    {post?.eventName}
                  </h3>

                  <div className="text-sm text-gray-700 space-y-1">
                  
                    <p className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-gray-500" />
                      {new Date(post?.date).toLocaleDateString('en-GB')} at{' '}
                      {new Date(`1970-01-01T${post?.time}`).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                      })}
                    </p>
                    <p className="flex items-center gap-2">
                      <ChefHat className="w-4 h-4 text-gray-500" />
                      Chef: {bid?.chefId?.name}
                    </p>
                    <p className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-gray-500" />
                      Delivery Status:{' '}
                      <span
                        className={`font-semibold ${
                          item.status === 'delivered'
                            ? 'text-green-600'
                            : item.status === 'pending'
                            ? 'text-yellow-600'
                            : 'text-blue-600'
                        }`}
                      >
                        {item.status}
                      </span>
                    </p>
                  </div>

                  <button
                    className="mt-4 inline-block px-4 py-1.5 text-sm bg-[#B8755D] text-white rounded hover:bg-[#9c5942] transition"
                    onClick={() => handleViewDetails(item._id)}
                  >
                    View Details
                  </button>
                </div>
              )
            })}
          </div>
        )}

        {showModal && selectedPostId && (
          <OrderDetailsModal
            postId={selectedPostId}
            show={showModal}
            onClose={closeModal}
          />
        )}
      </div>
    </div>
  )
}

export default DeliveryUi
