import AuthWrapper from '@/components/AuthWrapper'
import Home from '@/components/user/Home'
import React from 'react'

function page() {
  return (
    <div>
      <AuthWrapper routeType='private'>
      <Home/>
      </AuthWrapper>
    </div>
  )
}

export default page