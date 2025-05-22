'use client';

import axiosInstance from '@/api/axiosInstance';
import { fetchChefDistrictPosts } from '@/features/userPostSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';



const ChefPosts = () => {
    const dispatch = useDispatch<AppDispatch>();
  const { posts, loading, error } = useSelector((state: RootState) => state.userPosts);
   const router=useRouter()
  useEffect(() => {
    dispatch(fetchChefDistrictPosts());
  }, [dispatch]);

  const handleDetails=(postId)=>{
    router.push(`/chef/postDetails/${postId}`)
  }

  if (loading) return <div className="text-center mt-4">Loading posts...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Posts in Your District</h2>
      {posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        posts.map((post) => (
          <div key={post._id} className=" py-3">
            <h3 className="text-xl font-semibold">{post.eventName}</h3>
            <p><strong>Date:</strong> {post.date}</p>
            <p><strong>Time:</strong> {post.time}</p>
            <p onClick={()=>handleDetails(post._id)}>view details</p>
            </div>
 
          
        ))
      )}
    
    </div>
  );
};

export default ChefPosts;
