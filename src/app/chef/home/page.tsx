// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useRouter } from 'next/navigation';
// import { ChefHat, Calendar, Clock, Loader, ChevronRight, MapPin } from 'lucide-react';
// import { fetchChefDistrictPosts } from '@/features/userPostSlice';
// import { AppDispatch, RootState } from '@/redux/store';
// import AuthWrapper from '@/components/AuthWrapper';
// import SearchBar from '@/components/shared/SearchBar';
// import Pagination from '@/components/admin/userManagement/Pagination';

// const page = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { posts, loading, error } = useSelector((state: RootState) => state.userPosts);
//   const router = useRouter();

//   const [currentPage, setCurrentPage] = useState(1);
//   const postsPerPage = 4;
//   const [searchTerm, setSearchTerm] = useState("");

//   const filteredPosts = posts
//     .filter((post) => post.status === 'pending')
//     .filter((post) =>
//       post.eventName.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//   useEffect(() => {
//     dispatch(fetchChefDistrictPosts());
//   }, [dispatch]);

//   const handleDetails = (postId: string) => {
//     router.push(`/chef/postDetails/${postId}`);
//   };

//   const reversedPosts = [...filteredPosts].reverse();
//   const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
//   const indexOfLastPost = currentPage * postsPerPage;
//   const indexOfFirstPost = indexOfLastPost - postsPerPage;
//   const currentPosts = reversedPosts.slice(indexOfFirstPost, indexOfLastPost);

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[400px]">
//         <Loader className="h-12 w-12 text-[#C26E4B] animate-spin" />
//         <p className="mt-4 text-[#8E472A] font-medium">
//           Loading available opportunities...
//         </p>
//       </div>
//     );
//   }

//   return (
//     <AuthWrapper routeType='private'>
//       <div className="min-h-screen bg-gradient-to-b from-[#FFF9F5] to-[#9b8f85]">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           {/* Header Section */}
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
//             <div className="flex items-center">
//               <div className="p-3 rounded-full bg-[#FFF0E8] shadow-inner">
//                 <ChefHat size={28} className="text-[#C26E4B]" />
//               </div>
//               <h1 className="ml-3 text-3xl font-serif font-bold text-[#5A2D1A]">
//                 Culinary Opportunities
//               </h1>
//             </div>
            
//             <div className="w-full md:w-auto">
//               <SearchBar
//                 value={searchTerm}
//                 onChange={setSearchTerm}
//                 placeholder="Search by event name..."
//                />
//             </div>
//           </div>

//           {/* Content Section */}
//           {posts.length === 0 ? (
//             <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-[#F0E0D8] max-w-2xl mx-auto">
//               <div className="bg-[#FFF5F0] rounded-full p-4 inline-block mb-4">
//                 <Calendar size={48} className="text-[#D79275] mx-auto" />
//               </div>
//               <h3 className="text-2xl font-serif font-medium text-[#5A2D1A] mb-3">
//                 No Events Found
//               </h3>
//               <p className="text-[#7D6B64] font-sans max-w-md mx-auto">
//                 There are no culinary opportunities in your district at the moment. Please check back later.
//               </p>
//             </div>
//           ) : (
//             <>
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//                 {currentPosts.map((post) => (
//                   <div
//                     key={post._id}
//                     className="bg-white rounded-xl p-6 border border-[#F5E5DC] hover:border-[#C26E4B]
//                     shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
//                   >
//                     {/* Post Header */}
//                     <div className="flex items-center justify-between mb-4">
//                       <div className="flex items-center">
//                         {post.userId?.profileImage ? (
//                           <img
//                             src={post.userId.profileImage}
//                             alt={post.userId?.name}
//                             className="w-12 h-12 rounded-full object-cover mr-3 border-2 border-[#F5E5DC]"
//                           />
//                         ) : (
//                           <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#F5E5DC] to-[#F8D9C8] text-[#5A2D1A] flex items-center justify-center font-semibold mr-3 border border-[#F5E5DC]">
//                             {post.userId?.name?.[0]?.toUpperCase() || 'U'}
//                           </div>
//                         )}
//                         <div>
//                           <h4 className="text-base font-semibold text-[#5A2D1A]">{post.userId?.name}</h4>
//                           <p className="text-xs text-[#9C8378]">
//                             Posted on {new Date(post.createdAt).toLocaleDateString('en-GB', {
//                               day: '2-digit',
//                               month: 'short',
//                               year: 'numeric',
//                             })}
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Post Body */}
//                     <div className="mb-4">
//                       <h3 className="text-xl font-serif font-semibold text-[#8E472A] mb-3">
//                         {post.eventName}
//                       </h3>

//                       <div className="space-y-3 mb-4 text-[#7D6B64]">
//                         <div className="flex items-center">
//                           <div className="bg-[#FFF0E8] p-2 rounded-full mr-3">
//                             <Calendar size={16} className="text-[#C26E4B]" />
//                           </div>
//                           <span className="font-medium">
//                             {new Date(post.date).toLocaleDateString('en-GB', {
//                               weekday: 'short',
//                               day: '2-digit',
//                               month: 'short',
//                               year: 'numeric',
//                             })}
//                           </span>
//                         </div>
//                         <div className="flex items-center">
//                           <div className="bg-[#FFF0E8] p-2 rounded-full mr-3">
//                             <Clock size={16} className="text-[#C26E4B]" />
//                           </div>
//                           <span className="font-medium">
//                             {new Date(`1970-01-01T${post.time}`).toLocaleTimeString('en-US', {
//                               hour: 'numeric',
//                               minute: '2-digit',
//                               hour12: true,
//                             })}
//                           </span>
//                         </div>
//                         {post.district && (
//                           <div className="flex items-center">
//                             <div className="bg-[#FFF0E8] p-2 rounded-full mr-3">
//                               <MapPin size={16} className="text-[#C26E4B]" />
//                             </div>
//                             <span className="font-medium">{post.district}</span>
//                           </div>
//                         )}
//                       </div>

//                       {post.description && (
//                         <p className="text-sm text-[#7D6B64] mb-4 line-clamp-3">
//                           {post.description}
//                         </p>
//                       )}
//                     </div>

//                     {/* Post Footer */}
//                     <div className="flex c justify-between items-center pt-4 border-t border-[#F5E5DC]">
//                       <button
//                         onClick={() => handleDetails(post._id)}
//                         className="flex cursor-pointer items-center text-[#C26E4B] hover:text-[#8E472A] font-medium transition-colors group"
//                       >
//                         <span className="mr-2 group-hover:underline">View Details</span>
//                         <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {totalPages > 1 && (
//                 <div className="mt-8 flex justify-center">
//                   <Pagination
//                     currentPage={currentPage}
//                     totalPages={totalPages}
//                     onPageChange={setCurrentPage}
//                     // activeColor="#C26E4B"
//                     // inactiveColor="#E8D5CC"
//                   />
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>
//     </AuthWrapper>
//   );
// };

// export default page;


'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { ChefHat, Calendar, Clock, Loader2, ChevronRight, MapPin, Search, Sparkles, Star } from 'lucide-react';
import { fetchChefDistrictPosts } from '@/features/userPostSlice';
import { AppDispatch, RootState } from '@/redux/store';
import AuthWrapper from '@/components/AuthWrapper';
import Pagination from '@/components/admin/userManagement/Pagination';

const OpportunitiesPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, loading } = useSelector((state: RootState) => state.userPosts);
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 4;
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const filteredPosts = posts
    .filter((post) => post.status === 'pending')
    .filter((post) =>
      post.eventName.toLowerCase().includes(searchTerm.toLowerCase())
    );

  useEffect(() => {
    dispatch(fetchChefDistrictPosts());
  }, [dispatch]);

  const handleDetails = (postId: string) => {
    router.push(`/chef/postDetails/${postId}`);
  };

  const reversedPosts = [...filteredPosts].reverse();
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = reversedPosts.slice(indexOfFirstPost, indexOfLastPost);

  

  return (
    <AuthWrapper routeType='private'>
      <div className="min-h-screen ">
        {/* Decorative background elements */}
        {/* <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-amber-200/20 to-orange-200/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-yellow-200/20 to-amber-200/20 rounded-full blur-3xl"></div>
        </div> */}

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-r from-[#e3a587] to-[#5A2D1A] shadow-xl mb-6 transform hover:scale-105 transition-transform duration-300">
              <ChefHat size={32} className="text-white" />
            </div>
            <h1 className="text-3xl md:text-3xl font-bold  mb-4 text-[#8f4526] bg-clip-text ">
              Culinary Opportunities
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Discover extraordinary culinary experiences and showcase your talents at exclusive events
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-brown-400 h-5 w-5 group-focus-within:text-brown-600 transition-colors" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search culinary events..."
                  className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border-2 border-[#F0E0D8] rounded-2xl text-gray-900 placeholder-[#5A2D1A] focus:outline-none focus:border-[#F0E0D8] focus:bg-white transition-all duration-300 shadow-lg hover:shadow-xl"
                />
              </div>
            </div>
          </div>

          

          {/* Content */}
          {filteredPosts.length === 0 ? (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 text-center shadow-2xl border border-[#F0E0D8]">
                <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-full p-8 inline-block mb-6">
                  <Calendar size={48} className="text-amber-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  No Events Available
                </h3>
                <p className="text-gray-600 leading-relaxed max-w-md mx-auto mb-6">
                  There are currently no culinary opportunities in your district. 
                  New events are added regularly, so please check back soon.
                </p>
                
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {currentPosts.map((post, index) => (
                  <div
                    key={post._id}
                    className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-[#F0E0D8] 
                    hover:bg-white hover:border-[#F0E0D8] hover:shadow-2xl 
                    transition-all duration-500 transform hover:-translate-y-2 
                    shadow-lg hover:[#F0E0D8]"
                    style={{
                      animationDelay: `${index * 100}ms`
                    }}
                  >
                    {/* Post Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                      {post.userId?.profileImage ? (
                        <div className="relative">
                          <img
                            src={post.userId.profileImage}
                            alt={post.userId?.name}
                            className="w-14 h-14 rounded-2xl object-cover shadow-lg"
                          />
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#e3a587] to-[#5A2D1A] text-white flex items-center justify-center font-bold text-lg shadow-lg">
                          {post.userId?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      )}

                        <div className="ml-4">
                          <h4 className="text-lg font-semibold text-gray-900">{post.userId?.name}</h4>
                          <p className="text-sm text-[#964e2f] font-medium">
                            Posted {new Date(post.createdAt).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Post Content */}
                    <div className="mb-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-6 leading-tight">
                        {post.eventName}
                      </h3>

                      <div className="space-y-4 mb-6">
                        <div className="flex items-center group/item">
                          <div className=" p-3 rounded-xl mr-4  transition-shadow">
                            <Calendar size={18} className="text-[#5A2D1A]" />
                          </div>
                          <div>
                            <p className="text-sm text-amber-600 font-medium">Event Date</p>
                            <p className="font-semibold text-gray-900">
                              {new Date(post.date).toLocaleDateString('en-GB', {
                                weekday: 'long',
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric',
                              })}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center group/item">
                          <div className="bg-gradient-to-r p-3 rounded-xl mr-4  transition-shadow">
                            <Clock size={18} className="text-[#5A2D1A]" />
                          </div>
                          <div>
                            <p className="text-sm text-amber-600 font-medium">Start Time</p>
                            <p className="font-semibold text-gray-900">
                              {new Date(`1970-01-01T${post.time}`).toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true,
                              })}
                            </p>
                          </div>
                        </div>
                        
                        {post.district && (
                          <div className="flex items-center group/item">
                            <div className=" p-3 rounded-xl mr-4  transition-shadow">
                              <MapPin size={18} className="text-[#5A2D1A]" />
                            </div>
                            <div>
                              <p className="text-sm text-amber-600 font-medium">Location</p>
                              <p className="font-semibold text-gray-900">{post.district}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {post.description && (
                        
                          <p className="text-gray-700 leading-relaxed">
                            {post.description}
                          </p>
                        
                      )}
                    </div>

                    {/* Post Footer */}
                    <div className="pt-6 border-t border-[#F0E0D8]">
                      <button
                        onClick={() => handleDetails(post._id)}
                        className="group/btn w-full bg-[#b45932] hover:bg-[#5A2D1A]
                        text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 
                        transform hover:scale-105 hover:shadow-xl 
                        flex items-center justify-center"
                      >
                        <span className="mr-2">View Opportunity Details</span>
                        <ChevronRight size={20} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-amber-200/50">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                      isLoading={isLoading}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AuthWrapper>
  );
};

export default OpportunitiesPage;