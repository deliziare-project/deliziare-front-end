'use client';

import React, { useEffect } from 'react';
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
import AuthWrapper from '@/components/AuthWrapper';

const ChefPosts = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, loading, error } = useSelector((state: RootState) => state.userPosts);
  const router = useRouter();

  useEffect(() => {
    dispatch(fetchChefDistrictPosts());
  }, [dispatch]);

  const handleDetails = (postId: string) => {
    router.push(`/chef/postDetails/${postId}`);
  };

 

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
    <div className="min-h-screen bg-[#FAF8F7]">
      <div className="max-w-6xl mx-auto p-4 pt-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <ChefHat size={28} className="text-[#C26E4B] mr-3" />
            <h2 className="text-2xl font-['Playfair_Display'] font-bold text-[#74391F]">
              Culinary Opportunities
            </h2>
          </div>

        
        </div>

        {/* Posts Content */}
        {posts.length === 0 ? (
          <div className="bg-[#FCF5F2] rounded-xl p-8 text-center">
            <Calendar size={48} className="mx-auto mb-4 text-[#D79275]" />
            <h3 className="text-xl font-['Playfair_Display'] font-medium text-[#8E472A] mb-2">
              No Events Found
            </h3>
            <p className="text-[#6B7280] font-['Nunito_Sans']">
              There are no culinary opportunities in your district at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-xl p-6 border border-[#F9EBE5] hover:border-[#C26E4B]
                           shadow-sm hover:shadow-md transition-all duration-300"
              >
                {/* Post Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <img
                      src={post.userId?.profileImage || '/default-avatar.png'}
                      alt={post.userId?.name}
                      className="w-10 h-10 rounded-full object-cover mr-3 border border-[#F9EBE5]"
                    />
                    <div>
                      <h4 className="text-sm font-semibold text-[#74391F]">{post.userId?.name}</h4>
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
                  <h3 className="text-xl font-['Playfair_Display'] font-semibold text-[#8E472A] mb-2">
                    {post.eventName}
                  </h3>

                  {/* Event Date/Time/Location */}
                  <div className="space-y-2 mb-3 text-[#6B7280] font-['Nunito_Sans']">
                    <div className="flex items-center">
                      <Calendar size={18} className="mr-2 text-[#BF9A61]" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock size={18} className="mr-2 text-[#BF9A61]" />
                      <span>{post.time}</span>
                    </div>
                    {post.location && (
                      <div className="flex items-center">
                        <MapPin size={18} className="mr-2 text-[#BF9A61]" />
                        <span>{post.district}</span>
                      </div>
                    )}
                  </div>

                  {/* Description (optional) */}
                  {post.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {post.description}
                    </p>
                  )}
                </div>

                {/* Footer with Actions */}
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#F9EBE5]">
                  <button
                    onClick={() => handleDetails(post._id)}
                    className="flex items-center text-[#C26E4B] cursor-pointer hover:text-[#A85A3A] transition-colors"
                  >
                    <span className="mr-2">View Details</span>
                    <ChevronRight size={20} />
                  </button>

                  
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </AuthWrapper>
  );
};

export default ChefPosts;
