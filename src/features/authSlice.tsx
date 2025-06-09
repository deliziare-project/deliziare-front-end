import axiosInstance from '@/api/axiosInstance';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '@/redux/store';


interface RegisterState {
  loading: boolean;
  error: string | null;
  success: boolean;
  emailExists: boolean | null;
  emailCheckLoading: boolean;
  emailCheckError: string | null;
  otpVerified: boolean;
  registrationData?: any;
  currentUser: {
    _id: string;
    name: string;
    email: string;
    role: string;
    isGoogleUser: boolean;
    hasPassword: boolean; 
    profileImage?: string;
    isProfileCompleted?:boolean;
  } | null;
  isAuthenticated: boolean;
  tempToken?: string; 
  resetPasswordSuccess: boolean; 
  accessToken?:string;

}

const initialState: RegisterState = {
  loading: false,
  error: null,
  success: false,
  emailExists: false,
  emailCheckLoading: false,
  emailCheckError: null,
  otpVerified: false,
  registrationData: null,
  currentUser: null,
  isAuthenticated: false,
  tempToken: undefined,
  resetPasswordSuccess: false,
  accessToken: undefined,
};

export const checkEmailExists = createAsyncThunk(
  "auth/checkEmailExists",
  async (email: string, thunkAPI) => {
    try {
      const response = await axiosInstance.post(`/users/check-email`,{email});
      return response.data.exists;
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
    vehicleType?:string;
    IDProof:string;
    license:string;
  }
  
  
  interface VerifiedUser {
    _id: string;
    email: string;
    name: string;
   
  }
  
 
export const verifyOtp = createAsyncThunk<VerifiedUser, OtpPayload, { rejectValue: { message: string } }>(
  'auth/verifyOtp',
  async (payload, { rejectWithValue }) => {
    try {
      let res;
      
      if (
        payload.role === 'chef' &&
        payload.certificate &&
        typeof payload.certificate !== 'string'
      ) {
        const formData = new FormData();
        formData.append('email', payload.email);
        formData.append('otp', payload.otp);
        formData.append('name', payload.name || '');
        formData.append('password', payload.password || '');
        formData.append('phone', payload.phone?.toString() || '');
        formData.append('role', 'chef');
        formData.append('experience', payload.experience || '');
        formData.append('specializations', JSON.stringify(payload.specialize|| []));
        if (payload.location) {
          formData.append('locationLat', payload.location.lat.toString());
          formData.append('locationLng', payload.location.lng.toString());
        }
        formData.append('certificate', payload.certificate); 

        res = await axiosInstance.post('/users/verify-otp', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } 
      else if(payload.role === 'deliveryBoy') {
        const formData = new FormData();
        formData.append('email', payload.email);
        formData.append('otp', payload.otp);
        formData.append('name', payload.name || '');
        formData.append('password', payload.password || '');
        formData.append('phone', payload.phone?.toString() || '');
        formData.append('role', 'deliveryBoy');
        formData.append('IDProof', payload.IDProof); 
        formData.append('license', payload.license);

        res = await axiosInstance.post('/users/verify-otp', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      else {
       
        res = await axiosInstance.post('/users/verify-otp', payload, {
          headers: { 'Content-Type': 'application/json' },
        });
      }
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
  

  export const sendOtpForDeliveryBoy = createAsyncThunk(
    'auth/sendOtpForDeliveryBoy',
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
        const message =
          err.response?.status === 401
            ? err.response?.data?.message || 'Invalid email or password'
            : err.response?.data?.message || 'Login failed';
        return thunkAPI.rejectWithValue(message);
      }
    }
  );
  
  
//   export const checkCurrentUser = createAsyncThunk(
//   'auth/checkCurrentUser',
//   async (_, thunkAPI) => {
//     try {
//       const response = await axiosInstance.get('/users/me',{withCredentials:true});
//       return response.data;
//     } catch (err: any) {
//       return thunkAPI.rejectWithValue(err.response?.data?.message || 'Not authenticated');
//     }
//   }
// );

export const checkCurrentUser = createAsyncThunk(
  'auth/checkCurrentUser',
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get('/users/me');
      return response.data;
    } catch (error) {
      // Don't throw unless absolutely sure token refresh failed
      return thunkAPI.rejectWithValue('Session invalid');
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
interface UserProfileUpdate {
  _id: string;
  name: string;
  email: string;
  password: string;
  phone: number;
  role: string;
  isBlock: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;

}

interface UpdateProfileArgs {
  name: string;
  phone: number;
}

export const updateUserProfile = createAsyncThunk<UserProfileUpdate, UpdateProfileArgs>(
  'user/updateProfile',
  async ({ name, phone }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put('/userclient/update-profile', { name, phone });
      return res.data.user;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update profile');
    }
  }
);



export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email: string, thunkAPI) => {
    try {
      const res = await axiosInstance.post('/users/forgot-password', { email });
      return res.data.message;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 'Failed to send password reset email'
      );
    }
  }
);


export const verifyPasswordOtp = createAsyncThunk(
  'auth/verifyPasswordOtp',
  async (
    { email, otp }: { email: string; otp: string },
    thunkAPI
  ) => {
    try {
      const res = await axiosInstance.post('/users/verify-password-otp', { email, otp });
      return res.data.tempToken as string;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 'OTP verification failed'
      );
    }
  }
);


export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (
    { newPassword }: { newPassword: string },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const tempToken = state.auth.tempToken;

      if (!tempToken) throw new Error('No temporary token found');

      const res = await axiosInstance.post(
        '/users/reset-password',
        { newPassword },
        {
          headers: {
            Authorization: `Bearer ${tempToken}`,
          },
        }
      );
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Password reset failed'
      );
    }
  }
);

export const resendOtp = createAsyncThunk(
  'auth/resendOtp',
  async (email: string, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/users/resend-otp', { email });
      return response.data;
    } catch (err: any) {
      console.error('Resend OTP error:', err.response?.data);
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to resend OTP');
    }
    
  }
);

function getErrorMessage(payload: unknown, defaultMsg = 'Not authenticated'): string {
  if (typeof payload === 'string') return payload;
  if (payload && typeof payload === 'object' && 'message' in payload) {
    return (payload as { message: string }).message;
  }
  return defaultMsg;
}

const registerSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetRegisterState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.registrationData = null;
      state.resetPasswordSuccess = false;
    },
    setRegistrationData: (state, action) => {
      state.registrationData = action.payload;
    },

    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      
      state.success = false;
    },
    clearTempToken: (state) => {
      state.tempToken = undefined;
    },
  setUser(state, action) {
    state.currentUser = action.payload;
    state.isAuthenticated = true;
  },
  clearUser(state) {
    state.currentUser = null;
    state.isAuthenticated = false;
  },
  

 },

  extraReducers: (builder) => {
    builder
       
    .addCase(checkCurrentUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(checkCurrentUser.fulfilled, (state, action) => {
      state.loading = false;
      state.currentUser = {
        ...action.payload,
        hasPassword: action.payload.hasPassword
      };
      state.isAuthenticated = true;
      state.error = null;
    })
    .addCase(checkCurrentUser.rejected, (state, action) => {
      state.loading = false;
      state.currentUser = null;
      state.isAuthenticated = false;
      state.error = getErrorMessage(action.payload, 'Not authenticated');
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
      .addCase(sendOtpForDeliveryBoy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtpForDeliveryBoy.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(sendOtpForDeliveryBoy.rejected, (state, action) => {
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
        state.currentUser = {
          _id: action.payload.user._id,
          name: action.payload.user.name,
          email: action.payload.user.email,
          hasPassword: false,          
          role: 'host',               
          isGoogleUser: false,         
          
        };
        
        state.isAuthenticated = true;
        state.registrationData = action.payload; 
        state.accessToken = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
        state.accessToken = undefined;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.currentUser = null;
        state.isAuthenticated = false;
        state.error = null;
        state.success = false;
        state.registrationData = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Verify Password OTP
      .addCase(verifyPasswordOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPasswordOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.tempToken = action.payload;
      })
      .addCase(verifyPasswordOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.resetPasswordSuccess = false;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.resetPasswordSuccess = true;
        state.tempToken = undefined;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(resendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendOtp.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});


export const { 
  resetRegisterState,
  setRegistrationData,
  setCurrentUser,
  logout,
  clearTempToken,
  setUser,
  clearUser
} = registerSlice.actions;



export default registerSlice.reducer;
