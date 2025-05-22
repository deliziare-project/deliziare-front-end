// app/admin/layout.tsx
import Sidebar from '@/components/user/Sidebar';
import { ReactNode } from 'react';

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#fff8f0]">
      <Sidebar />
        <main className="p-4">{children}</main>
      </div>
   
  );
}
