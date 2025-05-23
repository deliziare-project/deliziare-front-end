
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';
interface ProfileImageState {
  uploading: boolean;
  imageUrl: string | null;
  error: string | null;
}

const initialState: ProfileImageState = {
  uploading: false,
  imageUrl: null,
  error: null,
};


export const uploadProfileImage = createAsyncThunk<
  string,
  File, 
  { rejectValue: string }
>('profileImage/uploadProfileImage', async (file, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append('profileImage', file); 

    const response = await axiosInstance.post('/userclient/upload-profile-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.imageUrl;
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.error || 'Upload failed');
  }
});

const profileImageSlice = createSlice({
  name: 'profileImage',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadProfileImage.pending, (state) => {
        state.uploading = true;
        state.imageUrl = null;
        state.error = null;
      })
      .addCase(uploadProfileImage.fulfilled, (state, action) => {
        state.uploading = false;
        state.imageUrl = action.payload;
      })
      .addCase(uploadProfileImage.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload || 'Upload failed';
      });
  },
});

export default profileImageSlice.reducer;
