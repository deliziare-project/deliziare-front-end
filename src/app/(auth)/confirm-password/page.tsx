import ConfirmPassword from '@/components/auth/ConfirmPassword'
import AuthWrapper from '@/components/AuthWrapper'
import React from 'react'

function page() {
  return (
    <div>
      <AuthWrapper routeType='public'>
        <ConfirmPassword/>
      </AuthWrapper>
    </div>
  )
}

export default page