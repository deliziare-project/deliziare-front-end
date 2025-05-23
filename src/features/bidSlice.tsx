import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';

export interface Bid {
  _id: string;
  postId: string;
  chefId: string;
  bidAmount: number;
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
  async (data: { postId: string; bidAmount: number }, thunkAPI) => {
    try {
      const res = await axiosInstance.post('/bids/createBid', data);
      return res.data;
    } catch (err: any) {
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
      });
  },
});

export default chefBidSlice.reducer;
