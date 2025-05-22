import React from 'react';
import { FileQuestion } from 'lucide-react';

const PostsEmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-10 bg-white rounded-lg shadow-sm border border-gray-100 text-center">
      <FileQuestion className="w-16 h-16 text-gray-200 mb-4" />
      <h3 className="text-xl font-semibold text-gray-800 mb-2">No posts available</h3>
      <p className="text-gray-500 max-w-md">
        There are no food donation posts available at the moment. Click the "+" button to create your first post.
      </p>
    </div>
  );
};

export default PostsEmptyState;