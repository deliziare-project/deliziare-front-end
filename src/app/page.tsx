'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-[#213D72] px-6 py-16 flex flex-col items-center justify-center">
      <main className="text-center max-w-3xl w-full">
        <div className="flex justify-center mb-6">
          <Image
            src="/logo/delizaire-logo.png"
            alt="Deliziare Logo"
            width={200}
            height={100}
          />
        </div>


        <h1 className="text-5xl sm:text-6xl font-bold mb-4 tracking-tight text-[#213D72]">
          Welcome to <span className="text-[#B87333]">Deliziare</span>

        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-10">
          Delight in every detail. Plan events, connect chefs, and simplify your celebration — all in one platform.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/register"
            className="bg-[#213D72] hover:bg-[#1a2f5c] text-white font-semibold py-3 px-6 rounded-full transition"
          >
            Sign Up
          </Link>
          <Link
            href="/login"
            className="border border-[#213D72] text-[#213D72] hover:bg-[#f0f4fa] py-3 px-6 rounded-full transition"
          >
            Sign In
          </Link>
        </div>
      </main>

      {/* <footer className="mt-20 text-sm text-gray-500 flex gap-6">
        <a
          href="https://github.com/your-username/deliziare"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline hover:text-[#213D72]"
        >
          GitHub
        </a>
        <a
          href="mailto:support@deliziare.com"
          className="hover:underline hover:text-[#213D72]"
        >
          Contact
        </a>
        <a
          href="/privacy"
          className="hover:underline hover:text-[#213D72]"
        >
          Privacy Policy
        </a>
      </footer> */}
    </div>
  );
}
