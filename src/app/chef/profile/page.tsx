'use client';

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState, AppDispatch } from '@/redux/store';
import { fetchLoggedInChef } from '@/features/chefSlice';
import { fetchChefPosts } from '@/features/chefPostSlice';
import { UserCircle, FileText, Utensils, Award, BookOpen, Edit3, MapPin } from 'lucide-react';
import SetPasswordModal from '@/components/user/userProfile/SetPasswordModal';
import AuthWrapper from '@/components/AuthWrapper';

const page: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'posts'>('overview');
  const [isSetPasswordOpen, setSetPasswordOpen] = useState(false);

  const { posts, loading: postsLoading, error: postsError } = useSelector((state: RootState) => state.chefPost);
  const { chef, loading, error } = useSelector((state: RootState) => state.chef);
  const { currentUser } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const loadChefProfile = async () => {
      try {
        await dispatch(fetchLoggedInChef());
      } catch (error) {
        console.error('Error loading chef profile:', error);
        if (error instanceof Error && error.message.includes('not found') && currentUser?.role === 'chef') {
          router.push('/chef/complete-profile');
        }
      }
    };
    loadChefProfile();
  }, [dispatch]);

  useEffect(() => {
    if (activeTab === 'posts') {
      dispatch(fetchChefPosts());
    }
  }, [activeTab, dispatch]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[300px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C26E4B]"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 max-w-5xl mx-auto my-8">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">Error loading profile: {error}</p>
        </div>
      </div>
    </div>
  );

  if (!chef) return (
    <div className="text-center py-12">
      <div className="mx-auto h-24 w-24 text-gray-400">
        <UserCircle className="w-full h-full" />
      </div>
      <h3 className="mt-2 text-lg font-medium text-gray-900">No chef data available</h3>
      <p className="mt-1 text-sm text-gray-500">Please complete your profile to get started.</p>
      <div className="mt-6">
        <button
          onClick={() => router.push('/chef/complete-profile')}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#C26E4B] hover:bg-[#A85A3A] focus:outline-none"
        >
          Complete Profile
        </button>
      </div>
    </div>
  );

  return (
    <AuthWrapper routeType='private'>
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-8">
            <div className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  {currentUser?.profileImage ? (
                    <img
                      src={currentUser.profileImage}
                      alt="avatar"
                      className="w-24 h-24 rounded-full border-4 border-[#F9EBE5] shadow-sm object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 flex items-center justify-center rounded-full bg-gradient-to-br from-[#F9EBE5] to-[#F8D9C8] text-[#5A2D1A] text-4xl font-bold border border-[#F9EBE5] shadow-sm">
                      {currentUser?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}

                  <div>
                    <h1 className="text-2xl font-serif font-bold text-[#5A2D1A]">{chef.userId?.name}</h1>
                    <p className="text-[#7D6B64]">{chef.userId?.email}</p>
                    {chef.userId?.phone && <p className="text-[#7D6B64]">{chef.userId.phone}</p>}
                    {chef.district && (
                      <p className="flex items-center text-[#7D6B64] mt-1">
                        <MapPin className="w-4 h-4 mr-1 text-[#C26E4B]" />
                        {chef.district}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => router.push('/chef/complete-profile')}
                    className="flex cursor-pointer items-center justify-center px-4 py-2 bg-[#C26E4B] text-white text-sm font-medium rounded-lg hover:bg-[#A85A3A] transition-colors shadow-sm"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button>
                  {currentUser?.isGoogleUser && !currentUser?.hasPassword && (
                    <button
                      onClick={() => setSetPasswordOpen(true)}
                      className="flex items-center justify-center px-4 py-2 bg-[#5A2D1A] text-white text-sm font-medium rounded-lg hover:bg-[#3D1E12] transition-colors shadow-sm"
                    >
                      Set Password
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-t border-[#F0E0D8]">
              <nav className="flex -mb-px">
                {[
                  { id: 'overview', label: 'Overview', icon: <UserCircle className="w-5 h-5 mr-2" /> },
                  { id: 'posts', label: 'Posts', icon: <FileText className="w-5 h-5 mr-2" /> },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'overview' | 'posts')}
                    className={`flex cursor-pointer items-center justify-center px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-[#C26E4B] text-[#5A2D1A]'
                        : 'border-transparent text-[#9C8378] hover:text-[#5A2D1A] hover:border-[#E8D5CC]'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden p-6 sm:p-8">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {chef.bio && (
                  <div className=" rounded-lg p-5 border border-[#F0E0D8]">
                    <h3 className="flex items-center text-lg font-serif font-semibold text-[#5A2D1A] mb-3">
                      <BookOpen className="w-5 h-5 mr-2 text-[#C26E4B]" />
                      About Me
                    </h3>
                    <p className="text-[#5A2D1A]">{chef.bio}</p>
                  </div>
                )}

                {chef.experience && (
                  <div className=" rounded-lg p-5 border border-[#F0E0D8]">
                    <h3 className="flex items-center text-lg font-serif font-semibold text-[#5A2D1A] mb-3">
                      <Award className="w-5 h-5 mr-2 text-[#C26E4B]" />
                      Professional Experience
                    </h3>
                    <p className="text-[#5A2D1A]">{chef.experience}</p>
                  </div>
                )}

                {Array.isArray(chef.specialize) && chef.specialize.length > 0 && (
                  <div className=" rounded-lg p-5 border border-[#F0E0D8]">
                    <h3 className="flex items-center text-lg font-serif font-semibold text-[#5A2D1A] mb-3">
                      <Utensils className="w-5 h-5 mr-2 text-[#C26E4B]" />
                      Culinary Specialties
                    </h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {chef.specialize.map((skill: string, idx: number) => (
                        <li key={idx} className="flex items-center">
                          <span className="bg-[#F0E0D8] text-[#5A2D1A] px-3 py-1 rounded-full text-sm">
                            {skill}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {Array.isArray(chef.qualifications) && chef.qualifications.length > 0 && (
                  <div className=" rounded-lg p-5 border border-[#F0E0D8]">
                    <h3 className="flex items-center text-lg font-serif font-semibold text-[#5A2D1A] mb-3">
                      <Award className="w-5 h-5 mr-2 text-[#C26E4B]" />
                      Certifications & Qualifications
                    </h3>
                    <ul className="space-y-2">
                      {chef.qualifications.map((q: string, idx: number) => (
                        <li key={idx} className="flex items-start">
                          <span className="flex-shrink-0 h-5 w-5 text-[#C26E4B] mr-2 mt-0.5">•</span>
                          <span className="text-[#5A2D1A]">{q}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Posts Tab */}
            {activeTab === 'posts' && (
              <div className="space-y-6">
                {postsLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#C26E4B]"></div>
                  </div>
                ) : postsError ? (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{postsError}</p>
                      </div>
                    </div>
                  </div>
                ) : posts.length > 0 ? (
                  posts.map((post) => (
                    <div
                      key={post._id}
                      className="border border-[#F0E0D8] rounded-xl p-6 hover:shadow-md transition duration-300 bg-white"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-serif font-semibold text-[#5A2D1A]">{post.title}</h3>
                        <span className="text-sm text-[#9C8378]">
                          {new Date(post.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      
                      <p className="text-[#5A2D1A] mb-4">{post.description}</p>

                      {post.images?.[0]?.url && (
                        <img
                          src={post.images[0].url}
                          alt={post.images[0].altText || 'Post image'}
                          className="w-full h-64 object-cover rounded-lg mb-4 border border-[#F0E0D8]"
                        />
                      )}

                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-[#F9EBE5] text-[#5A2D1A] text-xs font-medium rounded-full"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No posts yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Create your first post to showcase your culinary work.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <SetPasswordModal isOpen={isSetPasswordOpen} onClose={() => setSetPasswordOpen(false)} />
      </div>
    </AuthWrapper>
  );
};

export default page;