'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
// Add this additional import at the top
import { Plus, X } from 'lucide-react'; // optional, for icons if you're using Lucide
import { useDispatch, useSelector } from 'react-redux';
import { fetchLoggedInChef, updateChefProfile } from '@/features/chefSlice';
import { RootState } from '@/redux/store';

type FormDataType = {
  
  bio: string;
  specialize: string[];              
  qualifications: string[];          
  experience: string;                
  // socialLinks: {
  //   instagram: string;
  //   youtube: string;
  //   facebook: string;
  //   linkedin: string;
  // };
};



const CompleteProfilePage = () => {
  const router = useRouter();
 

  const isProfileCompleted = false;
      const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(fetchLoggedInChef());
  }, [dispatch]);

  const { chef, loading, error } = useSelector((state: RootState) => state.chef);
 console.log('complete chef data',chef);
 
 
const [specialityInput, setSpecialityInput] = useState('');
const[qualificationInput,setQualificationInput]=useState('')
 const [formData, setFormData] = useState<FormDataType>(
  {
  bio:'',
  specialize: [],
  qualifications: [],
  experience: '',
  // socialLinks: {
  //   instagram: '',
  //   youtube: '',
  //   facebook: '',
  //   linkedin: '',
  // },
}
);

useEffect(() => {
  if (chef) {
    setFormData({
      bio: chef.bio || '',
      specialize: chef.specialize || [],
      qualifications: chef.qualifications || [],
      experience: chef.experience || '',
      // socialLinks: {
      //   instagram: chef.socialLinks?.instagram || '',
      //   youtube: chef.socialLinks?.youtube || '',
      //   facebook: chef.socialLinks?.facebook || '',
      //   linkedin: chef.socialLinks?.linkedin || '',
      // },
    });
  }
}, [chef]);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  dispatch(updateChefProfile(formData));
  console.log('Profile Submitted:', formData);
  router.push('/chef/home');
};


  const handleSkip = () => {
    console.log('Skipped profile completion');
    router.push('/chef/home');
  };


  if (isProfileCompleted) {
    router.push('/chef/profile');
  }

  return (
    <div className="max-w-3xl mx-auto mt-12 p-8 bg-white shadow-xl rounded-xl">
  <h1 className="text-4xl font-bold text-center text-[#2E1D13] mb-10">
    Complete Your Chef Profile
  </h1>

  <form onSubmit={handleSubmit} className="space-y-8">
    {/* Bio */}
    <div>
      <label htmlFor="bio" className="block text-lg font-semibold mb-2 text-gray-700">
        Bio
      </label>
      <textarea
        id="bio"
        name="bio"
        value={formData.bio}
        onChange={handleChange}
        rows={5}
        className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Tell us about yourself"
      />
    </div>

    {/* Specialities */}
    <div>
      <label className="block text-lg font-semibold mb-2 text-gray-700">Specialities</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={specialityInput}
          onChange={(e) => setSpecialityInput(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Italian, Pastry"
        />
        <button
          type="button"
          onClick={() => {
            const trimmed = specialityInput.trim();
            if (trimmed && !formData.specialize.includes(trimmed)) {
              setFormData((prev) => ({
                ...prev,
                specialize: [...prev.specialize, trimmed],
              }));
              setSpecialityInput('');
            }
          }}
          className="px-4 py-2 bg-[#3B2A1E] text-white rounded-md hover:bg-green-700 transition"
        >
          <Plus size={18} />
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mt-3">
        {formData.specialize.map((item, index) => (
          <span key={index} className="flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            {item}
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  specialize: prev.specialize.filter((_, i) => i !== index),
                }))
              }
              className="ml-2 hover:text-red-500"
            >
              <X size={16} />
            </button>
          </span>
        ))}
      </div>
    </div>

    {/* Qualifications */}
    <div>
      <label className="block text-lg font-semibold mb-2 text-gray-700">Qualifications</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={qualificationInput}
          onChange={(e) => setQualificationInput(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Culinary Arts Diploma"
        />
        <button
          type="button"
          onClick={() => {
            const trimmed = qualificationInput.trim();
            if (trimmed && !formData.qualifications.includes(trimmed)) {
              setFormData((prev) => ({
                ...prev,
                qualifications: [...prev.qualifications, trimmed],
              }));
              setQualificationInput('');
            }
          }}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
        >
          Add
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mt-3">
        {formData.qualifications.map((q, i) => (
          <span key={i} className="flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
            {q}
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  qualifications: prev.qualifications.filter((_, index) => index !== i),
                }))
              }
              className="ml-2 hover:text-red-500"
            >
              <X size={16} />
            </button>
          </span>
        ))}
      </div>
    </div>

    {/* Experience */}
    <div>
      <label htmlFor="experience" className="block text-lg font-semibold mb-2 text-gray-700">
        Years of Experience
      </label>
      <input
        type="number"
        id="experience"
        name="experience"
        value={formData.experience}
        onChange={handleChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="e.g., 5"
        min={0}
      />
    </div>

    {/* Submit & Skip Buttons */}
    <div className="flex flex-col sm:flex-row gap-4 pt-4">
      <button
        type="submit"
        className="w-full sm:w-1/2 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
      >
        Submit Profile
      </button>
      <button
        type="button"
        onClick={handleSkip}
        className="w-full sm:w-1/2 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition"
      >
        Skip for now
      </button>
    </div>
  </form>
</div>

  );
};

export default CompleteProfilePage;
