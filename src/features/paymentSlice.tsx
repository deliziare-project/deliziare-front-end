import axiosInstance from '@/api/axiosInstance';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface Payment {
  _id: string;
  user: string;
  bid: {
    bidId: string;
    amount: number;
  };
  gst: number;
  deliveryCharge: number;
  paymentMethod: string;
  total: number;
  razorpayOrderId: string;
  status: string;
  razorpayPaymentStatus: string;
  razorpayPaymentId?: string;
  createdAt: string;
  updatedAt: string;
}

interface Pay {
  _id: string;
  user: string;
  bid: {
    bidId: string;
    amount: number;
  };
  gst: number;
  deliveryCharge: number;
  paymentMethod: string;
  total: number;
  razorpayOrderId: string;
  status: string;
  razorpayPaymentStatus: string;
  razorpayPaymentId?: string;
  createdAt: string;
  updatedAt: string;
}


interface RazorpayOrder {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  attempts: number;
  created_at: number;
}

interface CreatePaymentResponse {
  message: string;
  payment: Payment;
  razorpayOrder: RazorpayOrder;
}

interface VerifyPaymentResponse {
  message: string;
  payment: Payment;
}

interface PaymentState {
  loading: boolean;
  payment: Payment | null;
  payments: Payment[];
  pay:Pay[];
  razorpayOrder: RazorpayOrder | null;
  success: boolean;
  error: string | null;
}


export const createPayment = createAsyncThunk<
  CreatePaymentResponse,
  { bidId: string; paymentMethod: string },
  { rejectValue: string }
>('payment/create', async ({ bidId, paymentMethod }, thunkAPI) => {
  try {
    const response = await axiosInstance.post<CreatePaymentResponse>('/payment/create', {
      bidId,
      paymentMethod,
    });
    return response.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || 'Failed to create payment'
    );
  }
});

export const verifyPayment = createAsyncThunk<
  VerifyPaymentResponse,
  {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  },
  { rejectValue: string }
>(
  'payment/verify',
  async (
    { razorpay_order_id, razorpay_payment_id, razorpay_signature },
    thunkAPI
  ) => {
    try {
      const response = await axiosInstance.post<VerifyPaymentResponse>('/payment/verify', {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 'Failed to verify payment'
      );
    }
  }
);


export const fetchAllPayments = createAsyncThunk<
  Payment[], 
  void,
  { rejectValue: string }
>('admin/payment/fetchAll', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get<Payment[]>('/payment/getpayment');
    return response.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || 'Failed to fetch payments'
    );
  }
});


export const getAllPay = createAsyncThunk<
  Pay[], 
  void,
  { rejectValue: string }
>('user/payment/getAll', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get<Pay[]>('/payment/fetchPayment');
    return response.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || 'Failed to fetch payments'
    );
  }
});

const initialState: PaymentState = {
  loading: false,
  payment: null,
  razorpayOrder: null,
   payments: [],
   pay:[],
  success: false,
  error: null,
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
   
      .addCase(createPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createPayment.fulfilled, (state, action: PayloadAction<CreatePaymentResponse>) => {
        state.loading = false;
        state.payment = action.payload.payment;
        state.razorpayOrder = action.payload.razorpayOrder;
        state.success = false;
        state.error = null;
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create payment';
        state.success = false;
      })

      
      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(verifyPayment.fulfilled, (state, action: PayloadAction<VerifyPaymentResponse>) => {
        state.loading = false;
        state.payment = action.payload.payment;
        state.success = true;
        state.error = null;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to verify payment';
        state.success = false;
      })
      .addCase(fetchAllPayments.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(fetchAllPayments.fulfilled, (state, action: PayloadAction<Payment[]>) => {
  state.loading = false;
  state.payments = action.payload;
})
.addCase(fetchAllPayments.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload || 'Failed to fetch payments';
})
.addCase(getAllPay.fulfilled, (state, action: PayloadAction<Pay[]>) => {
  state.loading = false;
  state.pay = action.payload;
})

  },
});

export default paymentSlice.reducer;
