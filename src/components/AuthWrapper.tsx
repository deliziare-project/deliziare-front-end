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

  const [ready, setReady] = useState(false);

  useEffect(() => {
    
    if (routeType === 'private') {
      dispatch(checkCurrentUser()).finally(() => {
        setReady(true);
      });
    } else {
      
      setReady(true);
    }
  }, [dispatch, routeType]);

  // useEffect(() => {
  //   if (!ready || loading) return; 

  //   if (routeType === 'private') {
  //     if (!isAuthenticated) {
  //       router.push('/login');
  //     }
  //   } else if (routeType === 'public') {
  //     if (isAuthenticated) {
  //       if (currentUser?.role === 'admin' && pathname !== '/admin/dashboard') {
  //         router.push('/admin/dashboard');
  //       } else if (currentUser?.role === 'host' && !pathname.startsWith('/user')) {
  //         router.push('/user/home');
  //       } else if (currentUser?.role === 'chef') {
  //         if (!currentUser?.isProfileCompleted && pathname !== '/chef/complete-profile') {
  //           router.push('/chef/complete-profile');
  //         } else if (currentUser.isProfileCompleted && pathname !== '/chef/home') {
  //           router.push('/chef/home');
  //         }
  //       }
  //     }
  //   }
  // }, [ready, loading, isAuthenticated, router, currentUser, pathname, routeType]);


  useEffect(() => {
    if (!ready || loading) return;
  
    if (routeType === 'private') {
      if (!isAuthenticated) {
        router.push('/login');
      } else {
       
        if (currentUser?.role === 'admin' && pathname !== '/admin/dashboard') {
          router.push('/admin/dashboard');
        } else if (currentUser?.role === 'host' && !pathname.startsWith('/user')) {
          router.push('/user/home');
        } else if (currentUser?.role === 'chef') {
          if (!currentUser?.isProfileCompleted && pathname !== '/chef/complete-profile') {
            router.push('/chef/complete-profile');
          } else if (
            currentUser.isProfileCompleted &&
            !pathname.startsWith('/chef')
          ) {
            router.push('/chef/home');
          }

        }
        
        
        
      }
    } 
    else if (routeType === 'public') {
      if (isAuthenticated) {
        
        if (currentUser?.role === 'admin') {
          router.push('/admin/dashboard');
        } else if (currentUser?.role === 'host') {
          router.push('/user/home');
        } else if (currentUser?.role === 'chef') {
          router.push('/chef/home');
        } else if (currentUser?.role==='deliveryBoy'){
          router.push('/deliveryBoy/welcome')
        }

      }
    }
  }, [ready, loading, isAuthenticated, router, currentUser, pathname, routeType]);
  

 
  if (!ready || loading) {
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
  
  
  if (routeType === 'public' && isAuthenticated) {
    return null;
  }
  
  if (
    (routeType === 'private' && isAuthenticated) ||
    (routeType === 'public' && !isAuthenticated)
  ) {
    return <>{children}</>;
  }
  
  return null;
  
};

export default AuthWrapper;
