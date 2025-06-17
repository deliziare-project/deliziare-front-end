import axiosInstance from "@/api/axiosInstance";
import { useSocket } from "./socket";

  const {  markMessagesAsReadSocket } = useSocket('');

  export const markMessagesAsReadService = async (recipientId:string,currentUserId:string) => {
    if (!recipientId || !currentUserId) return;
     
    try {
      await axiosInstance.post(`/messages/markAsRead/${currentUserId}/${recipientId}`);
      console.log(`📖 API call to mark messages as read for recipientId: ${recipientId}`);
      markMessagesAsReadSocket(currentUserId, recipientId);
    } catch (error) {
      console.error('Failed to mark messages as read:', error);
    }
  };