import React from 'react';
import { MessageSquare } from 'lucide-react';

const EmptyState: React.FC = () => {
  return (
    <div className="text-center p-6">
      <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
        <MessageSquare className="w-8 h-8 text-blue-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">No messages yet</h3>
      <p className="text-gray-500 max-w-xs mx-auto">
        Start the conversation by sending a message. Your chat history will appear here.
      </p>
    </div>
  );
};

export default EmptyState;