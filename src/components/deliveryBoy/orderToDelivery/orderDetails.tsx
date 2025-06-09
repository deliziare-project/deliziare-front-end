'use client'

import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { clearSelectedOrder, fetchOrderDetails } from '@/features/deliverySlice'
import {
  ChefHat,
  CalendarDays,
  Clock,
  MapPin,
  List,
  ShoppingCart,
  CircleCheck,
  Info
} from 'lucide-react'
import DeliveryMap from './mapview'

interface Props {
  postId: string
  show: boolean
  onClose: () => void
}

const OrderDetailsModal: React.FC<Props> = ({ postId, show, onClose }) => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-40 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-xl relative max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-2 right-3 text-gray-500 hover:text-red-600 text-xl"
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-[#B8755D] mb-4 flex items-center gap-2">
          <Info className="w-6 h-6" />
          Order Details
        </h2>

        {loading && <p className="text-center text-gray-600 font-semibold">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {selectedOrder && (
          <div className="space-y-3 text-gray-700 text-sm px-2">
            <div className="flex items-center gap-2">
              <CircleCheck className="w-5 h-5" />
              <strong>Status:</strong> {selectedOrder.status}
            </div>
            <div className="flex items-center gap-2">
              <ChefHat className="w-5 h-5" />
              <strong>Chef:</strong> {selectedOrder.bidId.chefId.name}
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5" />
              <strong>Date:</strong> {selectedOrder.bidId.postId.date}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <strong>Time:</strong> {selectedOrder.bidId.postId.time}
            </div>
           

            <DeliveryMap mapHeight="400px" />
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderDetailsModal
