import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';

interface Post {
  _id: string;
  title: string;
  description: string;
  images: { url: string; altText?: string }[];
  tags: string[];
  createdAt: string;
}

interface PostState {
  loading: boolean;
  error: string | null;
  success: boolean;
  post: Post | null;
  posts: Post[];
  postsLoading: boolean;
  postsError: string | null;
}

const initialState: PostState = {
  loading: false,
  error: null,
  success: false,
  post: null,
  posts: [],
  postsLoading: false,
  postsError: null,
};


export const createChefPost = createAsyncThunk(
  'chefPost/create',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/chefs/chef-post', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


export const fetchChefPosts = createAsyncThunk(
  'chefPost/fetchMyPosts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/chefs/getPost');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const chefPostSlice = createSlice({
  name: 'chefPost',
  initialState,
  reducers: {
    resetPostState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.post = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create post
      .addCase(createChefPost.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createChefPost.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.post = action.payload;
      })
      .addCase(createChefPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch posts
      .addCase(fetchChefPosts.pending, (state) => {
        state.postsLoading = true;
        state.postsError = null;
      })
      .addCase(fetchChefPosts.fulfilled, (state, action) => {
        state.postsLoading = false;
        state.posts = action.payload;
      })
      .addCase(fetchChefPosts.rejected, (state, action) => {
        state.postsLoading = false;
        state.postsError = action.payload as string;
      });
  },
});

export const { resetPostState } = chefPostSlice.actions;
export default chefPostSlice.reducer;
