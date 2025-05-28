// 'use client'
// import Image from 'next/image';
// import { useRouter } from 'next/navigation';
// import React, { useEffect, useState } from 'react'

// const Welcome:React.FC = () => {
//   const [showButton,setShowButton]=useState(false);
//   const [navigateNow,setNavigateNow]=useState(false);
//   const router=useRouter();

//     // if (!router.isReady) return null;

//   useEffect(()=>{
//     const timer1=setTimeout(() => {
//       setShowButton(true);
//     }, 3000);

//     if(navigateNow){
//       const timer2=setTimeout(() => {
//         router.push('/deliveryBoy/home')
//       }, 3000);
//       return ()=>clearTimeout(timer2)
//     }
//     return()=>clearTimeout(timer1)
//   },[navigateNow,router])
//   return (
//      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[var(--deep-red-orange)] to-[var(--coral-red)] text-white text-center px-4">
//       <h1 className="text-4xl font-bold mb-6 animate-pulse">Welcome Delivery Hero!</h1>
//       <Image
//       src='/authImages/deliveryWelcome.png'
//       alt='deliveryWelome'
//       />

//       <div className="text-2xl font-semibold mb-6">
//         Loading<span className="dot-1">.</span>
//         <span className="dot-2">.</span>
//         <span className="dot-3">.</span>
//       </div>

//       {showButton && (
//         <button
//           className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold text-lg shadow-lg mt-4 hover:bg-gray-100 transition"
//           onClick={() => setNavigateNow(true)}
//         >
//           Get Started
//         </button>
//       )}

//       <style jsx>{`
//         .dot-1,
//         .dot-2,
//         .dot-3 {
//           animation: blink 1s infinite;
//         }
//         .dot-2 {
//           animation-delay: 0.2s;
//         }
//         .dot-3 {
//           animation-delay: 0.4s;
//         }

//         @keyframes blink {
//           0%, 80%, 100% {
//             opacity: 0;
//           }
//           40% {
//             opacity: 1;
//           }
//         }
//       `}</style>
//     </div>
//   )
// }

// export default Welcome

'use client'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const Welcome:React.FC = () => {
  const [showButton, setShowButton] = useState(false);
  const [navigateNow, setNavigateNow] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setShowButton(true);
    }, 3000);

    if (navigateNow) {
      const timer2 = setTimeout(() => {
        router.push('/deliveryBoy/home')
      }, 3000);
      return () => clearTimeout(timer2)
    }
    return () => clearTimeout(timer1)
  }, [navigateNow, router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[var(--deep-red-orange)] to-[var(--coral-red)] text-white text-center px-6 py-8">
      {/* Main heading with refined typography and animation */}
     

      {/* Image with proper dimensions and subtle scaling animation */}
      <div className="relative w-64 h-64 md:w-80 md:h-80  transform hover:scale-105 transition-transform duration-300 mt-20">
        <Image
          src="/authImages/deliveryWelcome.png"
          alt="Delivery Welcome"
          fill
          className="object-contain"
          priority
        />
      </div>
       <h1 className="text-3xl  font-extrabold mb-8 tracking-tight animate-pulse drop-shadow-lg font-serif">
        Deliziare
      </h1>

      {/* Loading dots with refined animation */}
      <div className="text-3xl font-medium mb-8 tracking-wider">
        Loading
        <span className="dot-1">.</span>
        <span className="dot-2">.</span>
        <span className="dot-3">.</span>
      </div>

      {/* Button with modern design and hover effect */}
      {showButton && (
        <button
          className="bg-white text-blue-700 px-8 py-4 rounded-2xl font-semibold text-xl shadow-xl hover:bg-blue-50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          onClick={() => setNavigateNow(true)}
        >
          Get Started
        </button>
      )}

      {/* Updated styles for the blinking dots animation */}
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
      `}</style>
    </div>
  )
}

export default Welcome