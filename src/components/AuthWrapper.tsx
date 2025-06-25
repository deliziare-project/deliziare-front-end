'use client';

import { useEffect, useState } from 'react';
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

  // const initializeAuth = async () => {
  //     await dispatch(checkCurrentUser());
  // };
  // initializeAuth()
  // useEffect(() => {
   
  //   if(routeType=='private')initializeAuth();
  //    setInitialized(true);
  // }, [dispatch]);

  // Handle routing based on auth state
  useEffect(() => {
    
    if ( loading) return;
    console.log({isAuthenticated, currentUser, loading,routeType })
   
   if(routeType === 'public'&&!isAuthenticated) return;
    // Public route handling
    if (routeType === 'public') {
      if (isAuthenticated) {
        // Redirect authenticated users away from public routes
        const redirectPath = getRoleBasedRedirect(currentUser?.role,currentUser?.isProfileCompleted);
        if (pathname !== redirectPath) {
          
          router.replace(redirectPath);
        }
      }
    }
    // Private route handling
    else {
      if (!isAuthenticated) {
       
       
        router.replace('/login');
      } else if (currentUser?.role) {
        const expectedPath = getRoleBasedPath(currentUser.role);
        console.log({expectedPath})
        if (!pathname.startsWith(expectedPath)) {
          router.replace(getRoleBasedRedirect(currentUser.role,currentUser.isProfileCompleted));
        }
      }
    }
  }, [ loading, isAuthenticated, currentUser, pathname, router, routeType]);

  if ( loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Only render children if auth state matches route type
  if (
    (routeType === 'public' && !isAuthenticated) ||
    (routeType === 'private' && isAuthenticated && isAuthorized(pathname, currentUser?.role))
  ) {
    return <>{children}</>;
  }

  return null;
};

// Helper functions
function getRoleBasedPath(role?: string): string {
  switch (role) {
    case 'admin': return '/admin';
    case 'chef': return '/chef';
    case 'deliveryBoy': return '/deliveryBoy';
    case 'host': return '/user';
    default: return '/';
  }
}

function getRoleBasedRedirect(role?: string,isProfileCompleted?:boolean): string {
  switch (role) {
    case 'admin': return '/admin/dashboard';
    case 'chef': return isProfileCompleted ? '/chef/home' : '/chef/complete-profile';
    case 'deliveryBoy': return '/deliveryBoy/welcome';
    case 'host': return '/user/home';
    default: return '/';
  }
}

function isAuthorized(path: string, role?: string): boolean {
  if (!role) return false;
  
  const rolePath = getRoleBasedPath(role);
  return path.startsWith(rolePath) || 
         path.startsWith('/chat') || 
         (role === 'chef' && path === '/chef/complete-profile');
}

export default AuthWrapper;