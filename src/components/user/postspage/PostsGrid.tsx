import React from 'react';
import { Post } from '@/types/post';
import PostCard from './PostCard';
import PostsEmptyState from './PostsEmptyState';

interface PostsGridProps {
  posts: Post[];
  isLoading: boolean;
}

const PostsGrid: React.FC<PostsGridProps> = ({ posts, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md h-80 animate-pulse">
            <div className="bg-gray-200 h-16 rounded-t-lg"></div>
            <div className="p-5 space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!posts.length) {
    return <PostsEmptyState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...posts]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .map(post => (
          <PostCard key={post._id} post={post} />
      ))}

    </div>
  );
};

export default PostsGrid;