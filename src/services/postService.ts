import axiosInstance from '../api/axiosInstance';
import { PostsResponse } from '../types/post';

export const fetchPosts = async (): Promise<PostsResponse> => {
  try {
    const response = await axiosInstance.get('/posts/view');
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};