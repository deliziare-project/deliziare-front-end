import axiosInstance from '@/api/axiosInstance';
import { notFound } from 'next/navigation';
import React from 'react';

interface Params {
  params: { id: string };
}

const getPostById = async (id: string) => {
  try {
    const res = await axiosInstance.get(`/user-posts/${id}`);
    return res.data;
  } catch (error) {
    return null;
  }
};

const PostDetailsPage = async ({ params }: Params) => {
  const post = await getPostById(params.id);

  if (!post) return notFound();

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{post.eventName}</h1>
      <p><strong>Date:</strong> {post.date}</p>
      <p><strong>Time:</strong> {post.time}</p>
      <p><strong>District:</strong> {post.district}</p>
      <p><strong>Menu:</strong> {post.menu.join(', ')}</p>
      <p><strong>Quantity:</strong> {post.quantity}</p>
      <p className="mt-4"><strong>Description:</strong> {post.description}</p>
    </div>
  );
};

export default PostDetailsPage;
