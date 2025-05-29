'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, ChefHat, Truck, ArrowLeft } from 'lucide-react';

const roles = [
  {
    id: 'user',
    title: 'User',
    description: 'Find chefs, plan your events, and enjoy personalized menus.',
    icon: Users,
    color: 'bg-[#B87333]',
    image: '/authImages/user-role.jpg', // Add or replace with your own image
  },
  {
    id: 'chef',
    title: 'Chef',
    description: 'Showcase your cooking skills and get event opportunities.',
    icon: ChefHat,
    color: 'bg-[#2C3E50]',
    image: '/authImages/chef.jpg', // Add or replace with your own image
  },
  {
    id: 'deliveryboy',
    title: 'Delivery Partner',
    description: 'Deliver food to customers and become a valued partner.',
    icon: Truck,
    color: 'bg-[#27AE60]',
    image: '/authImages/delivery-role.jpg', // Add or replace with your own image
  },
];

export default function RegisterHome() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-[#B87333] transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-4">Join Deliziare as a</h1>
            <p className="text-gray-600">Choose your role and start your journey with us</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roles.map((role, index) => (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <button
                  onClick={() => router.push(`/register/${role.id}`)}
                  className="block w-full text-left group focus:outline-none"
                >
                  <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="relative h-48">
                      <Image
                        src={role.image}
                        alt={role.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 transition-colors" />
                    </div>
                    <div className="p-6">
                      <div className={`${role.color} w-12 h-12 rounded-full flex items-center justify-center mb-4`}>
                        <role.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">{role.title}</h3>
                      <p className="text-gray-600">{role.description}</p>
                    </div>
                  </div>
                </button>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-[#B87333] hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
