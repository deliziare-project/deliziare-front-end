// components/chat/ChatLayout.tsx
'use client'

import MessageList from './MessageList'
import MessageInput from './MessageInput'
import LoadingSpinner from '../ui/LoadingSpinner'
import { useChat } from '../hookss/useChat'
import { useEffect, useState } from 'react'
import axiosInstance from '@/api/axiosInstance'
import ChatHeader from './ChatHeader'
import EmptyState from './EmptyState'
import { User } from '@/types/User'
import { useDispatch } from 'react-redux'
import { closeChat } from '@/features/chatSlice'

interface ChatLayoutProps {
  recipientId: string;
}

export default function ChatLayout({ recipientId }: ChatLayoutProps) {
  const dispatch = useDispatch()
  const [recipient, setRecipient] = useState<User | null>(null)
  const [loadingRecipient, setLoadingRecipient] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const {
    currentUser,
    messages,
    onlineUsers,
    loading,
    messageInput,
    handleSendMessage,
    handleInputChange,
    handleKeyPress,
    isLoadingCurrentUser,
  } = useChat(recipientId)

  useEffect(() => {
    const fetchRecipientDetails = async () => {
      try {
        setLoadingRecipient(true)
        const response = await axiosInstance.get(`/messages/find-user/${recipientId}`)
        const data = response.data
        setRecipient(data)
      } catch (err) {
        console.error('Error fetching recipient details:', err)
        setError('Failed to load user details')
      } finally {
        setLoadingRecipient(false)
      }
    }

    if (recipientId) {
      fetchRecipientDetails()
    }
  }, [recipientId])

  if (isLoadingCurrentUser || loadingRecipient||loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <LoadingSpinner />
      </div>
    )
  }

  if (!currentUser) {
    console.log(currentUser,loading,isLoadingCurrentUser)
    return (
      <div className="flex justify-center items-center h-full">
        <p>Please login to access chat</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <ChatHeader 
        recipient={recipient}
        onlineUsers={onlineUsers}
        recipientId={recipientId}
        onClose={() => dispatch(closeChat())}
      />
      
      <MessageList 
        messages={messages} 
        currentUserId={currentUser._id} 
        loading={loading} 
        emptyState={<EmptyState />}
        recipientName={recipient?.name}
        avatar={recipient?.profileImage}
        className="flex-1"
      />
      
      <MessageInput
        messageInput={messageInput}
        handleInputChange={handleInputChange}
        handleKeyPress={handleKeyPress}
        handleSendMessage={handleSendMessage}
      />
    </div>
  )
}