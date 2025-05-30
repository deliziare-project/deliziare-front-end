import VerifyOtpPage from '@/components/auth/VerifyOtp'
import AuthWrapper from '@/components/AuthWrapper'
import React from 'react'

function page() {
  return (
    <div>
      <AuthWrapper routeType='public'>
      <VerifyOtpPage/>
      </AuthWrapper>
      
    </div>
  )
}

export default page