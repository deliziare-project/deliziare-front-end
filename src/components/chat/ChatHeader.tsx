// components/chat/ChatHeader.tsx
'use client'

import { User } from '@/types/User'


interface ChatHeaderProps {
  recipient: User | null
  onlineUsers: string[]
  recipientId: string
  onClose: () => void
}

export default function ChatHeader({
  recipient,
  onlineUsers,
  recipientId,
  onClose,
}: ChatHeaderProps) {
  const isOnline = onlineUsers.includes(recipientId)
console.log(onlineUsers.includes(recipientId))
  return (
    <div className="bg-gray-800 text-white p-3 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden">
            {recipient?.profileImage ? (
              <img
                src={recipient.profileImage}
                alt={recipient.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-lg">
                {recipient?.name?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
              isOnline ? 'bg-green-500' : 'bg-gray-500'
            }`}
          />
        </div>
        <div>
          <h3 className="font-semibold">{recipient?.name}</h3>
          <p className="text-xs text-gray-300">
            {isOnline ? 'Online' : 'Offline'}
          </p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="text-gray-300 hover:text-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  )
}