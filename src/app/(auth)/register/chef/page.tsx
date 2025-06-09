import ChefRegisterPage from '@/components/auth/ChefRegister'
import AuthWrapper from '@/components/AuthWrapper'
import React from 'react'

function page() {
  return (
    <div>
      <AuthWrapper routeType='public'>
        <ChefRegisterPage/>
        </AuthWrapper>
    </div>
  )
}

export default page