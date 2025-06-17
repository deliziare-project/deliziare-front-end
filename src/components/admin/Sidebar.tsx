'use client';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  ChefHat,
  LogOut,
  Truck,
  CreditCard,
  BadgeIndianRupee,
  Menu,
  X,
} from 'lucide-react';
import { logoutUser } from '@/features/authSlice';
import { AppDispatch } from '@/redux/store';

export default function Sidebar() {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    router.push('/login');
  };

  const menuItems = [
    { href: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { href: '/admin/usermanagement', icon: <Users size={20} />, label: 'Hosts' },
    { href: '/admin/chefmanagement', icon: <ChefHat size={20} />, label: 'Chefs' },
    { href: '/admin/deliverymanagement', icon: <Truck size={20} />, label: 'Delivery' },
    { href: '/admin/paymentManagement', icon: <CreditCard size={20} />, label: 'Transactions' },
    { href: '/admin/withdrawals', icon: <BadgeIndianRupee size={20} />, label: 'Withdrawals' },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Hamburger Button */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 rounded-md bg-slate-900 text-white shadow-lg md:hidden"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}

      {/* Sidebar */}
      <aside
  className={`bg-slate-900 text-white w-64 h-screen md:h-auto md:min-h-screen
    flex flex-col justify-between z-40 md:fixed md:left-0 top-0
    transition-all duration-300 ease-in-out 
    ${
      isMobile
        ? `${isOpen ? 'left-0 fixed' : '-left-64 fixed'}`
        : 'relative'
    }`}
>

        {/* Logo Section */}
        <div className="border-b border-slate-800 p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#de6d37] rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Deliziare</h1>
              <p className="text-xs text-slate-400">Admin Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map(({ href, icon, label }) => (
            <Link href={href} key={label} passHref onClick={() => isMobile && setIsOpen(false)}>
              <div className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-slate-800 transition cursor-pointer group">
                <div className="text-slate-400 group-hover:text-white">{icon}</div>
                <span className="text-sm font-medium group-hover:text-white">{label}</span>
              </div>
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-red-400 hover:bg-slate-800 hover:text-red-300 px-4 py-2 rounded-md w-full transition"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}