// First, update your TagInput component to work with Controller:
'use client';

import { Plus, X } from 'lucide-react';
import { useState } from 'react';

type Props = {
  label: string;
  tags: string[];
  setTags: (tags: string[]) => void;
  placeholder?: string;
  buttonLabel?: string;
  tagColor?: string;
  error?: string;
};

export default function TagInput({
  label,
  tags,
  setTags,
  placeholder,
  buttonLabel = "Add",
  tagColor = "bg-blue-100 text-blue-800",
  error
}: Props) {
  const [inputValue, setInputValue] = useState('');

  const addTag = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setInputValue('');
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div>
      <label className="block text-lg font-semibold mb-2 text-gray-700">{label}</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300 text-gray-500"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={addTag}
          className="px-2 text-[#B8755D] rounded-lg transition"
        >
          {buttonLabel === 'Add' ? 'Add' : <Plus size={18} />}
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mt-3">
        {tags.map((tag, index) => (
          <span key={index} className={`flex items-center px-3 py-1 ${tagColor} rounded-full text-sm`}>
            {tag}
            <button type="button" onClick={() => removeTag(index)} className="ml-2 hover:text-red-500">
              <X size={16} />
            </button>
          </span>
        ))}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}