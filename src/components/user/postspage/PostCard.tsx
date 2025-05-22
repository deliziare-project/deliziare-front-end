import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Utensils, Users, Pen } from 'lucide-react';
import { Post } from '@/types/post';
import EditPostModal from '@/components/ui/EditPostModal';
import { editPostIs } from '@/services/postService';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedPost, setEditedPost] = useState(post);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handlePostEdit = async(updatedPost: Post) => {
  let res= await editPostIs(updatedPost)
  console.log(res)
    setEditedPost(updatedPost);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
      <div className="bg-white border-b border-gray-100 p-4">
        <h2 className="text-xl font-bold text-gray-800 truncate">{editedPost.eventName}</h2>
        <Pen className="h-4 w-4 text-gray-400 hover:text-orange-500 cursor-pointer" onClick={handleEditClick} />
      </div>
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-start gap-2">
            <MapPin className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
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
            <span className="text-gray-700">Food for <span className="font-semibold">{editedPost.quantity} people</span></span>
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
        
        <div className="mt-4 pt-3 border-t border-gray-100 text-sm text-gray-500">
          Posted on {formatDate(editedPost.createdAt)}
        </div>
      </div>

      {isModalOpen && (
        <EditPostModal post={editedPost} onClose={handleCloseModal} onSave={handlePostEdit} />
      )}
    </div>
  );
};

export default PostCard;
