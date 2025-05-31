'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CameraIcon, Plus, X } from 'lucide-react'; 
import { useDispatch, useSelector } from 'react-redux';
import { ChefProfile, fetchLoggedInChef, updateChefProfile } from '@/features/chefSlice';
import { AppDispatch, RootState } from '@/redux/store';
import TextAreaField from '@/components/chef/completeProfile/TextAreaField';
import TagInput from '@/components/chef/completeProfile/TagInput';
import InputField from '@/components/chef/completeProfile/InputField';
import FormActions from '@/components/chef/completeProfile/FormActions';
import AutocompleteInput from './Autocomplete';
import { uploadProfileImage } from '@/features/profileImageSlice';
import { setCertificateUrl, uploadCertificate } from '@/features/fileUploadSlice';
import Image from 'next/image';

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
//  console.log('complete chef data',chef);
 const { uploading: certUploading, error: certError, certificateUrl } = useSelector(
  (state: RootState) => state.Certificate
);

  const [fileName, setFileName] = useState("");
  
const handleCertificateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
     setFileName(file.name);
    dispatch(uploadCertificate(file));
  }
};

 
const [specialityInput, setSpecialityInput] = useState('');
const [isModalOpen,setIsModalOpen]=useState(false)
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
     if (chef?.certificate) {
      console.log("Chef certificate URL:", chef?.certificate);

      dispatch(setCertificateUrl(chef?.certificate));
    }
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
  
    if (!chef) {
      console.error("Chef profile not loaded yet.");
      return;
    }
  
    const updatedProfile: ChefProfile = {
      userId: chef.userId, 
      isProfileCompleted: true,
      certificate: finalCertificateUrl || '',
      bio: formData.bio,
      specialize: formData.specialize,
      qualifications: formData.qualifications,
      experience: formData.experience,
      district: formData.district,
    };
  
    dispatch(updateChefProfile(updatedProfile));
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


const finalCertificateUrl = certificateUrl || chef?.certificate;

  return (
  <div className="max-w-2xl mx-auto  p-7 bg-gray-50 shadow-xl rounded-xl ">
  <h1 className="text-2xl md:text-2xl font-bold text-center bg-red-200 text-[#B8755D] mb-12 tracking-tight animate-fadeInDown bg-clip-text  ">
          Complete Your Profile to Proceed
        </h1>
<div className="mb-6 flex flex-col items-center">
  {/* <label className="text-gray-700 font-bold mb-2">Profile Image</label> */}

  <div className="relative group">
  <input
    type="file"
    accept="image/*"
    onChange={handleImageUpload}
    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
  />

{(imageUrl || chef?.userId?.profileImage) ? (
  <Image
    width={100}
    height={100}
    src={imageUrl || chef?.userId?.profileImage!} // non-null assertion because of condition
    alt="Profile"
    className="w-32 h-32 object-cover rounded-full border-4 border-gray-300 shadow-md transition-transform duration-300 group-hover:scale-105"
  />
) : (
  <div className="w-32 h-32 flex items-center justify-center rounded-full bg-[#F9EBE5] text-[#B8755D] text-4xl font-bold border border-[#F9EBE5] shadow-md">
    {chef?.userId?.name?.charAt(0)?.toUpperCase() || 'U'}
  </div>
)}



  <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0">
    <p className="text-white text-sm"><CameraIcon /></p>
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

{/* <TextAreaField label="Bio" name="bio" value={formData.bio} onChange={handleChange} placeholder="Tell us about yourself" /> */}
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


      <AutocompleteInput
  label="District"
  name="district"
  value={formData.district}
  onChange={handleChange}
  placeholder="e.g., Thrissur"
  suggestions={districts}
/>
<div className="mb-6">
  <label className="block text-sm font-medium text-gray-700 mb-1">Upload Certificate</label>

  {/* Custom Upload Button */}
  <button
    type="button"
    onClick={() => document.getElementById('certificateInput')?.click()}
    className="px-4 py-2 bg-rose-100 text-rose-700 rounded-full text-sm font-semibold hover:bg-rose-200 transition"
  >
    Upload Certificate
  </button>

 
  <input
    id="certificateInput"
    type="file"
    accept="image/*,application/pdf"
    onChange={handleCertificateUpload}
   className='hidden'
  />
    {fileName && (
       <span className="font-medium">{fileName}</span>
      )}

  {/* Show Uploading/Error messages */}
  {certUploading && <p className="text-blue-500 text-sm mt-1">Uploading...</p>}
  {certError && <p className="text-red-500 text-sm mt-1">{certError}</p>}

 {finalCertificateUrl && (
  <div className="mt-3">
    <button
      type="button"
      onClick={() => setIsModalOpen(true)}
      className="text-blue-600 underline text-sm"
    >
      View Uploaded Certificate
    </button>
  </div>
)}

</div>
</div>


<FormActions
  onSubmit={handleSubmit}
  onSkip={handleSkip}
  isProfileCompleted={chef?.userId?.isProfileCompleted || false}
/>

{/* Certificate Preview Modal */}
{isModalOpen && finalCertificateUrl && (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
    <div className="relative bg-white p-4 rounded-lg shadow-xl max-w-xl w-full">
      <button
        onClick={() => setIsModalOpen(false)}
        className="absolute top-2 right-2 text-gray-600 hover:text-black"
      >
        <X className="w-5 h-5" />
      </button>
      <h3 className="text-lg font-semibold mb-4 text-center">Certificate Preview</h3>

      {finalCertificateUrl.match(/\.(jpeg|jpg|png|gif|png)$/i) ? (
        <img
          src={finalCertificateUrl}
          alt="Uploaded Certificate"
          className="w-full h-auto rounded-lg object-contain"
        />
      ) : finalCertificateUrl.match(/\.pdf$/i) ? (
        <iframe
          src={finalCertificateUrl}
          title="Certificate PDF"
          className="w-full h-[500px] rounded-lg"
        ></iframe>
      ) : (
        <p className="text-center text-gray-500">Unsupported file format</p>
      )}
    </div>
  </div>
)}

</div>

  );
};

export default CompleteProfilePage;
