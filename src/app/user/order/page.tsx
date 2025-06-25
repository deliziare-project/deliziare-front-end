'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '@/api/axiosInstance';
import { fetchPosts } from '@/services/postService';
import dynamic from 'next/dynamic';

const LiveDeliveryMap = dynamic(() => import('@/components/user/liveMap'), { ssr: false });

interface Post {
  _id: string;
  eventName: string;
  date: string;
  time: string;
  district: string;
  deliveryStatus: string;
}

const Page = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [deliveryId, setDeliveryId] = useState<string | null>(null);
  const [showMapModal, setShowMapModal] = useState(false);

  // 1. Fetch posts on initial load
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchPosts();
        setPosts(data.posts); // must include deliveryStatus
      } catch (err) {
        console.error('❌ Failed to fetch posts');
      }
    };
    loadPosts();
  }, []);

  // 2. When a post is selected, fetch deliveryId
  useEffect(() => {
    const fetchDeliveryId = async () => {
      if (!selectedPostId) return;

      try {
        const res = await axiosInstance.get(`/location/get-delivery-id/${selectedPostId}`);
        setDeliveryId(res.data.deliveryId);
        setShowMapModal(true);
      } catch (err) {
        console.error('❌ Error fetching delivery ID:', err);
        setDeliveryId(null);
        setShowMapModal(false);
      }
    };

    fetchDeliveryId();
  }, [selectedPostId]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">📦 Your Orders</h2>

      <div className="grid gap-4">
        {posts.map((post) => (
          <div
            key={post._id}
            className={`border rounded p-3 cursor-pointer transition ${
              selectedPostId === post._id ? 'bg-blue-100' : 'hover:bg-gray-100'
            }`}
            onClick={() => setSelectedPostId(post._id)}
          >
            <h3 className="text-lg font-medium">{post.eventName}</h3>
            <p className="text-sm text-gray-600">
              {post.date} at {post.time}
            </p>
            <p className="text-sm">Location: {post.district}</p>
            <p className="text-sm text-blue-600 underline mt-1">Track Delivery</p>
            {post.deliveryStatus === 'delivered' && (
              <p className="text-green-600 text-sm mt-1 font-semibold">✅ Delivered</p>
            )}
          </div>
        ))}
      </div>

      {/* 🧭 Live Location Modal */}
      {showMapModal && deliveryId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-6 relative">
            <button
              className="absolute top-3 right-4 text-gray-600 hover:text-red-600 text-2xl"
              onClick={() => setShowMapModal(false)}
            >
              ✕
            </button>

            <h3 className="text-lg font-semibold mb-4 text-red-600">🚚 Live Delivery Tracking</h3>
            <LiveDeliveryMap deliveryId={deliveryId} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
