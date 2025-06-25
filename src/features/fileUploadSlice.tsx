import axiosInstance from "@/api/axiosInstance";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface ProfileImageState {
  uploading: boolean;
  certificateUrl: string | null;
  error: string | null;

  deliveryUploading: boolean;
  deliveryError: string | null;
  deliveryUrls: {
    IDProof?: string;
    license?: string;
  };
}

const initialState: ProfileImageState = {
  uploading: false,
  certificateUrl: null,
  error: null,

  deliveryUploading: false,
  deliveryError: null,
  deliveryUrls: {},
};

// 🟢 For chef certificate
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
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      return response.data.certificateUrl;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Certificate upload failed"
      );
    }
  }
);

// 🟢 For delivery boy IDProof/license
export const uploadDeliveryCertificate = createAsyncThunk<
  { type: "IDProof" | "license"; url: string },
  { file: File; type: "IDProof" | "license" },
  { rejectValue: string }
>(
  "certificate/uploadDeliveryCertificate",
  async ({ file, type }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("certificate", file);
      formData.append("type", type); // "IDProof" or "license"

      const response = await axiosInstance.post(
        "/certificates/upload-dc",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      return { type, url: response.data[type] };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Delivery file upload failed"
      );
    }
  }
);

const certificateSlice = createSlice({
  name: "certificate",
  initialState,
  reducers: {
    setCertificateUrl: (state, action: PayloadAction<string>) => {
      state.certificateUrl = action.payload;
    },
    resetDeliveryUploads: (state) => {
      state.deliveryUploading = false;
      state.deliveryError = null;
      state.deliveryUrls = {};
    },
  },
  extraReducers: (builder) => {
    // Chef
    builder
      .addCase(uploadCertificate.pending, (state) => {
        state.uploading = true;
        state.error = null;
        state.certificateUrl = null;
      })
      .addCase(uploadCertificate.fulfilled, (state, action) => {
        state.uploading = false;
        state.certificateUrl = action.payload;
      })
      .addCase(uploadCertificate.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload || "Certificate upload failed";
      });

    // Delivery Boy
    builder
      .addCase(uploadDeliveryCertificate.pending, (state) => {
        state.deliveryUploading = true;
        state.deliveryError = null;
      })
      .addCase(uploadDeliveryCertificate.fulfilled, (state, action) => {
        state.deliveryUploading = false;
        const { type, url } = action.payload;
        state.deliveryUrls[type] = url;
      })
      .addCase(uploadDeliveryCertificate.rejected, (state, action) => {
        state.deliveryUploading = false;
        state.deliveryError = action.payload || "Delivery upload failed";
      });
  },
});

export const { setCertificateUrl, resetDeliveryUploads } = certificateSlice.actions;
export default certificateSlice.reducer;
