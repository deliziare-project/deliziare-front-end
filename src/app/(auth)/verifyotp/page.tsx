'use-client'
import VerifyOtpPage from '@/components/auth/VerifyOtp'
import AuthWrapper from '@/components/AuthWrapper'
import React, { Suspense } from 'react'

function page() {
  return (
    <div>
      <AuthWrapper routeType='public'>
        <Suspense fallback={<div className="min-h-screen flex justify-center items-center">Loading...</div>}>
          <VerifyOtpPage/>
        </Suspense>
      </AuthWrapper>
      
    </div>
  )
}

export default page