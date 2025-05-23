'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-[#1a1a1a] px-6 py-16 flex flex-col items-center justify-center">
      <main className="text-center max-w-3xl w-full">
        {/* <Image
          src="/logo.svg" 
          alt="Deliziare Logo"
          width={100}
          height={100}
          className="mx-auto mb-6"
        /> */}

        <h1 className="text-5xl sm:text-6xl font-bold mb-4 tracking-tight text-[#1a1a1a]">
          Welcome to <span className="text-[#B8755D]">Deliziare</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 mb-10">
          Delight in every detail. Plan events, connect chefs, and simplify your celebration — all in one platform.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/register"
            className="bg-[#B8755D] hover:bg-[#a05f2a] text-white font-semibold py-3 px-6 rounded-full transition"
          >
            Get Started
          </Link>
          <Link
            href="/about"
            className="border border-[#B87333] text-[#B87333] hover:bg-[#fef4ee] py-3 px-6 rounded-full transition"
          >
            Learn More
          </Link>
        </div>
      </main>

      <footer className="mt-20 text-sm text-gray-500 flex gap-6">
        <a
          href="https://github.com/your-username/deliziare"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline hover:text-[#B87333]"
        >
          GitHub
        </a>
        <a
          href="mailto:support@deliziare.com"
          className="hover:underline hover:text-[#B87333]"
        >
          Contact
        </a>
        <a
          href="/privacy"
          className="hover:underline hover:text-[#B87333]"
        >
          Privacy Policy
        </a>
      </footer>
    </div>
  );
}
