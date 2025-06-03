import Login from '@/components/auth/Login'
import AuthWrapper from '@/components/AuthWrapper'
import React from 'react'

function page() {
  return (
    <div>
      <AuthWrapper routeType='public'>
      <Login />
      </AuthWrapper>
      
    </div>
  )
}

export default page