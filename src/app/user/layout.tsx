import ToastProvider from '@/components/shared/ToastProvider';
import Navbar from '@/components/user/Navbar';
import { ReactNode } from 'react';

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
    <div className="min-h-screen bg-white">
      
      <Navbar />
      
        <main className=''>{children}</main>

      </div>
      </ToastProvider>
   
  );
}
