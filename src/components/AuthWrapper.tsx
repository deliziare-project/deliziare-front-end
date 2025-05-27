
'use client';

import { useEffect } from 'react';

import { usePathname, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { checkCurrentUser } from '@/features/authSlice';
import { AppDispatch } from '@/redux/store';


const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>();

  const { isAuthenticated, currentUser, loading } = useSelector((state:any) => state.auth);
  const router = useRouter();

   const pathname = usePathname();
console.log(currentUser);

  useEffect(() => {
    dispatch(checkCurrentUser());
  }, [dispatch]);

  useEffect(() => {

    if (!loading) {
 if (!isAuthenticated && (pathname.startsWith('/admin')||pathname.startsWith('/user')|| pathname.startsWith('/chef'))) {
        router.push('/login');
        return;
      }
   
      if (isAuthenticated && currentUser?.role === 'chef') {
      if (!currentUser.isProfileCompleted) {
        if (!pathname.startsWith('/chef/complete-profile')) {
          router.push('/chef/complete-profile');
          return;
        }
      } else {
        if (!pathname.startsWith('/chef/home')) {
          router.push('/chef/home');
          return;
        }
      }
      }
    }
    
  }, [isAuthenticated, loading,  router,currentUser]);

  if (loading) {

    return <div>Loading...</div>;
  }


  return <>{children}</>;
};
export default AuthWrapper