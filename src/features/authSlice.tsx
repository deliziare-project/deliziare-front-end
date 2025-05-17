import axiosInstance from '@/api/axiosInstance';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


interface RegisterState {
  loading: boolean;
  error: string | null;
  success: boolean;
  otpVerified:boolean;
  registrationData?:any;
 currentUser: any;
 isAuthenticated: boolean;
}

const initialState: RegisterState = {
  loading: false,
  error: null,
  success: false,
  otpVerified:false,
  registrationData: null,
  currentUser: null,
  isAuthenticated: false,
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
    role?: 'host' | 'chef' | 'deliveryBoy';
    location?: {
      lat: number;
      lng: number;
    };
    experience?: string;
    specialize?: string[];
    certificate?: string; 
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
        console.log('Sending OTP payload:', payload); 
        const res = await axiosInstance.post('/users/verify-otp', payload, {
            headers: { 'Content-Type': 'application/json' },
          });
          
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
        console.log(response.data)
        return response.data;
      } catch (err: any) {
        return thunkAPI.rejectWithValue(err.response?.data?.error || 'Login failed');
      }
    }
  );
  export const checkCurrentUser = createAsyncThunk(
  'auth/checkCurrentUser',
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get('/users/me',{withCredentials:true});
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Not authenticated');
    }
  }
);
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, thunkAPI) => {
    try {
      await axiosInstance.post('/users/logout', {}, { withCredentials: true });
      return true;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Logout failed');
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

     setCurrentUser: (state, action) => {
    state.currentUser = action.payload;
    state.isAuthenticated = !!action.payload;
  },
   logoutUser: (state) => {
    state.currentUser = null;
    state.isAuthenticated = false;
    },



  },
  extraReducers: (builder) => {
    builder
        .addCase(checkCurrentUser.pending, (state) => {
        state.loading = true;
        })
        .addCase(checkCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.isAuthenticated = true;
        })
       .addCase(checkCurrentUser.rejected, (state) => {
        state.loading = false;
        state.currentUser = null;
        state.isAuthenticated = false;
        })
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
        state.otpVerified = true;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as { message: string })?.message;
        state.otpVerified = false;
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
        state.otpVerified = false;
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
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.currentUser = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});


export const { resetRegisterState ,setRegistrationData} = registerSlice.actions;

export default registerSlice.reducer;
