'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { getChefBids, updateBidStatus } from '@/features/bidSlice';
import { getAllPay } from '@/features/paymentSlice';
import { showSuccess } from '@/components/shared/ToastUtilis';
import { Calendar, Clock, MapPin, Utensils, Info, Truck, CheckCircle } from 'lucide-react';

const OrderStatus = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { bids, loading, error } = useSelector((state: RootState) => state.chefBids);
  const { pay } = useSelector((state: RootState) => state.payment);

  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    dispatch(getChefBids());
    dispatch(getAllPay());
  }, [dispatch]);

  const paymentMap = new Map(
    (pay || []).map((payment) => [
      payment.bid?.bidId?._id, 
      payment,
    ])
  );

  const pendingBids = bids.filter(
    (bid) =>
      bid.status === 'accepted' &&
      paymentMap.has(bid._id) &&
      (!filterDate ||
        new Date(bid.postId.date).toISOString().split('T')[0] === filterDate)
  );

  const completedBids = bids.filter((bid) => bid.status === 'completed');

  const handleComplete = (bidId: string) => {
    dispatch(updateBidStatus({ id: bidId, status: 'completed' }));
    showSuccess('Order marked as completed successfully');
  };

  const displayedBids = activeTab === 'pending' ? pendingBids : completedBids;

  const isToday = (dateString: string) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    return (
      eventDate.getFullYear() === today.getFullYear() &&
      eventDate.getMonth() === today.getMonth() &&
      eventDate.getDate() === today.getDate()
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center text-[#B8755D] border-b-2 border-[#B8755D] pb-2 inline-block">
          My Orders
        </h2>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            className={`flex items-center cursor-pointer gap-2 px-6 py-2 rounded-full transition-all ${
              activeTab === 'pending'
                ? 'bg-[#B8755D] text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('pending')}
          >
            <Clock className="h-5 w-5" />
            Pending Orders
            
          </button>
          <button
            className={`flex items-center cursor-pointer gap-2 px-6 py-2 rounded-full transition-all ${
              activeTab === 'completed'
                ? 'bg-[#B8755D] text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('completed')}
          >
            <CheckCircle className="h-5 w-5" />
            Completed Orders
            
          </button>
        </div>

        

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#B8755D]"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-red-500 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-700 font-medium">Error: {error}</p>
            </div>
          </div>
        ) : displayedBids.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-sm text-center border border-gray-200">
            <Utensils className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">
              No {activeTab === 'pending' ? 'pending' : 'completed'} orders found
            </h3>
            <p className="mt-2 text-gray-500">
              {activeTab === 'pending'
                ? 'You currently have no pending orders.'
                : 'Your completed orders will appear here.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {displayedBids.map((bid) => (
              <div
                key={bid._id}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-[#B8755D]">{bid.postId.eventName}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    activeTab === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {activeTab === 'completed' ? 'Completed' : 'Pending'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-[#F8F1EE] p-2 rounded-lg">
                      <Calendar className="h-5 w-5 text-[#B8755D]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Event Date & Time</p>
                      <p className="font-medium">
                        {new Date(bid.postId.date).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}
                        {' • '}
                        {new Date(`1970-01-01T${bid.postId.time}`).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true,
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-[#F8F1EE] p-2 rounded-lg">
                      <MapPin className="h-5 w-5 text-[#B8755D]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">{bid.postId.district}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-[#F8F1EE] p-2 rounded-lg">
                      <Utensils className="h-5 w-5 text-[#B8755D]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Menu Items</p>
                      <p className="font-medium">{bid.postId.menu.join(', ')}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-[#F8F1EE] p-2 rounded-lg">
                      <Info className="h-5 w-5 text-[#B8755D]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Description</p>
                      <p className="font-medium">{bid.postId.description || 'Not specified'}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Suggested Amount</p>
                        <p className="text-lg font-bold text-green-600">₹{bid.bidAmount}</p>
                      </div>
                      {bid.deliveryBoyId && (
                        <div>
                          <p className="text-sm text-gray-500">Delivery Partner</p>
                          <p className="font-medium text-[#B8755D] flex items-center gap-1">
                            <Truck className="h-4 w-4" />
                            {bid.deliveryBoyId?.name}
                          </p>
                        </div>
                      )}
                    </div>

                    {activeTab === 'pending' && (
                      <button
                        onClick={() => handleComplete(bid._id)}
                        disabled={!isToday(bid.postId.date)}
                        className={`px-5 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                          isToday(bid.postId.date)
                            ? 'bg-[#B8755D] hover:bg-[#9c5942] text-white cursor-pointer shadow-md'
                            : 'bg-[#F8F1EE] text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <CheckCircle className="h-5 w-5" />
                        Mark as Completed
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderStatus;


// 'use client';

// import { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch, RootState } from '@/redux/store';
// import { getChefBids, updateBidStatus } from '@/features/bidSlice';
// import { getAllPay } from '@/features/paymentSlice';
// import { showSuccess } from '@/components/shared/ToastUtilis';
// import { 
//   Calendar, 
//   Clock, 
//   MapPin, 
//   Utensils, 
//   Info, 
//   Truck, 
//   CheckCircle, 
//   Filter,
//   Search,
//   Star,
//   Users,
//   ChefHat,
//   DollarSign
// } from 'lucide-react';

// const OrderStatus = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { bids, loading, error } = useSelector((state: RootState) => state.chefBids);
//   const { pay } = useSelector((state: RootState) => state.payment);

//   const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');
//   const [filterDate, setFilterDate] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     dispatch(getChefBids());
//     dispatch(getAllPay());
//   }, [dispatch]);

//   const paymentMap = new Map(
//     (pay || []).map((payment) => [
//       payment.bid?.bidId?._id, 
//       payment,
//     ])
//   );

//   const pendingBids = bids.filter(
//     (bid) =>
//       bid.status === 'accepted' &&
//       paymentMap.has(bid._id) &&
//       (!filterDate ||
//         new Date(bid.postId.date).toISOString().split('T')[0] === filterDate) &&
//       (!searchTerm ||
//         bid.postId.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         bid.postId.district.toLowerCase().includes(searchTerm.toLowerCase()))
//   );

//   const completedBids = bids.filter((bid) => 
//     bid.status === 'completed' &&
//     (!searchTerm ||
//       bid.postId.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       bid.postId.district.toLowerCase().includes(searchTerm.toLowerCase()))
//   );

//   const handleComplete = (bidId: string) => {
//     dispatch(updateBidStatus({ id: bidId, status: 'completed' }));
//     showSuccess('Order marked as completed successfully');
//   };

//   const displayedBids = activeTab === 'pending' ? pendingBids : completedBids;

//   const isToday = (dateString: string) => {
//     const eventDate = new Date(dateString);
//     const today = new Date();
//     return (
//       eventDate.getFullYear() === today.getFullYear() &&
//       eventDate.getMonth() === today.getMonth() &&
//       eventDate.getDate() === today.getDate()
//     );
//   };

//   const getStatusColor = (status: string, date: string) => {
//     if (status === 'completed') return 'from-emerald-500 to-green-600';
//     if (isToday(date)) return 'from-amber-500 to-orange-600';
//     return 'from-blue-500 to-indigo-600';
//   };

//   const getStatusText = (status: string, date: string) => {
//     if (status === 'completed') return 'Completed';
//     if (isToday(date)) return 'Due Today';
//     return 'Scheduled';
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-stone-50">
//       {/* Header Section */}
//       <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
//         <div className="max-w-7xl mx-auto px-6 py-12">
//           <div className="text-center">
//             <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full mb-6">
//               <ChefHat className="h-8 w-8 text-white" />
//             </div>
//             <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-700 bg-clip-text text-transparent mb-3">
//               Order Management
//             </h1>
//             <p className="text-lg text-stone-600 max-w-2xl mx-auto">
//               Manage your culinary orders with ease and track your cooking journey
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-6 py-8">
//         {/* Controls Section */}
//         <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 mb-8">
//           <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
//             {/* Tabs */}
//             <div className="flex bg-stone-100 rounded-xl p-1">
//               <button
//                 className={`flex items-center gap-3 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
//                   activeTab === 'pending'
//                     ? 'bg-white text-amber-700 shadow-md'
//                     : 'text-stone-600 hover:text-stone-800'
//                 }`}
//                 onClick={() => setActiveTab('pending')}
//               >
//                 <Clock className="h-5 w-5" />
//                 Pending Orders
//                 <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded-full">
//                   {pendingBids.length}
//                 </span>
//               </button>
//               <button
//                 className={`flex items-center gap-3 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
//                   activeTab === 'completed'
//                     ? 'bg-white text-emerald-700 shadow-md'
//                     : 'text-stone-600 hover:text-stone-800'
//                 }`}
//                 onClick={() => setActiveTab('completed')}
//               >
//                 <CheckCircle className="h-5 w-5" />
//                 Completed Orders
//                 <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-full">
//                   {completedBids.length}
//                 </span>
//               </button>
//             </div>

//             {/* Search and Filter */}
//             <div className="flex gap-4 w-full lg:w-auto">
//               <div className="relative flex-1 lg:w-80">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-stone-400" />
//                 <input
//                   type="text"
//                   placeholder="Search orders..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
//                 />
//               </div>
//               {activeTab === 'pending' && (
//                 <div className="relative">
//                   <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-stone-400" />
//                   <input
//                     type="date"
//                     value={filterDate}
//                     onChange={(e) => setFilterDate(e.target.value)}
//                     className="pl-10 pr-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
//                   />
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Content */}
//         {loading ? (
//           <div className="flex justify-center items-center h-96">
//             <div className="relative">
//               <div className="animate-spin rounded-full h-20 w-20 border-4 border-stone-200"></div>
//               <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-amber-500 absolute top-0 left-0"></div>
//               <div className="absolute inset-0 flex items-center justify-center">
//                 <ChefHat className="h-8 w-8 text-amber-500" />
//               </div>
//             </div>
//           </div>
//         ) : error ? (
//           <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
//             <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Info className="h-8 w-8 text-red-500" />
//             </div>
//             <h3 className="text-xl font-semibold text-red-800 mb-2">Something went wrong</h3>
//             <p className="text-red-600">{error}</p>
//           </div>
//         ) : displayedBids.length === 0 ? (
//           <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-12 text-center">
//             <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
//               <Utensils className="h-10 w-10 text-stone-400" />
//             </div>
//             <h3 className="text-2xl font-semibold text-stone-800 mb-3">
//               No {activeTab === 'pending' ? 'pending' : 'completed'} orders
//             </h3>
//             <p className="text-stone-500 text-lg max-w-md mx-auto">
//               {activeTab === 'pending'
//                 ? 'Your pending orders will appear here when customers book your services.'
//                 : 'Your completed orders will be displayed here for your records.'}
//             </p>
//           </div>
//         ) : (
//           <div className="grid gap-6">
//             {displayedBids.map((bid) => (
//               <div
//                 key={bid._id}
//                 className="group bg-white rounded-2xl shadow-sm border border-stone-200 hover:shadow-xl hover:border-amber-200 transition-all duration-300 overflow-hidden"
//               >
//                 {/* Header */}
//                 <div className="bg-gradient-to-r from-stone-50 to-amber-50 p-6 border-b border-stone-100">
//                   <div className="flex justify-between items-start">
//                     <div className="flex-1">
//                       <h3 className="text-2xl font-bold text-stone-800 mb-2 group-hover:text-amber-700 transition-colors">
//                         {bid.postId.eventName}
//                       </h3>
//                       <div className="flex items-center gap-4 text-stone-600">
//                         <div className="flex items-center gap-2">
//                           <Users className="h-4 w-4" />
//                           <span className="text-sm font-medium">Event Catering</span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <Star className="h-4 w-4 text-amber-500" />
//                           <span className="text-sm font-medium">Premium Service</span>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-3">
//                       <span 
//                         className={`px-4 py-2 rounded-xl text-sm font-bold text-white bg-gradient-to-r ${getStatusColor(bid.status, bid.postId.date)} shadow-lg`}
//                       >
//                         {getStatusText(bid.status, bid.postId.date)}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Content */}
//                 <div className="p-6">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//                     <div className="space-y-4">
//                       <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
//                         <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
//                           <Calendar className="h-6 w-6 text-white" />
//                         </div>
//                         <div>
//                           <p className="text-sm font-medium text-stone-500 mb-1">Event Date & Time</p>
//                           <p className="font-bold text-stone-800">
//                             {new Date(bid.postId.date).toLocaleDateString('en-GB', {
//                               weekday: 'long',
//                               day: '2-digit',
//                               month: 'short',
//                               year: 'numeric',
//                             })}
//                           </p>
//                           <p className="text-indigo-600 font-semibold">
//                             {new Date(`1970-01-01T${bid.postId.time}`).toLocaleTimeString('en-US', {
//                               hour: 'numeric',
//                               minute: '2-digit',
//                               hour12: true,
//                             })}
//                           </p>
//                         </div>
//                       </div>

//                       <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl">
//                         <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
//                           <MapPin className="h-6 w-6 text-white" />
//                         </div>
//                         <div>
//                           <p className="text-sm font-medium text-stone-500 mb-1">Location</p>
//                           <p className="font-bold text-stone-800">{bid.postId.district}</p>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="space-y-4">
//                       <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl">
//                         <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
//                           <Utensils className="h-6 w-6 text-white" />
//                         </div>
//                         <div>
//                           <p className="text-sm font-medium text-stone-500 mb-1">Menu Items</p>
//                           <div className="flex flex-wrap gap-2">
//                             {bid.postId.menu.slice(0, 3).map((item, index) => (
//                               <span key={index} className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
//                                 {item}
//                               </span>
//                             ))}
//                             {bid.postId.menu.length > 3 && (
//                               <span className="px-3 py-1 bg-stone-100 text-stone-600 rounded-full text-sm font-medium">
//                                 +{bid.postId.menu.length - 3} more
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       </div>

//                       <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
//                         <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
//                           <Info className="h-6 w-6 text-white" />
//                         </div>
//                         <div>
//                           <p className="text-sm font-medium text-stone-500 mb-1">Special Requirements</p>
//                           <p className="font-medium text-stone-700 text-sm leading-relaxed">
//                             {bid.postId.description || 'No special requirements mentioned'}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Footer */}
//                   <div className="border-t border-stone-100 pt-6">
//                     <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
//                       <div className="flex items-center gap-6">
//                         <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
//                           <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
//                             <DollarSign className="h-5 w-5 text-white" />
//                           </div>
//                           <div>
//                             <p className="text-sm text-stone-500">Quoted Amount</p>
//                             <p className="text-2xl font-bold text-green-600">₹{bid.bidAmount}</p>
//                           </div>
//                         </div>
                        
//                         {bid.deliveryBoyId && (
//                           <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl">
//                             <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center">
//                               <Truck className="h-5 w-5 text-white" />
//                             </div>
//                             <div>
//                               <p className="text-sm text-stone-500">Delivery Partner</p>
//                               <p className="font-bold text-stone-800">{bid.deliveryBoyId?.name}</p>
//                             </div>
//                           </div>
//                         )}
//                       </div>

//                       {activeTab === 'pending' && (
//                         <button
//                           onClick={() => handleComplete(bid._id)}
//                           disabled={!isToday(bid.postId.date)}
//                           className={`flex items-center gap-3 px-8 py-4 rounded-xl font-bold transition-all duration-300 ${
//                             isToday(bid.postId.date)
//                               ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1'
//                               : 'bg-stone-100 text-stone-400 cursor-not-allowed'
//                           }`}
//                         >
//                           <CheckCircle className="h-5 w-5" />
//                           {isToday(bid.postId.date) ? 'Mark as Completed' : 'Complete on Event Day'}
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default OrderStatus;