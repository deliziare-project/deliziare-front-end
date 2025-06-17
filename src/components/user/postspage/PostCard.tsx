
// import React, { useState, useEffect, useCallback } from 'react';
// import { Calendar, Clock, MapPin, Utensils, Users, Pen } from 'lucide-react';
// import { Post } from '@/types/post';
// import EditPostModal from '@/components/ui/EditPostModal';
// import axiosInstance from '@/api/axiosInstance';
// import { editPostIs } from '@/services/postService';
// import ReplayModal from '@/components/ui/ReplayModal';
// import socket from '@/socket';
// import { markBidsAsRead } from '@/features/bidSlice';
// import { Replay } from '@/types/Replay';

// interface PostCardProps {
//   post: Post;
// }

// const PostCard: React.FC<PostCardProps> = ({ post }) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isReplayModalOpen, setIsReplayModalOpen] = useState(false);
//   const [editedPost, setEditedPost] = useState(post);
//   const [replays, setReplays] = useState<Replay[]>([]);
//   const [showBidCount, setShowBidCount] = useState(true);
//   const [hasUnreadBids, setHasUnreadBids] = useState(false);
//   const [refreshKey, setRefreshKey] = useState(0);
//   const [bidCount, setBidCount] = useState(0);

//   const unreadCount = replays.filter(bid => !bid.readByUser).length;

//   const fetchReplays = useCallback(async () => {
//     try {
//       const res = await axiosInstance.get('/bids/get-post-replay', {
//         params: { postId: editedPost._id },
//       });
//       setReplays(res.data);
//       setBidCount(res.data.length);
//     } catch (error) {
//       console.error('Error fetching replays:', error);
//     }
//   }, [editedPost._id]);
  

//   useEffect(() => {
//     console.log("Component mounted for post:", editedPost._id);
//     fetchReplays();
//   }, [editedPost._id]);

//   useEffect(() => {
//     const hasUnread = replays.some(bid => !bid.readByUser);
//     console.log('Checking unread bids:', hasUnread);
//     setHasUnreadBids(hasUnread);
//     setShowBidCount(hasUnread);
//   }, [replays]);

//   useEffect(() => {
//     const handleNewBid = (postId: string, bidId: string, message: string) => {
//       console.log('Socket: new_bid received:', postId, bidId, message);
//       if (postId === editedPost._id) {
//         setShowBidCount(true);
//         setHasUnreadBids(true);
//         const postElement = document.getElementById(`post-${post._id}`);
//         if (postElement) {
//           postElement.classList.add('animate-pulse');
//           setTimeout(() => postElement.classList.remove('animate-pulse'), 500);
//         }
//         fetchReplays();
//       } else {
//         console.log('Received bid for different post:', postId);
//       }
//     };
  
//     const handleBidUpdated = (postId: string, bidCount: string) => {
//       console.log('Socket: bid_updated received:', postId, bidCount);
//       if (postId === editedPost._id) {
//         setShowBidCount(true);
//       } else {
//         console.log('Bid update for different post:', postId);
//       }
//     };
  
//     socket?.on('new_bid', handleNewBid);
//     socket?.on('bid_updated', handleBidUpdated);
  
//     return () => {
//       socket?.off('new_bid', handleNewBid);
//       socket?.off('bid_updated', handleBidUpdated);
//     };
//   }, [editedPost._id]);
  
//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//     });
//   };

//   const handleEditClick = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     console.log('Edit icon clicked for post:', editedPost._id);
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     console.log('Edit modal closed');
//     setIsModalOpen(false);
//   };

//   const handleCloseReplayModal = async () => {
//     console.log('Replay modal closed');
//     setIsReplayModalOpen(false);
//     try {
//       await markBidsAsRead(editedPost._id);
//       console.log('Marked bids as read for post:', editedPost._id);
//       setReplays(prev => prev.map(bid => ({ ...bid, readByUser: true })));
//       setHasUnreadBids(false);
//       setShowBidCount(false);
//     } catch (err) {
//       console.error('Failed to mark bids as read:', err);
//     }
//   };

//   const handlePostEdit = async (updatedPost: Post) => {
//     const res = await editPostIs(updatedPost);
//     console.log('Post updated successfully:', res);
//     setEditedPost(updatedPost);
//   };

//   const isEditDisabled = () => {
//   const eventDate = new Date(editedPost.date); 
//   const now = new Date();
//   const msInDay = 24 * 60 * 60 * 1000;
//   const dayDiff = Math.floor((eventDate.getTime() - now.getTime()) / msInDay);

//   return dayDiff < 2;
// };


//   const handleViewReplay = async (id: any) => {
//     console.log('Viewing replays for post:', id._id);
//     try {
//       const res = await axiosInstance.get('/bids/get-post-replay', {
//         params: { postId: id._id },
//       });
//       console.log('Replay data:', res.data);
//       setReplays(res.data);
//       setIsReplayModalOpen(true);
//     } catch (error) {
//       console.error('Error viewing replays:', error);
//     }
//   };

//   const handleCardClick = () => {
//     console.log('Post card clicked:', editedPost._id);
//     setShowBidCount(false);
//     handleViewReplay(editedPost);
//   };

//   return (
//     <>
//       <div
//         id={`post-${post._id}`}
//         onClick={handleCardClick}
//         className="bg-white rounded-2xl cursor-pointer shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col relative group"
//       >
//         <div className="bg-gradient-to-r from-orange-50 to-white border-b border-gray-100 p-5 flex justify-between items-center">
//           <h2 className="text-2xl font-bold text-gray-800 truncate group-hover:text-orange-600 transition-colors duration-200">{editedPost.eventName}</h2>
//           <Pen
//             className={`h-5 w-5 transition-colors duration-200 ${
//               isEditDisabled()
//                 ? 'text-gray-300 cursor-not-allowed'
//                 : 'text-gray-400 hover:text-orange-500 cursor-pointer'
//             }`}
//             onClick={(e) => {
//               if (!isEditDisabled()) handleEditClick(e);
//             }}
//           />
//         </div>

//         <div className="p-6 flex-grow flex flex-col justify-between bg-gradient-to-b from-white to-orange-50">
//           <div className="space-y-5">
//             <div className="flex items-start gap-3">
//               <MapPin className="h-5 w-5 text-orange-500 mt-0.5" />
//               <div>
//                 <p className="font-semibold text-gray-800">{editedPost.district}</p>
//                 <p className="text-xs text-gray-500">
//                   Lat: {editedPost.location.lat.toFixed(4)}, Lng: {editedPost.location.lng.toFixed(4)}
//                 </p>
//               </div>
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//               <div className="flex items-center gap-2">
//                 <Calendar className="h-5 w-5 text-orange-500" />
//                 <span className="text-gray-700 font-medium">{editedPost.date}</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Clock className="h-5 w-5 text-orange-500" />
//                 <span className="text-gray-700 font-medium">{editedPost.time}</span>
//               </div>
//             </div>
//             <div className="flex items-center gap-2">
//               <Users className="h-5 w-5 text-orange-500" />
//               <span className="text-gray-700">
//                 Food for <span className="font-semibold text-orange-600">{editedPost.quantity} people</span>
//               </span>
//             </div>
//             <div>
//               <div className="flex items-center gap-2 mb-2">
//                 <Utensils className="h-5 w-5 text-orange-500" />
//                 <span className="font-semibold text-gray-800">Menu</span>
//               </div>
//               <div className="flex flex-wrap gap-2">
//                 {editedPost.menu.map((item, index) => (
//                   <span
//                     key={index}
//                     className="bg-orange-100 text-orange-700 text-xs px-3 py-1 rounded-full border border-orange-200 shadow-sm"
//                   >
//                     {item}
//                   </span>
//                 ))}
//               </div>
//             </div>
//             <p className="text-gray-600 line-clamp-3 mt-2 text-sm">{editedPost.description}</p>
//           </div>

//           <div className="mt-6 pt-4 border-t cursor-pointer border-gray-100 text-xs text-gray-500 flex justify-between items-center">
//             <span>Posted on: <span className="font-medium text-gray-700">{formatDate(editedPost.createdAt)}</span></span>
//             {unreadCount > 0 && showBidCount && (
//               <div
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleViewReplay(editedPost);
//                   setShowBidCount(false);
//                 }}
//                 className="cursor-pointer"
//               >
//                 <span className="flex items-center justify-center w-7 h-7 rounded-full bg-orange-500 text-white text-xs font-bold shadow-lg border-2 border-white">
//                   {unreadCount}
//                 </span>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {isModalOpen && (
//         <EditPostModal post={editedPost} onClose={handleCloseModal} onSave={handlePostEdit} />
//       )}

//       <ReplayModal
//         isOpen={isReplayModalOpen}
//         onClose={handleCloseReplayModal}
//         replays={replays}
//       />
//     </>
//   );

// };

// export default PostCard;



// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import { Calendar, Clock, MapPin, Utensils, Users, Pen } from 'lucide-react';
// import axiosInstance from '@/api/axiosInstance';
// import { Post } from '@/types/post';
// import { Replay } from '@/types/Replay';
// import socket from '@/socket';
// import { markBidsAsRead } from '@/features/bidSlice';
// import EditPostModal from '@/components/ui/EditPostModal';
// import ReplayModal from '@/components/ui/ReplayModal';
// import { editPostIs } from '@/services/postService';
// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch, RootState } from '@/redux/store';
// import { addNotification } from '@/features/notificationSlice';

// interface PostCardProps {
//   post: Post;
// }

// const PostCard: React.FC<PostCardProps> = ({ post }) => {
//   const [editedPost, setEditedPost] = useState(post);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isReplayModalOpen, setIsReplayModalOpen] = useState(false);
//   const [replays, setReplays] = useState<Replay[]>([]);
//   //const [hasUnreadBids, setHasUnreadBids] = useState(false);
//   const [showBidCount, setShowBidCount] = useState(true);

//   const unreadCount = replays.filter((bid) => !bid.readByUser).length;

//   const userId = useSelector((state: RootState) => state.auth.currentUser?._id);
//   const { notifications, loading } = useSelector((state: RootState) => state.notifications);
//   const dispatch = useDispatch<AppDispatch>();
  


//   const fetchReplays = useCallback(async () => {
//     try {
//       const res = await axiosInstance.get('/bids/get-post-replay', {
//         params: { postId: editedPost._id },
//       });
//       setReplays(res.data);
//     } catch (error) {
//       console.error('Error fetching replays:', error);
//     }
//   }, [editedPost._id]);

//   useEffect(() => {
//     fetchReplays();
//   }, [fetchReplays]);

//   useEffect(() => {
//     if (!userId) return;

//     const onConnect = () => {
//       socket.emit('register', userId);
//     };

//     if (socket.connected) {
//       onConnect();
//     } else {
//       socket.connect();
//       socket.once('connect', onConnect);
//     }

//     const handleNewNotification = (notification: any) => {
//       dispatch(addNotification(notification));
//     };

//     socket.on('new_notification', handleNewNotification);

//     return () => {
//       socket.off('new_notification', handleNewNotification);
//       socket.off('connect', onConnect);
//     };
//   }, [userId, dispatch]);

//   // useEffect(() => {
//   //   setHasUnreadBids(unreadCount > 0);
//   //   setShowBidCount(unreadCount > 0);
//   // }, [unreadCount]);

//   useEffect(() => {
//     const handleNewBid = (postId: string) => {
//       if (postId === editedPost._id) {
//         setShowBidCount(true);
//         //setHasUnreadBids(true);
//         fetchReplays();

//         const postElement = document.getElementById(`post-${editedPost._id}`);
//         if (postElement) {
//           postElement.classList.add('animate-pulse');
//           setTimeout(() => postElement.classList.remove('animate-pulse'), 500);
//         }
//       }
//     };

//     const handleBidUpdated = (postId: string) => {
//       if (postId === editedPost._id) {
//         fetchReplays();
//         setShowBidCount(true);
//       }
//     };

//     socket?.on('new_bid', handleNewBid);
//     socket?.on('bid_updated', handleBidUpdated);

//     return () => {
//       socket?.off('new_bid', handleNewBid);
//       socket?.off('bid_updated', handleBidUpdated);
//     };
//   }, [editedPost._id, fetchReplays]);

//   const handleEditClick = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (!isEditDisabled()) {
//       setIsModalOpen(true);
//     }
//   };

//   const handleCloseModal = () => setIsModalOpen(false);

//   const handlePostEdit = async (updatedPost: Post) => {
//     const res = await editPostIs(updatedPost);
//     setEditedPost(updatedPost);
//   };

//   const handleCardClick = () => {
//     setShowBidCount(false);
//     handleViewReplay();
//   };

//   const handleViewReplay = async () => {
//     await fetchReplays();
//     setIsReplayModalOpen(true);
//   };

//   const handleCloseReplayModal = async () => {
//     try {
//       await dispatch(markBidsAsRead(editedPost._id));
//       setReplays((prev) => prev.map((bid) => ({ ...bid, readByUser: true })));
//       //setHasUnreadBids(false);
//       setShowBidCount(false);
//     } catch (error) {
//       console.error('Failed to mark bids as read:', error);
//     } finally {
//       setIsReplayModalOpen(false);
//     }
//   };

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//     });
//   };

//   const isEditDisabled = () => {
//     const eventDate = new Date(editedPost.date);
//     const now = new Date();
//     return (eventDate.getTime() - now.getTime()) / (1000 * 3600 * 24) < 2;
//   };

//   return (
//     <>
//       <div
//         id={`post-${editedPost._id}`}
//         onClick={handleCardClick}
//         className="bg-white rounded-2xl cursor-pointer shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col relative group"
//       >
//         <div className="bg-gradient-to-r from-orange-50 to-white border-b border-gray-100 p-5 flex justify-between items-center">
//           <h2 className="text-2xl font-bold text-gray-800 truncate group-hover:text-orange-600 transition-colors duration-200">
//             {editedPost.eventName}
//           </h2>
//           <Pen
//             className={`h-5 w-5 transition-colors duration-200 ${
//               isEditDisabled()
//                 ? 'text-gray-300 cursor-not-allowed'
//                 : 'text-gray-400 hover:text-orange-500 cursor-pointer'
//             }`}
//             onClick={handleEditClick}
//           />
//         </div>

//         <div className="p-6 flex-grow flex flex-col justify-between bg-gradient-to-b from-white to-orange-50">
//           <div className="space-y-5">
//             <div className="flex items-start gap-3">
//               <MapPin className="h-5 w-5 text-orange-500 mt-0.5" />
//               <div>
//                 <p className="font-semibold text-gray-800">{editedPost.district}</p>
//                 <p className="text-xs text-gray-500">
//                   Lat: {editedPost.location.lat.toFixed(4)}, Lng: {editedPost.location.lng.toFixed(4)}
//                 </p>
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div className="flex items-center gap-2">
//                 <Calendar className="h-5 w-5 text-orange-500" />
//                 <span className="text-gray-700 font-medium">{editedPost.date}</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Clock className="h-5 w-5 text-orange-500" />
//                 <span className="text-gray-700 font-medium">{editedPost.time}</span>
//               </div>
//             </div>

//             <div className="flex items-center gap-2">
//               <Users className="h-5 w-5 text-orange-500" />
//               <span className="text-gray-700">
//                 Food for <span className="font-semibold text-orange-600">{editedPost.quantity} people</span>
//               </span>
//             </div>

//             <div>
//               <div className="flex items-center gap-2 mb-2">
//                 <Utensils className="h-5 w-5 text-orange-500" />
//                 <span className="font-semibold text-gray-800">Menu</span>
//               </div>
//               <div className="flex flex-wrap gap-2">
//                 {editedPost.menu.map((item, idx) => (
//                   <span
//                     key={idx}
//                     className="bg-orange-100 text-orange-700 text-xs px-3 py-1 rounded-full border border-orange-200 shadow-sm"
//                   >
//                     {item}
//                   </span>
//                 ))}
//               </div>
//             </div>

//             <p className="text-gray-600 line-clamp-3 mt-2 text-sm">{editedPost.description}</p>
//           </div>

//           <div className="mt-6 pt-4 border-t text-xs text-gray-500 flex justify-between items-center">
//             <span>
//               Posted on: <span className="font-medium text-gray-700">{formatDate(editedPost.createdAt)}</span>
//             </span>
//             {unreadCount > 0 && showBidCount && (
//               <div
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleViewReplay();
//                 }}
//                 className="cursor-pointer"
//               >
//                 <span className="flex items-center justify-center w-7 h-7 rounded-full bg-orange-500 text-white text-xs font-bold shadow-lg border-2 border-white">
//                   {unreadCount}
//                 </span>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {isModalOpen && (
//         <EditPostModal
//           post={editedPost}
//           onClose={handleCloseModal}
//           onSave={handlePostEdit}
//         />
//       )}

//       <ReplayModal
//         isOpen={isReplayModalOpen}
//         onClose={handleCloseReplayModal}
//         replays={replays}
//       />
//     </>
//   );
// };

// export default PostCard;


import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Calendar, Clock, MapPin, Utensils, Users, Pen } from 'lucide-react';
import axiosInstance from '@/api/axiosInstance';
import { Post } from '@/types/post';
import { Replay } from '@/types/Replay';
import socket from '@/socket';
import { markBidsAsRead } from '@/features/bidSlice';
import EditPostModal from '@/components/ui/EditPostModal';
import ReplayModal from '@/components/ui/ReplayModal';
import { editPostIs } from '@/services/postService';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { addNotification } from '@/features/notificationSlice';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [editedPost, setEditedPost] = useState(post);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReplayModalOpen, setIsReplayModalOpen] = useState(false);
  const [replays, setReplays] = useState<Replay[]>([]);
  const [showBidCount, setShowBidCount] = useState(true);

  const userId = useSelector((state: RootState) => state.auth.currentUser?._id);
  const { notifications, loading } = useSelector((state: RootState) => state.notifications);
  const dispatch = useDispatch<AppDispatch>();

  // Use readByPostOwner for unreadCount
  const unreadCount = useMemo(() => replays.filter((bid) => !bid.readByPostOwner).length, [replays]);

  const fetchReplays = useCallback(async () => {
    try {
      const res = await axiosInstance.get('/bids/get-post-replay', {
        params: { postId: editedPost._id },
      });
      console.log('Fetched replays:', res.data); // Debug log
      setReplays(res.data);
    } catch (error) {
      console.error('Error fetching replays:', error);
    }
  }, [editedPost._id]);

  useEffect(() => {
    fetchReplays();
  }, [fetchReplays]);

  useEffect(() => {
    if (!userId) return;

    const onConnect = () => {
      socket.emit('register', userId);
    };

    if (socket.connected) {
      onConnect();
    } else {
      socket.connect();
      socket.once('connect', onConnect);
    }

    const handleNewNotification = (notification: any) => {
      dispatch(addNotification(notification));
    };

    socket.on('new_notification', handleNewNotification);

    return () => {
      socket.off('new_notification', handleNewNotification);
      socket.off('connect', onConnect);
    };
  }, [userId, dispatch]);

  useEffect(() => {
    const handleNewBid = (postId: string) => {
      if (postId === editedPost._id) {
        setShowBidCount(true);
        fetchReplays();

        const postElement = document.getElementById(`post-${editedPost._id}`);
        if (postElement) {
          postElement.classList.add('animate-pulse');
          setTimeout(() => postElement.classList.remove('animate-pulse'), 500);
        }
      }
    };

    const handleBidUpdated = (postId: string) => {
      if (postId === editedPost._id) {
        fetchReplays();
        setShowBidCount(true);
      }
    };

    socket?.on('new_bid', handleNewBid);
    socket?.on('bid_updated', handleBidUpdated);

    return () => {
      socket?.off('new_bid', handleNewBid);
      socket?.off('bid_updated', handleBidUpdated);
    };
  }, [editedPost._id, fetchReplays]);

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isEditDisabled()) {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handlePostEdit = async (updatedPost: Post) => {
    const res = await editPostIs(updatedPost);
    setEditedPost(updatedPost);
  };

  const handleCardClick = () => {
    setShowBidCount(false);
    handleViewReplay();
  };

  const handleViewReplay = async () => {
    await fetchReplays();
    setIsReplayModalOpen(true);
  };

  const handleCloseReplayModal = async () => {
    try {
      const result = await dispatch(markBidsAsRead(editedPost._id)).unwrap();
      console.log('markBidsAsRead result:', result); // Debug log
      await fetchReplays(); // Refetch to sync with server
      setShowBidCount(false);
    } catch (error) {
      console.error('Failed to mark bids as read:', error);
    } finally {
      setIsReplayModalOpen(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isEditDisabled = () => {
    const eventDate = new Date(editedPost.date);
    const now = new Date();
    return (eventDate.getTime() - now.getTime()) / (1000 * 3600 * 24) < 2;
  };

  return (
    <>
      <div
        id={`post-${editedPost._id}`}
        onClick={handleCardClick}
        className="bg-white rounded-2xl cursor-pointer shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col relative group"
      >
        <div className="bg-gradient-to-r from-orange-50 to-white border-b border-gray-100 p-5 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800 truncate group-hover:text-orange-600 transition-colors duration-200">
            {editedPost.eventName}
          </h2>
          <Pen
            className={`h-5 w-5 transition-colors duration-200 ${
              isEditDisabled()
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-400 hover:text-orange-500 cursor-pointer'
            }`}
            onClick={handleEditClick}
          />
        </div>

        <div className="p-6 flex-grow flex flex-col justify-between bg-gradient-to-b from-white to-orange-50">
          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-orange-500 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-800">{editedPost.district}</p>
                <p className="text-xs text-gray-500">
                  Lat: {editedPost.location.lat.toFixed(4)}, Lng: {editedPost.location.lng.toFixed(4)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-orange-500" />
                <span className="text-gray-700 font-medium">{editedPost.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-500" />
                <span className="text-gray-700 font-medium">{editedPost.time}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-orange-500" />
              <span className="text-gray-700">
                Food for <span className="font-semibold text-orange-600">{editedPost.quantity} people</span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Utensils className="h-5 w-5 text-orange-500" />
                <span className="font-semibold text-gray-800">Menu</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {editedPost.menu.map((item, idx) => (
                  <span
                    key={idx}
                    className="bg-orange-100 text-orange-700 text-xs px-3 py-1 rounded-full border border-orange-200 shadow-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-gray-600 line-clamp-3 mt-2 text-sm">{editedPost.description}</p>
          </div>

          <div className="mt-6 pt-4 border-t text-xs text-gray-500 flex justify-between items-center">
            <span>
              Posted on: <span className="font-medium text-gray-700">{formatDate(editedPost.createdAt)}</span>
            </span>
            {unreadCount > 0 && showBidCount && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewReplay();
                }}
                className="cursor-pointer"
              >
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-orange-500 text-white text-xs font-bold shadow-lg border-2 border-white">
                  {unreadCount}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <EditPostModal
          post={editedPost}
          onClose={handleCloseModal}
          onSave={handlePostEdit}
        />
      )}

      <ReplayModal
        isOpen={isReplayModalOpen}
        onClose={handleCloseReplayModal}
        replays={replays}
      />
    </>
  );
};

export default PostCard;