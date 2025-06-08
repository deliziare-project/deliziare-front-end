import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { useSocket } from '@/services/socket';
import axiosInstance from '@/api/axiosInstance';
import {
  setMessages,
  setLoading,
  replayChat,
} from '@/features/chatSlice';
import { checkCurrentUser } from '@/features/authSlice';

interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string | Date;
}

export const useChat = (recipientId: string) => {
  const [messageInput, setMessageInput] = useState('');
  const dispatch = useDispatch<AppDispatch>();
    const { replayMessage } = useSelector((state: RootState) => state.chat);
  
  const { messages, onlineUsers, loading } = useSelector(
    (state: RootState) => state.chat
  );
  
  const { currentUser, loading: isLoadingCurrentUser } = useSelector(
    (state: RootState) => state.auth
  );
  
  const { sendMessage } = useSocket(currentUser?._id || '');

  const fetchMessages = async () => {
    if (!recipientId || !currentUser?._id) return;
    
    try {
      dispatch(setLoading(true));
      const response = await axiosInstance.get<Message[]>(
        `/messages/get-message/${currentUser._id}/${recipientId}`
      );
      dispatch(setMessages(response.data));
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
  dispatch(checkCurrentUser());
}, []);

useEffect(() => {
  if (recipientId && currentUser?._id) {
    fetchMessages();
  }
}, [recipientId, currentUser?._id]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !recipientId || !currentUser?._id) return;

    const newMessage = {
      senderId: currentUser._id,
      receiverId: recipientId,
      content: messageInput,
      postId:replayMessage?._id
    };

    try {
      await sendMessage(newMessage);
      dispatch(replayChat(null))
      setMessageInput('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return {
    currentUser,
    messages,
    onlineUsers,
    loading,
    messageInput,
    handleSendMessage,
    handleInputChange,
    handleKeyPress,
    isLoadingCurrentUser,
  };
};