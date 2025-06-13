'use client'

import { HomeIcon, List, Wallet2 } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

function BottomBar() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-sm z-50">
      <div className="max-w-md mx-auto flex justify-around py-2">
        <Link
          href="/deliveryBoy/home"
          className={`flex flex-col items-center px-4 py-1 rounded-md transition-colors ${
            pathname === '/deliveryBoy/home'
              ? 'text-[#E53935]'
              : 'text-gray-500 hover:text-[#E53935]'
          }`}
        >
          <HomeIcon className="w-5 h-5" />
          <span className="text-xs mt-0.5">Home</span>
        </Link>

        <Link
          href="/deliveryBoy/orders"
          className={`flex flex-col items-center px-4 py-1 rounded-md transition-colors ${
            pathname === '/deliveryBoy/orders'
              ? 'text-[#E53935]'
              : 'text-gray-500 hover:text-[#E53935]'
          }`}
        >
          <List className="w-5 h-5" />
          <span className="text-xs mt-0.5">Orders</span>
        </Link>

        
        <Link
          href="/deliveryBoy/earning"
          className={`flex flex-col items-center px-4 py-1 rounded-md transition-colors ${
            pathname === '/deliveryBoy/earning'
              ? 'text-[#E53935]'
              : 'text-gray-500 hover:text-[#E53935]'
          }`}
        >
          <Wallet2 className="w-5 h-5" />
          <span className="text-xs mt-0.5">Earnings</span>
        </Link>
      </div>
    </nav>
  )
}

export default BottomBar
