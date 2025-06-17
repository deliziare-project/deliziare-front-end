'use client'

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { getOrder } from '@/features/deliverySlice'
import OrderDetailsModal from './orderDetails'
import { CalendarDays, ChefHat, Truck, RefreshCw } from 'lucide-react'

function Delivery() {
  const dispatch = useDispatch<AppDispatch>()
  const { order, loading, error } = useSelector((state: RootState) => state.delivery)

  const [showModal, setShowModal] = useState(false)
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)
  const [selectedTab, setSelectedTab] = useState<'pending' | 'picked up' | 'delivered'>('pending')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const refreshOrders = async () => {
    setIsRefreshing(true)
    try {
      await dispatch(getOrder())
    } finally {
      setIsRefreshing(false)
    }
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'picked up':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b  mb-12 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="text-3xl font-bold text-[#E53935] px-6 py-3 ">
            Delivery Orders
          </h2>
          
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto pb-2 mb-8 scrollbar-hide">
          <div className="flex space-x-2 mx-auto bg-white p-1 rounded-full shadow-inner">
            {['pending', 'picked up', 'delivered'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedTab(status as any)}
                className={`px-5 py-2 rounded-full text-sm font-medium capitalize transition-all ${
                  selectedTab === status
                  ? 'bg-[#E53935] text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'

                } whitespace-nowrap`}
              >
                {status === 'picked up' ? 'In Transit' : status}
              </button>
            ))}
          </div>
        </div>

        {loading && !isRefreshing ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#B8755D]"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <div className="flex items-center">
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
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-sm text-center">
            <Truck className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No {selectedTab} orders found</h3>
            <p className="mt-2 text-gray-500">You don't have any {selectedTab} delivery orders at this time.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((item) => {
              const bid = item.bidId
              const post = bid?.postId

              return (
                <div
                  key={item._id}
                  className="bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold text-red-700 mb-2">{post?.eventName}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="flex items-start space-x-3">
                        <div className="bg-red-50 p-2 rounded-lg">
                          <CalendarDays className="w-5 h-5 text-[#E53935]" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Event Date</p>
                          <p className="font-medium">
                            {new Date(post?.date).toLocaleDateString('en-GB')} •{' '}
                            {new Date(`1970-01-01T${post?.time}`).toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true,
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="bg-red-50 p-2 rounded-lg">
                          <ChefHat className="w-5 h-5 text-[#E53935]" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Chef</p>
                          <p className="font-medium">{bid?.chefId?.name || 'Not assigned'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={() => handleViewDetails(item._id)}
                        className="px-5 py-2 text-sm font-medium rounded-lg bg-[#E53935] hover:bg-[#D32F2F] focus:outline-none focus:ring-2 focus:ring-offset-2 text-white focus:ring-[#E53935] transition-colors flex items-center gap-2"
                      >
                        View Details
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
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