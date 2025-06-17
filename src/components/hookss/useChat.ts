import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { useSocket } from '@/services/socket';
import axiosInstance from '@/api/axiosInstance';
import {
  setMessages,
  setLoading,
  replayChat,
  updateRequstBid,
} from '@/features/chatSlice';
import { checkCurrentUser } from '@/features/authSlice';
import { Message } from '@/types/message';
interface BidRequest {
  amount: string;
  description: string;
}
export const useChat = (recipientId: string) => {
  const [messageInput, setMessageInput] = useState('');
  const [bidRequest, setBidRequest] = useState<BidRequest>({
    amount: '',
    description: ''
  });
  const dispatch = useDispatch<AppDispatch>();
  const { replayMessage } = useSelector((state: RootState) => state.chat);
  
  const { messages, onlineUsers, loading } = useSelector(
    (state: RootState) => state.chat
  );
  
  const { currentUser, loading: isLoadingCurrentUser } = useSelector(
    (state: RootState) => state.auth
  );
  
  const { sendMessage, markMessagesAsReadSocket  } = useSocket(currentUser?._id || '');

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
  
  const markMessagesAsRead = async () => {
    if (!recipientId || !currentUser?._id) return;
    
    try {
      await axiosInstance.post(`/messages/markAsRead/${currentUser._id}/${recipientId}`);
      console.log(`📖 API call to mark messages as read for recipientId: ${recipientId}`);
      markMessagesAsReadSocket(currentUser._id, recipientId);
    } catch (error) {
      console.error('Failed to mark messages as read:', error);
    }
  };

  useEffect(() => {
    dispatch(checkCurrentUser());
  }, []);

  useEffect(() => {
    if (recipientId && currentUser?._id) {
      fetchMessages();
      markMessagesAsRead();
    }
  }, [recipientId, currentUser?._id]);

  const handleSendMessage = async () => {
   

    if (!recipientId || !currentUser?._id) return;

    const newMessage = {
      senderId: currentUser._id,
      receiverId: recipientId,
      content: messageInput,
      postId: replayMessage?._id as string,
      RequestChef:bidRequest.amount&&bidRequest.description?bidRequest:undefined
    };
   
    try {
      await sendMessage(newMessage);
      dispatch(replayChat(null));
      setMessageInput('');
        setBidRequest({
         amount: '',
        description: ''
        });
      dispatch(updateRequstBid(false))
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
  };
   const handleBidCHange = (e: React.ChangeEvent<HTMLInputElement| HTMLTextAreaElement>) => {
    const { name, value } = e.target;
     setBidRequest((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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
    bidRequest,
    handleBidCHange,
    isLoadingCurrentUser,
  };
};