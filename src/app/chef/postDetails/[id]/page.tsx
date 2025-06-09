import PostDetailsPage from '@/components/chef/postDetails';
import AuthWrapper from '@/components/AuthWrapper';

export default function Page() {
  return (
  <AuthWrapper routeType="private">
    <PostDetailsPage />
    </AuthWrapper>
  )
}
