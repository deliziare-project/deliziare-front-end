'use client'

import React, { useState } from 'react'
import axiosInstance from '@/api/axiosInstance'
import { toast } from 'react-hot-toast'

interface Props {
  onClose: () => void
  balance: number
}

const ChefWithdrawalForm = ({ onClose, balance }: Props) => {
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const numericAmount = parseFloat(amount)

    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    if (numericAmount > balance) {
      toast.error('Amount exceeds wallet balance')
      return
    }

    setLoading(true)
    try {
      const res = await axiosInstance.post('/wallet/chefWithdraw', {
        amount: numericAmount,
      })
      toast.success(res.data.message || 'Withdrawal request submitted')
      setAmount('')
      onClose()
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to submit withdrawal'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleWithdrawFull = () => {
    setAmount(balance.toFixed(2))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-600 hover:text-black text-xl"
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4 text-red-600">Withdraw Earnings</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Amount (₹)
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
              placeholder="Enter amount"
              min="1"
              step="0.01"
              required
            />
            <button
              type="button"
              onClick={handleWithdrawFull}
              className="mt-2 text-sm text-red-600 underline hover:text-red-800"
            >
              Withdraw Full Balance (₹{balance.toFixed(2)})
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 disabled:opacity-60"
          >
            {loading ? 'Submitting...' : 'Request Withdrawal'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChefWithdrawalForm
