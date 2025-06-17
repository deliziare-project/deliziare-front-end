import BottomBar from '@/components/deliveryBoy/bottomBar'
import WalletInfo from '@/components/deliveryBoy/Earning/Earning'
import Navbar from '@/components/deliveryBoy/Navbar'
import React from 'react'

function page() {
  return (
    <div>
      <Navbar/>
      <WalletInfo/>
      <BottomBar/>
    </div>
  )
}

export default page
