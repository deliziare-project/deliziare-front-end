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
  userId: { name: string; email: string };
}

interface ChefDistrictPostsState {
  posts: Post[];
  loading: boolean;
  error: string | null;
}

const initialState: ChefDistrictPostsState = {
  posts: [],
  loading: false,
  error: null,
};

export const fetchChefDistrictPosts = createAsyncThunk(
  'chefDistrictPosts/fetch',
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get('/chefs/user-posts');
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

const chefDistrictPostsSlice = createSlice({
  name: 'chefDistrictPosts',
  initialState,
  reducers: {},
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
      });
  },
});

export default chefDistrictPostsSlice.reducer;
