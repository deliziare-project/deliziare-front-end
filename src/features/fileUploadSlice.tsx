import axiosInstance from "@/api/axiosInstance";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface ProfileImageState {
  loading: boolean;
  certificateUrl: string | null;
  error: string | null;
}

const initialState: ProfileImageState = {
  loading: false,
  certificateUrl: null,
  error: null,
};


export const uploadCertificate = createAsyncThunk<

  string,
  File, 
  { rejectValue: string }
>(
  "certificate/uploadCertificate",
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("certificate", file);

      const response = await axiosInstance.post(
        "/certificates/upload-certificate",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true, 
        }
      );

      return response.data.certificateUrl;
    } catch (error:any) {
      return rejectWithValue(
        error.response?.data?.error || "Certificate upload failed"
      );
    }
  }
);

const certificateSlice = createSlice({
  name: "certificate",
  initialState,
  reducers: {
  
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadCertificate.pending, (state) => {
        state.loading = true;
        state.certificateUrl=null;
        state.error = null;
       
      })
      .addCase(uploadCertificate.fulfilled, (state, action) => {
        state.loading = false;
        state.certificateUrl=action.payload;
    
      })
      .addCase(uploadCertificate.rejected, (state, action) => {
        state.loading = false;
        state.error=action.payload || "upload failed";
        
      });
  },
});


export const setCertificateUrl = (url: string) => ({
  type: 'certificate/setCertificateUrl',
  payload: url,
});


export default certificateSlice.reducer;
