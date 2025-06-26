'use client';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchChefPostByChefId } from '@/features/profileSlice';
import { ChevronRight, ChevronLeft } from 'lucide-react';

type Props = {
  chefId: string;
};

const ChefPostView = ({ chefId }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { post, loading, error } = useSelector((state: RootState) => state.profile);
  const [imageIndexes, setImageIndexes] = useState<{ [postId: string]: number }>({});

  useEffect(() => {
    if (chefId) {
      dispatch(fetchChefPostByChefId(chefId));
    }
  }, [chefId, dispatch]);

  const nextImage = (postId: string, length: number) => {
    setImageIndexes((prev) => ({
      ...prev,
      [postId]: ((prev[postId] || 0) + 1) % length,
    }));
  };

  const prevImage = (postId: string, length: number) => {
    setImageIndexes((prev) => ({
      ...prev,
      [postId]: ((prev[postId] || 0) - 1 + length) % length,
    }));
  };

  if (loading) return <p className="text-center py-10 text-gray-600">Loading posts...</p>;
  if (error) return <p className="text-red-500 text-center py-10">{error}</p>;
  if (!post || post.length === 0)
    return <p className="text-center text-gray-500 py-10">No posts found</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[...post].reverse().map((item) => (
          <div
            key={item._id}
            className="relative group overflow-hidden rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="relative h-60">
              {item.images?.length ? (
                <>
                  <img
                    src={item.images[imageIndexes[item._id] || 0].url}
                    alt={item.images[imageIndexes[item._id] || 0].altText || item.title}
                    className="w-full h-60 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {item.images.length > 1 && (
                    <>
                      <button
                        onClick={() => prevImage(item._id, item.images.length)}
                        className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white text-[#708A58] opacity-0 group-hover:opacity-100 transition-all duration-200"
                        aria-label="Previous image"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        onClick={() => nextImage(item._id, item.images.length)}
                        className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white text-[#708A58] opacity-0 group-hover:opacity-100 transition-all duration-200"
                        aria-label="Next image"
                      >
                        <ChevronRight size={16} />
                      </button>
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {item.images.map((_, idx) => (
                          <span
                            key={idx}
                            className={`w-2 h-2 rounded-full ${
                              idx === (imageIndexes[item._id] || 0)
                                ? 'bg-[#708A58]'
                                : 'bg-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="h-60 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                  No Image
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 truncate">
                {item.title}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChefPostView;