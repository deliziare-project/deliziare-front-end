'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  sendOtpForChef,
  setRegistrationData,
  resetRegisterState,
  checkEmailExists,
} from '../../features/authSlice';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Plus, X } from 'lucide-react';
import { chefRegisterSchema } from '@/validation/ChefValidation';
import Link from 'next/link';
import { useDebounce } from '@/hooks/useDebounce';

const ChefLocationPicker = dynamic(() => import('@/components/LocationPicker'), { ssr: false });

type ChefFormInputs = {
  name: string;
  email: string;
  phone: string;
  password: string;
  experience: string;
  specializations: string[];
  certificate: File | null;
};

const ChefRegister = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { loading, error, success } = useSelector((state: RootState) => state.auth);

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
      certificate: null,
    },
  });

  const email = watch('email');
  const debouncedEmail = useDebounce(email, 600);
  const [emailExists, setEmailExists] = useState<boolean | null>(null);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'specializations',
  });

  const specializations = watch('specializations') || [];

  useEffect(() => {
    if (debouncedEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(debouncedEmail)) {
      dispatch(checkEmailExists(debouncedEmail))
        .unwrap()
        .then((result) => setEmailExists(result))
        .catch(() => setEmailExists(null));
    } else {
      setEmailExists(null);
    }
  }, [debouncedEmail, dispatch]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => console.warn('Geolocation error:', err.message)
    );
  }, []);

  const onSubmit = (data: ChefFormInputs) => {
    if (emailExists) {
      return; 
    }
    const formData = new FormData();
    const chefData = {
      ...data,
      location,
      role: 'chef',
    };
    dispatch(setRegistrationData(chefData));

    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('phone', data.phone);
    formData.append('password', data.password);
    formData.append('experience', data.experience);
    formData.append('specialize', JSON.stringify(data.specializations));
    formData.append('locationLat', location.lat.toString());
    formData.append('locationLng', location.lng.toString());
    formData.append('role', 'chef');
    if (data.certificate) formData.append('certificate', data.certificate);

    dispatch(sendOtpForChef(formData));
  };

  useEffect(() => {
    if (success) {
      const email = getValues('email');
      router.push(`/verifyotp?email=${encodeURIComponent(email)}&role=chef`);
      setTimeout(() => {
        dispatch(resetRegisterState());
        reset();
      }, 60000);
    }
  }, [success, dispatch, router, getValues, reset]);

  const inputFields = useMemo(
    () => [
      { label: 'Name', name: 'name', type: 'text' },
      { label: 'Email', name: 'email', type: 'email' },
      { label: 'Phone Number', name: 'phone', type: 'tel' },
      { label: 'Password', name: 'password', type: 'password' },
      { label: 'Experience', name: 'experience', type: 'number' },
    ],
    []
  );

  const [specialize, setSpecialize] = useState('');

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-2xl shadow-xl mt-12">
      <h2 className="text-3xl font-bold mb-8 text-center text-teal-700">Chef Registration</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {inputFields.map(({ label, name, type }) => (
        <div key={name}>
          <label className="block text-gray-700 font-medium mb-1">{label}</label>
          <input
            type={type}
            {...register(name as keyof ChefFormInputs)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          {errors[name as keyof ChefFormInputs] && (
            <p className="text-sm text-red-600 mt-1">{errors[name as keyof ChefFormInputs]?.message?.toString()}</p>
          )}
          {name === 'email' && emailExists === true && (
            <p className="text-sm text-red-600 mt-1">This email is already registered.</p>
          )}
        </div>
      ))}


        {/* Specializations */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Specialize In</label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={specialize}
              onChange={(e) => setSpecialize(e.target.value)}
              placeholder="e.g., Biryani, Desserts"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              type="button"
              onClick={() => {
                const trimmed = specialize.trim();
                if (trimmed && !specializations.includes(trimmed)) {
                  append(trimmed);
                  setSpecialize('');
                }
              }}
              className="p-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {fields.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {fields.map((item, idx) => (
                <span key={item.id} className="flex items-center gap-1 bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm">
                  {specializations[idx]}
                  <button type="button" onClick={() => remove(idx)} className="hover:text-red-600">
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          )}
          {errors.specializations && <p className="text-sm text-red-600 mt-1">{errors.specializations.message}</p>}
        </div>

        {/* Location Picker */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Pick Location</label>
          <ChefLocationPicker onLocationChange={(lat, lng) => setLocation({ lat, lng })} />
        </div>

        {/* Certificate Upload */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Upload Certificate</label>
          <Controller
            control={control}
            name="certificate"
            render={({ field }) => (
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => field.onChange(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-white file:bg-teal-600 hover:file:bg-teal-700"
              />
            )}
          />
          {errors.certificate && <p className="text-sm text-red-600 mt-1">{errors.certificate.message}</p>}
        </div>

        {/* Loading / Error / Submit */}
        {loading && <p className="text-blue-500 text-sm">Registering...</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Register'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-[#213D72] font-medium hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ChefRegister;
