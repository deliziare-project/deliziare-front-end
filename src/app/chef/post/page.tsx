'use client'
import MyChefPosts from '@/components/chef/post/Postview'
import React from 'react'
import AuthWrapper from '@/components/AuthWrapper'

function page() {
  return (
    <div>
      <AuthWrapper routeType="private">
      <MyChefPosts/>
      </AuthWrapper>
    </div>
  )
}

export default page
