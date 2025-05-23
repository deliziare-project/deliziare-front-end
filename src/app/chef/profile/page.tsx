'use client';

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState, AppDispatch } from '@/redux/store';
import { fetchLoggedInChef } from '@/features/chefSlice';
import { fetchChefPosts } from '@/features/chefPostSlice';

const ChefProfile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'posts'>('overview');

  const { posts, loading: postsLoading, error: postsError } = useSelector((state: RootState) => state.chefPost);
  const { chef, loading, error } = useSelector((state: RootState) => state.chef);
  const { currentUser } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchLoggedInChef());
  }, [dispatch]);

  useEffect(() => {
    if (activeTab === 'posts') {
      dispatch(fetchChefPosts());
    }
  }, [activeTab, dispatch]);

  if (loading) return <div className="text-center mt-6 text-lg font-medium">Loading...</div>;
  if (error) return <div className="text-center mt-6 text-red-600">Error: {error}</div>;
  if (!chef) return <div className="text-center mt-6 text-gray-600">No chef data available.</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 bg-white shadow-md rounded-md">
      {/* Profile Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser?.profileImage || '/default-avatar.png'}
            alt="avatar"
            className="w-20 h-20 rounded-full border-2 border-gray-300 object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{chef.userId?.name}</h1>
            <p className="text-gray-500">{chef.userId?.email}</p>
            <p className="text-gray-500">{chef.userId?.phone}</p>
            {chef.district && <p className="text-gray-500">📍 {chef.district}</p>}
          </div>
        </div>
        <button
          onClick={() => router.push('/chef/complete-profile')}
          className="text-sm px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Edit Profile
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        {['overview', 'posts'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as 'overview' | 'posts')}
            className={`px-4 py-2 font-medium transition-colors duration-200 ${
              activeTab === tab
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-blue-600'
            }`}
          >
            {tab === 'overview' ? 'Overview' : 'Posts'}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {chef.bio && (
            <p className="text-gray-700">
              <strong className="text-gray-800">Bio:</strong> {chef.bio}
            </p>
          )}
          {chef.experience && (
            <p className="text-gray-700">
              <strong className="text-gray-800">Experience:</strong> {chef.experience}
            </p>
          )}

          {Array.isArray(chef.specialize) && chef.specialize.length > 0 && (
            <div>
              <strong className="text-gray-800">Skills:</strong>
              <ul className="list-disc list-inside text-gray-700 mt-1">
                {chef.specialize.map((skill: string, idx: number) => (
                  <li key={idx}>{skill}</li>
                ))}
              </ul>
            </div>
          )}

          {Array.isArray(chef.qualifications) && chef.qualifications.length > 0 && (
            <div>
              <strong className="text-gray-800">Qualifications:</strong>
              <ul className="list-disc list-inside text-gray-700 mt-1">
                {chef.qualifications.map((q: string, idx: number) => (
                  <li key={idx}>{q}</li>
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
            <p className="text-center text-gray-500">Loading posts...</p>
          ) : postsError ? (
            <p className="text-center text-red-500">{postsError}</p>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post._id}
                className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300 bg-gray-50"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h3>
                <p className="text-gray-700 mb-3">{post.description}</p>

                {post.images?.[0]?.url && (
                  <img
                    src={post.images[0].url}
                    alt={post.images[0].altText || 'Post image'}
                    className="w-full h-64 object-cover rounded-md"
                  />
                )}

                {post.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {post.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <p className="mt-3 text-sm text-gray-500">
                  Posted on {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No posts available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ChefProfile;
