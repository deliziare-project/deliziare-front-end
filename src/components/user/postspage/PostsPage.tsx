'use client';
import React, { useEffect, useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Post } from '@/types/post';
import { fetchPosts } from '@/services/postService';
import PostsGrid from './PostsGrid';
import PostModal from '@/components/ui/PostModal';
import axiosInstance from '@/api/axiosInstance';
import toast from 'react-hot-toast';
import { showSuccess } from '@/components/shared/ToastUtilis';

const PostsPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
  

    const handlePostSubmit = async (data: any) => {
      try {
        const res = await axiosInstance.post("/posts/create", data, {
          headers: { "Content-Type": "application/json" },
        });
        console.log(res.data);
        
        // Refresh the posts list after successful creation
        await loadPosts();
        
        toast.success("Post submitted successfully");
        setIsModalOpen(false); // Close the modal
      } catch (error) {
        toast.error("Error creating post");
        console.error("Error creating post:", error);
      }
    };


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

      // showSuccess("Post created successfully");
    } 
  };

  useEffect(() => {
    loadPosts();
  }, []);

  // return (
  //   <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
  //     <div className="flex justify-between items-center mb-8">
  //       <div>
  //         <h1 className="text-2xl font-bold text-gray-800 mt-4">My Posts</h1>
  //       </div>
  //       <PostModal
  //       isOpen={isModalOpen}
  //         onClose={() => setIsModalOpen(false)}
  //         onSubmitPost={handlePostSubmit}
  //       />
  //       <button
  //         className="bg-white hover:bg-gray-50 text-orange-500 p-2 rounded-full shadow-md transition-colors duration-200 border border-gray-200"
  //         aria-label="Add new post"
  //       >
  //         <PlusCircle className="h-8 w-8" onClick={() => setIsModalOpen(true)}/>
  //       </button>
  //     </div>

  //     {error && (
  //       <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
  //         <div className="flex">
  //           <div className="flex-shrink-0">
  //             <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
  //               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
  //             </svg>
  //           </div>
  //           <div className="ml-3">
  //             <p className="text-sm text-red-600">{error}</p>
  //           </div>
  //         </div>
  //       </div>
  //     )}

  //     <PostsGrid posts={posts} isLoading={isLoading} />
  //   </div>
  // );


  // ... existing code ...
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mt-4 tracking-tight">My Posts</h1>
        </div>
        <PostModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmitPost={handlePostSubmit}
        />
        <button
          className="bg-white cursor-pointer hover:bg-orange-50 text-orange-500 p-3 rounded-full shadow-lg transition-colors duration-200 border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
          aria-label="Add new post"
        >
          <PlusCircle className="h-9 w-9" onClick={() => setIsModalOpen(true)} />
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8 rounded-lg shadow">
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
// ... existing code ...
};

export default PostsPage;