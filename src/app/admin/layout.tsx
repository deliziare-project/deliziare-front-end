import Sidebar from '@/components/admin/Sidebar';
import ToastProvider from '@/components/shared/ToastProvider';
import { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <main className="flex-1 md:ml-64 overflow-y-auto">
          <div className="pt-16 md:pt-6 px-4 md:px-6 py-6">
            {children}
          </div>
        </main>
      </div>
    </ToastProvider>
  );
}
