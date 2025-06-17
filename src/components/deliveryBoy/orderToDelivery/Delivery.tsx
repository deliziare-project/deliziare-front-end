'use client'

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { getOrder } from '@/features/deliverySlice'
import OrderDetailsModal from './orderDetails'
import { CalendarDays, ChefHat, Truck } from 'lucide-react'

function Delivery() {
  const dispatch = useDispatch<AppDispatch>()
  const { order, loading, error } = useSelector((state: RootState) => state.delivery)

  const [showModal, setShowModal] = useState(false)
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)

  const [selectedTab, setSelectedTab] = useState<'pending' | 'picked up' | 'delivered'>('pending')

  const refreshOrders = () => {
  dispatch(getOrder())
}

  useEffect(() => {
    dispatch(getOrder())
  }, [dispatch])

  const handleViewDetails = (postId: string) => {
    setSelectedPostId(postId)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedPostId(null)
  }

  const sortedOrders = [...order].reverse()
  const filteredOrders = sortedOrders.filter((item) => item.status === selectedTab)

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-[#B8755D] mb-6 text-center">Delivery Orders</h2>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          {['pending', 'picked up', 'delivered'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedTab(status as any)}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${
                selectedTab === status
                  ? 'bg-[#B8755D] text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status === 'picked up' ? 'Picked Up' : status}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading orders...</p>
        ) : error ? (
          <p className="text-center text-red-500">Error: {error}</p>
        ) : filteredOrders.length === 0 ? (
          <p className="text-center text-gray-500">No {selectedTab} orders.</p>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((item) => {
              const bid = item.bidId
              const post = bid?.postId

              return (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition duration-300 p-6"
                >
                  <h3 className="text-xl font-semibold text-[#B8755D] mb-3">{post?.eventName}</h3>

                  <div className="space-y-2 text-gray-700 text-sm">
                    <p className="flex items-center gap-2">
                      <CalendarDays className="w-5 h-5 text-gray-500" />
                      {new Date(post?.date).toLocaleDateString('en-GB')} at{' '}
                      {new Date(`1970-01-01T${post?.time}`).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                      })}
                    </p>

                    <p className="flex items-center gap-2">
                      <ChefHat className="w-5 h-5 text-gray-500" />
                      Chef: <span className="font-medium">{bid?.chefId?.name}</span>
                    </p>

                    <p className="flex items-center gap-2">
                      <Truck className="w-5 h-5 text-gray-500" />
                      Delivery Status:{' '}
                      <span
                        className={`font-semibold capitalize ${
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

                  <div className="mt-5 text-right">
                    <button
                      className="px-5 py-2 text-sm rounded-full bg-[#B8755D] text-white hover:bg-[#9c5942] transition"
                      onClick={() => handleViewDetails(item._id)}
                    >
                      View Details
                    </button>
                  </div>
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
            refreshOrders={refreshOrders}
          />
        )}
      </div>
    </div>
  )
}

export default Delivery
