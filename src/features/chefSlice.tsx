
import axiosInstance from '@/api/axiosInstance';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// interface SocialLinks {
//   instagram?: string;
//   youtube?: string;
//   facebook?: string;
//   linkedin?: string;
// }

interface ChefProfile {
  userId:string;
  bio: string;
  specialize: string[];
  qualifications: string[];
  experience: string;
  district:string;
  //socialLinks?: SocialLinks;
  isProfileCompleted?: boolean;
}

interface ChefState {
  chef: ChefProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: ChefState = {
  chef: null,
  loading: false,
  error: null,
};


export const fetchLoggedInChef = createAsyncThunk<
  ChefProfile,
  void,
  { rejectValue: string }
>('chef/fetchLoggedInChef', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get('/chefs/chefData', {
      withCredentials: true,
    });
   // console.log('chef data', response);
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || 'Failed to fetch chef'
    );
  }
});


export const updateChefProfile = createAsyncThunk<
  ChefProfile,
  ChefProfile,
  { rejectValue: string }
>('chef/updateProfile', async (profileData, thunkAPI) => {
  try {
    const response = await axiosInstance.put('/chefs/update-profile', profileData, {
      withCredentials: true,
    });
    return response.data.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || 'Failed to update profile'
    );
  }
});

const chefSlice = createSlice({
  name: 'chef',
  initialState,
  reducers: {
    clearChef(state) {
      state.chef = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLoggedInChef.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLoggedInChef.fulfilled, (state, action) => {
        state.loading = false;
        state.chef = action.payload;
        // console.log('Fetched chef:', action.payload);
      })
      .addCase(fetchLoggedInChef.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(updateChefProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateChefProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.chef = action.payload; 
      })
      .addCase(updateChefProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearChef } = chefSlice.actions;
export default chefSlice.reducer;
