"use client"
import { checkCurrentUser } from "@/features/authSlice";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, currentUser, loading } = useSelector((state:any) => state.auth);
  const router = useRouter();

  const pathname = usePathname();

  useEffect(() => {
    dispatch(checkCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    if (loading) return;
    
    // Protected routes check
    if (!isAuthenticated && (pathname.startsWith('/admin') || pathname.startsWith('/user'))) {
      router.push('/login');
      return;
    }

 
    if (isAuthenticated) {
      if (pathname === '/login') {
        if (currentUser?.role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/user/home');
        }
      } else if (currentUser?.role === 'admin' && !pathname.startsWith('/admin')) {
        router.push('/admin/dashboard');
      } else if (currentUser?.role !== 'admin' && pathname.startsWith('/admin')) {
        router.push('/user/home');
      }
    }
  }, [isAuthenticated, loading, currentUser, pathname]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};
export default AuthWrapper