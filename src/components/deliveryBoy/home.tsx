// "use client";

// import React from "react";
// import Image from "next/image";
// import { Bell, Home as HomeIcon, List, ChevronRight } from "lucide-react";

// const weekEarnings = {
//   Monday: 120,
//   Tuesday: 90,
//   Wednesday: 110,
//   Thursday: 150,
//   Friday: 100,
//   Saturday: 170,
//   Sunday: 80,
// };

// const recentOrders = [
//   {
//     id: 1,
//     user: "John Doe",
//     profile: "/userSideImage/chef1.jpg",
//     status: "Delivered",
//   },
//   {
//     id: 2,
//     user: "Jane Smith",
//     profile: "/userSideImage/chef2.jpg",
//     status: "Pending",
//   },
//   {
//     id: 3,
//     user: "Thomas",
//     profile: "/userSideImage/chef5.jpg",
//     status: "Pending",
//   },
//   {
//     id: 4,
//     user: "Shoan",
//     profile: "/userSideImage/chef4.jpg",
//     status: "Pending",
//   },
//   {
//     id: 5,
//     user: "Beon",
//     profile: "/userSideImage/chef1.jpg",
//     status: "Pending",
//   },
// ];

// const Home: React.FC = () => {
//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white px-6 py-3 border-b border-gray-100 sticky top-0 z-10 shadow-sm">
//         <div className="flex justify-between items-center max-w-6xl mx-auto">
//           <div className="flex items-center space-x-3">
//             <div className="w-10 h-10 flex items-center justify-center">
//               <Image
//                 src="/logo/delizaire-logo.png"
//                 alt="Deliziare Logo"
//                 width={40}
//                 height={40}
//                 className="object-contain"
//               />
//             </div>
//             <div>
//               <h1 className="text-xl font-bold text-gray-800">Deliziare</h1>
//               <p className="text-xs text-gray-400 tracking-wider">Delivery Partner</p>
//             </div>
//           </div>

//           <div className="flex items-center space-x-4">
//             <button className="relative p-2 rounded-full hover:bg-gray-50 transition-colors">
//               <Bell className="w-5 h-5 text-gray-600" />
//               <span className="absolute top-2 right-2 w-2 h-2 bg-[#FF4D00] rounded-full"></span>
//             </button>
            
//             <div className="flex items-center space-x-2">
//               <div className="relative">
//                 <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-200">
//                   <Image
//                     src="/userSideImage/deliveryMan.jpg"
//                     alt="User Profile"
//                     width={36}
//                     height={36}
//                     className="object-cover"
//                   />
//                 </div>
//                 <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></span>
//               </div>
//               <div className="hidden md:block">
//                 <p className="text-sm font-medium text-gray-700">Varun</p>
//                 <p className="text-xs text-gray-400">Online</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       <main className="p-4 max-w-6xl mx-auto">
//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//           {/* Total Earnings Card */}
//           <div className="bg-white p-5 rounded-xl shadow-xs border border-gray-100">
//             <div className="flex justify-between items-start">
//               <div>
//                 <p className="text-sm font-medium text-gray-500 mb-1">Total Earnings</p>
//                 <p className="text-2xl font-bold text-gray-900">₹12,340</p>
//                 <div className="flex items-center mt-2">
//                   <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full mr-2">
//                     ↑ 12% from last week
//                   </span>
//                 </div>
//               </div>
//               <div className="bg-[#FFF0E6] p-2 rounded-lg">
//                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                   <path d="M12 1V23" stroke="#FF4D00" strokeWidth="2" strokeLinecap="round"/>
//                   <path d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="#FF4D00" strokeWidth="2" strokeLinecap="round"/>
//                 </svg>
//               </div>
//             </div>
//           </div>

//           {/* Weekly Earnings Card */}
//           <div className="bg-white p-7 rounded-xl shadow-xs border border-gray-100 ">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-sm font-medium text-gray-500">Weekly Earnings</h3>
//               <span className="text-xs font-medium text-[#FF4D00] bg-[#FFF0E6] px-2 py-1 rounded-full">
//                 This Week
//               </span>
//             </div>
            
//             {/* Area Chart */}
//             <div className="relative h-40 mt-5">
//               <svg width="100%" height="100%" viewBox="0 0 300 100" preserveAspectRatio="none">
//                 <defs>
//                   <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
//                     <stop offset="0%" stopColor="#FF4D00" stopOpacity="0.2"/>
//                     <stop offset="100%" stopColor="#FF4D00" stopOpacity="0"/>
//                   </linearGradient>
//                 </defs>
                
//                 {/* Area fill */}
//                 <path
//                   d={`
//                     M0,100 
//                     L${(0/6)*300},${100 - (weekEarnings.Monday/170)*100}
//                     L${(1/6)*300},${100 - (weekEarnings.Tuesday/170)*100}
//                     L${(2/6)*300},${100 - (weekEarnings.Wednesday/170)*100}
//                     L${(3/6)*300},${100 - (weekEarnings.Thursday/170)*100}
//                     L${(4/6)*300},${100 - (weekEarnings.Friday/170)*100}
//                     L${(5/6)*300},${100 - (weekEarnings.Saturday/170)*100}
//                     L${(6/6)*300},${100 - (weekEarnings.Sunday/170)*100}
//                     L300,100
//                     Z
//                   `}
//                   fill="url(#areaGradient)"
//                 />
                
//                 {/* Line */}
//                 <polyline
//                   points={`
//                     ${(0/6)*300},${100 - (weekEarnings.Monday/170)*100}
//                     ${(1/6)*300},${100 - (weekEarnings.Tuesday/170)*100}
//                     ${(2/6)*300},${100 - (weekEarnings.Wednesday/170)*100}
//                     ${(3/6)*300},${100 - (weekEarnings.Thursday/170)*100}
//                     ${(4/6)*300},${100 - (weekEarnings.Friday/170)*100}
//                     ${(5/6)*300},${100 - (weekEarnings.Saturday/170)*100}
//                     ${(6/6)*300},${100 - (weekEarnings.Sunday/170)*100}
//                   `}
//                   fill="none"
//                   stroke="#FF4D00"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
                
//                 {/* Dots */}
//                 {Object.values(weekEarnings).map((amount, i) => (
//                   <circle
//                     key={i}
//                     cx={(i/6)*300}
//                     cy={100 - (amount/170)*100}
//                     r="3"
//                     fill="#FF4D00"
//                     stroke="white"
//                     strokeWidth="1.5"
//                   />
//                 ))}
//               </svg>
              
//               {/* X-axis labels */}
//               <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500">
//                 {Object.keys(weekEarnings).map((day) => (
//                   <span key={day} className="w-8 text-center">
//                     {day.substring(0, 1)}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Recent Orders */}
//         <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden mb-20">
//           <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
//             <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
//             <button className="text-sm font-medium text-[#FF4D00] hover:text-[#E04500] flex items-center">
//               View all <ChevronRight className="w-4 h-4 ml-1" />
//             </button>
//           </div>
          
//           <div className="divide-y divide-gray-100">
//             {recentOrders.map((order) => (
//               <div key={order.id} className="px-5 py-3 hover:bg-gray-50 transition-colors">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-3">
//                     <div className="relative w-10 h-10 rounded-full overflow-hidden">
//                       <Image
//                         src={order.profile}
//                         alt={order.user}
//                         width={40}
//                         height={40}
//                         className="object-cover"
//                       />
//                     </div>
//                     <div>
//                       <p className="font-medium text-gray-900">{order.user}</p>
//                       <p className="text-xs text-gray-500">Order #{order.id.toString().padStart(3, '0')}</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-3">
//                     <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
//                       order.status === "Delivered" 
//                         ? "bg-green-50 text-green-700" 
//                         : "bg-[#FFF0E6] text-[#FF4D00]"
//                     }`}>
//                       {order.status}
//                     </span>
//                     <ChevronRight className="w-5 h-5 text-gray-400" />
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </main>

//       {/* Bottom Navigation */}
//       <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-sm">
//         <div className="max-w-md mx-auto flex justify-around py-2">
//           <button className="flex flex-col items-center px-4 py-2 text-[#FF4D00]">
//             <HomeIcon className="w-5 h-5" />
//             <span className="text-xs mt-1">Home</span>
//           </button>
//           <button className="flex flex-col items-center px-4 py-2 text-gray-500 hover:text-gray-700">
//             <List className="w-5 h-5" />
//             <span className="text-xs mt-1">Orders</span>
//           </button>
//         </div>
//       </nav>
//     </div>
//   );
// };

// export default Home;


"use client";

import React from "react";
import Image from "next/image";
import { Bell, Home as HomeIcon, List, ChevronRight } from "lucide-react";

const weekEarnings = {
  Mon: 120,
  Tue: 90,
  Wed: 110,
  Thu: 150,
  Fri: 100,
  Sat: 170,
  Sun: 80,
};

const recentOrders = [
  {
    id: 1,
    user: "John Doe",
    profile: "/userSideImage/chef1.jpg",
    status: "Delivered",
  },
  {
    id: 2,
    user: "Jane Smith",
    profile: "/userSideImage/chef2.jpg",
    status: "Pending",
  },
  {
    id: 3,
    user: "Thomas",
    profile: "/userSideImage/chef5.jpg",
    status: "Pending",
  },
  {
    id: 4,
    user: "Shoan",
    profile: "/userSideImage/chef4.jpg",
    status: "Pending",
  },
  {
    id: 5,
    user: "Beon",
    profile: "/userSideImage/chef1.jpg",
    status: "Pending",
  },
];

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white px-4 sm:px-6 py-3 border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
              <Image
                src="/logo/delizaire-logo.png"
                alt="Deliziare Logo"
                width={40}
                height={40}
                className="object-contain"
                priority
              />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-800">Deliziare</h1>
              <p className="text-[10px] sm:text-xs text-gray-400 tracking-wider">Delivery Partner</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            <button className="relative p-1 sm:p-2 rounded-full hover:bg-gray-50 transition-colors">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              <span className="absolute top-1 right-1 sm:top-2 sm:right-2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#FF4D00] rounded-full"></span>
            </button>
            
            <div className="flex items-center space-x-1 sm:space-x-2">
              <div className="relative">
                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full overflow-hidden border border-gray-200">
                  <Image
                    src="/userSideImage/deliveryMan.jpg"
                    alt="User Profile"
                    width={36}
                    height={36}
                    className="object-cover"
                    priority
                  />
                </div>
                <span className="absolute bottom-0 right-0 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-green-500 rounded-full border border-white"></span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-700">Varun</p>
                <p className="text-xs text-gray-400">Online</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="p-3 sm:p-4 max-w-6xl mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
          {/* Total Earnings Card */}
          <div className="bg-white p-4 sm:p-5 rounded-xl shadow-xs border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Total Earnings</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">₹12,340</p>
                <div className="flex items-center mt-1 sm:mt-2">
                  <span className="bg-green-100 text-green-800 text-[10px] sm:text-xs px-2 py-0.5 rounded-full mr-2">
                    ↑ 12% from last week
                  </span>
                </div>
              </div>
              <div className="bg-[#FFF0E6] p-1 sm:p-2 rounded-lg">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 1V23" stroke="#FF4D00" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="#FF4D00" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Weekly Earnings Card */}
          <div className="bg-white p-4 sm:p-5 rounded-xl shadow-xs border border-gray-100">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h3 className="text-xs sm:text-sm font-medium text-gray-500">Weekly Earnings</h3>
              <span className="text-[10px] sm:text-xs font-medium text-[#FF4D00] bg-[#FFF0E6] px-2 py-0.5 rounded-full">
                This Week
              </span>
            </div>
            
            {/* Area Chart */}
            <div className="relative h-32 sm:h-40 mt-3 sm:mt-5">
              <svg width="100%" height="100%" viewBox="0 0 300 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FF4D00" stopOpacity="0.2"/>
                    <stop offset="100%" stopColor="#FF4D00" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                
                {/* Area fill */}
                <path
                  d={`
                    M0,100 
                    L${(0/6)*300},${100 - (weekEarnings.Mon/170)*100}
                    L${(1/6)*300},${100 - (weekEarnings.Tue/170)*100}
                    L${(2/6)*300},${100 - (weekEarnings.Wed/170)*100}
                    L${(3/6)*300},${100 - (weekEarnings.Thu/170)*100}
                    L${(4/6)*300},${100 - (weekEarnings.Fri/170)*100}
                    L${(5/6)*300},${100 - (weekEarnings.Sat/170)*100}
                    L${(6/6)*300},${100 - (weekEarnings.Sun/170)*100}
                    L300,100
                    Z
                  `}
                  fill="url(#areaGradient)"
                />
                
                {/* Line */}
                <polyline
                  points={`
                    ${(0/6)*300},${100 - (weekEarnings.Mon/170)*100}
                    ${(1/6)*300},${100 - (weekEarnings.Tue/170)*100}
                    ${(2/6)*300},${100 - (weekEarnings.Wed/170)*100}
                    ${(3/6)*300},${100 - (weekEarnings.Thu/170)*100}
                    ${(4/6)*300},${100 - (weekEarnings.Fri/170)*100}
                    ${(5/6)*300},${100 - (weekEarnings.Sat/170)*100}
                    ${(6/6)*300},${100 - (weekEarnings.Sun/170)*100}
                  `}
                  fill="none"
                  stroke="#FF4D00"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                
                {/* Dots */}
                {Object.values(weekEarnings).map((amount, i) => (
                  <circle
                    key={i}
                    cx={(i/6)*300}
                    cy={100 - (amount/170)*100}
                    r="3"
                    fill="#FF4D00"
                    stroke="white"
                    strokeWidth="1.5"
                  />
                ))}
              </svg>
              
              {/* X-axis labels */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] sm:text-xs text-gray-500">
                {Object.keys(weekEarnings).map((day) => (
                  <span key={day} className="w-8 text-center">
                    {day}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden mb-16 sm:mb-20">
          <div className="px-4 py-3 sm:px-5 sm:py-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Recent Orders</h2>
            <button className="text-xs sm:text-sm font-medium text-[#FF4D00] hover:text-[#E04500] flex items-center">
              View all <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
            </button>
          </div>
          
          <div className="divide-y divide-gray-100">
            {recentOrders.map((order) => (
              <div key={order.id} className="px-4 py-2 sm:px-5 sm:py-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden">
                      <Image
                        src={order.profile}
                        alt={order.user}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm sm:text-base font-medium text-gray-900">{order.user}</p>
                      <p className="text-[10px] sm:text-xs text-gray-500">Order #{order.id.toString().padStart(3, '0')}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <span className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium ${
                      order.status === "Delivered" 
                        ? "bg-green-50 text-green-700" 
                        : "bg-[#FFF0E6] text-[#FF4D00]"
                    }`}>
                      {order.status}
                    </span>
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-sm">
        <div className="max-w-md mx-auto flex justify-around py-1 sm:py-2">
          <button className="flex flex-col items-center px-3 py-1 sm:px-4 sm:py-2 text-[#FF4D00]">
            <HomeIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-[10px] sm:text-xs mt-1">Home</span>
          </button>
          <button className="flex flex-col items-center px-3 py-1 sm:px-4 sm:py-2 text-gray-500 hover:text-gray-700">
            <List className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-[10px] sm:text-xs mt-1">Orders</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Home;