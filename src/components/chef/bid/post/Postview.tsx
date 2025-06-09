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

  if (loading) return <p className="text-center text-blue-600">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">My Posts</h1>
      {posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <div key={post._id} className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <p className="mb-2 text-sm text-gray-700">{post.description}</p>
              <div className="flex flex-wrap gap-1 mb-2">
                {post.tags.map((tag, index) => (
                  <span key={index} className="text-xs bg-blue-100 px-2 py-1 rounded-full">{tag}</span>
                ))}
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {post.images.map((img, i) => (
                  <img key={i} src={img.url} alt={img.altText} className="w-24 h-24 object-cover rounded" />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyChefPosts;
