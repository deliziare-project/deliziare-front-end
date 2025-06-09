import WalletInfo from '@/components/chef/wallet/walletList'
import React from 'react'
import AuthWrapper from '@/components/AuthWrapper'

function page() {
  return (
    <div>
     <AuthWrapper routeType="private">
      <WalletInfo/>
      </AuthWrapper>
    </div>
  )
}

export default page
