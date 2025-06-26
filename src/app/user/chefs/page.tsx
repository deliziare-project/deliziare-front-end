
"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/api/axiosInstance";
import {
  Bookmark,
  MessageCircle,
  MoreHorizontal,
  Reply,
  ChefHat,
  MapPin,
  Calendar,
  Heart,
  Star,
  Clock,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/loaders/Skeleton";
import Pagination from "@/components/admin/userManagement/Pagination";
import Link from "next/link";
import AuthWrapper from "@/components/AuthWrapper";
import { useDispatch, useSelector } from "react-redux";
import { openChat, replayChat } from "@/features/chatSlice";
import { RootState } from "@/redux/store";

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

const HostViewChefPosts = () => {
  const [posts, setPosts] = useState<ChefPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savedPosts, setSavedPosts] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const postsPerPage = 6;
  const [isLoading, setIsLoading] = useState(false);
  const [imageIndexes, setImageIndexes] = useState<{ [postId: string]: number }>({});
  const [expandedTags, setExpandedTags] = useState<{ [postId: string]: boolean }>({});

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

  const toggleTags = (postId: string) => {
    setExpandedTags((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

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

  const formatDate = (dateString: string) => {
    const date = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(new Date(dateString));
    return date;
  };

  const toggleSavePost = async (postId: string) => {
    try {
      const alreadySaved = savedPosts.includes(postId);
      if (!alreadySaved) {
        await axiosInstance.post(`userclient/savedPost/${postId}`);
        setSavedPosts((prev) => [...prev, postId]);
        toast.success("Saved to favorites!");
      } else {
        setSavedPosts((prev) => prev.filter((id) => id !== postId));
        toast.success("Removed from favorites!");
      }
    } catch (error) {
      console.error("Failed to save post:", error);
      toast.error("Failed to save post");
    }
  };

  const handleReplay = (post: any) => {
    dispatch(replayChat(post));
    dispatch(openChat(post.chefId._id));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <Skeleton />
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(posts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = [...posts]
    .reverse()
    .slice(indexOfFirstPost, indexOfLastPost);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center py-12 px-8 bg-white shadow-lg rounded-xl border border-gray-200">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-50 rounded-full flex items-center justify-center">
            <Heart className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-lg font-semibold text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center py-12 px-8 bg-white shadow-lg rounded-xl border border-gray-200">
          <ChefHat className="w-12 h-12 mx-auto mb-4 text-[#708A58]" />
          <p className="text-lg font-semibold text-gray-700">No culinary stories found</p>
        </div>
      </div>
    );
  }

  return (
    <AuthWrapper routeType="private">
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        {/* Page Header */}
        <div className="bg-white shadow-sm border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <h1 className="text-2xl font-bold text-[#708A58] tracking-tight">Explore Chef Creations</h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          {/* Posts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentPosts.map((post) => (
              <div key={post._id} className="group">
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  {/* Chef Profile Header */}
                  <div className="p-4 bg-gray-50 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Link
                          href={`/profiles/chefProfile/${post.chefId?._id}`}
                          className="relative group/avatar"
                        >
                          <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white shadow-sm transition-all duration-200 group-hover:ring-[#708A58]">
                            <img
                              src={post.chefId?.profileImage || "/default-profile.png"}
                              alt={post.chefId?.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute -bottom-1 right-0 w-4 h-4 bg-[#708A58] rounded-full flex items-center justify-center shadow-sm">
                            <ChefHat className="w-2.5 h-2.5 text-white" />
                          </div>
                        </Link>
                        <div>
                          <h3 className="font-semibold text-gray-800 text-sm hover:text-[#708A58] transition-colors">
                            <Link href={`/profiles/chefProfile/${post.chefId?._id}`}>
                              {post.chefId?.username || post.chefId?.name}
                            </Link>
                          </h3>
                          <div className="flex items-center text-gray-500 text-xs mt-1 space-x-2">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3 text-[#708A58]" />
                              <span>{formatDate(post.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Post Image */}
                  <div className="relative">
                    {post.images?.length ? (
                      <div className="h-64 relative overflow-hidden">
                        <img
                          src={post.images[imageIndexes[post._id] || 0].url}
                          alt={post.images[imageIndexes[post._id] || 0].altText || post.title}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {post.images.length > 1 && (
                          <>
                            <button
                              onClick={() => prevImage(post._id, post.images?.length ?? 0)}

                              className="absolute top-1/2 left-3 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-all duration-200 text-[#708A58] opacity-0 group-hover:opacity-100"
                            >
                              <ChevronLeft size={16} />
                            </button>
                            <button
                              onClick={() => prevImage(post._id, post.images?.length ?? 0)}

                              className="absolute top-1/2 right-3 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-all duration-200 text-[#708A58] opacity-0 group-hover:opacity-100"
                            >
                              <ChevronRight size={16} />
                            </button>
                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1">
                              {post.images.map((_, idx) => (
                                <span
                                  key={idx}
                                  className={`w-2 h-2 rounded-full ${
                                    idx === (imageIndexes[post._id] || 0)
                                      ? "bg-[#708A58]"
                                      : "bg-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="h-64 bg-gray-100 flex items-center justify-center rounded-b-lg">
                        <div className="text-center space-y-2">
                          <ChefHat className="w-8 h-8 text-[#708A58] mx-auto" />
                          <p className="text-gray-500 text-sm font-medium">No Image</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Post Content */}
                  <div className="p-5">
                    <div className="space-y-3">
                      <div>
                        <h2 className="text-lg font-bold text-gray-800 mb-1 line-clamp-2">
                          {post.title}
                        </h2>
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                          {post.description}
                        </p>
                      </div>

                      {/* Tags */}
                      {post.tags?.length ? (
                        <div className="flex flex-wrap gap-2">
                          {expandedTags[post._id]
                            ? post.tags.map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 text-xs font-medium bg-[#708A58]/10 text-[#708A58] rounded-full border border-[#708A58]/20"
                                >
                                  #{tag}
                                </span>
                              ))
                            : post.tags.slice(0, 3).map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 text-xs font-medium bg-[#708A58]/10 text-[#708A58] rounded-full border border-[#708A58]/20"
                                >
                                  #{tag}
                                </span>
                              ))}
                          {post.tags.length > 3 && !expandedTags[post._id] && (
                            <button
                              onClick={() => toggleTags(post._id)}
                              className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                            >
                              +{post.tags.length - 3}
                            </button>
                          )}
                          {post.tags.length > 3 && expandedTags[post._id] && (
                            <button
                              onClick={() => toggleTags(post._id)}
                              className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                            >
                              Show Less
                            </button>
                          )}
                        </div>
                      ) : null}

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <button
                          onClick={() => handleReplay(post)}
                          className="inline-flex items-center text-sm font-semibold text-[#708A58] hover:text-[#16610E] transition-colors"
                        >
                          <Reply className="w-4 h-4 mr-2" />
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  isLoading={isLoading}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthWrapper>
  );
};

export default HostViewChefPosts;