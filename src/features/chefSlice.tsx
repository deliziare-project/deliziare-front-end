// features/chef/chefSlice.ts
import axiosInstance from '@/api/axiosInstance';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface ChefState {
  chef:  null;
  loading: boolean;
  error: string | null;
}

const initialState: ChefState = {
  chef: null,
  loading: false,
  error: null,
};


export const fetchLoggedInChef = createAsyncThunk(
  'chef/fetchLoggedInChef',
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get('/chefs/chefData',{withCredentials:true});
      return response.data;
     
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch chef'
      );
    }
  }
);

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
        console.log(state.chef)
      })
      .addCase(fetchLoggedInChef.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearChef } = chefSlice.actions;
export default chefSlice.reducer;
