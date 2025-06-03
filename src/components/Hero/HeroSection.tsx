'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function HeroSection() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image with overlay container */}
      <div className="absolute inset-0 -z-20 h-full w-full">
        <Image
          src="/logo/background.jpg"
          alt="Elegant dining setup"
          fill
          priority
          className="object-cover"
          quality={100}
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* Top-right corner buttons */}
      <div className="absolute top-6 right-6 z-20 flex gap-4">
        <Button
          asChild
          size="sm"
          className="bg-orange-600 text-black font-semibold px-4 py-2 rounded-full hover:bg-gray-200"
        >
          <Link href="/register">Sign Up</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="sm"
          className="bg-transparent text-white hover:bg-orange-700 font-semibold px-4 py-2 rounded-full"
        >
          <Link href="/login">Sign In</Link>
        </Button>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 z-10 py-20 md:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              Elevate Your Events with{' '}
              <span className="text-[#B87333]">Exceptional</span> Culinary Experiences
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-200 max-w-xl">
              Connect with talented chefs, plan memorable events, and create custom menus tailored to your occasion. From intimate gatherings to grand celebrations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className=" bg-orange-600 text-white hover:bg-orange-700 font-semibold px-8 py-3 rounded-full"
              >
                <Link href="/register">Get Started</Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="bg-transparent text-white border-white hover:bg-white/10 font-semibold px-8 py-3 rounded-full"
              >
                <Link href="/chefs" className="flex items-center">
                  Explore Chefs <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
