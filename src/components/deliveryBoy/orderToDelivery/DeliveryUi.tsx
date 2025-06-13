'use client'

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { getOrder } from '@/features/deliverySlice'
import OrderDetailsModal from './orderDetails'
import {
  CalendarDays,
  ChefHat,
  Truck,
} from 'lucide-react'
import { useRouter } from 'next/navigation'

function DeliveryUi() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { order, loading, error } = useSelector((state: RootState) => state.delivery)

  const [showModal, setShowModal] = useState(false)
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)

  useEffect(() => {
    dispatch(getOrder())
  }, [dispatch])

  const sortedOrders = [...order].reverse()
  const topOrders = sortedOrders.slice(0, 3)

  const handleViewDetails = (postId: string) => {
    setSelectedPostId(postId)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedPostId(null)
  }

  const refreshOrders = () => {
    dispatch(getOrder())
  }

  return (
    <div className="min-h-screen py-6 mb-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-[#E53935] pb-2">
            My Delivery Orders
          </h2>

        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E53935]"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">Error loading orders: {error}</p>
              </div>
            </div>
          </div>
        ) : sortedOrders.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-sm text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No delivery orders assigned</h3>
            <p className="mt-1 text-sm text-gray-500">You currently don't have any delivery orders. Check back later!</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {topOrders.map((item) => {
                const bid = item.bidId
                const post = bid?.postId

                return (
                  <div
                    key={item._id}
                    className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-300 border border-gray-100"
                  >
                    <div className="px-5 py-4">
                      <h3 className="text-lg font-semibold text-red-700 mb-3 truncate">
                        {post?.eventName}
                      </h3>

                      <div className="space-y-3">
                        <div className="flex items-start">
                          <CalendarDays className="flex-shrink-0 h-5 w-5 text-gray-400 mt-0.5" />
                          <div className="ml-3">
                            <p className="text-sm text-gray-600">Event Date</p>
                            <p className="text-sm font-medium text-gray-900">
                              {new Date(post?.date).toLocaleDateString('en-GB')} •{' '}
                              {new Date(`1970-01-01T${post?.time}`).toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true,
                              })}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <ChefHat className="flex-shrink-0 h-5 w-5 text-gray-400 mt-0.5" />
                          <div className="ml-3">
                            <p className="text-sm text-gray-600">Chef</p>
                            <p className="text-sm font-medium text-gray-900">
                              {bid?.chefId?.name || 'Not assigned'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <Truck className="flex-shrink-0 h-5 w-5 text-gray-400 mt-0.5" />
                          <div className="ml-3">
                            <p className="text-sm text-gray-600">Delivery Status</p>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                item.status === 'delivered'
                                  ? 'bg-green-100 text-green-800'
                                  : item.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {item.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        className="mt-4 w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#E53935] hover:bg-[#D32F2F] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E53935] transition-colors"
                        onClick={() => handleViewDetails(item._id)}
                      >
                        View Details
                      </button>

                    </div>
                  </div>
                )
              })}
            </div>

            {sortedOrders.length > 3 && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => router.push('/deliveryBoy/orders')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-[#E53935] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E53935] transition-colors shadow-sm"
                 >
                  View All Orders ({sortedOrders.length})
                  <svg className="ml-2 -mr-1 w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}
          </>
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

export default DeliveryUi