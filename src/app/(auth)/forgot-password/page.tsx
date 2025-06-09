import ForgotPassword from '@/components/auth/ForgotPassword'
import React from 'react'
import AuthWrapper from '@/components/AuthWrapper'

function page() {
  return (
    <div>
      <AuthWrapper routeType='public'>
      <ForgotPassword/>
      </AuthWrapper>
    </div>
  )
}

export default page