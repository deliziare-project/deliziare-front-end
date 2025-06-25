// 'use client';

// import { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch, RootState } from '@/redux/store';
// import { getChefBids } from '@/features/bidSlice';
// import { getAllPay } from '@/features/paymentSlice';

// const TABS = ['pending', 'accepted', 'rejected'];

// const ChefBids = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { bids=[], loading, error } = useSelector((state: RootState) => state.chefBids);
//    const { pay } = useSelector((state: RootState) => state.payment);
//    console.log('amount',pay)
  
//     useEffect(() => {
//       dispatch(getAllPay());
//     }, [dispatch]);

//   const [activeTab, setActiveTab] = useState('pending');

//   // console.log(bids)

//   useEffect(() => {
//     dispatch(getChefBids());
//   }, [dispatch]);

// const filteredBids = Array.isArray(bids)
//   ? bids.filter((bid) => bid.status === activeTab)
//   : [];

//   console.log("Before reverse", filteredBids.map(b => b.createdAt));
// console.log("After reverse", [...filteredBids].reverse().map(b => b.createdAt));


//  const paymentMap = new Map(
//   (pay || []).map((payment) => [
//     payment.bid?.bidId?._id, 
//     payment,
//   ])
// );


// console.log(paymentMap)

//   return (
//     <div className="p-6 max-w-5xl mx-auto">
//       <h2 className="text-3xl font-bold mb-6 text-center text-[#B8755D]">My Bids</h2>

//       <div className="flex justify-center gap-4 mb-8">
//         {TABS.map((tab) => (
//           <button
//             key={tab}
//             className={`px-4 py-2 cursor-pointer text-sm font-medium rounded-full transition ${
//               activeTab === tab
//                 ? 'bg-[#B8755D] text-white'
//                 : 'bg-[#f0e6e2] text-[#B8755D] hover:bg-[#e5d4ce]'
//             }`}
//             onClick={() => setActiveTab(tab)}
//           >
//             {tab.charAt(0).toUpperCase() + tab.slice(1)}
//           </button>
//         ))}
//       </div>

//       {loading ? (
//         <div className="text-center text-[#B8755D]">Loading bids...</div>
//       ) : error ? (
//         <div className="text-center text-red-500">Error: {error}</div>
//       ) : filteredBids.length === 0 ? (
//         <p className="text-gray-500 text-center">No {activeTab} bids found.</p>
//       ) : (
//         <ul className="space-y-6">
//           {filteredBids.map((bid) => (
//             <li
//               key={bid._id}
//               className="border border-[#e2d4cf] rounded-xl shadow-md p-6 bg-white hover:shadow-lg transition"
//             >
//               <div className="mb-4">
//                 <h3 className="text-xl font-semibold text-[#B8755D]">
//                   {bid?.postId?.eventName}
//                 </h3>
//                 <p className="text-sm text-gray-500">
//                   {/* {bid?.postId?.date} at {bid?.postId?.time} 
//                    */}

//                     {new Date(bid?.postId?.date).toLocaleDateString('en-GB', {
//                           day: '2-digit',
//                           month: '2-digit',
//                           year: 'numeric',
//                         })} at  {new Date(`1970-01-01T${bid?.postId?.time}`).toLocaleTimeString('en-US', {
//                           hour: 'numeric',
//                           minute: '2-digit',
//                           hour12: true,
//                         })}
//                 </p>
//               </div>

//               <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
//                 <div>
//                   <span className="font-medium text-[#B8755D]">Location:</span>{' '}
//                   {bid?.postId?.district}
//                 </div>
//                 <div>
//                   <span className="font-medium text-[#B8755D]">Menu:</span>{' '}
//                   {Array.isArray(bid?.postId?.menu)
//                   ? bid.postId.menu.join(', ')
//                   : bid?.postId?.menu}

//                 </div>
//                 <div>
//                   <span className="font-medium text-[#B8755D]">Quantity:</span>{' '}
//                   {bid?.postId?.quantity}
//                 </div>
//                 <div>
//                   <span className="font-medium text-[#B8755D]">Description:</span>{' '}
//                   {bid.postId?.description}
//                 </div>
//               </div>

//               <div className="mt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-sm font-medium">
//                 <div>
//                   <span className="text-gray-600">Suggested Amount:</span>{' '}
//                   <span className="text-green-600 font-semibold">₹{bid?.bidAmount}</span>
//                 </div>
//                 <div>
//                   <span className="text-gray-600">Status:</span>{' '}
//                   <span
//                     className={`font-semibold capitalize ${
//                       bid?.status === 'accepted'
//                         ? 'text-green-600'
//                         : bid?.status === 'rejected'
//                         ? 'text-red-500'
//                         : 'text-yellow-600'
//                     }`}
//                   >
//                     {bid?.status}
//                   </span>
//                 </div>

//                  {bid.status === 'accepted' && (
//                   <div>
//                     <span className="text-gray-600">Payment:</span>{' '}
//                     <span
//                       className={`font-semibold ${
//                         paymentMap.has(bid._id) ? 'text-green-600' : 'text-red-500'
//                       }`}
//                     >
//                       {paymentMap.has(bid._id) ? 'Paid' : 'Not Paid'}
//                     </span>
//                   </div>
//                 )}

//                 <div className="text-gray-500 text-sm">
//                   {/* {new Date(bid?.createdAt).toLocaleString()} */}
//                    {new Date(bid?.createdAt).toLocaleDateString('en-GB', {
//                           day: '2-digit',
//                           month: '2-digit',
//                           year: 'numeric',
//                         })}
//                 </div>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default ChefBids;


'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { getChefBids } from '@/features/bidSlice';
import { getAllPay } from '@/features/paymentSlice';
import { Clock, CalendarDays, MapPin, Utensils, Scale, FileText, CheckCircle2, XCircle, Clock4, IndianRupee } from 'lucide-react';

const TABS = ['pending', 'accepted', 'rejected'];

const ChefBids = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { bids = [], loading, error } = useSelector((state: RootState) => state.chefBids);
  const { pay } = useSelector((state: RootState) => state.payment);
  
  useEffect(() => {
    dispatch(getAllPay());
    dispatch(getChefBids());
  }, [dispatch]);

  const [activeTab, setActiveTab] = useState('pending');

  const filteredBids = Array.isArray(bids)
    ? bids.filter((bid) => bid.status === activeTab)
    : [];

  const paymentMap = new Map(
    (pay || []).map((payment) => [
      payment.bid?.bidId?._id, 
      payment,
    ])
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-2 text-[#B8755D]">My Bids</h2>
        <p className="text-gray-600">Manage and track all your catering bids in one place</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center gap-2 mb-8 bg-[#f9f5f3] p-2 rounded-full shadow-inner">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`px-6 py-2 cursor-pointer text-sm font-medium rounded-full transition-all flex items-center gap-2 ${
              activeTab === tab
                ? 'bg-[#B8755D] text-white shadow-md'
                : 'bg-transparent text-[#B8755D] hover:bg-[#f0e6e2]'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'accepted' && <CheckCircle2 size={16} />}
            {tab === 'rejected' && <XCircle size={16} />}
            {tab === 'pending' && <Clock4 size={16} />}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-[#B8755D] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-[#B8755D]">Loading your bids...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
          <div className="flex items-center">
            <XCircle className="h-5 w-5 text-red-500 mr-2" />
            <h3 className="text-red-800 font-medium">Error loading bids</h3>
          </div>
          <p className="text-red-700 mt-1">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredBids.length === 0 && (
        <div className="text-center py-12 bg-[#f9f5f3] rounded-xl">
          <FileText className="mx-auto h-12 w-12 text-[#B8755D] mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No {activeTab} bids found</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            {activeTab === 'pending'
              ? "You don't have any pending bids at the moment."
              : activeTab === 'accepted'
              ? "Your accepted bids will appear here."
              : "No rejected bids to display."}
          </p>
        </div>
      )}

      {/* Bids List */}
      {!loading && !error && filteredBids.length > 0 && (
        <ul className="space-y-4">
          {[...filteredBids].reverse().map((bid) => (
            <li
              key={bid._id}
              className="border border-[#e2d4cf] rounded-xl shadow-sm p-6 bg-white hover:shadow-md transition-all duration-300"
            >
              <div className="mb-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-[#B8755D]">
                    {bid?.postId?.eventName}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    bid?.status === 'accepted'
                      ? 'bg-green-100 text-green-800'
                      : bid?.status === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {bid?.status.charAt(0).toUpperCase() + bid?.status.slice(1)}
                  </span>
                </div>

                <div className="flex items-center gap-3 mt-2 text-gray-600">
                  <div className="flex items-center">
                    <CalendarDays className="h-4 w-4 mr-1 text-[#B8755D]" />
                    <span>
                      {new Date(bid?.postId?.date).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-[#B8755D]" />
                    <span>
                      {new Date(`1970-01-01T${bid?.postId?.time}`).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-[#B8755D] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Location</p>
                    <p>{bid?.postId?.district}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Utensils className="h-5 w-5 text-[#B8755D] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Menu</p>
                    <p>
                      {Array.isArray(bid?.postId?.menu)
                        ? bid.postId.menu.join(', ')
                        : bid?.postId?.menu}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Scale className="h-5 w-5 text-[#B8755D] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Quantity</p>
                    <p>{bid?.postId?.quantity}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-[#B8755D] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Description</p>
                    <p className="text-gray-600">{bid.postId?.description || 'Not specified'}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#f0e6e2] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-2">
                  <IndianRupee className="h-5 w-5 text-[#B8755D]" />
                  <span className="text-gray-600">Your Bid:</span>
                  <span className="text-lg font-bold text-green-600">₹{bid?.bidAmount}</span>
                </div>

                {bid.status === 'accepted' && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Payment:</span>
                    <span className={`font-medium ${
                      paymentMap.has(bid._id) 
                        ? 'text-green-600 flex items-center gap-1'
                        : 'text-red-500 flex items-center gap-1'
                    }`}>
                      {paymentMap.has(bid._id) 
                        ? <><CheckCircle2 size={16} /> Paid</>
                        : <><XCircle size={16} /> Pending</>}
                    </span>
                  </div>
                )}

                <div className="text-sm text-gray-500">
                  Submitted on {new Date(bid?.createdAt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChefBids;
