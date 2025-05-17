
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';

export interface Host {
  _id: string;
  name: string;
  email: string;
  phone: number;
  role: string;
  isBlock: boolean;
}

interface HostState {
  hosts: Host[];
  loading: boolean;
  error: string | null;
}

const initialState: HostState = {
  hosts: [],
  loading: false,
  error: null,
};

export const fetchHosts = createAsyncThunk("hosts/fetchHosts", async () => {
  const response = await axiosInstance.get("/admin/users");
  return response.data;
});

export const toggleBlockStatus = createAsyncThunk(
  "hosts/toggleBlockStatus",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/admin/users/${userId}/block`);
      return response.data; 
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to toggle status");
    }
  }
);

const hostSlice = createSlice({
  name: "hosts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHosts.fulfilled, (state, action: PayloadAction<Host[]>) => {
        state.loading = false;
        state.hosts = action.payload;
        console.log(state.hosts);
        
      })
      .addCase(fetchHosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
     .addCase(toggleBlockStatus.fulfilled, (state, action) => {
        const updatedUser = action.payload.user;
        const index = state.hosts.findIndex(user => user._id === updatedUser._id);
        if (index !== -1) {
            state.hosts[index] = updatedUser;
        }
        });

  }
});

export default hostSlice.reducer;
