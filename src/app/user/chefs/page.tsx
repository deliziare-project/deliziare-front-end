'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '@/api/axiosInstance';
import { Bookmark, MoreHorizontal} from 'lucide-react';
import Pagination from '@/components/admin/userManagement/pagination';
import Link from 'next/link';

interface ChefPost {
  _id: string;
  title: string;
  description: string;
  tags?: string[];
  images?: {
    url: string;
    altText?: string;
  }[];
  chefId?: {
    name: string;
    username?: string;
    profileImage?: string;
    district?: string;
    _id: string;
  };
  createdAt: string;
}

const HostViewChefPosts = () => {
  const [posts, setPosts] = useState<ChefPost[]>([]);
  console.log(posts);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savedPosts, setSavedPosts] = useState<string[]>([]);

  useEffect(() => {
    const fetchChefPosts = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get('/chefs/all');
        setPosts(res.data);
      } catch (err) {
        console.error('Error fetching chef posts:', err);
        setError('Failed to load chef posts');
      } finally {
        setLoading(false);
      }
    };

    fetchChefPosts();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const toggleSavePost = (postId: string) => {
    setSavedPosts(prev =>
      prev.includes(postId)
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 4;
   
  const totalPages = Math.ceil(posts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);


  if (loading) return <div className="flex justify-center items-center h-screen">Loading posts...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (posts.length === 0) return <div className="text-center py-8">No posts found</div>;

  return (
  <div className="min-h-screen flex flex-col max-w-6xl mx-auto px-4 py-8">
    {/* Post Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
      {currentPosts.map((post) => (
        <div key={post._id} className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
          {/* Post Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-300">              
              <Link href={`/profiles/chefProfile/${post.chefId?._id}`} className="w-10 h-10 rounded-full overflow-hidden border border-gray-300 block">
                <img
                  src={post.chefId?.profileImage || '/default-profile.png'}
                  alt={post.chefId?.name}
                  className="w-full h-full object-cover"
                />
              </Link>

              </div>
              <div>
                <p className="font-semibold text-sm">{post.chefId?.username || post.chefId?.name}</p>
                <p className="text-gray-500 text-xs">{post.chefId?.district}</p>
              </div>
            </div>
            {/* <MoreHorizontal className="text-gray-500" size={20} /> */}
          </div>

          {/* Post Image */}
          {post.images?.length ? (
            <img
              src={post.images[0].url}
              alt={post.images[0].altText || post.title}
              className="w-full h-64 object-cover"
            />
          ) : (
            <div className="w-full h-64 bg-gray-100 flex items-center justify-center text-gray-500">
              No image
            </div>
          )}

          {/* Post Details */}
          <div className="p-4 space-y-2">
            <p className="text-sm">
              <span className="font-semibold mr-2">{post.title}</span>
              {post.description}
            </p>

            {post.tags?.length ? (
              <div className="flex flex-wrap gap-2 mt-1">
                {post.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            ) : null}

            <p className="text-gray-400 text-xs">{formatDate(post.createdAt)}</p>
          </div>

          {/* Post Actions */}
          <div className="flex justify-end items-center px-4 pb-4">
            <button onClick={() => toggleSavePost(post._id)}>
              <Bookmark
                className={savedPosts.includes(post._id) ? 'text-black fill-current' : 'text-gray-600'}
                size={20}
              />
            </button>
          </div>
        </div>
      ))}
    </div>

    {/* Pagination */}
    {totalPages > 1 && (
      <div className="mt-10 flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    )}
  </div>
);

};

export default HostViewChefPosts;
