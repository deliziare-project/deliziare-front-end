import axiosInstance from '@/api/axiosInstance';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface Post {
  _id: string;
  eventName: string;
  location: { lat: number; lng: number };
  district: string;
  date: string;
  time: string;
  quantity: number;
  menu: string[];
  description: string;
  userId: { name: string; email: string ,profileImage:string};
  createdAt:string;
  status:string;
}

interface ChefDistrictPostsState {
  posts: Post[];
  selectedPost: Post | null;
  loading: boolean;
  error: string | null;
}

const initialState: ChefDistrictPostsState = {
  posts: [],
  selectedPost: null,
  loading: false,
  error: null,
};

export const fetchChefDistrictPosts = createAsyncThunk(
  'chefDistrictPosts/fetchAll',
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get('/chefs/user-posts');
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);


export const fetchPostDetails = createAsyncThunk(
  'chefDistrictPosts/fetchDetails',
  async (postId: string, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/chefs/user-posts/${postId}`);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch post details');
    }
  }
);

const chefDistrictPostsSlice = createSlice({
  name: 'chefDistrictPosts',
  initialState,
  reducers: {
    clearSelectedPost: (state) => {
      state.selectedPost = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
     
      .addCase(fetchChefDistrictPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChefDistrictPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchChefDistrictPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      
      .addCase(fetchPostDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedPost = null;
      })
      .addCase(fetchPostDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPost = action.payload;
      })
      .addCase(fetchPostDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.selectedPost = null;
      });
  },
});

export const { clearSelectedPost } = chefDistrictPostsSlice.actions;

export default chefDistrictPostsSlice.reducer;
