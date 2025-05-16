import axiosInstance from '@/api/axiosInstance';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


interface RegisterState {
  loading: boolean;
  error: string | null;
  success: boolean;
  emailExists: boolean | null;
  emailCheckLoading:boolean;
  emailCheckError: string | null;
}

const initialState: RegisterState = {
  loading: false,
  error: null,
  success: false,
  emailExists: false,
  emailCheckLoading: false,
  emailCheckError: null,

};

export const checkEmailExists = createAsyncThunk(
  "auth/checkEmailExists",
  async (email: string, thunkAPI) => {
    try {
      const response = await axiosInstance.post(`/users/check-email`,{email});
      return response.data.exists; // true or false
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to check email");
    }
  }
);



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
  if (err.response && err.response.data && err.response.data.error) {
    return thunkAPI.rejectWithValue(err.response.data.error);
  }
  return thunkAPI.rejectWithValue(err.message || 'Something went wrong');
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
  }
  
  interface VerifiedUser {
    _id: string;
    email: string;
    name: string;
    // etc.
  }
  
  export const verifyOtp = createAsyncThunk<VerifiedUser, OtpPayload, { rejectValue: { message: string } }>(
    'auth/verifyOtp',
    async ({ email, otp }, { rejectWithValue }) => {
      try {
        const res = await axiosInstance.post('/users/verify-otp', { email, otp });
        return res.data.user;
      } catch (err: any) {
        return rejectWithValue({
          message: err?.response?.data?.message || err.message || 'OTP verification failed',
        });
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
    },
    clearSuccess: (state) => {
      state.success = false;
    },

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
      .addCase(checkEmailExists.pending, (state) => {
  state.emailCheckLoading = true;
  state.emailCheckError = null;
})
.addCase(checkEmailExists.fulfilled, (state, action) => {
  state.emailCheckLoading = false;
  state.emailExists = action.payload;
})
.addCase(checkEmailExists.rejected, (state, action) => {
  state.emailCheckLoading = false;
  state.emailCheckError = action.payload as string;
})


      
  },
});

export const { resetRegisterState,clearSuccess  } = registerSlice.actions;
export default registerSlice.reducer;
