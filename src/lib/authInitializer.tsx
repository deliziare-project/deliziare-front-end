'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { checkCurrentUser } from '@/features/authSlice';
import axiosInstance from '@/api/axiosInstance';

export default function AuthInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    const init = async () => {
      try {
        const response = await axiosInstance.get('/users/me');
        dispatch(checkCurrentUser());
      } catch (err) {
        console.log("User not authenticated or session expired.");
        // Stay unauthenticated silently
      }
    };

    // ✅ Only call init if refreshToken exists
    if (typeof document !== 'undefined' && document.cookie.includes('refreshToken')) {
      init();
    }
  }, []);

  return null;
}
