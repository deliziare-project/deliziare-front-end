'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavLinkProps {
  href: string;
  label: string;
  icon?: React.ReactNode;
  mobile?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ href, label, icon, mobile }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  const baseClasses = mobile
    ? 'flex items-center p-2 rounded-md text-base font-medium transition-colors'
    : 'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors';

  const activeClasses = mobile
    ? 'text-orange-600 bg-orange-50'
    : 'border-orange-500 text-orange-600';

  const inactiveClasses = mobile
    ? 'text-gray-600 hover:text-orange-500 hover:bg-orange-50'
    : 'border-transparent text-gray-600 hover:text-orange-500 hover:border-orange-300';

  return (
    <Link href={href}>
      <span className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
        {icon && <span className="mr-2">{icon}</span>}
        {label}
      </span>
    </Link>
  );
};

export default NavLink;
