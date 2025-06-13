'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '@/redux/store';
import { createChefPost, resetPostState } from '@/features/chefPostSlice';
import toast from 'react-hot-toast';
import { Router } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { showSuccess } from '@/components/shared/ToastUtilis';

type FormValues = {
  title: string;
  description: string;
  tags: string;
  images: FileList;
};

const useAppDispatch: () => AppDispatch = useDispatch;
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

const ChefPostForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const router=useRouter()
  const { loading, success, error } = useAppSelector((state) => state.chefPost);
const [tags, setTags] = useState<string[]>([]);
const [inputTag, setInputTag] = useState('');
const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

 const {
  register,
  handleSubmit,
  reset,
  formState: { errors },
} = useForm<FormValues>({ mode: 'onTouched' });

  const onSubmit = (data: FormValues) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('tags', tags.join(','));

    Array.from(data.images).forEach((file) => {
      formData.append('images', file);
    });

    dispatch(createChefPost(formData));
    
  };

  useEffect(() => {
    if (success) {
      
      reset();
      dispatch(resetPostState());
      router.push('/chef/post')
      showSuccess('Post created successfully')
    }
  }, [success, dispatch, reset,router]);

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Create New Post</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            {...register('title', { required: 'Title is required' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8755D]"
          />
          {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            rows={4}
            {...register('description')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8755D]"
          />
          {errors.description && (
            <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
          )}
        </div>

{/* Tags */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
  <input
    type="text"
    value={inputTag}
    onChange={(e) => setInputTag(e.target.value)}
    onKeyDown={(e) => {
      if ((e.key === 'Enter' || e.key === ',') && inputTag.trim()) {
        e.preventDefault();
        if (!tags.includes(inputTag.trim())) {
          setTags([...tags, inputTag.trim()]);
        }
        setInputTag('');
      }
    }}
    placeholder="eg: cake, dessert, vegan"
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8755D] text-sm"
  />

  {/* Tags Preview */}
  <div className="flex flex-wrap gap-2 mt-2">
    {tags.map((tag, index) => (
      <span
        key={index}
        className="bg-[#B8755D] text-white px-3 py-1 rounded-full flex items-center gap-2 text-sm"
      >
        #{tag}
        <button
          type="button"
          onClick={() => setTags(tags.filter((_, i) => i !== index))}
          className="ml-1 text-white hover:text-gray-200"
        >
          &times;
        </button>
      </span>
    ))}
  </div>
</div>


    {/* Images */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Upload Images</label>
  
  <label className="block w-full px-4 py-2 text-center border border-gray-300 rounded-lg cursor-pointer">
    Choose Images
    <input
      type="file"
      multiple
      accept="image/*"
      {...register('images', {
        required: 'Please upload an image',
        onChange: (e) => setSelectedFiles(e.target.files),
      })}
      className="hidden"
    />
  </label>
  {selectedFiles && (
  <ul className="mt-2 text-sm text-gray-700 list-disc list-inside">
    {Array.from(selectedFiles).map((file, idx) => (
      <li key={idx}>{file.name}</li>
    ))}
  </ul>
)}


  {errors.images && (
    <p className="text-sm text-red-500 mt-1">{errors.images.message}</p>
  )}
</div>


        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#B8755D] cursor-pointer hover:bg-[#a66249] text-white font-semibold px-6 py-2 rounded-lg transition duration-200 ease-in-out disabled:opacity-50"
          >
            {loading ? 'Uploading...' : 'Create Post'}
          </button>
        </div>

        {/* Error Message */}
        {error && <p className="text-center text-red-600 font-medium">{error}</p>}
      </form>
    </div>
  );
};

export default ChefPostForm;
