// import React, { useRef, useState } from 'react';
// import { Shield, Calendar, Pencil, Check, X } from 'lucide-react';
// import { formatDate } from '@/utils/dateUtils';
// import UserAvatar from './UserAvatar';
// import axiosInstance from '@/api/axiosInstance';

// interface User {
//   name: string;
//   role: string;
//   createdAt: string;
//   isBlock: boolean;
//   _id: string;
//   profileImage?: string;
// }

// interface ProfileHeaderProps {
//   user: User;
// }

// const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [profileImage, setProfileImage] = useState(user.profileImage);
//   const [previewImage, setPreviewImage] = useState<string | null>(null);
//   const [isUploading, setIsUploading] = useState(false);

//   const handleEditClick = () => {
//     fileInputRef.current?.click();
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     // Create preview URL
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       setPreviewImage(event.target?.result as string);
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleConfirmUpload = async () => {
//     if (!previewImage || !fileInputRef.current?.files?.[0]) return;

//     setIsUploading(true);
//     const file = fileInputRef.current.files[0];
//     const formData = new FormData();
//     formData.append('profileImage', file);

//     try {
//       const res = await axiosInstance.post('/userclient/upload-profile-image', formData, {
//         withCredentials: true,
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });
//       setProfileImage(res.data.imageUrl);
//       setPreviewImage(null);
//     } catch (err) {
//       console.error('Image upload failed', err);
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const handleCancelUpload = () => {
//     setPreviewImage(null);
//     if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//     }
//   };

//   return (
//     <div className="border-b border-gray-100">
//       <div className="px-6 py-8 md:flex md:items-center md:justify-between">
//         <div className="flex items-center relative">
//           {previewImage ? (
//             <div className="relative">
//               <img
//                 src={previewImage}
//                 alt="Preview"
//                 className="w-20 h-20 rounded-full object-cover border-4 border-white shadow"
//               />
//               <div className="absolute bottom-0 right-0 flex gap-1 bg-white rounded-full p-1 shadow-md">
//                 <button
//                   onClick={handleConfirmUpload}
//                   disabled={isUploading}
//                   className="p-1 text-green-600 hover:bg-green-50 rounded-full"
//                 >
//                   <Check size={16} />
//                 </button>
//                 <button
//                   onClick={handleCancelUpload}
//                   disabled={isUploading}
//                   className="p-1 text-red-600 hover:bg-red-50 rounded-full"
//                 >
//                   <X size={16} />
//                 </button>
//               </div>
//             </div>
//           ) : profileImage ? (
//             <img
//               src={profileImage}
//               alt={user.name}
//               className="w-20 h-20 rounded-full object-cover border-4 border-white shadow"
//             />
//           ) : (
//             <UserAvatar name={user.name} size="large" />
//           )}

//           {!previewImage && (
//             <button
//               onClick={handleEditClick}
//               className="absolute cursor-pointer bottom-0 right-0 bg-white border border-gray-300 rounded-full p-1 hover:bg-gray-100"
//             >
//               <Pencil size={16} className="text-gray-600" />
//             </button>
//           )}

//           <input
//             ref={fileInputRef}
//             type="file"
//             accept="image/*"
//             className="hidden"
//             onChange={handleFileChange}
//           />
//         </div>

//         <div className="ml-6">
//           <h1 className="text-2xl font-semibold text-gray-900">{user.name}</h1>
//           <div className="flex items-center mt-1">
//             <Shield size={16} className="text-indigo-500 mr-1" />
//             <span className="text-sm font-medium text-indigo-600 capitalize">
//               {user.role}
//             </span>
//             <span className={`ml-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.isBlock ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
//               {user.isBlock ? 'Blocked' : 'Active'}
//             </span>
//           </div>
//         </div>

//         <div className="mt-6 md:mt-0">
//           <div className="flex items-center text-sm text-gray-500">
//             <Calendar size={16} className="mr-1.5" />
//             <span>Joined {formatDate(user.createdAt)}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };


// export default ProfileHeader;

'use client';

import React, { useRef, useState } from 'react';
import { Shield, Calendar, Pencil, Check, X } from 'lucide-react';
import { formatDate } from '@/utils/dateUtils';
import UserAvatar from './UserAvatar';
import axiosInstance from '@/api/axiosInstance';

interface User {
  name: string;
  role: string;
  createdAt: string;
  isBlock: boolean;
  _id: string;
  profileImage?: string;
}

interface ProfileHeaderProps {
  user: User;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImage, setProfileImage] = useState(user.profileImage);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmUpload = async () => {
    if (!previewImage || !fileInputRef.current?.files?.[0]) return;

    setIsUploading(true);
    const file = fileInputRef.current.files[0];
    const formData = new FormData();
    formData.append('profileImage', file);

    try {
      const res = await axiosInstance.post('/userclient/upload-profile-image', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setProfileImage(res.data.imageUrl);
      setPreviewImage(null);
    } catch (err) {
      console.error('Image upload failed', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancelUpload = () => {
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="border-b border-[#E8F5E6] bg-gradient-to-r from-[#F1F8E9] to-[#E8F5E6]">
      <div className="px-6 py-8 md:flex md:items-center md:justify-between">
        <div className="flex items-center relative">
          <div className="relative group">
            {previewImage ? (
              <img
                src={previewImage}
                alt="Preview"
                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : profileImage ? (
              <img
                src={profileImage}
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <UserAvatar name={user.name} size="large" />
            )}

            {!previewImage && (
              <button
                onClick={handleEditClick}
                className="absolute bottom-0 right-0 bg-white border-2 border-[#708A58] rounded-full p-1.5 hover:bg-[#E8F5E6] transition-colors duration-200 shadow-sm"
              >
                <Pencil size={14} className="text-[#708A58]" />
              </button>
            )}
          </div>

          {previewImage && (
            <div className="absolute bottom-0 right-0 flex gap-1 bg-white rounded-full p-1 shadow-md border border-[#D1E8CE]">
              <button
                onClick={handleConfirmUpload}
                disabled={isUploading}
                className="p-1 text-[#2D4F2B] hover:bg-[#E8F5E6] rounded-full"
              >
                <Check size={16} />
              </button>
              <button
                onClick={handleCancelUpload}
                disabled={isUploading}
                className="p-1 text-[#C95838] hover:bg-[#FCE8E5] rounded-full"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <div className="ml-6">
          <h1 className="text-2xl font-semibold text-[#2D4F2B]">{user.name}</h1>
          <div className="flex items-center mt-2">
            <Shield size={16} className="text-[#708A58] mr-1.5" />
            <span className="text-sm font-medium text-[#708A58] capitalize">
              {user.role}
            </span>
            <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.isBlock ? 'bg-[#FCE8E5] text-[#C95838]' : 'bg-[#E8F5E6] text-[#2D4F2B]'}`}>
              {user.isBlock ? 'Blocked' : 'Active'}
            </span>
          </div>
        </div>

        <div className="mt-4 md:mt-0">
          <div className="flex items-center text-sm text-[#708A58]">
            <Calendar size={16} className="mr-1.5" />
            <span>Joined {formatDate(user.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;