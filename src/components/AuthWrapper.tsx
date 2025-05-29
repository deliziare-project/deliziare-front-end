'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { checkCurrentUser } from '@/features/authSlice';
import { AppDispatch, RootState } from '@/redux/store';

type AuthWrapperProps = {
  children: React.ReactNode;
  routeType: 'public' | 'private';
};

const AuthWrapper = ({ children, routeType }: AuthWrapperProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, currentUser, loading } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (routeType === 'private') {
      dispatch(checkCurrentUser());
    }
  }, [dispatch, routeType]);
  

  useEffect(() => {
    if (loading) return;

    if (routeType === 'private') {
      // Private route: redirect to login if not authenticated
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }
    } else if (routeType === 'public') {
      // Public route: redirect to dashboard/home if authenticated
      if (isAuthenticated) {
        if (currentUser?.role === 'admin' && pathname !== '/admin/dashboard') {
          router.push('/admin/dashboard');
        } else if (currentUser?.role === 'host' && !pathname.startsWith('/user')) {
          router.push('/user/home');
        } else if (currentUser?.role === 'chef') {
          if (!currentUser?.isProfileCompleted && pathname !== '/chef/complete-profile') {
            router.push('/chef/complete-profile');
          } else if (currentUser.isProfileCompleted && pathname !== '/chef/home') {
            router.push('/chef/home');
          }
        }
        return;
      }
    }
  }, [isAuthenticated, loading, router, currentUser, pathname, routeType]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
          aria-label="Loading spinner"
        ></div>
        <span className="ml-4 text-gray-600">Loading user data...</span>
      </div>
    );
  }
  

  // Only render children if user is authorized to view routeType
  if (
    (routeType === 'private' && isAuthenticated) ||
    (routeType === 'public' && !isAuthenticated)
  ) {
    return <>{children}</>;
  }

  // Optionally, return null or loader while redirecting
  return null;
};

export default AuthWrapper;
