import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';

export interface Bid {
  _id: string;
  postId: string;
  chefId: string;
  bidAmount: number;
  description:string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

interface BidState {
  bids: Bid[];
  loading: boolean;
  error: string | null;
}

const initialState: BidState = {
  bids: [],
  loading: false,
  error: null,
};


export const createBid = createAsyncThunk(
  'chefBids/createBid',
  async (data: { postId: string; bidAmount: number,description:string }, thunkAPI) => {
    try {
      console.log('Sending bid data:', data);
      const res = await axiosInstance.post('/bids/createBid', data);
      return res.data;
    } catch (err: any) {
      console.error('Bid creation error:', err.response);
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to place bid');
    }
  }
);


export const getChefBids = createAsyncThunk(
  'chefBids/getBidsByPost',
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/bids/getBid`);
      console.log('bid data',res.data)
      return res.data;
      
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch bids');
    }
  }
);

export const updateBidStatus = createAsyncThunk(
  'bids/updateStatus',
  async ({ id, status }: { id: string; status: string }) => {
    const response = await axiosInstance.patch(`/bids/${id}/status`, { status });
    return response.data;
  }
);

export const markBidsAsRead = async (postId: string) => {
  return await axiosInstance.patch('/bids/mark-read', { postId });
};

const chefBidSlice = createSlice({
  name: 'chefBids',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createBid.pending, (state) => {
        state.loading = true;
      })
      .addCase(createBid.fulfilled, (state, action) => {
        state.loading = false;
        state.bids.push(action.payload);
      })
      .addCase(createBid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getChefBids.pending, (state) => {
        state.loading = true;
      })
      .addCase(getChefBids.fulfilled, (state, action) => {
        state.loading = false;
        state.bids = action.payload;
      })
      .addCase(getChefBids.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateBidStatus.fulfilled, (state, action) => {
      const updatedBid = action.payload;
      const index = state.bids.findIndex((bid) => bid._id === updatedBid._id);
      if (index !== -1) {
        state.bids[index] = updatedBid;
      }
    });
  },
});

export default chefBidSlice.reducer;
