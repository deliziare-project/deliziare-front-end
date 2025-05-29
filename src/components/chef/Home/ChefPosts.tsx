'use client';

import axiosInstance from '@/api/axiosInstance';
import { fetchChefDistrictPosts } from '@/features/userPostSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import { ChefHat, Calendar, Clock, MapPin, ChevronRight } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-300">
      <div className="max-w-4xl mx-auto p-4 pt-8">
        <div className="flex items-center mb-6">
          <ChefHat size={28} className="text-primary-500 mr-3" />
          <h2 className="text-2xl font-serif font-bold text-primary-800">Culinary Events in Your District</h2>
        </div>

        <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-8">
          {posts.length === 0 ? (
            <div className="bg-background-100 rounded-lg p-8 text-center">
              <Calendar size={48} className="mx-auto mb-4 text-primary-400" />
              <h3 className="text-xl font-medium text-primary-700 mb-2">No Events Found</h3>
              <p className="text-gray-600">There are no culinary events in your district at the moment.</p>
            </div>
          ) : (
            

            <div className="space-y-6 max-w-4xl mx-auto">
          {posts.map((post, idx) => (
            <div
              key={post._id}
              onClick={() => handleDetails(post._id)}
              className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer animate-slideUp"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <h3 className="text-2xl font-serif font-bold text-gray-900 mb-3 tracking-tight">
                    {post.eventName}
                  </h3>
                  <div className="flex flex-col sm:flex-row sm:space-x-8">
                    <div className="flex items-center text-gray-600 mb-3 sm:mb-0">
                      <Calendar className="w-5 h-5 mr-2 text-indigo-600" />
                      <span className="text-sm font-medium">{post.date}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-5 h-5 mr-2 text-indigo-600" />
                      <span className="text-sm font-medium">{post.time}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 flex items-center">
                  <ChevronRight className="w-6 h-6 text-indigo-400 group-hover:scale-110 transition-transform duration-200" />
                </div>
              </div>
            </div>
          ))}
        </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChefPosts;