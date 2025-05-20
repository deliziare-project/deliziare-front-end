import Sidebar from '@/components/user/Sidebar';
import { ReactNode } from 'react';

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
        <main className="p-4">{children}</main>
      </div>
   
  );
}
