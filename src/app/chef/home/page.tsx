'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import {
  ChefHat,
  Calendar,
  Clock,
  Loader,
  ChevronRight,
  MapPin,
} from 'lucide-react';

import { fetchChefDistrictPosts } from '@/features/userPostSlice';
import { AppDispatch, RootState } from '@/redux/store';
import Pagination from '@/components/admin/userManagement/pagination';
import SearchBar from '@/components/shared/SearchBar';

const ChefPosts = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, loading } = useSelector((state: RootState) => state.userPosts);
  console.log(posts)
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 4;
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPosts = posts.filter((post) =>
  post.eventName.toLowerCase().includes(searchTerm.toLowerCase())
);

  useEffect(() => {
    dispatch(fetchChefDistrictPosts());
  }, [dispatch]);

  const handleDetails = (postId: string) => {
    router.push(`/chef/postDetails/${postId}`);
  };

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader className="h-12 w-12 text-orange-500 animate-spin" />
        <p className="mt-4 text-orange-700 font-medium">Loading available opportunities...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4 pt-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <ChefHat size={28} className="text-orange-500 mr-3" />
          <h2 className="text-2xl font-serif font-bold text-gray-800">Culinary Opportunities</h2>
        </div>
        {/* Search Bar */}
<div className="mb-6">
  <SearchBar
    value={searchTerm}
    onChange={setSearchTerm}
    placeholder="Search by event name..."
  />
</div>


        {/* Posts Content */}
        {posts.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center shadow-sm">
            <Calendar size={48} className="mx-auto mb-4 text-orange-300" />
            <h3 className="text-xl font-serif font-medium text-gray-800 mb-2">No Events Found</h3>
            <p className="text-gray-600">
              There are no culinary opportunities available at the moment.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentPosts.map((post) => (
                <div
                  key={post._id}
                  className="bg-white rounded-xl p-6 border border-gray-200 hover:border-orange-500 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  {/* Post Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <img
                        src={post.userId?.profileImage || '/default-avatar.png'}
                        alt={post.userId?.name}
                        className="w-10 h-10 rounded-full object-cover mr-3 border border-gray-200"
                      />
                      <div>
                        <h4 className="text-sm font-semibold text-gray-800">{post.userId?.name}</h4>
                        <p className="text-xs text-gray-500">
                          {new Date(post.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Post Body */}
                  <div className="flex-1">
                    <h3 className="text-xl font-serif font-semibold text-gray-800 mb-2">
                      {post.eventName}
                    </h3>

                    <div className="space-y-2 mb-3 text-gray-600">
                      <div className="flex items-center">
                        <Calendar size={18} className="mr-2 text-orange-400" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock size={18} className="mr-2 text-orange-400" />
                        <span>{post.time}</span>
                      </div>
                      {post.location && (
                        <div className="flex items-center">
                          <MapPin size={18} className="mr-2 text-orange-400" />
                          <span>{post.district}</span>
                        </div>
                      )}
                    </div>

                    {post.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">{post.description}</p>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleDetails(post._id)}
                      className="flex items-center text-orange-500 cursor-pointer hover:text-orange-600 transition-colors"
                    >
                      <span className="mr-2">View Details</span>
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ChefPosts;
