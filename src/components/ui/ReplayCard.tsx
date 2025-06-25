// import React, { useEffect } from 'react';
// import { Mail, Phone } from 'lucide-react';
// import { formatRelativeTime } from '../../utils/dateUtils';
// import { Replay } from '@/types/Replay';
// import StatusBadge from './StatusBadge';
// import axiosInstance from '@/api/axiosInstance';
// import { useRouter } from 'next/navigation'; 
// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch, RootState } from '@/redux/store';
// import { getAllPay } from '@/features/paymentSlice';
// import Link from 'next/link';

// interface ReplayCardProps {
//   replay: Replay;
 
// }

// const ReplayCard: React.FC<ReplayCardProps> = ({ replay }) => {

//   // console.log('bids',replay)
//   const router = useRouter();
//   const dispatch = useDispatch<AppDispatch>();
//   const { pay } = useSelector((state: RootState) => state.payment);
//   const [status, setStatus] = React.useState(replay.status);
//   const [loading, setLoading] = React.useState(false);


//   useEffect(() => {
//     dispatch(getAllPay());
//   }, [dispatch]);

//   const handleClickAccept = async (value: Replay) => {
//     setLoading(true);
//     try {
//       await axiosInstance.patch('/bids/accept-bid', {
//         bidId: value._id,
//         postId: value.postId,
//       });
//       setStatus('accepted');
//     } catch (error) {
//       console.error('Error accepting bid:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePayment = () => {
//     router.push(`/payment?bidId=${replay._id}`); 
//   };

//   // console.log('pay',pay)
//   // console.log(pay[0]?.bid);
//   //  console.log(pay[0]?.bid?.bidId);
//   //   console.log(replay._id);
  
  
//   const bidPayment = pay?.find(
//     (payment) => payment?.bid?.bidId && payment.bid.bidId._id === replay._id
//   );
  
  

//   // console.log(bidPayment)
//   const isPaymentPending = bidPayment?.status === 'pending';
//   const isPaymentSuccess = bidPayment?.status === 'success';

//   return (
//     <div className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow replay-card">
//       <div className="flex justify-between items-start mb-3">
//         <Link href={`/profiles/chefProfile/${replay.chefId?._id}`} className="w-10 h-10 rounded-full overflow-hidden border border-gray-300 block">
//                         <img
//                           src={replay.chefId?.profileImage || '/default-profile.png'}
//                           alt={replay.chefId?.name}
//                           className="w-full h-full object-cover"
//                         />
//                       </Link>
        
//         <div>
//           <h3 className="font-medium text-gray-900">{replay.chefId?.name}</h3>
//         </div>

//         <div className="flex flex-col items-end">
//           <StatusBadge status={replay.status} />
//           <div className="mt-1 text-sm text-gray-500">
//             {replay.createdAt ? formatRelativeTime(replay.createdAt) : 'Just now'}
//           </div>
//         </div>
//       </div>

//       <div className="mt-4">
//         <div>
//           <div className="text-2xl font-bold text-gray-900">
//             <span className="text-sm text-gray-600">Bid Amount :</span>{' '}
//             ${replay.bidAmount.toLocaleString()}
//           </div>
//           <p className="text-sm text-gray-700">{replay.description}</p>
//         </div>

//         {status === 'pending' ? (
//           <button
//             className="px-4 cursor-pointer py-2 mt-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
//             onClick={() => handleClickAccept(replay)}
//             disabled={loading}
//           >
//             {loading ? 'Accepting...' : 'Accept'}
//           </button>
//         ) : (
//           <p
//             className={`inline-block text-sm font-medium px-2 py-1 rounded-full ${
//               status === 'accepted'
//                 ? 'bg-green-100 text-green-800'
//                 : 'bg-red-100 text-red-800'
//             }`}
//           >
//             {status}
//           </p>
//         )}

//         {isPaymentSuccess ? (
//           <button
//             className="px-4 py-2 mt-2 bg-gray-300 text-gray-700 rounded-lg cursor-not-allowed"
//             disabled
//           >
//             Paid
//           </button>
//         ) : (status === 'accepted' || isPaymentPending) && (
//           <button
//             className="px-4 py-2 cursor-pointer mt-2 bg-blue-600  hover:bg-blue-700 text-white rounded-lg transition-colors"
//             onClick={handlePayment}
//           >
//             Pay
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ReplayCard;




import React, { useEffect } from 'react';
import { Mail, Phone } from 'lucide-react';
import { formatRelativeTime } from '../../utils/dateUtils';
import { Replay } from '@/types/Replay';
import StatusBadge from './StatusBadge';
import axiosInstance from '@/api/axiosInstance';
import { useRouter } from 'next/navigation'; 
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { getAllPay } from '@/features/paymentSlice';
import Link from 'next/link';

interface ReplayCardProps {
  replay: Replay;
}

const ReplayCard: React.FC<ReplayCardProps> = ({ replay }) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { pay } = useSelector((state: RootState) => state.payment);
  const [status, setStatus] = React.useState(replay.status);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    dispatch(getAllPay());
  }, [dispatch]);

  const handleClickAccept = async (value: Replay) => {
    setLoading(true);
    try {
      await axiosInstance.patch('/bids/accept-bid', {
        bidId: value._id,
        postId: value.postId,
        
      });
      setStatus('accepted');
    } catch (error) {
      console.error('Error accepting bid:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = () => {
    router.push(`/payment?bidId=${replay._id}`); 
  };

  const bidPayment = pay?.find(
    (payment) => payment?.bid?.bidId && payment.bid.bidId._id === replay._id
  );
  
  const isPaymentPending = bidPayment?.status === 'pending';
  const isPaymentSuccess = bidPayment?.status === 'success';

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5">
      <div className="p-5">
        {/* Chef Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Link 
              href={`/profiles/chefProfile/${replay.chefId?._id}`} 
              className="relative group"
            >
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md group-hover:border-emerald-100 transition-colors duration-300">
                <img
                  src={replay.chefId?.profileImage || '/default-profile.png'}
                  alt={replay.chefId?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-3 h-3">
                  <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                </svg>
              </div> */}
            </Link>
            <div>
              <h3 className="font-semibold text-gray-800 group-hover:text-emerald-600 transition-colors duration-300">
                {replay.chefId?.name}
              </h3>
              {/* <p className="text-sm text-gray-500">
                {replay.chefId?.district || 'Professional Chef'}
              </p> */}
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <StatusBadge status={replay.status} />
            <span className="mt-1 text-xs text-gray-400">
              {replay.createdAt ? formatRelativeTime(replay.createdAt) : 'Just now'}
            </span>
          </div>
        </div>

        {/* Bid Content */}
        <div className="mt-4 space-y-3">
          <div className="flex items-baseline space-x-2">
            <span className="text-sm font-medium text-gray-500">Bid:</span>
            <span className="text-2xl font-bold text-emerald-600">
              ${replay.bidAmount.toLocaleString()}
            </span>
          </div>
          
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
            {replay.description || "No additional details provided by the chef."}
          </p>
        </div>


        {/* Actions */}
        <div className="mt-6 flex items-center justify-between">
          {/* <div className="flex space-x-2">
            <button className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors duration-200">
              <Phone size={16} />
            </button>
            <button className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors duration-200">
              <Mail size={16} />
            </button>
          </div> */}
          
          <div className="flex space-x-3">
            {status === 'pending' ? (
              <button
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  loading 
                    ? 'bg-emerald-300 cursor-not-allowed' 
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md hover:shadow-lg'
                }`}
                onClick={() => handleClickAccept(replay)}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Accepting...
                  </span>
                ) : 'Accept Bid'}
              </button>
            ) : isPaymentSuccess ? (
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium cursor-not-allowed"
                disabled
              >
                Payment Complete
              </button>
            ) : (status === 'accepted' || isPaymentPending) ? (
              <button
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200"
                onClick={handlePayment}
              >
                {isPaymentPending ? 'Complete Payment' : 'Pay Now'}
              </button>
            ) : (
              <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                status === 'accepted' 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {status}
              </span>
            )}
          </div>
        </div>

        {isPaymentSuccess ? (
          <button
            className="px-4 py-2 mt-2 bg-gray-300 text-gray-700 rounded-lg cursor-not-allowed"
            disabled
          >
            Paid
          </button>
        ) : (replay.status === 'accepted' || isPaymentPending) && (
          <button
            className="px-4 py-2  mt-2 bg-blue-600 cursor-pointer hover:bg-blue-700 text-white rounded-lg transition-colors"
            onClick={handlePayment}
          >
            Pay
          </button>
        )}

      </div>
    </div>
  );
};

export default ReplayCard;