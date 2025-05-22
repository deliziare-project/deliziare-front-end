"use client";

import React, { useState } from "react";
import { ChefHat, BookOpen, Bell, User, Menu, X } from "lucide-react";
import NavLink from "../ui/NavLink";
import Image from "next/image";

import { useRouter } from 'next/navigation';

import { useRouter } from 'next/navigation';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
const router=useRouter()

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex-shrink-0 flex items-center">
            <div className="flex items-center">
              {/* < className="h-8 w-8 text-orange-500" /> */}
              <Image
                src="/logo/delizaire-logo.png"
                alt="Deliziare Logo"
                width={150} // specify width
                height={100} // specify height
              />
            
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">

            <NavLink href="/user/home" icon={<BookOpen size={18} />} label="Home" />
            <NavLink href="/user/chef" icon={<ChefHat size={18} />} label="Chef" />
            <NavLink href="/user/posts" icon={<BookOpen size={18} />} label="Posts" />

            
            {/* Icons */}
            <div className="flex items-center space-x-4 ml-4">
              <button className="relative p-1 rounded-full text-gray-600 hover:text-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors">
                <span className="sr-only">View notifications</span>
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-orange-500 ring-2 ring-white"></span>
              </button>

              <button className="p-1 rounded-full text-gray-600 hover:text-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors" onClick={()=>router.push('/user/profile')}>

                <span className="sr-only">View profile</span>
                <User className="h-6 w-6" />
              </button>
            </div>
          </div>


          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-600 hover:text-orange-500 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500 transition-colors"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden ${isOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
          <NavLink href="/" icon={<BookOpen size={18} />} label="Home" mobile />
          <NavLink
            href="/chef"
            icon={<ChefHat size={18} />}
            label="Chef"
            mobile
          />
          <NavLink
            href="/posts"
            icon={<BookOpen size={18} />}
            label="Posts"
            mobile
          />

          <div className="flex space-x-4 items-center pt-4 border-t border-gray-200 mt-4">
            <button className="relative flex items-center p-2 rounded-md text-gray-600 hover:text-orange-500 hover:bg-orange-50 focus:outline-none transition-colors">
              <Bell className="h-6 w-6 mr-2" />
              <span>Notifications</span>
              <span className="ml-2 inline-block h-2 w-2 rounded-full bg-orange-500"></span>
            </button>
          </div>

          <button className="w-full flex items-center p-2 rounded-md text-gray-600 hover:text-orange-500 hover:bg-orange-50 focus:outline-none transition-colors">
            <User className="h-6 w-6 mr-2" />
            <span>Profile</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
