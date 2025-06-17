


import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Calendar, Clock, MapPin, Utensils, Users, Pen } from 'lucide-react';
import axiosInstance from '@/api/axiosInstance';
import { Post } from '@/types/post';
import { Replay } from '@/types/Replay';
import socket from '@/socket';
import { markBidsAsRead } from '@/features/bidSlice';
import EditPostModal from '@/components/ui/EditPostModal';
import ReplayModal from '@/components/ui/ReplayModal';
import { editPostIs } from '@/services/postService';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { addNotification } from '@/features/notificationSlice';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [editedPost, setEditedPost] = useState(post);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReplayModalOpen, setIsReplayModalOpen] = useState(false);
  const [replays, setReplays] = useState<Replay[]>([]);
  const [showBidCount, setShowBidCount] = useState(true);

  const userId = useSelector((state: RootState) => state.auth.currentUser?._id);
  const { notifications, loading } = useSelector((state: RootState) => state.notifications);
  const dispatch = useDispatch<AppDispatch>();

  // Use readByPostOwner for unreadCount
  const unreadCount = useMemo(() => replays.filter((bid) => !bid.readByPostOwner).length, [replays]);

  const fetchReplays = useCallback(async () => {
    try {
      const res = await axiosInstance.get('/bids/get-post-replay', {
        params: { postId: editedPost._id },
      });
      console.log('Fetched replays:', res.data); // Debug log
      setReplays(res.data);
    } catch (error) {
      console.error('Error fetching replays:', error);
    }
  }, [editedPost._id]);

  useEffect(() => {
    fetchReplays();
  }, [fetchReplays]);

  useEffect(() => {
    if (!userId) return;

    const onConnect = () => {
      socket.emit('register', userId);
    };

    if (socket.connected) {
      onConnect();
    } else {
      socket.connect();
      socket.once('connect', onConnect);
    }

    const handleNewNotification = (notification: any) => {
      dispatch(addNotification(notification));
    };

    socket.on('new_notification', handleNewNotification);

    return () => {
      socket.off('new_notification', handleNewNotification);
      socket.off('connect', onConnect);
    };
  }, [userId, dispatch]);

  useEffect(() => {
    const handleNewBid = (postId: string) => {
      if (postId === editedPost._id) {
        setShowBidCount(true);
        fetchReplays();

        const postElement = document.getElementById(`post-${editedPost._id}`);
        if (postElement) {
          postElement.classList.add('animate-pulse');
          setTimeout(() => postElement.classList.remove('animate-pulse'), 500);
        }
      }
    };

    const handleBidUpdated = (postId: string) => {
      if (postId === editedPost._id) {
        fetchReplays();
        setShowBidCount(true);
      }
    };

    socket?.on('new_bid', handleNewBid);
    socket?.on('bid_updated', handleBidUpdated);

    return () => {
      socket?.off('new_bid', handleNewBid);
      socket?.off('bid_updated', handleBidUpdated);
    };
  }, [editedPost._id, fetchReplays]);

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isEditDisabled()) {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handlePostEdit = async (updatedPost: Post) => {
    const res = await editPostIs(updatedPost);
    setEditedPost(updatedPost);
  };

  const handleCardClick = () => {
    setShowBidCount(false);
    handleViewReplay();
  };

  const handleViewReplay = async () => {
    await fetchReplays();
    setIsReplayModalOpen(true);
  };

  const handleCloseReplayModal = async () => {
    try {
      const result = await dispatch(markBidsAsRead(editedPost._id)).unwrap();
      console.log('markBidsAsRead result:', result); // Debug log
      await fetchReplays(); // Refetch to sync with server
      setShowBidCount(false);
    } catch (error) {
      console.error('Failed to mark bids as read:', error);
    } finally {
      setIsReplayModalOpen(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isEditDisabled = () => {
    const eventDate = new Date(editedPost.date);
    const now = new Date();
    return (eventDate.getTime() - now.getTime()) / (1000 * 3600 * 24) < 2;
  };

  return (
    <>
      <div
        id={`post-${editedPost._id}`}
        onClick={handleCardClick}
        className="bg-white rounded-2xl cursor-pointer shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col relative group"
      >
        <div className="bg-white border-gray-100 p-5 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[#708A58] truncate group-hover:text-[#708A58] transition-colors duration-200">
            {editedPost.eventName}
          </h2>
          <Pen
            className={`h-5 w-5 transition-colors duration-200 ${
              isEditDisabled()
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-400 hover:text-[#708A58] cursor-pointer'
            }`}
            onClick={handleEditClick}
          />
        </div>

        <div className="p-6 flex-grow flex flex-col justify-between bg-white">
          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-[#708A58] mt-0.5" />
              <div>
                <p className="font-semibold text-gray-800">{editedPost.district}</p>
                <p className="text-xs text-gray-500">
                  Lat: {editedPost.location.lat.toFixed(4)}, Lng: {editedPost.location.lng.toFixed(4)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#708A58]" />
                <span className="text-gray-700 font-medium">{editedPost.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#708A58]" />
                <span className="text-gray-700 font-medium">{editedPost.time}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-[#708A58]" />
              <span className="text-gray-700">
                Food for <span className="font-semibold text-[#2D4F2B]">{editedPost.quantity} people</span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Utensils className="h-5 w-5 text-[#708A58]" />
                <span className="font-semibold text-gray-800">Menu</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {editedPost.menu.map((item, idx) => (
                  <span
                    key={idx}
                    className="bg-white text-[#2D4F2B] text-xs px-3 py-1 rounded-full border shadow-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-gray-600 line-clamp-3 mt-2 text-sm">{editedPost.description}</p>
          </div>

          <div className="mt-6 pt-4 border-t text-xs text-gray-500 flex justify-between items-center">
            <span>
              Posted on: <span className="font-medium text-gray-700">{formatDate(editedPost.createdAt)}</span>
            </span>
            {unreadCount > 0 && showBidCount && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewReplay();
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
        <EditPostModal
          post={editedPost}
          onClose={handleCloseModal}
          onSave={handlePostEdit}
        />
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