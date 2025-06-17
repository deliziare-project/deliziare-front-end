import axiosInstance from "@/api/axiosInstance";

export const getBidsReadStatus = async (postId: string) => {
    try {
      const response = await axiosInstance.get('/bids/read-status', {
        params: { postId }
      });
      return response.data.hasUnreadBids;
    } catch (error) {
      console.error('Error getting bids read status:', error);
      throw error;
    }
  };