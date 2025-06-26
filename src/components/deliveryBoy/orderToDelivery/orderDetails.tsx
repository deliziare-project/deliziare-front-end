'use client'

import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { clearSelectedOrder, fetchOrderDetails } from '@/features/deliverySlice'
import {
  ChefHat,
  CalendarDays,
  Clock,
  CircleCheck,
  Info
} from 'lucide-react'
import dynamic from 'next/dynamic'
import DeliveryBoyTracker from '../DeliveryTracker'

const DeliveryMap = dynamic(() => import('./mapview'), { ssr: false })

interface Props {
  postId: string
  show: boolean
  onClose: () => void
  refreshOrders: () => void
}

const OrderDetailsModal: React.FC<Props> = ({ postId, show, onClose, refreshOrders }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { selectedOrder, loading, error } = useSelector((state: RootState) => state.delivery)

  useEffect(() => {
    if (show && postId) {
      dispatch(fetchOrderDetails(postId))
    }
    return () => {
      dispatch(clearSelectedOrder())
    }
  }, [dispatch, show, postId])
  console.log(selectedOrder)

  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 bg-opacity-30 backdrop-blur">
      <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          className="absolute top-3 right-4 text-gray-500 hover:text-red-600 text-xl"
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-red-700 mb-5 flex items-center gap-2">
          <Info className="w-6 h-6" />
          Order Details
        </h2>

        {/* Loading / Error */}
        {loading && <p className="text-center text-gray-600 font-semibold">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* Content */}
        {selectedOrder && (
          <div className="space-y-4 text-gray-700 text-sm px-1 divide-y divide-gray-200">
            <div className="flex flex-col gap-2 pb-4">
              <div className="flex items-center gap-2">
                <CircleCheck className="w-5 h-5 text-red-600" />
                <span>
                  <strong>Status:</strong> {selectedOrder.status}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-red-600" />
                <span>
                  <strong>Chef:</strong> {selectedOrder.bidId.chefId.name}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-red-600" />
                <span>
                  <strong>Date:</strong> {new Date(selectedOrder.bidId.postId.date).toLocaleDateString('en-GB')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-red-600" />
                <span>
                  <strong>Time:</strong>{' '}
                  {new Date(`1970-01-01T${selectedOrder.bidId.postId.time}`).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </span>
              </div>
            </div>
           <div className="pt-4">
            <h3 className="text-lg font-semibold text-red-700 mb-3">Customer Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.183 0 4.22.523 6.04 1.447M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span><strong>Name:</strong> {selectedOrder.bidId.postId.userId.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25l6.165 4.11a.75.75 0 00.82 0l6.165-4.11m-6.165 4.11V19.5m0-7.14l6.165 4.11a.75.75 0 00.82 0l6.165-4.11" />
                </svg>
                <span><strong>Phone:</strong> {selectedOrder.bidId.postId.userId.phone}</span>
              </div>
            </div>
          </div>


            {/* Map Section */}
            <div className="pt-4">
              <DeliveryMap mapHeight="400px" refreshOrders={refreshOrders} />
            </div>
          </div>
        )}
      </div>
      {selectedOrder && (
  <DeliveryBoyTracker deliveryId={selectedOrder._id} />
)}

    </div>
  )
}

export default OrderDetailsModal
