'use client';

import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  sendOtpForChef,
  setRegistrationData,
  resetRegisterState,
} from '../../features/authSlice';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Plus, X } from 'lucide-react';
import { chefRegisterSchema } from '@/validation/ChefValidation';
import { Controller } from 'react-hook-form';
import Link from 'next/link';


const ChefLocationPicker = dynamic(() => import('@/components/LocationPicker'), { ssr: false });

type ChefFormInputs = {
  name: string;
  email: string;
  phone: string;
  password: string;
  experience: string;
  specializations: string[];
  certificate:File | null;
};

const ChefRegister = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { loading, error, success } = useSelector((state: RootState) => state.auth);

  const [certificate, setCertificate] = useState<File | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number }>({ lat: 0, lng: 0 });

  const {
    register,
    handleSubmit,
    
    getValues,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm<ChefFormInputs>({
    resolver: yupResolver(chefRegisterSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      experience: '',
      specializations: [],
    },
  });
  

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'specializations',
  });

  const [specialize, setSpecialize] = useState('');

  useEffect(() => {
  navigator.geolocation.getCurrentPosition(
    (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
    (err) => {
      console.error(err.message);
      
    }
  );
}, []);


const onSubmit = (data: ChefFormInputs) => {
  
  
  const chefData = {
    ...data,
    location,
    role: 'chef',
  };
  dispatch(setRegistrationData(chefData));

  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('email', data.email);
  formData.append('phone', data.phone);
  formData.append('password', data.password);
  formData.append('experience', data.experience);
  formData.append('specialize', JSON.stringify(data.specializations));
  formData.append('locationLat', location.lat.toString());
  formData.append('locationLng', location.lng.toString());
  formData.append('role', 'chef');
  
  if (data.certificate) {
    formData.append('certificate', data.certificate);
  }
  dispatch(sendOtpForChef(formData));
};

  useEffect(() => {
    if (success) {
      const email = getValues('email');
      router.push(`/verifyotp?email=${encodeURIComponent(email)}&role=chef`);
      setTimeout(() => {
        dispatch(resetRegisterState());
        reset();
        setCertificate(null);
      }, 60000);
    }
  }, [success, dispatch, router, getValues, reset]);

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-2xl shadow-xl mt-12">
      <h2 className="text-3xl font-bold mb-8 text-center text-teal-700">Chef Registration</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {[
          { label: 'Name', name: 'name', type: 'text' },
          { label: 'Email', name: 'email', type: 'email' },
          { label: 'Phone Number', name: 'phone', type: 'tel' },
          { label: 'Password', name: 'password', type: 'password' },
          { label: 'Experience', name: 'experience', type: 'number' },
        ].map(({ label, name, type }) => (
          <div key={name}>
            <label className="block text-gray-700 font-medium mb-1">{label}</label>
            <input
              type={type}
              {...register(name as keyof ChefFormInputs)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
            />
            {errors[name as keyof ChefFormInputs] && (
              <p className="text-sm text-red-600 mt-1">
                {errors[name as keyof ChefFormInputs]?.message?.toString()}
              </p>
            )}
          </div>
        ))}

       
        <div>
          <label className="block text-gray-700 font-medium mb-1">Specialize In</label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={specialize}
              onChange={(e) => setSpecialize(e.target.value)}
              placeholder="e.g., Biryani, Desserts"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
            />
            <button
              type="button"
              onClick={() => {
                const trimmed = specialize.trim();
                if (trimmed && !watch('specializations').includes(trimmed)) {
                  append(trimmed);
                  setSpecialize('');
                }
              }}
              className="p-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white transition"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {fields.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {fields.map((item, idx) => (
              <span
                key={item.id}
                className="flex items-center gap-1 bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm"
              >
                {watch('specializations')[idx]} 
                <button
                  type="button"
                  onClick={() => remove(idx)}
                  className="hover:text-red-600 focus:outline-none"
                >
                  <X className="w-4 h-4" />
                </button>
              </span>
            ))}

            </div>
          )}

          {errors.specializations && (
            <p className="text-sm text-red-600 mt-1">{errors.specializations.message}</p>
          )}
        </div>

        
        <div>
          <label className="block text-gray-700 font-medium mb-1">Pick Location</label>
          <ChefLocationPicker onLocationChange={(lat, lng) => setLocation({ lat, lng })} />
        </div>

       
        <div>
          <label className="block text-gray-700 font-medium mb-1">Upload Certificate</label>
          <Controller
            control={control}
            name="certificate"
            defaultValue={null}
            render={({ field }) => (
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  field.onChange(file);   
                  setCertificate(file);   
                }}
                className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-white file:bg-teal-600 hover:file:bg-teal-700 transition"
              />
            )}
          />
          {errors.certificate && (
            <p className="text-sm text-red-600 mt-1">{errors.certificate.message}</p>
          )}

        </div>

        {loading && <p className="text-blue-500 text-sm">Registering...</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition duration-300 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Register'}
        </button>
      </form>
      <div className="mt-6 text-center">
      <p className="text-sm text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-[#213D72] font-medium hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ChefRegister;
