import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from '@/api/axiosInstance'

interface DeliveryBoy {
  IDProof: string
  license: string
  vehicleType: string
  userId: {
    _id: string
    name: string
    email: string
    profileImage: string
    phone: number
  }
}

interface UserId {
  name: string
  phone: number
}

export interface Bid {
  _id: string
  postId: {
    _id: string
    userId: UserId
    eventName: string
    date: string
    time: string
    district: string
    menu: string[]
    location?: {
      lat: number
      lng: number
    }
    quantity: number
    description: string
  }
  chefId: {
    _id: string
    name: string
  }
  bidAmount: number
  description: string
  status: 'pending' | 'accepted' | 'rejected' | 'completed'
  createdAt: string
}

export interface Order {
  _id: string
  status: 'pending' | 'picked up' | 'delivered'
  bidId: Bid
  chefLocation?: {
    lat: number
    lng: number
  }
}

interface DeliveryState {
  loading: boolean
  success: boolean
  error: string | null
  order: Order[]
  selectedOrder: Order | null
  deliveryBoy: DeliveryBoy | null
  updateSuccess: boolean
  updateMessage: string | null
}

const initialState: DeliveryState = {
  loading: false,
  success: false,
  error: null,
  order: [],
  selectedOrder: null,
  deliveryBoy: null,
  updateSuccess: false,
  updateMessage: null,
}


export const getDeliveryBoy = createAsyncThunk(
  'delivery/getDeliveryBoy',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/delivery/getData')
      return res.data
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Something went wrong')
    }
  }
)


export const updateDeliveryBoy = createAsyncThunk(
  'delivery/updateDeliveryBoy',
  async (formData: any, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/delivery/updateProfile', formData)
      return res.data
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Something went wrong')
    }
  }
)

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
      const response = await axiosInstance.get(`/delivery/orders/${postId}`)
      return response.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch post details')
    }
  }
)

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
      state.updateSuccess = false
      state.updateMessage = null
    },
    clearSelectedOrder: (state) => {
      state.selectedOrder = null
      state.error = null
    },
    markAsDelivered: (state, action) => {
      const orderId = action.payload
      const order = state.order.find((o) => o._id === orderId)
      if (order) {
        order.status = 'delivered'
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Accept delivery
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

      // Orders
      .addCase(getOrder.fulfilled, (state, action) => {
        state.order = action.payload
      })

      // Fetch order details
      .addCase(fetchOrderDetails.pending, (state) => {
        state.loading = true
        state.error = null
        state.selectedOrder = null
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.loading = false
        state.selectedOrder = action.payload
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.selectedOrder = null
      })

      // Get delivery boy
      .addCase(getDeliveryBoy.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getDeliveryBoy.fulfilled, (state, action) => {
        state.loading = false
        state.deliveryBoy = action.payload
      })
      .addCase(getDeliveryBoy.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

     
      .addCase(updateDeliveryBoy.pending, (state) => {
        state.loading = true
        state.updateSuccess = false
        state.updateMessage = null
        state.error = null
      })
      .addCase(updateDeliveryBoy.fulfilled, (state, action) => {
        state.loading = false
        state.updateSuccess = true
        state.updateMessage = action.payload?.message || 'Profile updated'
        state.deliveryBoy = action.payload?.data || state.deliveryBoy
      })
      .addCase(updateDeliveryBoy.rejected, (state, action) => {
        state.loading = false
        state.updateSuccess = false
        state.error = action.payload as string
      })
  },
})

export const { resetDeliveryState, clearSelectedOrder, markAsDelivered } = deliverySlice.actions
export default deliverySlice.reducer
