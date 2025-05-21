// 'use client';

// import React, { useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState, AppDispatch } from '@/redux/store';
// import { fetchLoggedInChef } from '@/features/chefSlice';

// const ChefProfile: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();

//   useEffect(() => {
//     dispatch(fetchLoggedInChef());
//   }, [dispatch]);

//   const { chef, loading, error } = useSelector((state: RootState) => state.chef);

//   if (loading) return <div className="text-center mt-4">Loading...</div>;
//   if (error) return <div className="text-center mt-4 text-red-500">Error: {error}</div>;
//   if (!chef) return <div className="text-center mt-4">No chef data available.</div>;

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
//       <h1 className="text-2xl font-bold mb-4">{chef.userId?.name}</h1>
//       {chef.userId?.email && <p><strong>Email:</strong> {chef.userId.email}</p>}
//       {chef.userId?.phone && <p><strong>Phone:</strong> {chef.userId.phone}</p>}
//       {chef.district && <p><strong>Location:</strong> {chef.district}</p>}

//       <div className="mt-6">
//         <h2 className="text-xl font-semibold mb-2">Overview</h2>

//         {chef.bio && <p><strong>Bio:</strong> {chef.bio}</p>}
//         {chef.experience && <p><strong>Experience:</strong> {chef.experience}</p>}

//         {Array.isArray(chef.specialize) && chef.specialize.length > 0 && (
//           <div>
//             <strong>Skills:</strong>
//             <ul className="list-disc list-inside">
//               {chef.specialize.map((skill: string, idx: number) => (
//                 <li key={idx}>{skill}</li>
//               ))}
//             </ul>
//           </div>
//         )}

//         {Array.isArray(chef.qualifications) && chef.qualifications.length > 0 && (
//           <div>
//             <strong>Qualifications:</strong>
//             <ul className="list-disc list-inside">
//               {chef.qualifications.map((q: string, idx: number) => (
//                 <li key={idx}>{q}</li>
//               ))}
//             </ul>
//           </div>
//         )}
//       </div>

//       {Array.isArray(chef.posts) && chef.posts.length > 0 && (
//         <div className="mt-6">
//           <h2 className="text-xl font-semibold mb-2">Posts</h2>
//           {chef.posts.map((post: any) => (
//             <div key={post.id} className="border-b py-2">
//               <h3 className="font-semibold">{post.title}</h3>
//               <p>{post.content}</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChefProfile;


'use client';

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { fetchLoggedInChef, updateChefProfile } from '@/features/chefSlice';

const ChefProfile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState<'overview' | 'posts'>('overview');
  const [editMode, setEditMode] = useState(false);

  const { chef, loading, error } = useSelector((state: RootState) => state.chef);

  useEffect(() => {
    dispatch(fetchLoggedInChef());
  }, [dispatch]);

  if (loading) return <div className="text-center mt-4">Loading...</div>;
  if (error) return <div className="text-center mt-4 text-red-500">Error: {error}</div>;
  if (!chef) return <div className="text-center mt-4">No chef data available.</div>;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  dispatch(updateChefProfile())
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{chef.userId?.name}</h1>
       
        <button
          className="text-sm text-blue-600 border border-blue-600 px-3 py-1 rounded hover:bg-blue-50"
          onClick={() => setEditMode(!editMode)}
        >
          {editMode ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>
         <div>
          {chef.userId?.email && <p><strong>Email:</strong> {chef.userId.email}</p>}
         {chef.userId?.phone && <p><strong>Phone:</strong> {chef.userId.phone}</p>}
         {chef.district && <p><strong>Location:</strong> {chef.district}</p>}
              
         </div>
      <div className="flex space-x-4 border-b mb-4">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 ${activeTab === 'overview' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('posts')}
          className={`px-4 py-2 ${activeTab === 'posts' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
        >
          Posts
        </button>
      </div>

      {activeTab === 'overview' && (
        <div>
          {editMode ? (
            <div className="space-y-4">
              <div>
                <label className="block font-medium">Bio:</label>
                <textarea
                  name="bio"
                  defaultValue={chef.bio}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block font-medium">Experience:</label>
                <input
                  name="experience"
                  defaultValue={chef.experience}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          ) : (
            <div>
             {chef.bio && <p><strong>Bio:</strong> {chef.bio}</p>}
              {chef.experience && <p><strong>Experience:</strong> {chef.experience}</p>}

              {Array.isArray(chef.specialize) && chef.specialize.length > 0 && (
                <div>
                  <strong>Skills:</strong>
                  <ul className="list-disc list-inside">
                    {chef.specialize.map((skill: string, idx: number) => (
                      <li key={idx}>{skill}</li>
                    ))}
                  </ul>
                </div>
              )}

              {Array.isArray(chef.qualifications) && chef.qualifications.length > 0 && (
                <div>
                  <strong>Qualifications:</strong>
                  <ul className="list-disc list-inside">
                    {chef.qualifications.map((q: string, idx: number) => (
                      <li key={idx}>{q}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'posts' && (
        <div>
          {Array.isArray(chef.posts) && chef.posts.length > 0 ? (
            chef.posts.map((post: any) => (
              <div key={post.id} className="border-b py-2">
                <h3 className="font-semibold">{post.title}</h3>
                <p>{post.content}</p>
              </div>
            ))
          ) : (
            <p>No posts available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ChefProfile;
