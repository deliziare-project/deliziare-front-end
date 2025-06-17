import axiosInstance from "@/api/axiosInstance";
import React, { useEffect, useState } from "react";

interface ChefPost {
  _id: string;
  title: string;
  description: string;
  tags?: string[];
  images?: {
    url: string;
    altText?: string;
  }[];
  chefId?: {
    name: string;
    username?: string;
    profileImage?: string;
    district?: string;
    _id: string;
  };
  createdAt: string;
}

function Allchefpost() {
  const [posts, setPosts] = useState<ChefPost[]>([]);
  console.log(posts);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  

  useEffect(() => {
    const fetchChefPosts = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/chefs/all");
        setPosts(res.data);
      } catch (err) {
        console.error("Error fetching chef posts:", err);
        setError("Failed to load chef posts");
      } finally {
        setLoading(false);
      }
    };

    fetchChefPosts();
  }, []);
  const sliced = posts.slice(0, 4);
  return (
   <div className="px-8 py-12 h-1/2 bg-white ">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
    {sliced.map((post, index) => (
      <div
        key={post._id}
        className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 hover:bg-white/20 hover:scale-105 transition-all duration-500 text-center relative group border border-white/10 hover:border-[#708A58] shadow-xl hover:shadow-2xl hover:shadow-[#2D4F2B]"
      >
      

        <div className="mb-6 flex justify-center">
          <div className="w-28 h-28 rounded-full overflow-hidden p-1 bg-gray-300 shadow-2xl group-hover:shadow-[#708A58] transition-all duration-300">
            <div className="w-full h-full rounded-full overflow-hidden bg-[#91958e]">
              <img
                src={post.images?.[0]?.url}
                alt={post.images?.[0]?.altText || "Chef Dish"}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="text-center space-y-4">
          <h3 className="text-md font-medium text-gray-400 mb-2 line-clamp-2 group-hover:text-[#708A58] transition-colors duration-300">
            {post.title}
          </h3>

          {/* Price */}
          {/* <div className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-3">
            ${post.price || 15}.00
          </div> */}

          {/* Rating or additional info */}
          {/* <div className="flex justify-center items-center text-yellow-400 mb-3">
            <div className="flex text-lg">
              <span className="hover:scale-125 transition-transform duration-200">★</span>
              <span className="hover:scale-125 transition-transform duration-200">★</span>
              <span className="hover:scale-125 transition-transform duration-200">★</span>
              <span className="hover:scale-125 transition-transform duration-200">★</span>
              <span className="hover:scale-125 transition-transform duration-200">★</span>
            </div>
            <span className="text-sm text-gray-300 ml-2 font-medium">4.8 Rating</span>
          </div> */}

          {/* Chef Name */}
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-r from-[#2D4F2B] to-[#708A58] rounded-full flex items-center justify-center">
              <span className="text-white text-xs">👨‍🍳</span>
            </div>
            <p className="text-sm text-[#708A58] font-medium">
              by {post.chefId?.name}
            </p>
          </div>

          {/* Add to Cart Button */}
          {/* <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:shadow-orange-500/30 transform hover:scale-105">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add to Cart
          </button> */}
        </div>

        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-br from-orange-500/20 to-transparent rounded-bl-3xl rounded-tr-3xl"></div>
      </div>
    ))}
  </div>

  {loading && (
    <div className="text-center mt-12">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent shadow-lg"></div>
      <p className="text-white mt-4 text-lg font-medium">Loading delicious dishes...</p>
    </div>
  )}

  {error && (
    <div className="text-center mt-12 bg-red-500/20 backdrop-blur-lg rounded-2xl p-6 max-w-md mx-auto border border-red-500/30 shadow-xl">
      <div className="flex items-center justify-center mb-2">
        <svg className="w-6 h-6 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-red-300 font-semibold">Oops! Something went wrong</span>
      </div>
      <p className="text-red-200">{error}</p>
    </div>
  )}
</div>
  );
}

export default Allchefpost;
