'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { forgotPassword } from '@/features/authSlice';
import { useRouter } from 'next/navigation';

interface FormData {
  email: string;
}

const schema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
});

const ForgotPassword: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (data: FormData) => {
    setMessage(null);
    try {
      const result = await dispatch(forgotPassword(data.email));
      
      if (forgotPassword.fulfilled.match(result)) {
        setMessage('OTP has been sent to your email.');
        router.push(`/password-otp?email=${encodeURIComponent(data.email)}`);
      }
    } catch (err) {
      console.error('Failed to send OTP:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-[#fdf7f4] px-4">
      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-2xl border border-[#f0e6e0]">
        <h2 className="text-3xl font-bold text-center text-[#d94f30] mb-8">Forgot Password</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-800">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your registered email"
              className={`mt-1 block w-full px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-[#B87333] focus:border-[#B87333] text-black ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              {...register('email')}
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {message && <p className="text-green-600 text-sm">{message}</p>}
          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#d94f30] text-white py-2 rounded-xl font-semibold hover:bg-[#a05f2a] transition duration-300 disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Reset OTP'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;