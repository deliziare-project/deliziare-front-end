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

interface ChefPostFormProps {
  chefId: string;
}

const ChefPostForm: React.FC<ChefPostFormProps> = () => {
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
    // formData.append('chefId', chefId);
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
      toast('post created successfully')
      reset();
      dispatch(resetPostState());
    }
  }, [success, dispatch, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl mx-auto space-y-4 p-4">
      <h2 className="text-2xl font-semibold mb-4">Create Chef Post</h2>

      <div>
        <label className="block font-medium">Title</label>
        <input
          type="text"
          {...register('title', { required: 'Title is required' })}
          className="w-full border rounded p-2"
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block font-medium">Description</label>
        <textarea
          {...register('description', { required: 'Description is required' })}
          className="w-full border rounded p-2"
        />
        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
      </div>

      <div>
        <label className="block font-medium">Tags</label>
        <input
          type="text"
          {...register('tags')}
          className="w-full border rounded p-2"
        />
      </div>

      <div>
        <label className="block font-medium">Upload Images</label>
        <input
          type="file"
          multiple
          accept="image/*"
          {...register('images', { required: 'At least one image is required' })}
          className="w-full"
        />
        {errors.images && <p className="text-red-500 text-sm">{errors.images.message}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? 'Uploading...' : 'Create Post'}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  );
};

export default ChefPostForm;
