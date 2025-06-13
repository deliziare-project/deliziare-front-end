import axiosInstance from '@/api/axiosInstance';
import React, { useEffect, useState } from 'react'

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

function Allchefpost() {
const [posts, setPosts] = useState<ChefPost[]>([]);
  console.log(posts);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
    
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
      const sliced=posts.slice(0,4)

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-8">
          {sliced.map((post, index) => (
            <div
              key={post._id}
              className="pt-5 pb-5 max-w-6xl shadow-xl rounded-2xl bg-white hover:shadow-2xl transition-shadow duration-300 ease-in-out animate-slideUp flex flex-col items-center backdrop-blur-md"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <img
                src={post.images?.[0].url}
                alt={post.images?.[0].altText}
                className="w-48 h-48 object-cover rounded-full border-4 border-amber-100 shadow-md"
              />
              <h2 className="text-2xl font-bold mt-4 text-gray-900 text-center tracking-tight">
                {post.title}
              </h2>
              
             
            </div>
          ))}
        </div>
    </div>
  )
}

export default Allchefpost
