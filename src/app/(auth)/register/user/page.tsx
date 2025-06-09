'use client'

import UserRegister from '@/components/auth/UserRegister'
import AuthWrapper from '@/components/AuthWrapper'
import React from 'react'


function page() {
  return (
    <div>
      <AuthWrapper routeType='public'>
       <UserRegister />
       </AuthWrapper>
    </div>
  )
}

export default page