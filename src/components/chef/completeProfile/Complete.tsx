'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CameraIcon, Plus, X } from 'lucide-react'; 
import { useDispatch, useSelector } from 'react-redux';
import { fetchLoggedInChef, updateChefProfile } from '@/features/chefSlice';
import { AppDispatch, RootState } from '@/redux/store';
import TextAreaField from '@/components/chef/completeProfile/TextAreaField';
import TagInput from '@/components/chef/completeProfile/TagInput';
import InputField from '@/components/chef/completeProfile/InputField';
import FormActions from '@/components/chef/completeProfile/FormActions';
import AutocompleteInput from './Autocomplete';
import { uploadProfileImage } from '@/features/profileImageSlice';

type FormDataType = {
  name:string,
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
  district:string;
  isProfileCompleted:boolean;
};



const districts = [
  'Thiruvananthapuram',
  'Kollam',
  'Pathanamthitta',
  'Alappuzha',
  'Kottayam',
  'Idukki',
  'Ernakulam',
  'Thrissur',
  'Palakkad',
  'Malappuram',
  'Kozhikode',
  'Wayanad',
  'Kannur',
  'Kasaragod',
];

const CompleteProfilePage = ({ isModal = false }: { isModal?: boolean }) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  
  useEffect(() => {
    dispatch(fetchLoggedInChef());
  }, [dispatch]);

  const { chef, loading, error } = useSelector((state: RootState) => state.chef);
 console.log('complete chef data',chef);
 
 
const [specialityInput, setSpecialityInput] = useState('');
const[qualificationInput,setQualificationInput]=useState('')
 const [formData, setFormData] = useState<FormDataType>(
  {
  name:'',
  bio:'',
  specialize: [],
  qualifications: [],
  experience: '',
  district:'',
  // socialLinks: {
  //   instagram: '',
  //   youtube: '',
  //   facebook: '',
  //   linkedin: '',
  // },
  isProfileCompleted:false,
}
);

useEffect(() => {
  if (chef) {
    setFormData({
      name:chef.userId?.name||'',
      bio: chef.bio || '',
      specialize: chef.specialize || [],
      qualifications: chef.qualifications || [],
      experience: chef.experience || '',
      district:chef.district||'',
      // socialLinks: {
      //   instagram: chef.socialLinks?.instagram || '',
      //   youtube: chef.socialLinks?.youtube || '',
      //   facebook: chef.socialLinks?.facebook || '',
      //   linkedin: chef.socialLinks?.linkedin || '',
      // },
      isProfileCompleted:chef.userId?.isProfileCompleted||false
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

  const updatedFormData = {
    ...formData,
    isProfileCompleted: true, 
  };

  dispatch(updateChefProfile(updatedFormData));
  console.log('Profile Submitted:', formData);
  router.push('/chef/home');
};


  const handleSkip = () => {
    console.log('Skipped profile completion');
    router.push('/chef/home');
  };

  const { uploading, imageUrl } = useSelector((state: RootState) => state.profileImage);

const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    dispatch(uploadProfileImage(file));
  }
};

  useEffect(() => {
  if (chef?.isProfileCompleted&&!isModal) {
    router.push('/chef/home');
  }
}, [chef,isModal]);


  return (
    <div className="max-w-3xl mx-auto mt-12 p-8 bg-white shadow-xl rounded-xl">
  {/* <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
    Complete Your Chef Profile
  </h1> */}
<div className="mb-6 flex flex-col items-center">
  {/* <label className="text-gray-700 font-bold mb-2">Profile Image</label> */}

  <div className="relative group">
    <input
      type="file"
      accept="image/*"
      onChange={handleImageUpload}
      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
    />
    <img
      src={
        imageUrl ||
        chef?.userId?.profileImage ||
        '/default-profile.png' // fallback image
      }
      alt="Profile"
      className="w-32 h-32 object-cover rounded-full border-4 border-gray-300 shadow-md transition-transform duration-300 group-hover:scale-105"
    />
    <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0">
      <p className="text-white text-sm"><CameraIcon/></p>
    </div>
  </div>

  {uploading && (
    <p className="text-sm text-blue-500 mt-2">Uploading...</p>
  )}
  {error && (
    <p className="text-sm text-red-500 mt-2">{error}</p>
  )}
</div>

  <InputField label="Username" name="name" value={formData.name} onChange={handleChange} type="text" placeholder="e.g.,Anand" />

<TextAreaField label="Bio" name="bio" value={formData.bio} onChange={handleChange} placeholder="Tell us about yourself" />

<TagInput label="Specialities" inputValue={specialityInput} setInputValue={setSpecialityInput} tags={formData.specialize} setTags={(tags) => setFormData({ ...formData, specialize: tags })} placeholder="e.g., Italian, Pastry" buttonLabel="+" />

<TagInput label="Qualifications" inputValue={qualificationInput} setInputValue={setQualificationInput} tags={formData.qualifications} setTags={(tags) => setFormData({ ...formData, qualifications: tags })} placeholder="e.g., Culinary Arts Diploma" buttonLabel="Add" tagColor="bg-purple-100 text-purple-800" />

<InputField label="Years of Experience" name="experience" value={formData.experience} onChange={handleChange} type="number" placeholder="e.g., 5" />

<AutocompleteInput
  label="District"
  name="district"
  value={formData.district}
  onChange={handleChange}
  placeholder="e.g., Thrissur"
  suggestions={districts}
/>
<FormActions onSubmit={handleSubmit} onSkip={handleSkip} />

</div>

  );
};

export default CompleteProfilePage;
