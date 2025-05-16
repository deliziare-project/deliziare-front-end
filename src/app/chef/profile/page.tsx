'use client';
import React, { useState } from 'react';
import { Pencil } from 'lucide-react';

interface Chef {
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  experience: string;
  skills: string[];
  posts: { id: number; title: string; content: string }[];
}

const initialChef: Chef = {
  name: 'Chef Gordon Ramsay',
  email: 'gordon@example.com',
  phone: '+1 555-123-4567',
  location: 'London, UK',
  bio: 'World-renowned chef known for his exceptional cuisine and fiery personality.',
  experience: '25 years of experience in gourmet and Michelin-star kitchens.',
  skills: ['Italian Cuisine', 'French Cooking', 'Pastry Arts', 'Plating'],
  posts: [
    {
      id: 1,
      title: 'Beef Wellington Secrets',
      content: 'Here’s how I make the perfect beef wellington...',
    },
    {
      id: 2,
      title: 'Gourmet Risotto',
      content: 'Let’s talk about creamy, rich risottos with real depth.',
    },
  ],
};

const ChefProfile: React.FC = () => {
  const [chef, setChef] = useState<Chef>(initialChef);
  const [editProfile, setEditProfile] = useState(false);
  const [editOverview, setEditOverview] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'posts'>('overview');
  const [editedChef, setEditedChef] = useState<Chef>(chef);

  const handleProfileChange = (field: keyof Chef, value: string) => {
    setEditedChef({ ...editedChef, [field]: value });
  };

  const handleSkillChange = (index: number, value: string) => {
    const updatedSkills = [...editedChef.skills];
    updatedSkills[index] = value;
    setEditedChef({ ...editedChef, skills: updatedSkills });
  };

  const saveChanges = () => {
    setChef(editedChef);
    setEditProfile(false);
    setEditOverview(false);
  };

  const cancelChanges = () => {
    setEditedChef(chef);
    setEditProfile(false);
    setEditOverview(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      {/* Profile Header */}
      <div className="flex justify-between items-start mb-6 border-b pb-4">
        <div className="space-y-1 w-full">
          {editProfile ? (
            <>
              <input
                type="text"
                className="block font-bold text-xl w-full border p-2 rounded mb-2"
                value={editedChef.name}
                onChange={(e) => handleProfileChange('name', e.target.value)}
              />
              <input
                type="email"
                className="text-gray-600 w-full border p-2 rounded mb-2"
                value={editedChef.email}
                onChange={(e) => handleProfileChange('email', e.target.value)}
              />
              <input
                type="text"
                className="text-gray-600 w-full border p-2 rounded mb-2"
                value={editedChef.phone}
                onChange={(e) => handleProfileChange('phone', e.target.value)}
              />
              <input
                type="text"
                className="text-gray-600 w-full border p-2 rounded"
                value={editedChef.location}
                onChange={(e) => handleProfileChange('location', e.target.value)}
              />
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold">{chef.name}</h1>
              <p className="text-gray-600">{chef.email}</p>
              <p className="text-gray-600">{chef.phone}</p>
              <p className="text-gray-600">{chef.location}</p>
            </>
          )}
        </div>

        <div className="flex flex-col gap-2 items-end ml-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Message
          </button>
          {editProfile ? (
            <div className="flex gap-2">
              <button
                onClick={saveChanges}
                className="text-green-600 hover:text-green-800 font-semibold"
              >
                Save Changes
              </button>
              <button
                onClick={cancelChanges}
                className="text-red-500 hover:text-red-700 font-semibold"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setEditProfile(true);
                setEditedChef(chef);
              }}
              className="text-gray-600 hover:text-black"
              title="Edit Profile"
            >
              <Pencil />
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b mb-6">
        {['overview', 'posts'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as 'overview' | 'posts')}
            className={`pb-2 capitalize ${
              activeTab === tab
                ? 'border-b-2 border-blue-600 font-semibold text-blue-600'
                : 'text-gray-500 hover:text-black'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-xl">Overview</h2>
            <button
              onClick={() => {
                setEditOverview(!editOverview);
                setEditedChef(chef);
              }}
              className="text-sm text-blue-600 hover:underline"
            >
              {editOverview ? 'Cancel' : 'Edit Overview'}
            </button>
          </div>

          {editOverview ? (
            <>
              <div>
                <label className="font-semibold block mb-1">Bio</label>
                <textarea
                  value={editedChef.bio}
                  onChange={(e) => handleProfileChange('bio', e.target.value)}
                  className="w-full p-2 border rounded resize-none"
                  rows={4}
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Experience</label>
                <input
                  type="text"
                  value={editedChef.experience}
                  onChange={(e) => handleProfileChange('experience', e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Skills</label>
                {editedChef.skills.map((skill, index) => (
                  <input
                    key={index}
                    type="text"
                    value={skill}
                    onChange={(e) => handleSkillChange(index, e.target.value)}
                    className="w-full p-2 border rounded mb-2"
                  />
                ))}
              </div>
              <div className="flex gap-4 mt-4">
                <button
                  onClick={saveChanges}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  onClick={cancelChanges}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <div>
                <h3 className="font-semibold mb-1">Bio</h3>
                <p className="text-gray-700">{chef.bio}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Experience</h3>
                <p className="text-gray-700">{chef.experience}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Skills</h3>
                <ul className="flex flex-wrap gap-2">
                  {chef.skills.map((skill, index) => (
                    <li
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      )}

      {/* Posts Tab */}
      {activeTab === 'posts' && (
        <div className="space-y-4">
          {chef.posts.length > 0 ? (
            chef.posts.map((post) => (
              <div
                key={post.id}
                className="border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold">{post.title}</h3>
                <p className="text-gray-700 mt-2">{post.content}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No posts available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ChefProfile;
