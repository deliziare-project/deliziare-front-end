import BottomBar from '@/components/deliveryBoy/bottomBar'
import Navbar from '@/components/deliveryBoy/Navbar'
import Profileview from '@/components/deliveryBoy/profile/Profileview'
import React from 'react'

function page() {
  return (
    <div>
        <Navbar/>
      <Profileview/>
      <BottomBar/>
    </div>
  )
}

export default page
