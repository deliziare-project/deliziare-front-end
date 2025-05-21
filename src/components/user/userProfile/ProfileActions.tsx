import React from 'react';
import { Edit,  LogOut } from 'lucide-react';
import { AppDispatch } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { logoutUser } from '@/features/authSlice';
import { useRouter } from 'next/navigation';

const ProfileActions = () => {
   const dispatch:AppDispatch =useDispatch()
    const router=useRouter()
    const handleLogout=()=>{
      dispatch(logoutUser())
       router.push('/login')
  
    }
  return (
    <div className="px-6 py-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Account Actions</h2>
      
      <div className="flex flex-wrap gap-4">
        <button 
          className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-md 
                    text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none 
                    focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 
                    transition-all duration-300 ease-in-out"
        >
          <Edit size={16} className="mr-2" />
          Edit Profile
        </button>
        
   
        
        <button 
          className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-md 
                    text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none 
                    focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                    transition-all duration-300 ease-in-out"
            onClick={handleLogout}        
        >
          <LogOut size={16} className="mr-2" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default ProfileActions;