
import Sidebar from '@/components/admin/Sidebar';
import { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
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





