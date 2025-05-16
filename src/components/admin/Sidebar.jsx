import { LayoutDashboard, Users, ChefHat, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="h-screen w-20 bg-white text-gray-800 flex flex-col items-center py-6 px-2 shadow-md">
      <div className="mb-10">
        <span className="text-xl font-bold text-gray-900">A</span> {/* Logo */}
      </div>

      <nav className="flex flex-col gap-8 flex-1 items-center">
        <Link href="/admin/dashboard">
          <div title="Dashboard" className="hover:bg-gray-100 p-3 rounded-md cursor-pointer">
            <LayoutDashboard size={24} />
          </div>
        </Link>

        <Link href="/admin/usermanagement">
          <div title="Users" className="hover:bg-gray-100 p-3 rounded-md cursor-pointer">
            <Users size={24} />
          </div>
        </Link>

        <Link href="/admin/chefmanagement">
          <div title="Chefs" className="hover:bg-gray-100 p-3 rounded-md cursor-pointer">
            <ChefHat size={24} />
          </div>
        </Link>
      </nav>

      <div className="mt-auto mb-4">
        <div title="Logout" className="hover:bg-red-100 text-red-500 p-3 rounded-md cursor-pointer">
          <LogOut size={24} />
        </div>
      </div>
    </aside>
  );
}
