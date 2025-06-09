import UserProfile from '@/components/user/userProfile/UserProfile'
import React from 'react'
import AuthWrapper from '@/components/AuthWrapper'

function page() {
  return (
    <div>
      <AuthWrapper routeType='private'>
      <UserProfile />
      </AuthWrapper>
    </div>
  )
}

export default page
