'use client';

import { useRouter } from 'next/navigation';
import { useEffect,useState } from 'react';
import { CameraIcon,Plus, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLoggedInChef, updateChefProfile } from '@/features/chefSlice';
import { AppDispatch, RootState } from '@/redux/store';
import TextAreaField from '@/components/chef/completeProfile/TextAreaField';
import TagInput from '@/components/chef/completeProfile/TagInput';
import InputField from '@/components/chef/completeProfile/InputField';
import FormActions from '@/components/chef/completeProfile/FormActions';
import AutocompleteInput from './Autocomplete';
import { uploadProfileImage } from '@/features/profileImageSlice';
import { setCertificateUrl, uploadCertificate } from '@/features/fileUploadSlice';
import Image from 'next/image';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const profileSchema = yup.object({
  name: yup.string().required('Name is required').min(3).max(50),

  bio: yup
    .string()
    .nullable()
    .notRequired()
    .defined()
    .max(500, 'Bio must not exceed 500 characters')
    .test(
      'min-length-if-exists',
      'Bio must be at least 10 characters if provided',
      (value) => !value || value.length >= 10
    ),

  specialize: yup
    .array()
    .of(yup.string().min(2))
    .notRequired()
    .defined(),

  qualifications: yup
    .array()
    .of(yup.string().min(2))
    .notRequired()
    .defined(),

  experience: yup
    .string()
    .nullable()
    .notRequired()
    .defined()
    .min(1)
    .max(50),

  district: yup.string().required('District is required'),

  isProfileCompleted: yup.boolean().nullable().notRequired().defined(),
}).required();





type FormDataType = yup.InferType<typeof profileSchema>;

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
  const [isSubmitting, setIsSubmitting] = useState(false)
  useEffect(() => {
    dispatch(fetchLoggedInChef());
  }, [dispatch]);

  const [fileName, setFileName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

const { 
  control, 
  handleSubmit, 
  setValue, 
  getValues, // Add this
  formState: { errors, isValid } 
} = useForm<FormDataType>({
  resolver: yupResolver(profileSchema),
  mode: 'onChange',
  defaultValues: {
    name: '',
    bio: null,
    specialize: [],
    qualifications: [],
    experience: null,
    district: '',
    isProfileCompleted: false,
  }
});

  const { chef } = useSelector((state: RootState) => state.chef);
  const { uploading: certUploading, error: certError, certificateUrl } = useSelector(
    (state: RootState) => state.Certificate
  );


  useEffect(() => {
    if (chef) {
      setValue('name', chef.userId?.name || '');
      setValue('bio', chef.bio || '');
      setValue('specialize', chef.specialize || []);
      setValue('qualifications', chef.qualifications || []);
      setValue('experience', chef.experience || '');
      setValue('district', chef.district || '');
      setValue('isProfileCompleted', chef.userId?.isProfileCompleted || false);

      if (chef?.certificate) {
        dispatch(setCertificateUrl(chef?.certificate));
      }
    }
  }, [chef, setValue, dispatch]);


  const onSubmit = async (data: FormDataType) => {
    console.log('Form data before submission:', data); 
    setIsSubmitting(true);
    try {
      if (!chef?.userId) {
        throw new Error("User ID not found");
      }
  
      const isFirstCompletion = !chef.userId.isProfileCompleted;
  
      const updatedFormData = {
        ...data,
        bio: data.bio ?? '',
        experience: data.experience ?? '', // <-- Add this line to convert null to empty string
        isProfileCompleted: true,
        userId: chef.userId,
        certificate: certificateUrl || chef.certificate || '',
        specialize: (data.specialize ?? []).filter((v): v is string => !!v),
        qualifications: (data.qualifications ?? []).filter((v): v is string => !!v),
      };
      
      

      console.log('Dispatching update...'); 
      await dispatch(updateChefProfile(updatedFormData)).unwrap();
      console.log('Profile update successful'); 
  
      if (isModal) {
        // handle modal logic
      } else if (isFirstCompletion) {
        router.push('/chef/profile');
      } else {
        router.push('/chef/profile');
      }
    } catch (error) {
      console.error('Submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  
  
  

   
  const handleCertificateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      dispatch(uploadCertificate(file));
    }
  };
const [isSkipping, setIsSkipping] = useState(false);

const handleSkip = async () => {
  setIsSkipping(true);
  try {
    if (!chef?.userId) {
      throw new Error("User ID not found");
    }
    const formValues = getValues();

    await dispatch(updateChefProfile({
      ...formValues,
      bio: formValues.bio ?? '',
      experience: formValues.experience ?? '',
      isProfileCompleted: true,
      userId: chef.userId,
      certificate: certificateUrl || chef.certificate || '',
      specialize: (formValues.specialize ?? []).filter((v): v is string => !!v),
      qualifications: (formValues.qualifications ?? []).filter((v): v is string => !!v),
    }));
    

    router.push('/chef/home');
  } catch (error) {
    console.log('skipping error', error);
  } finally {
    setIsSkipping(false);
  }
};




  const { uploading, imageUrl, error } = useSelector((state: RootState) => state.profileImage);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      dispatch(uploadProfileImage(file));
    }
  };

  useEffect(() => {
    if (chef?.isProfileCompleted && !isModal) {
      router.push('/chef/home');
    }
  }, [chef, isModal]);

  const finalCertificateUrl = certificateUrl || chef?.certificate;
  const profileImageSrc = imageUrl || chef?.userId?.profileImage || '';
  return (
    <div className="max-w-2xl mx-auto p-7 bg-gray-50 shadow-xl rounded-xl">
      <h1 className="text-2xl md:text-2xl font-bold text-center bg-red-200 text-[#B8755D] mb-12 tracking-tight animate-fadeInDown bg-clip-text">
        Complete Your Profile to Proceed
      </h1>
      
      <div className="mb-6 flex flex-col items-center">
        <div className="relative group">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />



          {profileImageSrc ? (
            <Image
              width={100}
              height={100}
              src={profileImageSrc}
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

<form onSubmit={handleSubmit(onSubmit)}>      
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <InputField
              label="Username"
              {...field}
              error={errors.name?.message}
              type="text"
              placeholder="e.g., Anand"
            />
          )}
        />

        <Controller
          name="bio"
          control={control}
          render={({ field }) => (
            <TextAreaField
              label="Bio (Optional)"
              {...field}
              value={field.value ?? ''}  
              error={errors.bio?.message}
              placeholder="Tell us about yourself (min 10 characters if provided)"
            />
          )}
        />


        <Controller
          name="specialize"
          control={control}
          render={({ field :{value,onChange}}) => (
            <TagInput
              label="Specialities"
              tags={(value || []).filter((v): v is string => !!v)}
              setTags={onChange}
              error={errors.specialize?.message}
              placeholder="e.g., Italian, Pastry"
              buttonLabel="+"
            />
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Controller
            name="qualifications"
            control={control}
            render={({ field }) => (
              <TagInput
                label="Qualifications"
                tags={(field.value ?? []).filter((v): v is string => !!v)}
                setTags={(tags) => field.onChange(tags)}
                error={errors.qualifications?.message}
                placeholder="e.g., Culinary Arts Diploma"
                buttonLabel="Add"
                tagColor="bg-purple-100 text-purple-800"
              />
            )}
          />


          <Controller
            name="experience"
            control={control}
            render={({ field }) => (
              <InputField
                label="Years of Experience"
                {...field}
                value={field.value ?? ''}  
                error={errors.experience?.message}
                type="number"
                placeholder="e.g., 5"
                onChange={(e) => field.onChange(e.target.value)}
                max={50}
              />
            )}
          />

        </div>

        <Controller
          name="district"
          control={control}
          render={({ field }) => (
            <AutocompleteInput
              label="District (mandatory)"
              {...field}
              error={errors?.district?.message}
              placeholder="e.g., Thrissur"
              suggestions={districts}
            />
          )}
        />

        <div className="mt-4 mb-6">
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
            className="hidden"
          />
          
          {fileName && (
            <span className="font-medium ml-2">{fileName}</span>
          )}

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

      <FormActions
      onSubmit={handleSubmit(onSubmit)}
        onSkip={handleSkip}
        isProfileCompleted={chef?.userId?.isProfileCompleted || false}
        isSubmitting={isSubmitting}
        isSkipping={isSkipping}
        isValid={isValid}
      />
        </form>

 
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