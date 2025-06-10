import AuthWrapper from '@/components/AuthWrapper'
import BidView from '@/components/chef/bid/bidView'
import React from 'react'

function page() {
  return (
    <div>
      <AuthWrapper routeType='private'>
      <BidView/>
      </AuthWrapper>
    </div>
  )
}

export default page
