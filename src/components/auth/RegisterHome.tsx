'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import Image from 'next/image';

function RegisterHome() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-[#fef5f3] px-4">
      <div className="flex flex-col md:flex-row items-center justify-center bg-white rounded-2xl shadow-2xl border border-[#f3d9d3] p-10 space-y-10 md:space-y-0 md:space-x-10">
        
       
        <div className="flex flex-col items-center space-y-6">
          <h1 className="text-3xl font-bold text-[#1a1a1a] mb-2">
            Register as
          </h1>

          <button
            onClick={() => router.push('/register/user')}
            className="w-60 px-6 py-3 bg-[#C95838] hover:bg-[#a6462d] text-white rounded-full transition duration-300 font-medium"
          >
            User
          </button>

          <button
            onClick={() => router.push('/register/chef')}
            className="w-60 px-6 py-3 border-2 border-[#C95838] text-[#C95838] hover:bg-[#fdf1ee] rounded-full transition duration-300 font-medium"
          >
            Chef
          </button>

          <button
            onClick={() => router.push('/register/deliveryboy')}
            className="w-60 px-6 py-3 bg-[#1a1a1a] hover:bg-[#333] text-white rounded-full transition duration-300 font-medium"
          >
            Delivery Boy
          </button>
        </div>

        
        <div className="hidden md:block">
          <Image
            src="/authImages/register.png"
            alt="Register Illustration"
            width={400}
            height={400}
            className="rounded-xl"
          />
        </div>
      </div>
    </div>
  );
}

export default RegisterHome;
