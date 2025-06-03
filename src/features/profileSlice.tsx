import axiosInstance from '@/api/axiosInstance';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface Chef {
  _id: string;
  userId: string;
  bio?: string;
  experience?: number;
  district:string;
  specialize: string[];
  qualifications: string[];
}

interface ChefUser {
  _id: string;
  name: string;
  email: string;
  phone:number;
  profileImage:string;
}

interface PostImage {
  url: string;
  altText?: string;
}

export interface ChefPost {
  _id: string;
  chefId: string;
  title: string;
  description?: string;
  images: PostImage[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface ChefProfile {
  user: ChefUser;
  chef: Chef;
}

interface ViewChefState {
 chefProfile: ChefProfile | null;
 post:ChefPost[];
  loading: boolean;
  error: string | null;
}

const initialState: ViewChefState = {
  chefProfile: null,
  post:[],
  loading: false,
  error: null,
};

export const fetchChefProfileById = createAsyncThunk<
  ChefProfile,
  string,
  { rejectValue: string }
>('viewChef/fetchById', async (chefId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/profile/${chefId}`);
    console.log(response.data)
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'Failed to fetch chef profile'
    );
  }
});


export const fetchChefPostByChefId = createAsyncThunk<
  ChefPost[],
  string,
  { rejectValue: string }
>('chefPost/fetchByChefId', async (chefId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/profile/post/${chefId}`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'Failed to fetch chef post'
    );
  }
});

const viewChefSlice = createSlice({
  name: 'viewChef',
  initialState,
  reducers: {
    clearChefProfile: (state) => {
      state.chefProfile = null;
      state.error = null;
      state.loading = false;
    },
      clearChefPost: (state) => {
      state.post = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChefProfileById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChefProfileById.fulfilled, (state, action: PayloadAction<ChefProfile>) => {
        state.loading = false;
        state.chefProfile = action.payload;
      })
      .addCase(fetchChefProfileById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      })
          .addCase(fetchChefPostByChefId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChefPostByChefId.fulfilled, (state, action: PayloadAction<ChefPost[]>) => {
        state.loading = false;
        state.post = action.payload;
      })
      .addCase(fetchChefPostByChefId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      });
  },
});

export const { clearChefProfile ,clearChefPost} = viewChefSlice.actions;

export default viewChefSlice.reducer;
