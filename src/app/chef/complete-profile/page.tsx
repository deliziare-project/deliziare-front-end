import CompleteProfilePage from '@/components/chef/completeProfile/Complete'
import React from 'react'
import AuthWrapper from '@/components/AuthWrapper'

function page() {
  return (
    <div >
      <AuthWrapper routeType='private'>
      <CompleteProfilePage/>
      </AuthWrapper>
    </div>
  )
}

export default page
