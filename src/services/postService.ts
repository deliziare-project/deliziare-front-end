import axiosInstance from '../api/axiosInstance';
import { Post, PostsResponse } from '../types/post';

export const fetchPosts = async (): Promise<PostsResponse> => {
  try {
    const response = await axiosInstance.get('/posts/view');
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

export const editPostIs=async(data:Post)=>{
  const {eventName,date,time,quantity,menu,description}=data
     try {
    const response = await axiosInstance.put(`/posts/edit-post/${data._id}`, {eventName,date,time,quantity,menu,description}, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Edit Post Error:', error);
    throw error;
  }
}