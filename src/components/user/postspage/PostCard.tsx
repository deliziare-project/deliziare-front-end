import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Utensils, Users, Pen } from 'lucide-react';
import { Post } from '@/types/post';
import EditPostModal from '@/components/ui/EditPostModal';
import axiosInstance from '@/api/axiosInstance';
import { editPostIs } from '@/services/postService';
import ReplayModal from '@/components/ui/ReplayModal';
import socket from '@/socket';
import { markBidsAsRead } from '@/features/bidSlice';
import { Replay } from '@/types/Replay';
import { NotificationType } from '@/features/notificationSlice';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReplayModalOpen, setIsReplayModalOpen] = useState(false);
  const [editedPost, setEditedPost] = useState(post);
  const [replays, setReplays] = useState<Replay[]>([]);

  const [showBidCount, setShowBidCount] = useState(true);
  const [hasUnreadBids, setHasUnreadBids] = useState(
    () => replays.some(bid => !bid.readByUser)
  );
  const [refreshKey, setRefreshKey] = useState(0);
  

  const bidCount = replays.length;


  const fetchReplays = async () => {
  try {
    const res = await axiosInstance.get('/bids/get-post-replay', {
      params: { postId: editedPost._id },
    });
    console.log('Fetched replays:', res.data);
    const replayData: Replay[] = res.data; // <-- add type here
    setReplays(replayData);

    const hasUnread = replayData.some(bid => !bid.readByUser);
    setHasUnreadBids(hasUnread);
    if (hasUnread) setShowBidCount(true);

    setRefreshKey(prev => prev + 1); // force rerender
  } catch (error) {
    console.error('Error fetching replays:', error);
  }
};

  

  useEffect(() => {
    fetchReplays();
  }, [editedPost._id]);

  interface NotificationPayload {
    type: string;
    postId: string;
  }
  

  useEffect(() => {
    const handleNewNotification = (notification: NotificationType) => {
      // Example check: if the notification.message contains 'new_bid'
      // or if you have a way to identify bid notifications in message or another field
      if (notification.message === 'new_bid' && notification.postId === editedPost._id) {
        setShowBidCount(true);
        setHasUnreadBids(true);
  
        const postElement = document.getElementById(`post-${notification.postId}`);
        if (postElement) {
          postElement.classList.add('animate-pulse');
          setTimeout(() => {
            postElement.classList.remove('animate-pulse');
          }, 500);
        }
  
        fetchReplays();
      }
    };
  
    socket?.on('new_notification', handleNewNotification);
  
    return () => {
      socket?.off('new_notification', handleNewNotification);
    };
  }, [editedPost._id]);
  
  
  
  
  
  
  useEffect(() => {
    setHasUnreadBids(replays.some(bid => !bid.readByUser));
    // If new bids came, show the badge
    if (replays.some(bid => !bid.readByUser)) {
      setShowBidCount(true);
    }
  }, [replays]);
  
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
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);
  const handleCloseReplayModal = async () => {
    setIsReplayModalOpen(false);
    try {
      await markBidsAsRead(editedPost._id);
      setReplays(prev => prev.map(bid => ({ ...bid, readByUser: true })));
      setHasUnreadBids(false);
      setShowBidCount(false);
    } catch (err) {
      console.error('Failed to mark bids as read:', err);
    }
  };
  

  const handlePostEdit = async (updatedPost: Post) => {
    const res = await editPostIs(updatedPost);
    console.log(res);
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
    try {
      const res = await axiosInstance.get('/bids/get-post-replay', {
        params: { postId: id._id },
      });
      console.log(res.data);
      setReplays(res.data);
      setIsReplayModalOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCardClick = () => {
    setShowBidCount(false);
    handleViewReplay(editedPost);
  };

  return (
    <>
      <div
        className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 h-full flex flex-col relative"
      
      >
        {/* Top Section */}
        <div className="bg-white border-b border-gray-100 p-4 flex justify-between">
          <h2 className="text-xl font-bold text-gray-800 truncate">{editedPost.eventName}</h2>
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

        {/* Content */}
        <div className="p-5 flex-grow flex flex-col justify-between"
          onClick={handleCardClick}
        >
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <MapPin className="h-5 w-5 text-orange-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-800">{editedPost.district}</p>
                <p className="text-sm text-gray-500">
                  Lat: {editedPost.location.lat.toFixed(4)}, Lng: {editedPost.location.lng.toFixed(4)}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-orange-500" />
                <span className="text-gray-700">{editedPost.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-500" />
                <span className="text-gray-700">{editedPost.time}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-orange-500" />
              <span className="text-gray-700">
                Food for <span className="font-semibold">{editedPost.quantity} people</span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Utensils className="h-5 w-5 text-orange-500" />
                <span className="font-medium text-gray-800">Menu</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {editedPost.menu.map((item, index) => (
                  <span
                    key={index}
                    className="bg-green-50 text-orange-600 text-xs px-2 py-1 rounded-full border border-green-100"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-gray-600 line-clamp-3 mt-2">{editedPost.description}</p>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500 flex justify-between items-center">
            <span>Posted on: {formatDate(editedPost.createdAt)}</span>

            {bidCount > 0 && showBidCount && hasUnreadBids && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewReplay(editedPost);
                  setShowBidCount(false);
                }}
                className="cursor-pointer"
              >
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold">
                  {bidCount}
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
