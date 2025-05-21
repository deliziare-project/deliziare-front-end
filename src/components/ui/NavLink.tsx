import React from 'react';

interface NavLinkProps {
  href: string;
  label: string;
  icon?: React.ReactNode;
  mobile?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ href, label, icon, mobile }) => {
  const isActive = window.location.pathname === href;
  
  if (mobile) {
    return (
      <a
        href={href}
        className={`flex items-center p-2 rounded-md text-base font-medium ${
          isActive
            ? 'text-orange-600 bg-orange-50'
            : 'text-gray-600 hover:text-orange-500 hover:bg-orange-50'
        } transition-colors`}
      >
        {icon && <span className="mr-3">{icon}</span>}
        {label}
      </a>
    );
  }
  
  return (
    <a
      href={href}
      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
        isActive
          ? 'border-orange-500 text-orange-600'
          : 'border-transparent text-gray-600 hover:text-orange-500 hover:border-orange-300'
      } transition-colors`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {label}
    </a>
  );
};

export default NavLink;