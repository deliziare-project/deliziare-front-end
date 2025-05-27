'use client';

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState, AppDispatch } from '@/redux/store';
import { fetchLoggedInChef } from '@/features/chefSlice';
import { fetchChefPosts } from '@/features/chefPostSlice';
import { UserCircle, FileText } from 'lucide-react';
import SetPasswordModal from '@/components/user/userProfile/SetPasswordModal';

const ChefProfile: React.FC = () => {
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
        // Redirect to complete profile if no chef profile exists
        if (error.message.includes('not found') && currentUser?.role === 'chef') {
          router.push('/chef/complete-profile');
        }
      }
    };
    loadChefProfile();
  }, [dispatch, currentUser, router]);

  useEffect(() => {
    if (activeTab === 'posts') {
      dispatch(fetchChefPosts());
    }
  }, [activeTab, dispatch]);

  if (loading) return <div className="text-center mt-6 text-lg font-medium text-blue-600">Loading...</div>;
  if (error) return <div className="text-center mt-6 text-red-600">Error: {error}</div>;
  if (!chef) return <div className="text-center mt-6 text-gray-500">No chef data available.</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 bg-white shadow-xl rounded-2xl">
      {/* Profile Header */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-5">
          <img
            src={currentUser?.profileImage || '/default-avatar.png'}
            alt="avatar"
            className="w-24 h-24 rounded-full border-4 border-blue-100 shadow-md object-cover"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{chef.userId?.name}</h1>
            <p className="text-gray-500">{chef.userId?.email}</p>
            <p className="text-gray-500">{chef.userId?.phone}</p>
            {chef.district && <p className="text-gray-500">📍 {chef.district}</p>}
          </div>
        </div>
      <button
  onClick={() => router.push('/chef/complete-profile')}
  className="text-sm px-4 py-2 bg-[#B8755D] text-white rounded-lg hover:bg-[#a0624f] transition"
>
  Edit Profile
</button>
{currentUser?.isGoogleUser && !currentUser?.hasPassword && (
  <button
    onClick={() => setSetPasswordOpen(true)}
    className="text-sm px-4 py-2 bg-[#4b5563] text-white rounded-lg hover:bg-[#374151] transition"
  >
    Set Password
  </button>
)}

      </div>

      <div className="flex space-x-4 border-b border-gray-200 mb-6">
  {[
    { id: 'overview', label: 'Overview', icon: <UserCircle className="w-4 h-4 mr-1" /> },
    { id: 'posts', label: 'Posts', icon: <FileText className="w-4 h-4 mr-1" /> },
  ].map((tab) => (
    <button
      key={tab.id}
      onClick={() => setActiveTab(tab.id as 'overview' | 'posts')}
      className={`flex items-center px-4 py-2 font-medium text-sm rounded-t-md transition ${
        activeTab === tab.id
          ? 'border-b-2 border-[#B8755D] text-[#B8755D] bg-[#FDF4F1]'
          : 'text-gray-500 hover:text-[#B8755D]'
      }`}
    >
      {tab.icon}
      {tab.label}
    </button>
  ))}
</div>


      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-4 text-sm text-gray-700">
          {chef.bio && (
            <p>
              <span className="font-semibold text-gray-800">Bio:</span> {chef.bio}
            </p>
          )}
          {chef.experience && (
            <p>
              <span className="font-semibold text-gray-800">Experience:</span> {chef.experience}
            </p>
          )}

          {Array.isArray(chef.specialize) && chef.specialize.length > 0 && (
            <div>
              <p className="font-semibold text-gray-800">Skills:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                {chef.specialize.map((skill: string, idx: number) => (
                  <li key={idx}>{skill}</li>
                ))}
              </ul>
            </div>
          )}

          {Array.isArray(chef.qualifications) && chef.qualifications.length > 0 && (
            <div>
              <p className="font-semibold text-gray-800">Qualifications:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
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
                className="border border-gray-200 rounded-xl p-5 shadow-md hover:shadow-lg transition duration-300 bg-gray-50"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h3>
                <p className="text-gray-700 mb-3">{post.description}</p>

                {post.images?.[0]?.url && (
                  <img
                    src={post.images[0].url}
                    alt={post.images[0].altText || 'Post image'}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                )}

                {post.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {post.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full"
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
      <SetPasswordModal isOpen={isSetPasswordOpen} onClose={() => setSetPasswordOpen(false)} />

    </div>
  );
};

export default ChefProfile;
