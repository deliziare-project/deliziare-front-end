'use client'

import { getOrder } from '@/features/deliverySlice'
import { AppDispatch, RootState } from '@/redux/store'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

function Delivery() {
  const dispatch = useDispatch<AppDispatch>()
  const { order, loading, error } = useSelector((state: RootState) => state.delivery)

  useEffect(() => {
    dispatch(getOrder())
  }, [dispatch])

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <h2 className="text-2xl font-bold text-[#B8755D] mb-6">My Delivery Orders</h2>

      {loading ? (
        <p className="text-gray-500">Loading orders...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : order?.length === 0 ? (
        <p className="text-gray-500">No delivery orders assigned.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {order?.map((item) => {
            const bid = item.bidId
            const post = bid?.postId

            return (
              <div
                key={item._id}
                className="bg-white shadow-md rounded-xl p-4 border border-gray-200 hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold text-[#B8755D]">{post?.eventName}</h3>
                <p className="text-sm text-gray-600 mb-1">
                   {post?.district} |  {post?.date} at  {post?.time}
                </p>
                <p className="text-sm text-gray-600 mb-1"> Chef: {bid?.chefId?.name}</p>
                <p className="text-sm text-gray-600"> Delivery Status: <span className="font-medium">{item.status}</span></p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Delivery
