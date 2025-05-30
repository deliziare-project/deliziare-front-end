import PasswordResetOtp from '@/components/auth/PasswordResetOtp'
import AuthWrapper from '@/components/AuthWrapper'
import React from 'react'

function page() {
  return (
    <div>
      <AuthWrapper routeType='public'>
      <PasswordResetOtp/>
      </AuthWrapper>
        
    </div>
  )
}

export default page