'use client'

import { useRouter } from 'next/navigation'
import React from 'react'

function RegisterHome() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
      <div className="bg-white p-10 rounded-2xl shadow-xl flex flex-col items-center space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Register as</h1>

        <button
          onClick={() => router.push('/register/user')}
          className="w-60 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition duration-300 font-medium"
        >
          User
        </button>

        <button
          onClick={() => router.push('/register/chef')}
          className="w-60 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl transition duration-300 font-medium"
        >
          Chef
        </button>

        <button
          onClick={() => router.push('/register/delivery')}
          className="w-60 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl transition duration-300 font-medium"
        >
          Delivery Boy
        </button>
      </div>
    </div>
  )
}

export default RegisterHome
