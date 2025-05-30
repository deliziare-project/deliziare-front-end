'use client'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const Welcome: React.FC = () => {
  const [showButton, setShowButton] = useState(false);
  const [navigateNow, setNavigateNow] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setShowButton(true);
    }, 3000);

    if (navigateNow) {
      const timer2 = setTimeout(() => {
        router.push('/deliveryBoy/home');
      }, 3000);
      return () => clearTimeout(timer2);
    }
    return () => clearTimeout(timer1);
  }, [navigateNow, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#ff4d00] to-[#ff8c66] text-white text-center px-6 py-8">
      {/* Main heading with refined typography and animation */}
     

      <div className="relative w-64 h-64 md:w-80 md:h-80 transform hover:scale-105 transition-transform duration-300">
        <Image
          src="/authImages/deliveryWelcome.png"
          alt="Delivery Welcome"
          fill
          className="object-contain"
          priority
        />
      </div>
       <h1 className="text-4xl md:text-5xl font-extrabold mb-8 tracking-tight animate-fadeIn drop-shadow-lg font-serif">
        Deliziare
      </h1>

      <div className=" font-medium mb-8 tracking-wider">
        Loading
        <span className="dot-1">.</span>
        <span className="dot-2">.</span>
        <span className="dot-3">.</span>
      </div>

      {showButton && (
        <button
          className="bg-white text-[#ff4d00] px-8 py-2 rounded-sm font-semibold text-lg md:text-xl shadow-xl hover:bg-blue-50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          onClick={() => setNavigateNow(true)}
        >
          Get Started
        </button>
      )}

      <style jsx>{`
        .dot-1,
        .dot-2,
        .dot-3 {
          animation: blink 1.2s ease-in-out infinite;
        }
        .dot-2 {
          animation-delay: 0.3s;
        }
        .dot-3 {
          animation-delay: 0.6s;
        }

        @keyframes blink {
          0%, 100% {
            opacity: 0.2;
            transform: translateY(2px);
          }
          50% {
            opacity: 1;
            transform: translateY(-2px);
          }
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Welcome;