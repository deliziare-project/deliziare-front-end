
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '@/redux/store';
import { createChefPost, resetPostState, updateChefPost } from '@/features/chefPostSlice';
import { showSuccess } from '@/components/shared/ToastUtilis';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

type FormValues = {
  title: string;
  description: string;
  tags: string;
  images: FileList;
};

type Props = {
  initialData?: any;
  isEditing?: boolean;
  onCancel?: () => void;
  onSuccess?: () => void;
};

const useAppDispatch: () => AppDispatch = useDispatch;
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

const ChefPostForm: React.FC<Props> = ({ initialData, isEditing = false, onCancel, onSuccess }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, success, error } = useAppSelector((state) => state.chefPost);
  const [tags, setTags] = useState<string[]>([]);
  const [inputTag, setInputTag] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<any[]>([]);
  const hasShownToast = useRef(false);

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

    // Append new uploaded images
    selectedFiles.forEach((file) => {
      formData.append('images', file);
    });

    // Handle removed existing images
    if (isEditing && initialData?.images) {
      const removedImageIds = initialData.images
        .filter((img: any) => !existingImages.some((e) => e._id === img._id))
        .map((img: any) => img._id);
      formData.append('removedImages', JSON.stringify(removedImageIds));
    }

    if (isEditing && initialData?._id) {
      dispatch(updateChefPost({ id: initialData._id, data: formData }));
    } else {
      dispatch(createChefPost(formData));
    }
  };

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        description: initialData.description,
      });
      setTags(initialData.tags || []);
      setExistingImages(initialData.images || []);
    }
  }, [initialData, reset]);

  useEffect(() => {
    if (success && !hasShownToast.current) {
      hasShownToast.current = true;
      reset();
      setTags([]);
      setSelectedFiles([]);
      setExistingImages([]);
      showSuccess(isEditing ? 'Post updated successfully' : 'Post created successfully');

      if (onSuccess) {
        onSuccess();
      } else if (onCancel) {
        onCancel();
      } else {
        router.push('/chef/post');
      }

      setTimeout(() => {
        dispatch(resetPostState());
        hasShownToast.current = false;
      }, 200);
    }
  }, [success, dispatch, reset, router, isEditing, onSuccess, onCancel]);

  return (
    <div className="max-w-3xl mx-auto my-12 p-8 bg-white rounded-2xl shadow-xl border border-[#B8755D]/10">
      <h2 className="text-3xl font-bold text-[#B8755D] mb-8 text-center tracking-tight">
        {isEditing ? 'Update Post' : 'Create New Post'}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
          <input
            type="text"
            {...register('title', { required: 'Title is required' })}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#B8755D] focus:border-transparent transition duration-200"
            placeholder="Enter post title"
          />
          {errors.title && (
            <p className="text-sm text-red-500 mt-2 font-medium">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
          <textarea
            rows={5}
            {...register('description')}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#B8755D] focus:border-transparent transition duration-200 resize-none"
            placeholder="Describe your dish or post"
          />
          {errors.description && (
            <p className="text-sm text-red-500 mt-2 font-medium">{errors.description.message}</p>
          )}
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Tags</label>
          <input
            type="text"
            value={inputTag}
            onChange={(e) => setInputTag(e.target.value)}
            onKeyDown={(e) => {
              if ((e.key === 'Enter' || e.key === ',') && inputTag.trim()) {
                e.preventDefault();
                const cleanTag = inputTag.trim().replace(/^#/, '');
                if (!tags.includes(cleanTag)) {
                  setTags([...tags, cleanTag]);
                }
                setInputTag('');
              }
            }}
            placeholder="e.g., cake, dessert, vegan"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#B8755D] focus:border-transparent transition duration-200"
          />
          <div className="flex flex-wrap gap-2 mt-4">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="bg-[#B8755D] text-white px-4 py-1.5 rounded-full flex items-center gap-2 text-sm font-medium transition duration-200 hover:bg-[#a66249]"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => setTags(tags.filter((_, i) => i !== index))}
                  className="ml-2 text-white hover:text-gray-100 transition duration-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Images</label>
          {isEditing && existingImages.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-3 font-medium">Current Images:</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {existingImages.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img.url}
                      alt={`Current image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-200 transition duration-200 group-hover:opacity-80"
                    />
                    <button
                      type="button"
                      onClick={() => setExistingImages((prev) => prev.filter((_, i) => i !== index))}
                      className="absolute top-2 right-2 bg-[#B8755D] text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition duration-200 hover:bg-[#a66249]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <label className="block w-full px-4 py-3 text-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition duration-200">
            <span className="text-sm font-medium text-gray-600">Choose Images</span>
            <input
              type="file"
              multiple
              accept="image/*"
              {...register('images', {
                required: !isEditing ? 'Please upload an image' : false,
                onChange: (e) => {
                  const newFiles: File[] = Array.from(e.target.files || []);
                  setSelectedFiles((prev: File[]) => [...prev, ...newFiles]);
                },
                
              })}
              className="hidden"
            />
          </label>

          {selectedFiles.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-3 font-medium">Selected Images:</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {selectedFiles.map((file, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${idx + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-200 transition duration-200 group-hover:opacity-80"
                    />
                    <button
                      type="button"
                      onClick={() => setSelectedFiles((prev) => prev.filter((_, i) => i !== idx))}
                      className="absolute top-2 right-2 bg-[#B8755D] text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition duration-200 hover:bg-[#a66249]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {errors.images && (
            <p className="text-sm text-red-500 mt-2 font-medium">{errors.images.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#B8755D] text-white font-semibold px-8 py-3 rounded-lg hover:bg-[#a66249] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {loading ? (isEditing ? 'Updating...' : 'Uploading...') : isEditing ? 'Update Post' : 'Create Post'}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-200 text-gray-700 font-semibold px-8 py-3 rounded-lg hover:bg-gray-300 transition duration-200"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-center text-red-600 font-medium mt-4">{error}</p>
        )}
      </form>
    </div>
  );
};

export default ChefPostForm;