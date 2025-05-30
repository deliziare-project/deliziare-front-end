import ChefNavbar from '@/components/chef/chefNavbar';
import ChefSidebar from '@/components/chef/chefSidebar';
import Navbar from '@/components/user/Navbar';
import { ReactNode } from 'react';

export default function ChefLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar/>
        <main className="p-6">
          {children}
        </main>
      </div>
    
  );
}
