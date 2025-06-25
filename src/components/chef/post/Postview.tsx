// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch, RootState } from '@/redux/store';
// import { fetchChefPosts } from '@/features/chefPostSlice';
// import { Pencil } from 'lucide-react';
// import ChefPostForm from './chefPost';

// const MyChefPosts = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { posts, loading, error } = useSelector((state: RootState) => state.chefPost);

//   const [editingPost, setEditingPost] = useState<any | null>(null);

//   useEffect(() => {
//     dispatch(fetchChefPosts());
//   }, [dispatch]);

//   if (loading) return <p className="text-center text-[#B8755D]">Loading...</p>;
//   if (error) return <p className="text-center text-red-500">Error: {error}</p>;

//   if (editingPost) {
//     return (
//       <ChefPostForm
//         initialData={editingPost}
//         isEditing={true}
//         onCancel={() => setEditingPost(null)}
//       />
//     );
//   }

//   return (
//     <div className="p-6 min-h-screen bg-[#fdf9f7]">
//       <h1 className="text-3xl font-bold mb-6 text-[#B8755D] text-center">My Posts</h1>

//       {posts.length === 0 ? (
//         <p className="text-center text-gray-500">You haven't created any posts yet.</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {posts.map((post) => (
//             <div
//               key={post._id}
//               className="bg-white rounded-xl shadow-sm border border-[#e4d4cc] hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col h-full"
//             >
//               <div className="p-4 flex flex-col gap-3 flex-grow relative">
//                 {/* Edit Icon */}
//                 <button
//                   onClick={() => setEditingPost(post)}
//                   className="absolute top-2 right-2 p-1 bg-gray-200 hover:bg-gray-300 rounded-full"
//                 >
//                   <Pencil className="h-4 w-4 text-[#B8755D]" />
//                 </button>

//                 <h2 className="text-lg font-semibold text-[#B8755D]">{post.title}</h2>
//                 <p className="text-sm text-gray-700 line-clamp-3">{post.description}</p>

//                 <div className="flex flex-wrap gap-2">
//                   {post.tags.map((tag, index) => (
//                     <span
//                       key={index}
//                       className="text-xs font-medium bg-[#f4e4df] text-[#B8755D] px-2 py-1 rounded-full"
//                     >
//                       #{tag}
//                     </span>
//                   ))}
//                 </div>
//               </div>

//               {post.images[0]?.url && (
//                 <img
//                   src={post.images[0].url}
//                   alt={post.images[0]?.altText || 'Chef Post'}
//                   className="w-full h-60 object-cover"
//                 />
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyChefPosts;


'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchChefPosts } from '@/features/chefPostSlice';
import { Pencil } from 'lucide-react';
import ChefPostForm from './chefPost';

const MyChefPosts = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, loading, error } = useSelector((state: RootState) => state.chefPost);
  const [editingPost, setEditingPost] = useState<any | null>(null);
  const [imageIndexes, setImageIndexes] = useState<{ [postId: string]: number }>({});
  const [imageLoading, setImageLoading] = useState<{ [postId: string]: boolean }>({});

  useEffect(() => {
    dispatch(fetchChefPosts());
  }, [dispatch]);

  // Preload images after posts are fetched
  useEffect(() => {
    posts.forEach((post) => {
      post.images.forEach((image) => {
        const img = new Image();
        img.src = image.url;
      });
    });
  }, [posts]);

  const nextImage = (postId: string, imagesLength: number) => {
    setImageIndexes((prev) => ({
      ...prev,
      [postId]: (prev[postId] + 1) % imagesLength || 0,
    }));
    setImageLoading((prev) => ({ ...prev, [postId]: true }));
  };

  const prevImage = (postId: string, imagesLength: number) => {
    setImageIndexes((prev) => ({
      ...prev,
      [postId]: (prev[postId] - 1 + imagesLength) % imagesLength || 0,
    }));
    setImageLoading((prev) => ({ ...prev, [postId]: true }));
  };

  const handleSuccess = () => {
    setEditingPost(null);
    dispatch(fetchChefPosts());
  };

  if (loading) return <p className="text-center text-[#B8755D]">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  if (editingPost) {
    return (
      <ChefPostForm
        initialData={editingPost}
        isEditing={true}
        onCancel={() => setEditingPost(null)}
        onSuccess={handleSuccess}
      />
    );
  }

  return (
    <div className="p-6 min-h-screen bg-[#fdf9f7]">
      <h1 className="text-3xl font-bold mb-6 text-[#B8755D] text-center">My Posts</h1>

      {posts.length === 0 ? (
        <p className="text-center text-gray-500">You haven't created any posts yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => {
            const currentImageIndex = imageIndexes[post._id] || 0;
            const currentImage = post.images[currentImageIndex];

            return (
              <div
                key={post._id}
                className="bg-white rounded-xl shadow-sm border border-[#e4d4cc] hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col h-full relative"
              >
                <div className="p-4 flex flex-col gap-3 flex-grow relative">
                  <button
                    onClick={() => setEditingPost(post)}
                    className="absolute top-2 right-2 p-1 bg-gray-200 hover:bg-gray-300 rounded-full z-10"
                  >
                    <Pencil className="h-4 w-4 text-[#B8755D]" />
                  </button>

                  <h2 className="text-lg font-semibold text-[#B8755D]">{post.title}</h2>
                  <p className="text-sm text-gray-700 line-clamp-3">{post.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs font-medium bg-[#f4e4df] text-[#B8755D] px-2 py-1 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Image Carousel */}
                {post.images.length > 0 && (
                  <div className="relative w-full h-60">
                    {imageLoading[post._id] && (
                      <div className="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center z-10">
                        <span className="text-[#B8755D] text-sm">Loading image...</span>
                      </div>
                    )}
                    <img
                      loading="lazy"
                      src={currentImage?.url}
                      alt={currentImage?.altText || 'Chef Post'}
                      onLoad={() =>
                        setImageLoading((prev) => ({ ...prev, [post._id]: false }))
                      }
                      className="w-full h-60 object-cover transition-all duration-300"
                    />

                    {post.images.length > 1 && (
                      <>
                        <button
                          onClick={() => prevImage(post._id, post.images.length)}
                          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-1 z-10 hover:bg-opacity-90"
                        >
                          ‹
                        </button>
                        <button
                          onClick={() => nextImage(post._id, post.images.length)}
                          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-1 z-10 hover:bg-opacity-90"
                        >
                          ›
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyChefPosts;
