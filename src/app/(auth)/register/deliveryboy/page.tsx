'use client'

import DeliveryBoyRegister from '@/components/auth/DeliveryBoyRegister'
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