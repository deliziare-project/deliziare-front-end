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
        <div className="max-w-4xl mx-auto mt-12 p-8 bg-white rounded-2xl border border-[#F9EBE5] shadow-lg hover:shadow-xl transition-all duration-300 animate-fadeIn">
          {/* Header */}
          <div className="flex items-center mb-4">
            <div className='flex item-center'>
             {userId?.profileImage ? (
                    <img
                      src={userId.profileImage}
                      alt={userId?.name}
                      className="w-12 h-12 rounded-full object-cover mr-3 border border-[#F9EBE5]"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#F9EBE5] text-[#333] flex items-center justify-center font-semibold mr-3 border border-[#F9EBE5]">
                      {userId?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
            </div>
            <div>
              <p className="text-sm text-[#8E472A] font-medium">You're viewing a post by</p>
              <p className="text-lg font-semibold text-[#74391F]">{userId?.name}</p>
            </div>
          </div>

          {/* Event Title */}
          <h2 className="text-3xl font-bold font-['Playfair_Display'] text-[#74391F] mb-6 tracking-tight">
            {eventName}
          </h2>

          {/* Event Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[#5C4639] font-['Nunito_Sans'] mb-8">
            <div className="space-y-4">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-3 text-[#BF9A61] group-hover:scale-110 transition-transform duration-200" />
                <span className="text-sm font-semibold"><strong>Date:</strong>  {new Date(date).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-3 text-[#BF9A61] group-hover:scale-110 transition-transform duration-200" />
                <span className="text-sm font-semibold"><strong>Time:</strong> {new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true,
                        })}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-3 text-[#BF9A61] group-hover:scale-110 transition-transform duration-200" />
                <span className="text-sm font-semibold"><strong>District:</strong> {district}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-3 text-[#BF9A61] group-hover:scale-110 transition-transform duration-200" />
                <span className="text-sm font-semibold"><strong>Quantity:</strong> {quantity} people</span>
              </div>
              <div className="flex items-center">
                <UtensilsCrossed className="w-5 h-5 mr-3 text-[#BF9A61] group-hover:scale-110 transition-transform duration-200" />
                <span className="text-sm font-semibold"><strong>Menu:</strong> {menu?.join(', ')}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <div className="flex items-center mb-3 text-[#74391F] font-semibold">
              <Info className="w-5 h-5 mr-3 text-[#BF9A61] group-hover:scale-110 transition-transform duration-200" />
              <span className="text-base">Description</span>
            </div>
            <p className="text-[#6B7280] text-sm leading-relaxed font-medium">
              {description}
            </p>
          </div>

          {/* Action Button */}
          <div className="text-right">
            <button
              onClick={() => setShowModal(true)}
              disabled={hasBid}
              className={`px-6 py-3 rounded-lg font-semibold text-base shadow-md transition-all duration-300 ${
                hasBid
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-[#C26E4B] hover:bg-[#A85A3A] text-white hover:shadow-lg'
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
