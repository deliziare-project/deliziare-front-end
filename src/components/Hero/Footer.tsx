"use client";

import React from "react";
import Link from "next/link";
import { Github, Twitter, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand and Description */}
          <div className="flex flex-col space-y-4">
            <Link href="/" className="text-2xl font-bold text-white">
              Deliziare
            </Link>
            <p className="text-sm text-gray-400 max-w-xs">
              Connecting you with talented chefs for unforgettable dining experiences. Discover culinary artistry for every occasion.
            </p>
          </div>

          

          {/* Social Media and Contact */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Connect With Us</h3>
            <div className="flex space-x-4 mb-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#B87333] transition-colors duration-200">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#B87333] transition-colors duration-200">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#B87333] transition-colors duration-200">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#B87333] transition-colors duration-200">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
            <p className="text-sm text-gray-400">
              Email: <a href="mailto:support@deliziare.com" className="hover:text-[#B87333] transition-colors">support@deliziare.com</a>
            </p>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-8 border-gray-700" />

        {/* Copyright */}
        <div className="text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Deliziare. All rights reserved.
        </div>
      </div>
    </footer>
  );
}