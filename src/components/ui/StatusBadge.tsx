import React from 'react';

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let bgColor = '';
  let textColor = '';
  
  switch (status.toLowerCase()) {
    case 'accepted':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      break;
    case 'rejected':
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      break;
    case 'pending':
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-800';
      break;
    default:
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
  }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {status}
    </span>
  );
};

export default StatusBadge;