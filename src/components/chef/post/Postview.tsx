'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchChefPosts } from '@/features/chefPostSlice';

const MyChefPosts = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, loading, error } = useSelector((state: RootState) => state.chefPost);

  useEffect(() => {
    dispatch(fetchChefPosts());
  }, [dispatch]);

  if (loading) return <p className="text-center text-[#B8755D]">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="p-6 min-h-screen bg-[#fdf9f7]">
      <h1 className="text-3xl font-bold mb-6 text-[#B8755D] text-center">My Posts</h1>

      {posts.length === 0 ? (
        <p className="text-center text-gray-500">You haven't created any posts yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-white rounded-xl shadow-sm border border-[#e4d4cc] hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col h-full"
            >
              <div className="p-4 flex flex-col gap-3 flex-grow">
                <h2 className="text-lg font-semibold text-[#B8755D]">{post.title}</h2>
                <p className="text-sm text-gray-700 line-clamp-3">{post.description}</p>

                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs font-medium bg-[#f4e4df] text-[#B8755D] px-2 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {post.images[0]?.url && (
                <img
                  src={post.images[0].url}
                  alt={post.images[0]?.altText || 'Chef Post'}
                  className="w-full h-60 object-cover"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyChefPosts;
