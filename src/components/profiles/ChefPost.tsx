'use client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchChefPostByChefId } from '@/features/profileSlice';

type Props = {
  chefId: string;
};

const ChefPostView = ({ chefId }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { post, loading, error } = useSelector((state: RootState) => state.profile);

  useEffect(() => {
    if (chefId) {
      dispatch(fetchChefPostByChefId(chefId));
    }
  }, [chefId, dispatch]);

  if (loading) return <p className="text-center py-10">Loading posts...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!post || post.length === 0) return <p className="text-center text-gray-500">No posts found</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {post.map((item) => (
          <div
            key={item._id}
            className="relative group overflow-hidden rounded-lg border border-gray-200 shadow-sm"
          >
            {item.images?.[0]?.url ? (
              <img
                src={item.images[0].url}
                alt={item.title}
                className="w-full h-60 object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="h-60 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                No Image
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {item.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChefPostView;
