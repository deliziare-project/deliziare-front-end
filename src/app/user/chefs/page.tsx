// 'use client';

// import { useEffect, useState } from 'react';
// import axiosInstance from '@/api/axiosInstance';
// import { Bookmark, MessageCircle, MoreHorizontal, Reply} from 'lucide-react';

// // import Pagination from '@/components/admin/userManagement/pagination';
// import toast from 'react-hot-toast';

// import { Skeleton } from '@/components/loaders/Skeleton';

// import Pagination from '@/components/admin/userManagement/Pagination';

// import Link from 'next/link';

// import AuthWrapper from '@/components/AuthWrapper';
// import { useDispatch, useSelector } from 'react-redux';
// import { openChat, replayChat } from '@/features/chatSlice';
// import { RootState } from '@/redux/store';

// interface ChefPost {
//   _id: string;
//   title: string;
//   description: string;
//   tags?: string[];
//   images?: {
//     url: string;
//     altText?: string;
//   }[];
//   chefId?: {
//     name: string;
//     username?: string;
//     profileImage?: string;
//     district?: string;
//     _id: string;
//   };
//   createdAt: string;
// }

// const HostViewChefPosts = () => {
//   const [posts, setPosts] = useState<ChefPost[]>([]);
//   console.log(posts);

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [savedPosts, setSavedPosts] = useState<string[]>([]);
//   const [currentPage, setCurrentPage] = useState(1);
// const dispatch=useDispatch()
//   const postsPerPage = 4;

//   useEffect(() => {
//     const fetchChefPosts = async () => {
//       try {
//         setLoading(true);
//         const res = await axiosInstance.get('/chefs/all');
//         setPosts(res.data);
//       } catch (err) {
//         console.error('Error fetching chef posts:', err);
//         setError('Failed to load chef posts');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchChefPosts();
//   }, []);

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return new Intl.DateTimeFormat('en-US', {
//       month: 'short',
//       day: 'numeric',
//     }).format(date);
//   };

//   // const toggleSavePost = (postId: string) => {
//   //   setSavedPosts(prev =>
//   //     prev.includes(postId)
//   //       ? prev.filter(id => id !== postId)
//   //       : [...prev, postId]
//   //   );
//   // };
//   const toggleSavePost = async (postId: string) => {
//   try {
//     const alreadySaved = savedPosts.includes(postId);
//     console.log('alread',alreadySaved);

//     // If already saved, optionally implement an unsave endpoint
//     if (!alreadySaved) {
//       await axiosInstance.post(`userclient/savedPost/${postId}`); // Call the backend to save the post
//       setSavedPosts(prev => [...prev, postId]);
//     } else {
//       // Optionally add un-save logic here
//       setSavedPosts(prev => prev.filter(id => id !== postId));
//       toast.success('Saved to favorites!');
//     }
//   } catch (error) {
//     console.error('Failed to save post:', error);
//   }
// };

// const handleReplay=(post:any)=>{
// dispatch(replayChat(post))
// dispatch(openChat(post.chefId._id))

// }

//   if (loading)
//     return (
//       <div className="max-w-4xl mx-auto px-4 py-8">
//         <Skeleton />
//       </div>
//     );

//   const totalPages = Math.ceil(posts.length / postsPerPage);
//   const indexOfLastPost = currentPage * postsPerPage;
//   const indexOfFirstPost = indexOfLastPost - postsPerPage;
//   const currentPosts = [...posts].reverse().slice(indexOfFirstPost, indexOfLastPost);

//   if (loading) return <div className="flex justify-center items-center h-screen">Loading posts...</div>;

//   if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
//   if (posts.length === 0) return <div className="text-center py-8">No posts found</div>;

//   return (
//     <AuthWrapper routeType='private'>
//   <div className=" flex flex-col max-w-6xl mx-auto px-4 py-8">
//     {/* Post Grid */}
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
//       {currentPosts.map((post) => (
//         <div key={post._id} className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">

//           <div className="flex items-center justify-between p-4 border-b border-gray-100">
//             <div className="flex items-center space-x-3">
//               <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-300">
//               <Link href={`/profiles/chefProfile/${post.chefId?._id}`} className="w-10 h-10 rounded-full overflow-hidden border border-gray-300 block">
//                 <img
//                   src={post.chefId?.profileImage || '/default-profile.png'}
//                   alt={post.chefId?.name}
//                   className="w-full h-full object-cover"
//                 />
//               </Link>

//               </div>
//               <div>
//                 <p className="font-semibold text-sm">{post.chefId?.username || post.chefId?.name}</p>
//                 <p className="text-gray-500 text-xs">{post.chefId?.district}</p>
//               </div>
//             </div>

//           </div>

//           {post.images?.length ? (
//             <img
//               src={post.images[0].url}
//               alt={post.images[0].altText || post.title}
//               className="w-full h-64 object-cover"
//             />
//           ) : (
//             <div className="w-full h-64 bg-gray-100 flex items-center justify-center text-gray-500">
//               No image
//             </div>
//           )}

//           {/* Post Details */}
//           <div className="p-4 space-y-2">
//             <p className="text-sm">
//               <span className="font-semibold mr-2">{post.title}</span>
//               {post.description}
//             </p>

//             {post.tags?.length ? (
//               <div className="flex flex-wrap gap-2 mt-1">
//                 {post.tags.map((tag, idx) => (
//                   <span
//                     key={idx}
//                     className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full"
//                   >
//                     #{tag}
//                   </span>
//                 ))}
//               </div>
//             ) : null}

//             <p className="text-gray-400 text-xs">{formatDate(post.createdAt)}</p>
//           </div>

// <div className="flex justify-between items-center px-4 pb-4">

//   <button className="flex cursor-pointer items-center text-gray-600 hover:text-black" onClick={()=>handleReplay(post)}>
//     <Reply size={20} className="mr-1" />
//     <span className="text-sm">Reply</span>
//   </button>

//   <button className='cursor-pointer' onClick={() => toggleSavePost(post._id)}>
//     <Bookmark
//       className={savedPosts.includes(post._id) ? 'text-black fill-current' : 'text-gray-600'}
//       size={20}
//     />
//   </button>
// </div>

//         </div>
//       ))}
//     </div>

//     {/* Pagination */}
//     {totalPages > 1 && (
//       <div className="mt-10 flex justify-center">
//         <Pagination
//           currentPage={currentPage}
//           totalPages={totalPages}
//           onPageChange={setCurrentPage}
//         />
//       </div>
//     )}
//   </div>
//   </AuthWrapper>
// );

// };

// export default HostViewChefPosts;
"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/api/axiosInstance";
import {
  Bookmark,
  MessageCircle,
  MoreHorizontal,
  Reply,
  ChefHat,
  MapPin,
  Calendar,
  Heart,
  Star,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/loaders/Skeleton";
import Pagination from "@/components/admin/userManagement/Pagination";
import Link from "next/link";
import AuthWrapper from "@/components/AuthWrapper";
import { useDispatch, useSelector } from "react-redux";
import { openChat, replayChat } from "@/features/chatSlice";
import { RootState } from "@/redux/store";

interface ChefPost {
  _id: string;
  title: string;
  description: string;
  tags?: string[];
  images?: {
    url: string;
    altText?: string;
  }[];
  chefId?: {
    name: string;
    username?: string;
    profileImage?: string;
    district?: string;
    _id: string;
  };
  createdAt: string;
}

const HostViewChefPosts = () => {
  const [posts, setPosts] = useState<ChefPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savedPosts, setSavedPosts] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const postsPerPage = 4;

  useEffect(() => {
    const fetchChefPosts = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/chefs/all");
        setPosts(res.data);
      } catch (err) {
        console.error("Error fetching chef posts:", err);
        setError("Failed to load chef posts");
      } finally {
        setLoading(false);
      }
    };

    fetchChefPosts();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const toggleSavePost = async (postId: string) => {
    try {
      const alreadySaved = savedPosts.includes(postId);
      if (!alreadySaved) {
        await axiosInstance.post(`userclient/savedPost/${postId}`);
        setSavedPosts((prev) => [...prev, postId]);
        toast.success("Saved to favorites!");
      } else {
        setSavedPosts((prev) => prev.filter((id) => id !== postId));
        toast.success("Removed from favorites!");
      }
    } catch (error) {
      console.error("Failed to save post:", error);
      toast.error("Failed to save post");
    }
  };

  const handleReplay = (post: any) => {
    dispatch(replayChat(post));
    dispatch(openChat(post.chefId._id));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <Skeleton />
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(posts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = [...posts]
    .reverse()
    .slice(indexOfFirstPost, indexOfLastPost);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center py-12 text-gray-700 bg-white shadow-sm px-12 rounded-xl border border-gray-200">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-50 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 bg-red-100 rounded-full"></div>
          </div>
          <p className="text-lg font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center py-12 text-gray-600 bg-white shadow-sm px-12 rounded-xl border border-gray-200">
          <ChefHat size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-lg font-medium">No culinary stories found</p>
        </div>
      </div>
    );
  }

  return (
    <AuthWrapper routeType="private">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        {/* Page Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 shadow-sm">
          
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentPosts.map((post) => (
              <div key={post._id} className="group">
                <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-gray-200 transform hover:-translate-y-1 backdrop-blur-sm">
                  
                  {/* Chef Profile Header */}
                  <div className="p-5 pb-3 bg-gradient-to-r from-slate-50 to-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Link
                          href={`/profiles/chefProfile/${post.chefId?._id}`}
                          className="relative group/avatar"
                        >
                          <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white shadow-sm group-hover/avatar:ring-emerald-200 transition-all duration-300">
                            <img
                              src={
                                post.chefId?.profileImage ||
                                "/default-profile.png"
                              }
                              alt={post.chefId?.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-[#16610E] rounded-full flex items-center justify-center shadow-sm">
                            <ChefHat size={10} className="text-white" />
                          </div>
                        </Link>
                        <div>
                          <h3 className="font-semibold text-gray-800 text-sm">
                            {post.chefId?.username || post.chefId?.name}
                          </h3>
                          <div className="flex items-center text-gray-500 text-xs mt-0.5 space-x-2">
                            <div className="flex items-center space-x-1">
                              <MapPin size={9} />
                              <span>{post.chefId?.district}</span>
                            </div>
                            <span>•</span>
                            <div className="flex items-center space-x-1">
                              <Clock size={9} />
                              <span>{formatDate(post.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Small Square Post Image */}
                  <div className="px-6 pb-4">
                    {post.images?.length ? (
                      <div className="w-70 h-40 mt-4 mx-auto rounded-xl overflow-hidden bg-gray-100 shadow-md">
                        <img
                          src={post.images[0].url}
                          alt={post.images[0].altText || post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="w-32 h-32 mx-auto bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center border border-gray-200 shadow-sm">
                        <div className="text-center space-y-2">
                          <ChefHat size={20} className="text-gray-400 mx-auto" />
                          <p className="text-gray-500 text-xs font-medium">
                            No Image
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Post Content */}
                  <div className="p-5">
                    <div className="space-y-3">
                      <div>
                        <h2 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 leading-tight">
                          {post.title}
                        </h2>
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                          {post.description}
                        </p>
                      </div>

                      {/* Tags */}
                      {post.tags?.length ? (
                        <div className="flex flex-wrap gap-1.5">
                          {post.tags.slice(0, 2).map((tag, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100"
                            >
                              #{tag}
                            </span>
                          ))}
                          {post.tags.length > 2 && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                              +{post.tags.length - 2}
                            </span>
                          )}
                        </div>
                      ) : null}

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <button
                          className="inline-flex items-center font-medium text-sm bg-gradient-to-r from-[#708A58] to-[#16610E] bg-clip-text text-transparent  "
                          onClick={() => handleReplay(post)}
                        >
                          <Reply size={14} className="mr-2 text-[#708A58]" />
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-16 flex justify-center">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthWrapper>
  );
};

export default HostViewChefPosts;