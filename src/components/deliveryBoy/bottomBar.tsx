import { HomeIcon, List } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

function BottomBar() {
  return (
    <div>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-sm">
        <div className="max-w-md mx-auto flex justify-around py-1 sm:py-2">
          <Link href='/deliveryBoy/home' className="flex flex-col items-center px-3 py-1 sm:px-4 sm:py-2 text-[#FF4D00]">
            <HomeIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-[10px] sm:text-xs mt-1">Home</span>
          </Link>
          <Link href='/deliveryBoy/orders' className="flex flex-col items-center px-3 py-1 sm:px-4 sm:py-2 text-gray-500 hover:text-gray-700">
            <List className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-[10px] sm:text-xs mt-1">Orders</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}

export default BottomBar
