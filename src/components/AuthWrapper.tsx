
'use client';

import { useEffect } from 'react';

import { usePathname, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { checkCurrentUser } from '@/features/authSlice';

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, currentUser, loading } = useSelector((state:any) => state.auth);
  const router = useRouter();
console.log(currentUser);

  useEffect(() => {
   
    dispatch(checkCurrentUser());
  }, [dispatch]);

  
  useEffect(() => {
    if (!loading) {   
    if(isAuthenticated&&currentUser.role=='admin'){
     router.push('/admin/dashboard');
    }else if(isAuthenticated&&currentUser.role=='host'){
      router.push('/user/home');
    }
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return <div>Loading...</div>; 
  }

  return <>{children}</>;
};

export default AuthWrapper;