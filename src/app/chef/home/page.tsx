'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { ChefHat, Calendar, Clock, Loader, ChevronRight, MapPin } from 'lucide-react';
import { fetchChefDistrictPosts } from '@/features/userPostSlice';
import { AppDispatch, RootState } from '@/redux/store';
import AuthWrapper from '@/components/AuthWrapper';
import SearchBar from '@/components/shared/SearchBar';
import Pagination from '@/components/admin/userManagement/Pagination';

const page = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, loading, error } = useSelector((state: RootState) => state.userPosts);
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 4;
  const [searchTerm, setSearchTerm] = useState("");

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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader className="h-12 w-12 text-[#C26E4B] animate-spin" />
        <p className="mt-4 text-[#8E472A] font-medium">
          Loading available opportunities...
        </p>
      </div>
    );
  }

  return (
    <AuthWrapper routeType='private'>
      <div className="min-h-screen bg-gradient-to-b from-[#FFF9F5] to-[#FAF3ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-[#FFF0E8] shadow-inner">
                <ChefHat size={28} className="text-[#C26E4B]" />
              </div>
              <h1 className="ml-3 text-3xl font-serif font-bold text-[#5A2D1A]">
                Culinary Opportunities
              </h1>
            </div>
            
            <div className="w-full md:w-auto">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search by event name..."
               />
            </div>
          </div>

          {/* Content Section */}
          {posts.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-[#F0E0D8] max-w-2xl mx-auto">
              <div className="bg-[#FFF5F0] rounded-full p-4 inline-block mb-4">
                <Calendar size={48} className="text-[#D79275] mx-auto" />
              </div>
              <h3 className="text-2xl font-serif font-medium text-[#5A2D1A] mb-3">
                No Events Found
              </h3>
              <p className="text-[#7D6B64] font-sans max-w-md mx-auto">
                There are no culinary opportunities in your district at the moment. Please check back later.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {currentPosts.map((post) => (
                  <div
                    key={post._id}
                    className="bg-white rounded-xl p-6 border border-[#F5E5DC] hover:border-[#C26E4B]
                    shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                  >
                    {/* Post Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        {post.userId?.profileImage ? (
                          <img
                            src={post.userId.profileImage}
                            alt={post.userId?.name}
                            className="w-12 h-12 rounded-full object-cover mr-3 border-2 border-[#F5E5DC]"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#F5E5DC] to-[#F8D9C8] text-[#5A2D1A] flex items-center justify-center font-semibold mr-3 border border-[#F5E5DC]">
                            {post.userId?.name?.[0]?.toUpperCase() || 'U'}
                          </div>
                        )}
                        <div>
                          <h4 className="text-base font-semibold text-[#5A2D1A]">{post.userId?.name}</h4>
                          <p className="text-xs text-[#9C8378]">
                            Posted on {new Date(post.createdAt).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Post Body */}
                    <div className="mb-4">
                      <h3 className="text-xl font-serif font-semibold text-[#8E472A] mb-3">
                        {post.eventName}
                      </h3>

                      <div className="space-y-3 mb-4 text-[#7D6B64]">
                        <div className="flex items-center">
                          <div className="bg-[#FFF0E8] p-2 rounded-full mr-3">
                            <Calendar size={16} className="text-[#C26E4B]" />
                          </div>
                          <span className="font-medium">
                            {new Date(post.date).toLocaleDateString('en-GB', {
                              weekday: 'short',
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <div className="bg-[#FFF0E8] p-2 rounded-full mr-3">
                            <Clock size={16} className="text-[#C26E4B]" />
                          </div>
                          <span className="font-medium">
                            {new Date(`1970-01-01T${post.time}`).toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true,
                            })}
                          </span>
                        </div>
                        {post.district && (
                          <div className="flex items-center">
                            <div className="bg-[#FFF0E8] p-2 rounded-full mr-3">
                              <MapPin size={16} className="text-[#C26E4B]" />
                            </div>
                            <span className="font-medium">{post.district}</span>
                          </div>
                        )}
                      </div>

                      {post.description && (
                        <p className="text-sm text-[#7D6B64] mb-4 line-clamp-3">
                          {post.description}
                        </p>
                      )}
                    </div>

                    {/* Post Footer */}
                    <div className="flex c justify-between items-center pt-4 border-t border-[#F5E5DC]">
                      <button
                        onClick={() => handleDetails(post._id)}
                        className="flex cursor-pointer items-center text-[#C26E4B] hover:text-[#8E472A] font-medium transition-colors group"
                      >
                        <span className="mr-2 group-hover:underline">View Details</span>
                        <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    // activeColor="#C26E4B"
                    // inactiveColor="#E8D5CC"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AuthWrapper>
  );
};

export default page;