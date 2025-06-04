import ChefNavbar from '@/components/chef/chefNavbar';
import ChefSidebar from '@/components/chef/chefSidebar';
import ToastProvider from '@/components/shared/ToastProvider';
import { ReactNode } from 'react';

export default function ChefLayout({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 fixed top-0 left-0 h-screen z-50">
        <ChefSidebar />
      </div>

      <div className="flex-1 ml-64 min-h-screen bg-gray-50">
      
        <div className="sticky top-0 ">
          <ChefNavbar />
        </div>

        <main className="p-6">
          {children}
        </main>     
      </div>
    </div>
    </ToastProvider>
  );
}
