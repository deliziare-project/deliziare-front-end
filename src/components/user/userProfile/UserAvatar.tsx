import React from 'react';

interface UserAvatarProps {
  name: string;
  size?: 'small' | 'medium' | 'large';
  imageUrl?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ 
  name, 
  size = 'medium',
  imageUrl 
}) => {
 
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const initials = getInitials(name);
  
  // Determine size classes
  const sizeClasses = {
    small: 'w-8 h-8 text-xs',
    medium: 'w-12 h-12 text-sm',
    large: 'w-20 h-20 text-xl'
  };
  
  const classes = `${sizeClasses[size]} bg-indigo-100 text-indigo-800 font-medium 
                   rounded-full flex items-center justify-center transition-all
                   duration-300 ease-in-out hover:bg-indigo-200`;

  return imageUrl ? (
    <img 
      src={imageUrl} 
      alt={name} 
      className={`${sizeClasses[size]} rounded-full object-cover`}
    />
  ) : (
    <div className={classes}>
      {initials}
    </div>
  );
};

export default UserAvatar;