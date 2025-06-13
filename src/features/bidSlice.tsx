import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';

export interface Bid {
  _id: string;
  postId: {
    _id:string;
    eventName: string;
    date: string;
    time: string;
    district: string;
    menu: string[];
    quantity: number;
    description: string;
    deliveryStatus:boolean;
  };
  deliveryBoyId:{
    _id:string;
    name:string;
  }
  chefId: string;
  bidAmount: number;
  description: string;
  status: 'pending' | 'accepted' | 'rejected'|'completed';
  createdAt: string;
}

export interface AllBid{
   _id: string;
  postId: {
    _id:string;
    eventName: string;
    date: string;
    time: string;
    district: string;
    menu: string[];
    quantity: number;
    description: string;
    deliveryStatus:'pending'|'accepted'|'delivered'
  };
  chefId: string;
  bidAmount: number;
  description: string;
  status: 'pending' | 'accepted' | 'rejected'|'completed';
  createdAt: string;
}

interface BidState {
  bids: Bid[];
  allbids:AllBid[];
  loading: boolean;
  error: string | null;
}

const initialState: BidState = {
  bids: [],
  allbids:[],
  loading: false,
  error: null,
};


export const createBid = createAsyncThunk(
  'chefBids/createBid',
  async (data: { postId: string; bidAmount: number, description: string }, thunkAPI) => {
    try {
      console.log('Sending bid:', data);
      const res = await axiosInstance.post('/bids/createBid', data);
      console.log('Response:', res.data);
      return res.data;
    } catch (err: any) {
      console.error('Full error response:', {
        status: err.response?.status,
        data: err.response?.data,
        headers: err.response?.headers
      });
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 
        err.message || 
        'Failed to place bid'
      );
    }
  }
);


export const getChefBids = createAsyncThunk(
  'chefBids/getBidsByPost',
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/bids/getBid`);
      // console.log('bid data',res.data)
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


export const getAllBids = createAsyncThunk(
  'bids/getAllbids',
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/bids/gettingBid`);
      console.log('all bid data',res.data)
      return res.data.nearbyPosts;
      
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch bids');
    }
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
    })
      .addCase(getAllBids.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllBids.fulfilled, (state, action) => {
        state.loading = false;
        state.allbids = action.payload;
      })
      .addCase(getAllBids.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
  },
});

export default chefBidSlice.reducer;
