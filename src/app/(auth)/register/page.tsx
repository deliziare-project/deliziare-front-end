import RegisterHome from '@/components/auth/RegisterHome'
import AuthWrapper from '@/components/AuthWrapper'
import React from 'react'

function page() {
  return (
    <div>
      <AuthWrapper routeType='public'>
      <RegisterHome />
      </AuthWrapper>
        
    </div>
  )
}

export default page