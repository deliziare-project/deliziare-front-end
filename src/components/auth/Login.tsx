'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { loginUser, checkCurrentUser } from '../../features/authSlice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import axiosInstance from '@/api/axiosInstance';
import { GoogleLogin } from '@react-oauth/google';
import { Skeleton } from '../loaders/Skeleton';


const schema = yup.object().shape({
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().required('Password is required'),
});

interface LoginFormInputs {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error, success, registrationData } = useAppSelector((state: any) => state.auth);

  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(schema),
  });

  const email = watch('email');

  useEffect(() => {
    const checkGoogleUser = async () => {
      if (!email) return;
      try {
        const res = await axiosInstance.post('/users/check-google-user', { email });
        setIsGoogleUser(res.data?.isGoogleUser ?? false);
        setUserRole(res.data?.role ?? null);
      } catch (err) {
        setIsGoogleUser(false);
        setUserRole(null);
      }
    };
    checkGoogleUser();
  }, [email]);

  const onSubmit = (data: LoginFormInputs) => {
    dispatch(loginUser({ email: data.email, password: data.password }));
  };

  const redirectBasedOnRole = (role: string | null) => {
    switch (role) {
      case 'admin':
        router.push('/admin/dashboard');
        break;
      case 'host':
        router.push('/user/home');
        break;
      case 'chef':
        router.push('/chef/home');
        break;
      case 'deliveryBoy':
        router.push('/deliveryBoy/welcome');
        break;
      default:
        router.push('/');
    }
  };
  

  useEffect(() => {
    const user = registrationData?.user;
    if (success && user) {

      redirectBasedOnRole(user.role);

    }
  }, [success, registrationData]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-[#fdf7f4] px-4">
      <div className="flex max-w-4xl w-full bg-white rounded-2xl shadow-2xl border border-[#f0e6e0] overflow-hidden">
        <div className="hidden md:block md:w-1/2">
          <Image
            src="/authImages/login.png"
            alt="Login Illustration"
            width={400}
            height={400}
            className="object-cover"
          />
        </div>

        <div className="w-full md:w-1/2 p-10">
        <h2 className="text-3xl font-bold text-center text-[#d94f30]">Welcome Back</h2>
        <p className="text-sm text-center text-gray-600 mb-8">Please sign in to your account</p>


        {loading ? (
          <Skeleton/>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-800">Email</label>
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-[#B87333] focus:border-[#B87333] text-black"
                />
                {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-800">Password</label>
                <input
                  id="password"
                  type="password"
                  {...register('password')}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-[#B87333] focus:border-[#B87333] text-black"
                />
                {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>}
                <div className="flex justify-end mt-1">
                  <Link href="/forgot-password">
                    <span className="text-sm text-[#B87333] hover:underline cursor-pointer font-medium">
                      Forgot Password?
                    </span>
                  </Link>
                </div>
              </div>

              {isGoogleUser && (
                <div className="w-full">
                  <div className="flex items-center my-4">
                    <hr className="flex-grow border-t border-gray-300" />
                    <span className="mx-3 text-sm text-gray-500">OR</span>
                    <hr className="flex-grow border-t border-gray-300" />
                  </div>

                  <GoogleLogin
                    onSuccess={async (credentialResponse) => {
                      try {
                        const res = await axiosInstance.post('/users/google', {
                          credential: credentialResponse.credential,
                          role: userRole,
                        });

                        if (res?.data?.status === true) {
                          dispatch(checkCurrentUser());
                          const user = res.data.data;
                          redirectBasedOnRole(user?.role || 'host');
                        }
                      } catch (err) {
                        console.error('Google login error', err);
                      }
                    }}
                    onError={() => console.log('Google Login Failed')}
                    useOneTap
                    width="365"
                    text="continue_with"
                  />
                </div>
              )}

              {error && <p className="text-red-600 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#d94f30] text-white py-2 rounded-xl font-semibold hover:bg-[#a05f2a] transition duration-300 disabled:opacity-50"
              >
                Login
              </button>
            </form>
          )}


          <p className="mt-6 text-sm text-center text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/register">
              <span className="text-[#B87333] hover:underline font-medium">Sign Up</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
