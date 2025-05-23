import Navbar from '@/components/user/Navbar';
import { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';

export default function UserLayout({ children }: { children: ReactNode }) {
  return (

    <div className="min-h-screen bg-white">
      
      <Navbar />
       <Toaster position="top-right" />
        <main className=''>{children}</main>

      </div>
   
  );
}
