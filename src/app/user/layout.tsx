
import Navbar from '@/components/user/Navbar';

import { ReactNode } from 'react';

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      {/* <Sidebar /> */}
      <Navbar />
        <main className=''>{children}</main>
      </div>
   
  );
}
