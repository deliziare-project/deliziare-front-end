'use client'; 

import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/store'; 
import { loginUser, resetRegisterState } from '../../features/authSlice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error, success, registrationData } = useAppSelector((state:any) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(loginUser({ email, password }));
    router.push('/user/home');
    console.log('Logging in with:', { email, password });

  };

  useEffect(() => {
    if (success) {

      alert('Login successful!');
      console.log('User data:', registrationData.user);

      
      if(registrationData.user&&registrationData.user.role=='admin'){
       router.push('/admin/dashboard')
      }else if(registrationData.user&&registrationData.user.role=='host'){
       router.push('/user/home')
      }

    }
  }, [success, registrationData]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-[#fdf7f4] px-4">
      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-2xl border border-[#f0e6e0]">
        <h2 className="text-3xl font-bold text-center text-[#B87333] mb-8">Login</h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-800">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-[#B87333] focus:border-[#B87333] text-black"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-800">Password</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-[#B87333] focus:border-[#B87333] text-black"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#B87333] text-white py-2 rounded-xl font-semibold hover:bg-[#a05f2a] transition duration-300 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-600">
          Don&apos;t have an account?{' '}
          <Link href="/register">
            <span className="text-[#B87333] hover:underline font-medium">Sign Up</span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
