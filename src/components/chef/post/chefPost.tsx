'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '@/redux/store';
import { createChefPost, resetPostState } from '@/features/chefPostSlice';
import toast from 'react-hot-toast';

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
  const { loading, success, error } = useAppSelector((state) => state.chefPost);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('tags', data.tags);

    Array.from(data.images).forEach((file) => {
      formData.append('images', file);
    });

    dispatch(createChefPost(formData));
  };

  useEffect(() => {
    if (success) {
      toast.success('Post created successfully!');
      reset();
      dispatch(resetPostState());
    }
  }, [success, dispatch, reset]);

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Create  New Post</h2>

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
            {...register('description', { required: 'Description is required' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8755D]"
          />
          {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
          <input
            type="text"
            {...register('tags')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8755D]"
          />
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Upload Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            {...register('images', { required: 'At least one image is required' })}
            className="w-full text-sm text-gray-500"
          />
          {errors.images && <p className="text-sm text-red-500 mt-1">{errors.images.message}</p>}
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#B8755D] hover:bg-[#a66249] text-white font-semibold px-6 py-2 rounded-lg transition duration-200 ease-in-out disabled:opacity-50"
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
