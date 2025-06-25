'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '@/api/axiosInstance';
import { fetchPosts } from '@/services/postService';
import dynamic from 'next/dynamic';
import { PackageCheck, Truck } from 'lucide-react'; 

const LiveDeliveryMap = dynamic(() => import('@/components/user/liveMap'), { ssr: false });

interface Post {
  _id: string;
  eventName: string;
  date: string;
  time: string;
  district: string;
  deliveryStatus: 'pending'|'accepted' | 'picked up' | 'delivered';
}

const Page = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [deliveryId, setDeliveryId] = useState<string | null>(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<'pending'|'accepted' | 'picked up' | 'delivered' | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchPosts();
        setPosts(data.posts);
      } catch (err) {
        console.error('❌ Failed to fetch posts');
      }
    };
    loadPosts();
  }, []);

  useEffect(() => {
    const fetchDeliveryId = async () => {
      if (!selectedPostId) return;

      try {
        const res = await axiosInstance.get(`/location/get-delivery-id/${selectedPostId}`);
        setDeliveryId(res.data.deliveryId);
        setSelectedStatus(res.data.deliveryStatus);
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
  <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
  <div className="max-w-5xl mx-auto px-6 py-12">

     <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-6">
  <PackageCheck className="w-6 h-6 text-[#B8755D]" />
  Your Orders
</h2>


      <div className="grid gap-4">
        {[...posts].reverse().map((post) => (
          <div
  key={post._id}
  className={`bg-white border border-gray-100 rounded-2xl shadow-sm p-4 transition-all hover:shadow-md hover:border-gray-200 ${
    selectedPostId === post._id ? 'ring-2 ring-[#B8755D]/30' : ''
  }`}
  onClick={() => {
    setSelectedPostId(post._id);
    setSelectedStatus(post.deliveryStatus);
  }}
>
  <h3 className="text-lg font-semibold text-gray-800">{post.eventName}</h3>
  <p className="text-sm text-gray-500 mt-1">
    {post.date} at {post.time}
  </p>
  <p className="text-sm text-gray-600">Location: {post.district}</p>

  <div className="mt-2 text-sm text-[#B8755D] flex items-center gap-1 underline font-medium">
    <Truck className="w-4 h-4" /> Track Delivery
  </div>

  {post.deliveryStatus === 'delivered' && (
    <p className="text-green-600 text-sm mt-2 font-semibold flex items-center gap-1">
      <PackageCheck className="w-4 h-4" />
      Delivered
    </p>
  )}
</div>

        ))}
      </div>

      {showMapModal && deliveryId && selectedStatus && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-2xl w-full p-6 relative">
    <button
      onClick={() => setShowMapModal(false)}
      className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-xl"
    >
      ✕
    </button>

    <h3 className="text-xl font-semibold mb-5 text-[#B8755D] flex items-center gap-2">
      <Truck className="w-5 h-5" /> Live Delivery Tracking
    </h3>

    <LiveDeliveryMap deliveryId={deliveryId} deliveryStatus={selectedStatus} />
  </div>
</div>

      )}
    </div>
    </div>
  );
};

export default Page;
