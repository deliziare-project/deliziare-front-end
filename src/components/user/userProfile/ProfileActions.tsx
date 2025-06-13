'use client';

import React, { useState } from 'react';
import { Edit, LogOut, KeyRound } from 'lucide-react';
import { AppDispatch, useAppSelector } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { logoutUser } from '@/features/authSlice';
import { useRouter } from 'next/navigation';
import EditProfileModal from './EditProfileModal';
import SetPasswordModal from './SetPasswordModal';
import { RootState } from '@/redux/store';

const ProfileActions = () => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();

  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isSetPasswordModalOpen, setSetPasswordModalOpen] = useState(false);

  const user = useAppSelector((state: RootState) => state.auth.currentUser);


  const handleLogout = async () => {
    const resultAction = await dispatch(logoutUser());
  
    if (logoutUser.fulfilled.match(resultAction)) {
      router.push('/login');
    } else {
      console.error('Logout failed:', resultAction.payload);
      // Optionally show a toast or alert here
    }
  };
  

  return (
    <div className="px-6 py-6">
      <h2 className="text-lg  font-medium text-gray-900 mb-4">Account Actions</h2>

      <div className="flex flex-wrap gap-4">
        <button
          className="inline-flex  cursor-pointer items-center px-4 py-2 bg-white border border-gray-200 rounded-md 
                     text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none 
                     focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
          onClick={() => setEditModalOpen(true)}
        >
          <Edit size={16} className="mr-2" />
          Edit Profile
        </button>

        {user?.isGoogleUser && user?.hasPassword === false && (
        <button
          className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-md 
                     text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none 
                     focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
          onClick={() => setSetPasswordModalOpen(true)}
        >
          <KeyRound size={16} className="mr-2" />
          Set Password
        </button>
      )}

        <button
          className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-md 
                     text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none 
                     focus:ring-2 cursor-pointer focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
          onClick={handleLogout}
        >
          <LogOut size={16} className="mr-2" />
          Sign Out
        </button>
      </div>

      <EditProfileModal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} />
      <SetPasswordModal isOpen={isSetPasswordModalOpen} onClose={() => setSetPasswordModalOpen(false)} />
    </div>
  );
};

export default ProfileActions;
