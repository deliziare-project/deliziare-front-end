'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  UtensilsCrossed,
  Info,
} from 'lucide-react';

import { AppDispatch, RootState } from '@/redux/store';
import { fetchPostDetails } from '@/features/userPostSlice';
import BidModal from './bid/BidModal';
import axiosInstance from '@/api/axiosInstance';

const PostDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedPost, loading, error } = useSelector((state: RootState) => state.userPosts);
  const { currentUser } = useSelector((state: any) => state.auth);

  const [showModal, setShowModal] = useState(false);
  const [hasBid, setHasBid] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchPostDetails(id as string));
    }
  }, [id, dispatch]);

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const res = await axiosInstance.get('/bids/getBid');
        const found = res.data.some((bid) => String(bid?.postId?._id) === String(id));
        setHasBid(found);
      } catch (err) {
        console.error('Error fetching bids:', err);
      }
    };

    if (id) fetchBids();
  }, [id]);

  if (loading) return <div className="text-center py-10 text-[#8E472A]">Loading...</div>;
  if (error) return <div className="text-center text-red-600 py-4">{error}</div>;
  if (!selectedPost) return <div className="text-center py-4 text-gray-500">No post found.</div>;

  const {
    eventName,
    date,
    time,
    district,
    description,
    quantity,
    menu,
    userId,
  } = selectedPost;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-[#FCF5F2] rounded-2xl border border-[#F9EBE5] shadow-md">
      {/* Header */}
      <div className="flex items-center mb-6">
        <div className="w-11 h-11 rounded-full bg-[#F2D7CE] text-[#74391F] flex items-center justify-center font-semibold mr-3">
          {userId?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-sm text-[#8E472A]">You're viewing a post by</p>
          <p className="font-medium text-[#74391F]">{userId?.name}</p>
        </div>
      </div>

      {/* Event Title */}
      <h2 className="text-2xl font-bold font-['Playfair_Display'] text-[#8E472A] mb-4">
        {eventName}
      </h2>

      {/* Event Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[#5C4639] font-['Nunito_Sans'] mb-6">
        <div className="space-y-2">
          <div className="flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-[#BF9A61]" />
            <span><strong>Date:</strong> {date}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-5 h-5 mr-2 text-[#BF9A61]" />
            <span><strong>Time:</strong> {time}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-[#BF9A61]" />
            <span><strong>District:</strong> {district}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center">
            <Users className="w-5 h-5 mr-2 text-[#BF9A61]" />
            <span><strong>Quantity:</strong> {quantity} people</span>
          </div>
          <div className="flex items-center">
            <UtensilsCrossed className="w-5 h-5 mr-2 text-[#BF9A61]" />
            <span><strong>Menu:</strong> {menu?.join(', ')}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mb-6">
        <div className="flex items-center mb-2 text-[#74391F] font-semibold">
          <Info className="w-5 h-5 mr-2 text-[#BF9A61]" />
          <span>Description:</span>
        </div>
        <p className="text-[#6B7280] leading-relaxed">
          {description}
        </p>
      </div>

      {/* Action Button */}
      <div className="text-right">
        <button
          onClick={() => setShowModal(true)}
          disabled={hasBid}
          className={`px-5 py-2.5 rounded-lg font-medium shadow-sm transition duration-200 ${
            hasBid
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'bg-[#C26E4B] hover:bg-[#A85A3A] text-white'
          }`}
        >
          {hasBid ? 'Request Sent' : 'Send Request'}
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <BidModal
          postId={selectedPost._id}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default PostDetailsPage;
