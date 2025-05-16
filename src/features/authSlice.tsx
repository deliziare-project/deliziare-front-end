import axiosInstance from '@/api/axiosInstance';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


interface RegisterState {
  loading: boolean;
  error: string | null;
  success: boolean;
  registrationData?:any;
}

const initialState: RegisterState = {
  loading: false,
  error: null,
  success: false,
  registrationData: null,
};


export const registerHost = createAsyncThunk(
  'user/registerHost',
  async (hostData: { name: string; email: string; password: string; phone: number }, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/users/register/host', hostData);
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.error || 'Something went wrong');
    }
  }
);

export const registerChef = createAsyncThunk(
  'user/registerChef',
  async (formData: FormData, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/users/register/chef', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.error || 'Something went wrong');
    }
  }
);

export const registerDeliveryBoy = createAsyncThunk(
  'user/registerDeliveryBoy',
  async (formData: FormData, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/users/register/deliveryboy', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.error || 'Something went wrong');
    }
  }
);

interface OtpPayload {
    email: string;
    otp: string;
    name?: string;
    password?: string;
    phone?: string | number;
  }
  
  interface VerifiedUser {
    _id: string;
    email: string;
    name: string;
    // etc.
  }
  
  export const verifyOtp = createAsyncThunk<VerifiedUser, OtpPayload, { rejectValue: { message: string } }>(
    'auth/verifyOtp',
    async (payload, { rejectWithValue }) => {
      try {
        const res = await axiosInstance.post('/users/verify-otp', payload);
        return res.data.user;
      } catch (err: any) {
        return rejectWithValue({
          message: err?.response?.data?.message || err.message || 'OTP verification failed',
        });
      }
    }
  );
  
  export const sendOtpForHost = createAsyncThunk(
    'auth/sendOtpForHost',
    async (
      hostData: { name: string; email: string; password: string; phone: number },
      thunkAPI
    ) => {
      try {
        const response = await axiosInstance.post('/users/send-otp', {
          role: 'host',
          ...hostData,
        });
        return response.data;
      } catch (err: any) {
        return thunkAPI.rejectWithValue(err.response?.data?.error || 'Failed to send OTP');
      }
    }
  );
  
  export const sendOtpForChef = createAsyncThunk(
    'auth/sendOtpForChef',
    async (formData: FormData, thunkAPI) => {
      try {
        const response = await axiosInstance.post('/users/send-otp', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
      } catch (err: any) {
        return thunkAPI.rejectWithValue(err.response?.data?.error || 'Failed to send OTP');
      }
    }
  );
  
  

interface LoginPayload {
    email: string;
    password: string;
  }
  
  interface LoginResponse {
    token: string;
    user: {
      _id: string;
      name: string;
      email: string;
      
    };
  }
  
  export const loginUser = createAsyncThunk<LoginResponse, LoginPayload, { rejectValue: string }>(
    'auth/loginUser',
    async (loginData, thunkAPI) => {
      try {
        const response = await axiosInstance.post('/users/login', loginData);
        return response.data;
      } catch (err: any) {
        return thunkAPI.rejectWithValue(err.response?.data?.error || 'Login failed');
      }
    }
  );
  

const registerSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetRegisterState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.registrationData = null;
    },
    setRegistrationData: (state, action) => {
      state.registrationData = action.payload;
    },
    logout: (state) => {
        state.loading = false;
        state.error = null;
        state.success = false;
        state.registrationData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(registerHost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerHost.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(registerHost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      
      .addCase(registerChef.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerChef.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(registerChef.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      
      .addCase(registerDeliveryBoy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerDeliveryBoy.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(registerDeliveryBoy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as { message: string })?.message;
      })
      .addCase(sendOtpForHost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtpForHost.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(sendOtpForHost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(sendOtpForChef.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtpForChef.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(sendOtpForChef.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.registrationData = action.payload; 
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });
      
  },
});

export const { resetRegisterState ,setRegistrationData,logout} = registerSlice.actions;
export default registerSlice.reducer;
