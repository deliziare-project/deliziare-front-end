
// 'use client';

// import { useRouter } from 'next/navigation';
// import React from 'react';
// import Link from 'next/link';
// import { motion } from 'framer-motion';
// import { Users, ChefHat, Truck, ArrowLeft } from 'lucide-react';

// const roles = [
//   {
//     id: 'user',
//     title: 'User',
//     description: 'Find chefs, plan your events, and enjoy personalized menus.',
//     icon: Users,
//     color: 'bg-[#27391C]',
//   },
//   {
//     id: 'chef',
//     title: 'Chef',
//     description: 'Showcase your cooking skills and get event opportunities.',
//     icon: ChefHat,
//     color: 'bg-[#27391C]',
//   },
//   {
//     id: 'deliveryboy',
//     title: 'Delivery Partner',
//     description: 'Deliver food to customers and become a valued partner.',
//     icon: Truck,
//     color: 'bg-[#27391C]',
//   },
// ];

// export default function RegisterHome() {
//   const router = useRouter();

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="container mx-auto px-4 py-8">
//         <div className="mb-8">
//           <Link href="/" className="inline-flex items-center text-gray-600 hover:text-[#B87333] transition-colors">
//             <ArrowLeft className="mr-2 h-4 w-4" />
//             Back to home
//           </Link>
//         </div>

//         <div className="max-w-4xl mx-auto">
//           <div className="text-center mb-12">
//             <h1 className="text-3xl font-bold mb-4">Join Deliziare as a</h1>
//             <p className="text-gray-600">Choose your role and start your journey with us</p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {roles.map((role, index) => (
//               <motion.div
//                 key={role.id}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: index * 0.1 }}
//               >
//                 <button
//                   onClick={() => router.push(`/register/${role.id}`)}
//                   className="block w-full text-left group focus:outline-none"
//                 >
//                   <div className="bg-[#FFFF] rounded-xl shadow-md overflow-hidden  hover:shadow-[#DF6D14] transition-all duration-300 ease-out">
//                     <div className="p-6">
//                       <div className={`${role.color} w-12 h-12 rounded-full flex items-center justify-center mb-4`}>
//                         <role.icon className="h-6 w-6 text-white" />
//                       </div>
//                       <h3 className="text-xl font-bold mb-2 text-[#526E48]">{role.title}</h3>
//                       <p className="text-gray-600">{role.description}</p>
//                     </div>
//                   </div>
//                 </button>
//               </motion.div>
//             ))}
//           </div>

//           <div className="text-center mt-12">
//             <p className="text-sm text-gray-600">
//               Already have an account?{" "}
//               <Link
//                 href="/login"
//                 className="text-[#27391C] hover:underline font-medium"
//               >
//                 Sign In
//               </Link>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
// "use client"
// import React, { useState } from 'react';
// import ChefRegister from '../auth/ChefRegister';
// import DeliveryBoyRegister from '../auth/DeliveryBoyRegister';
// import RegisterPage from '../auth/UserRegister';

// type FormType = 'user' | 'chef' | 'deliveryboy';

// const RegisterHome: React.FC = () => {
//   const [activeForm, setActiveForm] = useState<FormType>('user');

//   const renderForm = () => {
//     switch (activeForm) {
//       case 'user':
//         return <RegisterPage />;
//       case 'chef':
//         return <ChefRegister />;
//       case 'deliveryboy':
//         return <DeliveryBoyRegister />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="mt-6 bg-white px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md mx-auto overflow-hidden md:max-w-2xl">
//         <div className="p-8">
        
          
//           <div className="flex justify-center gap-4 -mb-2">
//             <button
//               onClick={() => setActiveForm('user')}
//               className={`px-6 py-2 rounded-full font-medium transition-all ${activeForm === 'user' 
//                 ? 'bg-[#708A58] text-white shadow-md' 
//                 : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
//             >
//               User
//             </button>
//             <button
//               onClick={() => setActiveForm('chef')}
//               className={`px-6 py-2 rounded-full font-medium transition-all ${activeForm === 'chef' 
//                 ? 'bg-orange-700 text-white shadow-md' 
//                 : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
//             >
//               Chef
//             </button>
//             <button
//               onClick={() => setActiveForm('deliveryboy')}
//               className={`px-6 py-2 rounded-full font-medium transition-all ${activeForm === 'deliveryboy' 
//                 ? 'bg-blue-600 text-white shadow-md' 
//                 : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
//             >
//               Delivery
//             </button>
//           </div>

//           <div className=" pt-6">
//             {renderForm()}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RegisterHome;

'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import forms with `ssr: false` to skip SSR entirely
const ChefRegister = dynamic(() => import('../auth/ChefRegister'), { ssr: false });
const DeliveryBoyRegister = dynamic(() => import('../auth/DeliveryBoyRegister'), { ssr: false });
const RegisterPage = dynamic(() => import('../auth/UserRegister'), { ssr: false });

type FormType = 'user' | 'chef' | 'deliveryboy';

const RegisterHome: React.FC = () => {
  const [activeForm, setActiveForm] = useState<FormType>('user');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedForm = localStorage.getItem('activeForm') as FormType | null;
      if (savedForm) {
        setActiveForm(savedForm);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('activeForm', activeForm);
    }
  }, [activeForm]);

  const renderForm = () => {
    switch (activeForm) {
      case 'user':
        return <RegisterPage />;
      case 'chef':
        return <ChefRegister />;
      case 'deliveryboy':
        return <DeliveryBoyRegister />;
      default:
        return null;
    }
  };

  return (
    <div className="mt-6 bg-white px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <div className="flex justify-center gap-4 -mb-2">
            <button
              onClick={() => setActiveForm('user')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${activeForm === 'user'
                ? 'bg-[#708A58] text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              User
            </button>
            <button
              onClick={() => setActiveForm('chef')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${activeForm === 'chef'
                ? 'bg-orange-700 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Chef
            </button>
            <button
              onClick={() => setActiveForm('deliveryboy')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${activeForm === 'deliveryboy'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Delivery
            </button>
          </div>

          <div className="pt-6">
            {renderForm()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterHome;
