
import PostsPage from '@/components/user/postspage/PostsPage'
import React from 'react'
import AuthWrapper from '@/components/AuthWrapper'

function page() {
  return (
    <div>
      <AuthWrapper routeType='private'>
      <PostsPage />
      </AuthWrapper>
    </div>
  )
}

export default page
