
'use client';

import { useEffect } from 'react';

import { usePathname, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { checkCurrentUser } from '@/features/authSlice';
import { AppDispatch } from '@/redux/store';


const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const dispatch :AppDispatch = useDispatch();
  const { isAuthenticated, currentUser, loading } = useSelector((state:any) => state.auth);
  const router = useRouter();

   const pathname = usePathname();
console.log(currentUser);

console.log(currentUser?.isProfileCompleted)
  useEffect(() => {
    dispatch(checkCurrentUser());
  }, [dispatch]);

  useEffect(() => {

    if (!loading) {
 if (!isAuthenticated && (pathname.startsWith('/admin')||pathname.startsWith('/user')|| pathname.startsWith('/chef'))) {
        router.push('/login');
        return;
      }
   
    if(isAuthenticated&&currentUser.role=='admin'){
     router.push('/admin/dashboard');
    }else if(isAuthenticated&&currentUser.role=='host'){
      router.push('/user/home');
    }
    else if(isAuthenticated && currentUser.role == 'chef'){
     if(!currentUser?.isProfileCompleted){
      
      router.push('/chef/complete-profile')
     }
      if (currentUser.isProfileCompleted){
      router.push('/chef/home')
     }
     
    }

  }
    
  }, [isAuthenticated, loading,  router,]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};
export default AuthWrapper