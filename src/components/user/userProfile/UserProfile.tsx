'use client'; 
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProfileHeader from './ProfileHeader';
import ProfileDetails from './ProfileDetails';
import ProfileActions from './ProfileActions';
import { checkCurrentUser } from '@/features/authSlice';
import { AppDispatch } from '@/redux/store';

function UserProfile() {
  const { currentUser } = useSelector((state: any) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  
  useEffect(() => {
    if (!currentUser) {
      dispatch(checkCurrentUser());
    }
  }, [currentUser, dispatch]);
  console.log("user:",currentUser);
  
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500 animate-pulse">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
          <ProfileHeader user={currentUser} />
          <ProfileDetails user={currentUser} />
          <ProfileActions />
        </div>
      </div>
    </div>
  );
}

export default UserProfile;