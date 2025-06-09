'use client'

import dynamic from 'next/dynamic';
//import DeliveryBoyRegister from '@/components/auth/DeliveryBoyRegister'
const DeliveryBoyRegister = dynamic(() => import('@/components/auth/DeliveryBoyRegister'), { ssr: false });

import AuthWrapper from '@/components/AuthWrapper'
import React from 'react'

function page() {
  return (
    <div>
      <AuthWrapper routeType='public'>
        <DeliveryBoyRegister/>
        </AuthWrapper>
    </div>
  )
}

export default page