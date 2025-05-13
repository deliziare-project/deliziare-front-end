// app/admin/layout.tsx
import Sidebar from '@/components/admin/Sidebar';
import { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
        <main className="p-4">{children}</main>
      </div>
   
  );
}
