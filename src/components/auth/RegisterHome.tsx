'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

function RegisterHome() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-[#fdf7f4]">
      <div className="bg-white p-10 rounded-2xl shadow-2xl border border-[#f0e6e0] flex flex-col items-center space-y-6">
        <h1 className="text-3xl font-bold text-[#1a1a1a] mb-4">
          Register as
        </h1>

        <button
          onClick={() => router.push('/register/user')}
          className="w-60 px-6 py-3 bg-[#B87333] hover:bg-[#a05f2a] text-white rounded-full transition duration-300 font-medium"
        >
          User
        </button>

        <button
          onClick={() => router.push('/register/chef')}
          className="w-60 px-6 py-3 border-2 border-[#B87333] text-[#B87333] hover:bg-[#fef4ee] rounded-full transition duration-300 font-medium"
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
    </div>
  );
}

export default RegisterHome;
