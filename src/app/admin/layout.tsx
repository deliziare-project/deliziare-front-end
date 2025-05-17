'use client';

import Sidebar from '@/components/admin/Sidebar';
import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { currentUser, loading } = useSelector((state: any) => state.auth);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Wait for loading to complete before making role checks
    if (!loading) {
      if (!currentUser) {
        router.replace('/NotAuthorized');
      } else if (currentUser.role !== 'admin') {
        router.replace('/NotAuthorized');
      } else {
        setCheckingAuth(false); // Allow rendering admin layout
      }
    }
  }, [loading, currentUser, router]);

  if (loading || checkingAuth) {
    return <div>Loading...</div>; // Optional: replace with spinner
  }

  return (
    <div className="flex">
      <div className="fixed top-0 left-0 h-screen w-20 z-50">
        <Sidebar />
      </div>
      <main className="ml-20 w-full min-h-screen bg-gray-50 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
