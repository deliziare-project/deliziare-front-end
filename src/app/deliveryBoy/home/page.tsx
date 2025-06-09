'use client'

import BottomBar from '@/components/deliveryBoy/bottomBar'
import DeliveryBoyTracker from '@/components/deliveryBoy/DeliveryTracker'
import Home from '@/components/deliveryBoy/home'
import Navbar from '@/components/deliveryBoy/Navbar'
import ReqUi from '@/components/deliveryBoy/OrderRequests/ReqUi'
import DeliveryUi from '@/components/deliveryBoy/orderToDelivery/DeliveryUi'
import { AppDispatch } from '@/redux/store'
import React from 'react'
import { useDispatch } from 'react-redux'

const page = () => {
    //  const dispatch = useDispatch<AppDispatch>();
    //   const { isAuthenticated, currentUser, loading } = useSelector((state: RootState) => state.auth);
     
    // const userId = currentUser?.id;
  return (
    <div>
       <Navbar/>
      <div  className="min-h-screen bg-white py-6 px-4 sm:px-8 md:px-16">
       
        <ReqUi />
        <DeliveryUi/>
     
       <DeliveryBoyTracker />

        <BottomBar/>
        </div>
      </div>
  
  )
}

export default page
