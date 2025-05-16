

'use client'; 


import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/store'; 
import { loginUser, resetRegisterState } from '../../features/authSlice';
import { useRouter } from 'next/navigation';

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error, success, registrationData } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

   
    dispatch(loginUser({ email, password }));
    router.push('/user/home')


    console.log('Logging in with:', { email, password });

  };

  useEffect(() => {
    if (success) {
      alert('Login successful!');
      console.log('User data:', registrationData.user);
      
    }
  }, [success, registrationData]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-[#213D72] mb-6">Login</h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-[#213D72] focus:border-[#213D72]"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-[#213D72] focus:border-[#213D72]"
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#213D72] text-white py-2 rounded-xl font-semibold hover:bg-[#1a2f5c] transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
