import React, { useState } from 'react';
import { Post } from '@/types/post';
import { X } from 'lucide-react';
import { showSuccess } from '../shared/ToastUtilis';

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
    showSuccess('Post updated successfully')
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex justify-center items-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl overflow-y-auto max-h-[90vh]">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Edit Post</h3>
        <div className="space-y-5">
          
          {[
            { id: 'eventName', label: 'Event Name', type: 'text' },
            { id: 'date', label: 'Date', type: 'date' },
            { id: 'time', label: 'Time', type: 'time' },
            { id: 'quantity', label: 'Quantity', type: 'number' },
          ].map(({ id, label, type }) => (
            <div key={id}>
              <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                {label}
              </label>
              <input
                id={id}
                name={id}
                type={type}
                value={(updatedPost as any)[id]}
                 min={new Date().toISOString().split('T')[0]}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>
          ))}

          
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">Menu</label>
  <div className="space-y-3">
    {updatedPost.menu.map((menuItem, index) => (
      <div key={index} className="flex items-center gap-2">
        <input
          type="text"
          value={menuItem}
          onChange={(e) => handleMenuChange(index, e.target.value)}
          placeholder={`Menu Item ${index + 1}`}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
        />
        <button
          type="button"
          onClick={() => handleRemoveMenu(index)}
          className="text-gray-500 cursor-pointer hover:text-red-500 transition"
          aria-label="Remove Menu Item"
        >
          <X size={18} />
        </button>
      </div>
    ))}
  </div>

  <button
    type="button"
    onClick={handleAddMenu}
    className="mt-4 inline-flex cursor-pointer items-center gap-1 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 px-3 py-1.5 rounded-md transition"
  >
    + Add Menu Item
  </button>
</div>

         

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={updatedPost.description}
              onChange={handleChange}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 cursor-pointer text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 cursor-pointer text-sm rounded-md bg-orange-500 text-white hover:bg-orange-600 transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPostModal;
