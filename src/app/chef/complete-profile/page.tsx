'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
// Add this additional import at the top
import { Plus, X } from 'lucide-react'; // optional, for icons if you're using Lucide

type FormDataType = {
  bio: string;
  specialities: string[];
  qualifications: string;
  pastExperience: string;
  instagram: string;
  youtube: string;
  facebook: string;
  linkedin: string;
};


const CompleteProfilePage = () => {
  const router = useRouter();

  const isProfileCompleted = false;
const [specialityInput, setSpecialityInput] = useState('');

  const [formData, setFormData] = useState<FormDataType>({
    bio: '',
    specialities: [],
    qualifications: '',
    pastExperience: '',
    instagram: '',
    youtube: '',
    facebook: '',
    linkedin: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  console.log('Profile Submitted:', formData);
  router.push('/chef/profile');
};


  const handleSkip = () => {
    console.log('Skipped profile completion');
    router.push('/chef/profile');
  };

  if (isProfileCompleted) {
    router.push('/chef/profile');
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white shadow rounded-lg">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Complete Your Chef Profile
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="bio" className="block mb-2 font-semibold text-gray-700">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tell us about yourself"
          />
        </div>

      <div>
  <label
    htmlFor="specialities"
    className="block mb-2 font-semibold text-gray-700"
  >
    Specialities
  </label>
  <div className="flex gap-2 mb-2">
    <input
      type="text"
      id="specialities"
      name="specialities"
      value={specialityInput}
      onChange={(e) => setSpecialityInput(e.target.value)}
      className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="e.g., Italian, Pastry"
    />
    <button
      type="button"
      onClick={() => {
        const trimmed = specialityInput.trim();
       if (trimmed && Array.isArray(formData.specialities) && !formData.specialities.includes(trimmed)) {
  setFormData((prev) => ({
    ...prev,
    specialities: [...prev.specialities, trimmed],
  }));
  setSpecialityInput('');
}

      }}
      className="px-4 py-2 bg-gray-200  text-gray-600 rounded-md hover:bg-green-700 transition"
    >
      <Plus size={20} />
    </button>
  </div>

  {/* Show selected specialities as tags */}
  <div className="flex flex-wrap gap-2">
    {formData.specialities.map((item, index) => (
      <span
        key={index}
        className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
      >
        {item}
        <button
          type="button"
          onClick={() =>
            setFormData((prev) => ({
              ...prev,
              specialities: prev.specialities.filter((_, i) => i !== index),
            }))
          }
          className="ml-2 text-blue-500 hover:text-red-600"
        >
          <X size={16} />
        </button>
      </span>
    ))}
  </div>
</div>


        <div>
          <label
            htmlFor="qualifications"
            className="block mb-2 font-semibold text-gray-700"
          >
            Qualifications
          </label>
          <input
            id="qualifications"
            name="qualifications"
            value={formData.qualifications}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Your cooking certifications or education"
          />
        </div>

        <div>
          <label
            htmlFor="pastExperience"
            className="block mb-2 font-semibold text-gray-700"
          >
            Past Experience
          </label>
          <textarea
            id="pastExperience"
            name="pastExperience"
            value={formData.pastExperience}
            onChange={handleChange}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe your previous roles or jobs"
          />
        </div>

        {/* Social Links Section */}
        <fieldset className="border border-gray-300 rounded-md p-4">
          <legend className="text-lg font-semibold text-gray-700 mb-4">
            Social Links
          </legend>

          <div className="space-y-4">
            {['instagram', 'youtube', 'facebook', 'linkedin'].map((platform) => (
              <div key={platform}>
                <label
                  htmlFor={platform}
                  className="block mb-1 font-medium capitalize text-gray-700"
                >
                  {platform}
                </label>
                <input
                  type="url"
                  id={platform}
                  name={platform}
                  value={(formData as any)[platform]}
                  onChange={handleChange}
                  placeholder={`Enter your ${platform} profile URL`}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        </fieldset>

        <div className="flex space-x-4 mt-6">
          <button
            type="submit"
            className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
          >
            Submit Profile
          </button>
          <button
            type="button"
            onClick={handleSkip}
            className="flex-1 py-3 border border-gray-400 text-gray-700 rounded-md hover:bg-gray-100 transition"
          >
            Skip for now
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompleteProfilePage;
