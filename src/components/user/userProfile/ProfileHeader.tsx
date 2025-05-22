import React from 'react';
import { Shield, Calendar } from 'lucide-react';
import { formatDate } from '@/utils/dateUtils';
import UserAvatar from './UserAvatar';


interface User {
  name: string;
  role: string;
  createdAt: string;
  isBlock: boolean;
  _id: string;
}

interface ProfileHeaderProps {
  user: User;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  return (
    <div className="border-b border-gray-100">
      <div className="px-6 py-8 md:flex md:items-center md:justify-between">
        <div className="flex items-center">
          <UserAvatar name={user.name} size="large" />
          <div className="ml-6">
            <h1 className="text-2xl font-semibold text-gray-900 transition-all duration-300 ease-in-out">
              {user.name}
            </h1>
            <div className="flex items-center mt-1">
              <Shield size={16} className="text-indigo-500 mr-1" />
              <span className="text-sm font-medium text-indigo-600 capitalize">
                {user.role}
              </span>
              <span className={`ml-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.isBlock ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                {user.isBlock ? 'Blocked' : 'Active'}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-6 md:mt-0">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar size={16} className="mr-1.5" />
            <span>Joined {formatDate(user.createdAt)}</span>
          </div>
        
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;