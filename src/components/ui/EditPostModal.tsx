import React, { useState } from 'react';
import { Post } from '@/types/post';

interface EditPostModalProps {
  post: Post;
  onClose: () => void;
  onSave: (updatedPost: Post) => void;
}

const EditPostModal: React.FC<EditPostModalProps> = ({ post, onClose, onSave }) => {
  const [updatedPost, setUpdatedPost] = useState(post);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUpdatedPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleMenuChange = (index: number, value: string) => {
    const updatedMenu = [...updatedPost.menu];
    updatedMenu[index] = value;
    setUpdatedPost((prev) => ({ ...prev, menu: updatedMenu }));
  };

  const handleAddMenu = () => {
    setUpdatedPost((prev) => ({ ...prev, menu: [...prev.menu, ''] }));
  };

  const handleRemoveMenu = (index: number) => {
    const updatedMenu = updatedPost.menu.filter((_, i) => i !== index);
    setUpdatedPost((prev) => ({ ...prev, menu: updatedMenu }));
  };

  const handleSave = () => {
    onSave(updatedPost);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Edit Post</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700" htmlFor="eventName">Event Name</label>
            <input
              id="eventName"
              name="eventName"
              type="text"
              value={updatedPost.eventName}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-gray-700" htmlFor="date">Date</label>
            <input
              id="date"
              name="date"
              type="date"
              value={updatedPost.date}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-gray-700" htmlFor="time">Time</label>
            <input
              id="time"
              name="time"
              type="time"
              value={updatedPost.time}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-gray-700" htmlFor="quantity">Quantity</label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              value={updatedPost.quantity}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-gray-700">Menu</label>
            {updatedPost.menu.map((menuItem, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={menuItem}
                  onChange={(e) => handleMenuChange(index, e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveMenu(index)}
                  className="text-red-500"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddMenu}
              className="text-blue-500 mt-2"
            >
              Add Menu Item
            </button>
          </div>
          <div>
            <label className="block text-gray-700" htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={updatedPost.description}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-orange-500 text-white px-4 py-2 rounded-md"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPostModal;
