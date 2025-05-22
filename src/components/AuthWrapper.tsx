
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
 if (!isAuthenticated && (pathname.startsWith('/user')||pathname.startsWith('/admin'))) {
        router.push('/login');
        return;
      }
   
    if(isAuthenticated&&currentUser.role=='admin'){
     router.push('/admin/dashboard');
    }else if(isAuthenticated&&currentUser.role=='host'){
      router.push('/user/home');
    }else if(isAuthenticated &&currentUser.role=='chef'){
      router.push('/chef/home')
    }
    else if(isAuthenticated && currentUser.role == 'chef'){
      router.push('/chef/home')

    }

  }
    
  }, [isAuthenticated, loading,  router]);

  if (loading) {

    return <div>Loading...</div>;
  }


  return <>{children}</>;
};
export default AuthWrapper