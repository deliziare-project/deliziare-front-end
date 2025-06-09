import OrderStatus from '@/components/chef/orders/OrderStatus'
import React from 'react'
import AuthWrapper from '@/components/AuthWrapper'

function page() {
  return (
    <div>
     <AuthWrapper routeType="private">
      <OrderStatus/>
      </AuthWrapper>
    </div>
  )
}

export default page
