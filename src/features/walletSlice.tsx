import axiosInstance from '@/api/axiosInstance';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';


interface Transaction {
  type: 'credit' | 'debit';
  amount: number;
  reason: string;
  date?: string;
}


interface Wallet {
    
    
    balance:number,
    transactions:Transaction[],

}


interface WalletState {
  loading: boolean;
  wallet: Wallet | null;
  error: string | null;
}



const initialState: WalletState = {
  loading: false,
 wallet: null,
  error: null,
};

export const fetchWallet = createAsyncThunk<Wallet>(
  'wallet/fetchWallet',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/wallet/getWallet', {
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch wallet');
    }
  }
);

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
     clearWallet: (state) => {
      state.wallet = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
   .addCase(fetchWallet.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(fetchWallet.fulfilled, (state, action: PayloadAction<Wallet>) => {
  state.loading = false;
  state.wallet=action.payload
 
})
.addCase(fetchWallet.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload as string;
});

  },
});

export const { clearWallet } = walletSlice.actions;
export default walletSlice.reducer;
