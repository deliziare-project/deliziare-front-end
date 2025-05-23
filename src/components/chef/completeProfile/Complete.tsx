'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Plus, X } from 'lucide-react'; 
import { useDispatch, useSelector } from 'react-redux';
import { fetchLoggedInChef, updateChefProfile } from '@/features/chefSlice';
import { AppDispatch, RootState } from '@/redux/store';
import TextAreaField from '@/components/chef/completeProfile/TextAreaField';
import TagInput from '@/components/chef/completeProfile/TagInput';
import InputField from '@/components/chef/completeProfile/InputField';
import FormActions from '@/components/chef/completeProfile/FormActions';

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
  district:string;
  isProfileCompleted:boolean;
};



const CompleteProfilePage = () => {
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
      isProfileCompleted:chef.isProfileCompleted||false
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


  useEffect(() => {
  if (chef?.isProfileCompleted) {
    router.push('/chef/home');
  }
}, [chef]);


  return (
    <div className="max-w-2xl mx-auto  p-7 bg-gray-50 shadow-xl rounded-xl ">
  <h1 className="text-2xl md:text-2xl font-bold text-center bg-red-200 text-[#B8755D] mb-12 tracking-tight animate-fadeInDown bg-clip-text  ">
          Complete Your Profile to Proceed
        </h1>
{/* <TextAreaField label="Bio" name="bio" value={formData.bio} onChange={handleChange} placeholder="Tell us about yourself" />

<TagInput label="Specialities" inputValue={specialityInput} setInputValue={setSpecialityInput} tags={formData.specialize} setTags={(tags) => setFormData({ ...formData, specialize: tags })} placeholder="e.g., Italian, Pastry" buttonLabel="+" />

<TagInput label="Qualifications" inputValue={qualificationInput} setInputValue={setQualificationInput} tags={formData.qualifications} setTags={(tags) => setFormData({ ...formData, qualifications: tags })} placeholder="e.g., Culinary Arts Diploma" buttonLabel="Add" tagColor="bg-purple-100 text-purple-800" />

<InputField label="Years of Experience" name="experience" value={formData.experience} onChange={handleChange} type="number" placeholder="e.g., 5" />

<InputField label="District" name="district" value={formData.district} onChange={handleChange} placeholder="e.g., Thrissur" /> */}


  <div className="space-y-3">
      {/* Bio */}
      <TextAreaField
        label="Bio"
        name="bio"
        value={formData.bio}
        onChange={handleChange}
        placeholder="Tell us about yourself"
      />

      {/* Specialities */}
      <TagInput
        label="Specialities"
        inputValue={specialityInput}
        setInputValue={setSpecialityInput}
        tags={formData.specialize}
        setTags={(tags) => setFormData({ ...formData, specialize: tags })}
        placeholder="e.g., Italian, Pastry"
        buttonLabel="+"
      />

      {/* Grid for Qualifications + Experience */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TagInput
          label="Qualifications"
          inputValue={qualificationInput}
          setInputValue={setQualificationInput}
          tags={formData.qualifications}
          setTags={(tags) => setFormData({ ...formData, qualifications: tags })}
          placeholder="e.g., Culinary Arts Diploma"
          buttonLabel="Add"
          tagColor="bg-purple-100 text-purple-800"
        />

        <InputField
          label="Years of Experience"
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          type="number"
          placeholder="e.g., 5"
        />
      </div>

      {/* District */}
      <InputField
        label="District"
        name="district"
        value={formData.district}
        onChange={handleChange}
        placeholder="e.g., Thrissur"
      />

      {/* Submit / Skip Buttons */}
    </div>
<FormActions onSubmit={handleSubmit} onSkip={handleSkip} />

</div>

  );
};

export default CompleteProfilePage;
