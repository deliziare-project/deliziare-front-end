
import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, MapPin, Utensils, Users, Pen } from 'lucide-react';
import { Post } from '@/types/post';
import EditPostModal from '@/components/ui/EditPostModal';
import axiosInstance from '@/api/axiosInstance';
import { editPostIs } from '@/services/postService';
import ReplayModal from '@/components/ui/ReplayModal';
import socket from '@/socket';
import { markBidsAsRead } from '@/features/bidSlice';
import { Replay } from '@/types/Replay';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReplayModalOpen, setIsReplayModalOpen] = useState(false);
  const [editedPost, setEditedPost] = useState(post);
  const [replays, setReplays] = useState<Replay[]>([]);
  const [showBidCount, setShowBidCount] = useState(true);
  const [hasUnreadBids, setHasUnreadBids] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [bidCount, setBidCount] = useState(0);

  const unreadCount = replays.filter(bid => !bid.readByUser).length;

  const fetchReplays = useCallback(async () => {
    try {
      const res = await axiosInstance.get('/bids/get-post-replay', {
        params: { postId: editedPost._id },
      });
      setReplays(res.data);
      setBidCount(res.data.length);
    } catch (error) {
      console.error('Error fetching replays:', error);
    }
  }, [editedPost._id]);
  

  useEffect(() => {
    console.log("Component mounted for post:", editedPost._id);
    fetchReplays();
  }, [editedPost._id]);

  useEffect(() => {
    const hasUnread = replays.some(bid => !bid.readByUser);
    console.log('Checking unread bids:', hasUnread);
    setHasUnreadBids(hasUnread);
    setShowBidCount(hasUnread);
  }, [replays]);

  useEffect(() => {
    const handleNewBid = (postId: string, bidId: string, message: string) => {
      console.log('Socket: new_bid received:', postId, bidId, message);
      if (postId === editedPost._id) {
        setShowBidCount(true);
        setHasUnreadBids(true);
        const postElement = document.getElementById(`post-${post._id}`);
        if (postElement) {
          postElement.classList.add('animate-pulse');
          setTimeout(() => postElement.classList.remove('animate-pulse'), 500);
        }
        fetchReplays();
      } else {
        console.log('Received bid for different post:', postId);
      }
    };
  
    const handleBidUpdated = (postId: string, bidCount: string) => {
      console.log('Socket: bid_updated received:', postId, bidCount);
      if (postId === editedPost._id) {
        setShowBidCount(true);
      } else {
        console.log('Bid update for different post:', postId);
      }
    };
  
    socket?.on('new_bid', handleNewBid);
    socket?.on('bid_updated', handleBidUpdated);
  
    return () => {
      socket?.off('new_bid', handleNewBid);
      socket?.off('bid_updated', handleBidUpdated);
    };
  }, [editedPost._id]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Edit icon clicked for post:', editedPost._id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    console.log('Edit modal closed');
    setIsModalOpen(false);
  };

  const handleCloseReplayModal = async () => {
    console.log('Replay modal closed');
    setIsReplayModalOpen(false);
    try {
      await markBidsAsRead(editedPost._id);
      console.log('Marked bids as read for post:', editedPost._id);
      setReplays(prev => prev.map(bid => ({ ...bid, readByUser: true })));
      setHasUnreadBids(false);
      setShowBidCount(false);
    } catch (err) {
      console.error('Failed to mark bids as read:', err);
    }
  };

  const handlePostEdit = async (updatedPost: Post) => {
    const res = await editPostIs(updatedPost);
    console.log('Post updated successfully:', res);
    setEditedPost(updatedPost);
  };

  const isEditDisabled = () => {
  const eventDate = new Date(editedPost.date); 
  const now = new Date();
  const msInDay = 24 * 60 * 60 * 1000;
  const dayDiff = Math.floor((eventDate.getTime() - now.getTime()) / msInDay);

  return dayDiff < 2;
};


  const handleViewReplay = async (id: any) => {
    console.log('Viewing replays for post:', id._id);
    try {
      const res = await axiosInstance.get('/bids/get-post-replay', {
        params: { postId: id._id },
      });
      console.log('Replay data:', res.data);
      setReplays(res.data);
      setIsReplayModalOpen(true);
    } catch (error) {
      console.error('Error viewing replays:', error);
    }
  };

  const handleCardClick = () => {
    console.log('Post card clicked:', editedPost._id);
    setShowBidCount(false);
    handleViewReplay(editedPost);
  };

  return (
    <>
      <div
        id={`post-${post._id}`}
        onClick={handleCardClick}
        className="bg-white rounded-2xl cursor-pointer shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col relative group"
      >
        <div className="bg-gradient-to-r from-orange-50 to-white border-b border-gray-100 p-5 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800 truncate group-hover:text-orange-600 transition-colors duration-200">{editedPost.eventName}</h2>
          <Pen
            className={`h-5 w-5 transition-colors duration-200 ${
              isEditDisabled()
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-400 hover:text-orange-500 cursor-pointer'
            }`}
            onClick={(e) => {
              if (!isEditDisabled()) handleEditClick(e);
            }}
          />
        </div>

        <div className="p-6 flex-grow flex flex-col justify-between bg-gradient-to-b from-white to-orange-50">
          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-orange-500 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-800">{editedPost.district}</p>
                <p className="text-xs text-gray-500">
                  Lat: {editedPost.location.lat.toFixed(4)}, Lng: {editedPost.location.lng.toFixed(4)}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-orange-500" />
                <span className="text-gray-700 font-medium">{editedPost.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-500" />
                <span className="text-gray-700 font-medium">{editedPost.time}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-orange-500" />
              <span className="text-gray-700">
                Food for <span className="font-semibold text-orange-600">{editedPost.quantity} people</span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Utensils className="h-5 w-5 text-orange-500" />
                <span className="font-semibold text-gray-800">Menu</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {editedPost.menu.map((item, index) => (
                  <span
                    key={index}
                    className="bg-orange-100 text-orange-700 text-xs px-3 py-1 rounded-full border border-orange-200 shadow-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-gray-600 line-clamp-3 mt-2 text-sm">{editedPost.description}</p>
          </div>

          <div className="mt-6 pt-4 border-t cursor-pointer border-gray-100 text-xs text-gray-500 flex justify-between items-center">
            <span>Posted on: <span className="font-medium text-gray-700">{formatDate(editedPost.createdAt)}</span></span>
            {unreadCount > 0 && showBidCount && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewReplay(editedPost);
                  setShowBidCount(false);
                }}
                className="cursor-pointer"
              >
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-orange-500 text-white text-xs font-bold shadow-lg border-2 border-white">
                  {unreadCount}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <EditPostModal post={editedPost} onClose={handleCloseModal} onSave={handlePostEdit} />
      )}

      <ReplayModal
        isOpen={isReplayModalOpen}
        onClose={handleCloseReplayModal}
        replays={replays}
      />
    </>
  );

};

export default PostCard;

