'use client'
import { checkCurrentUser, logoutUser } from '@/features/authSlice'
import { AppDispatch, RootState } from '@/redux/store'
import { Bell, LogOut } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

function Navbar() {
    const {currentUser}=useSelector((state:RootState)=>state.auth)
    const dispatch=useDispatch<AppDispatch>()
    const router = useRouter();
    
    useEffect(()=>{
        dispatch(checkCurrentUser())
    },[dispatch])

    const performLogout=async()=>{
      const resultAction=await dispatch(logoutUser());
      if(logoutUser.fulfilled.match(resultAction)){
        router.push("/login")
      }else{
        console.error("logout failed",resultAction.payload);
        
      }
    };
    const handleLogout=()=>{
      performLogout();
    }

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
              <div
                   onClick={handleLogout}
                   className="mt-auto flex items-center gap-3 px-5 py-3 rounded-xl bg-white text-red-600 hover:bg-red-50 hover:shadow-md transition-all duration-300 cursor-pointer animate-fadeIn border border-red-100 hover:border-red-200 group mb-7">
                        <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform duration-200"  />
                        <span className="text-sm font-semibold tracking-tight">Logout</span>
                      </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navbar
