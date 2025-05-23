import React from 'react';
import { Mail, Phone, Clock } from 'lucide-react';
import { formatDate } from '@/utils/dateUtils';

interface User {
  email: string;
  phone: number;
  createdAt: string;
  updatedAt: string;
}

interface ProfileDetailsProps {
  user: User;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ user }) => {
  return (
    <div className="px-6 py-6 border-b border-gray-100">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h2>
      
      <div className="space-y-4">
        <div className="flex items-center group">
          <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center mr-4 
                        group-hover:bg-indigo-100 transition-colors duration-300 ease-in-out">
            <Mail size={18} className="text-indigo-600" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Email</div>
            <div className="text-gray-900 font-medium">{user.email}</div>
          </div>
        </div>
        
        <div className="flex items-center group">
          <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center mr-4
                        group-hover:bg-indigo-100 transition-colors duration-300 ease-in-out">
            <Phone size={18} className="text-indigo-600" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Phone</div>
            <div className="text-gray-900 font-medium">{user.phone}</div>
          </div>
        </div>
        
        <div className="flex items-center group">
          <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center mr-4
                        group-hover:bg-indigo-100 transition-colors duration-300 ease-in-out">
            <Clock size={18} className="text-indigo-600" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Last Updated</div>
            <div className="text-gray-900 font-medium">{formatDate(user.updatedAt, true)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;