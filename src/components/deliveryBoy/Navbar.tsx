'use client'
import { checkCurrentUser } from '@/features/authSlice'
import { AppDispatch, RootState } from '@/redux/store'
import { Bell } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

function Navbar() {
    const {currentUser}=useSelector((state:RootState)=>state.auth)
    const dispatch=useDispatch<AppDispatch>()
    
    useEffect(()=>{
        dispatch(checkCurrentUser())
    },[dispatch])

  return (
    <div>
      <nav className="bg-white px-4 sm:px-6 py-3 border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
              <Image
                src="/logo/delizaire-logo.png"
                alt="Deliziare Logo"
                width={40}
                height={40}
                className="object-contain"
                priority
              />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-800">Deliziare</h1>
              <p className="text-[10px] sm:text-xs text-gray-400 tracking-wider">Delivery Partner</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            <button className="relative p-1 sm:p-2 rounded-full hover:bg-gray-50 transition-colors">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              <span className="absolute top-1 right-1 sm:top-2 sm:right-2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#FF4D00] rounded-full"></span>
            </button>
            
            <div className="flex items-center space-x-1 sm:space-x-2">
              <div className="relative">
                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full overflow-hidden border border-gray-200">
                  <Image
                    src="/userSideImage/deliveryMan.jpg"
                    alt="User Profile"
                    width={36}
                    height={36}
                    className="object-cover"
                    priority
                  />
                </div>
                <span className="absolute bottom-0 right-0 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-green-500 rounded-full border border-white"></span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-700">{currentUser?.name}</p>
                <p className="text-xs text-gray-400">Online</p>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navbar
