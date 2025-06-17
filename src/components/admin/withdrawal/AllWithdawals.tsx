'use client'

import { getAllWithdrawals } from '@/features/adminSlice'
import { AppDispatch, RootState } from '@/redux/store'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

function AllWithdrawals() {
  const { withdrawal, withdrawLoading, withdrawError } = useSelector(
    (state: RootState) => state.admin
  )
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(getAllWithdrawals())
  }, [dispatch])

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-red-600 mb-6">All Withdrawal Requests</h1>

      {withdrawLoading && <p className="text-gray-600">Loading withdrawals...</p>}
      {withdrawError && <p className="text-red-500">Error: {withdrawError}</p>}

      {withdrawal && withdrawal.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {withdrawal.map((v, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-xl p-5 border hover:shadow-lg transition duration-300"
            >
              <div className="mb-2">
                <p className="text-sm text-gray-500">Role</p>
                <p className="text-lg font-semibold capitalize">{v.role}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Amount</p>
                <p className="text-xl font-bold text-green-600">₹ {v.amount}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !withdrawLoading && (
          <p className="text-gray-500 text-center">No withdrawal requests found.</p>
        )
      )}
    </div>
  )
}

export default AllWithdrawals
