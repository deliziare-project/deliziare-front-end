import BottomBar from '@/components/deliveryBoy/bottomBar'
import Navbar from '@/components/deliveryBoy/Navbar'
import Delivery from '@/components/deliveryBoy/orderToDelivery/Delivery'
import React from 'react'

function page() {
  return (
    <div>
      <Navbar/>
      <Delivery/>
      <BottomBar/>
    </div>
  )
}

export default page
