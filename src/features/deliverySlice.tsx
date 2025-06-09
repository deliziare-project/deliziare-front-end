import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
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
  };
  chefId: {
    _id:string;
    name:string;
    
  };
  bidAmount: number;
  description: string;
  status: 'pending' | 'accepted' | 'rejected'|'completed';
  createdAt: string;
}

export interface Order{
    _id:string,
    status:'pending'|'picked up'|'delivered',
    bidId:Bid,
}

interface DeliveryState {
  loading: boolean
  success: boolean
  error: string | null
  order:Order[]
  selectedOrder:Order|null
}

const initialState: DeliveryState = {
  loading: false,
  success: false,
  error: null,
  order:[],
  selectedOrder:null,
}


export const acceptDelivery = createAsyncThunk(
  'delivery/acceptDelivery',
  async (bidId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/delivery/orderAccept', { bidId })
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Something went wrong')
    }
  }
)


export const fetchOrderDetails = createAsyncThunk(
  'delivery/fetchDetails',
  async (postId: string, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/delivery/orders/${postId}`);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch post details');
    }
  }
);

export const getOrder = createAsyncThunk(
  'delivery/getOrder',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/delivery/orders')
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Something went wrong')
    }
  }
)

const deliverySlice = createSlice({
  name: 'delivery',
  initialState,
  reducers: {
    resetDeliveryState: (state) => {
      state.loading = false
      state.success = false
      state.error = null
    },
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(acceptDelivery.pending, (state) => {
        state.loading = true
        state.success = false
        state.error = null
      })
      .addCase(acceptDelivery.fulfilled, (state) => {
        state.loading = false
        state.success = true
        state.error = null
      })
      .addCase(acceptDelivery.rejected, (state, action) => {
        state.loading = false
        state.success = false
        state.error = action.payload as string
      })
      .addCase(getOrder.fulfilled,(state,action)=>{
        state.order=action.payload
      })
       .addCase(fetchOrderDetails.pending, (state) => {
              state.loading = true;
              state.error = null;
              state.selectedOrder = null;
            })
            .addCase(fetchOrderDetails.fulfilled, (state, action) => {
              state.loading = false;
              state.selectedOrder = action.payload;
            })
            .addCase(fetchOrderDetails.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload as string;
              state.selectedOrder = null;
            });
  },
})

export const { resetDeliveryState ,clearSelectedOrder} = deliverySlice.actions
export default deliverySlice.reducer
