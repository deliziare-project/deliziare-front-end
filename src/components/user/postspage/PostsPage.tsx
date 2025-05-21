'use client';
import React, { useEffect, useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Post } from '@/types/post';
import { fetchPosts } from '@/services/postService';
import PostsGrid from './PostsGrid';

const PostsPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetchPosts();
        setPosts(response.posts);
      } catch (err) {
        setError('Failed to load posts. Please try again later.');
        console.error('Error loading posts:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Food Donation Posts</h1>
          <p className="text-gray-500 mt-1">
            Browse all available food donation events
          </p>
        </div>
        <button
          className="bg-white hover:bg-gray-50 text-orange-500 p-2 rounded-full shadow-md transition-colors duration-200 border border-gray-200"
          aria-label="Add new post"
        >
          <PlusCircle className="h-8 w-8" />
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        </div>
      )}

      <PostsGrid posts={posts} isLoading={isLoading} />
    </div>
  );
};

export default PostsPage;