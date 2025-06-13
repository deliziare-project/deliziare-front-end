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

  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
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

            {/* Map Section */}
            <div className="pt-4">
              <DeliveryMap mapHeight="400px" refreshOrders={refreshOrders} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderDetailsModal
