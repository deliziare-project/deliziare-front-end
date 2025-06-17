import axiosInstance from '@/api/axiosInstance';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';


interface Transaction {
  type: 'credit' | 'debit';
  amount: number;
  reason: string;
  date?: string;
  description:string;
}


interface Wallet {  
    balance:number,
    transactions:Transaction[],
}

interface Earning{ 
    balance:number,
    transactions:Transaction[],
}


interface WalletState {
  loading: boolean;
  wallet: Wallet | null;
  earning:Earning|null;
  error: string | null;
}



const initialState: WalletState = {
  loading: false,
  wallet: null,
  earning:null,
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

export const fetchEarning=createAsyncThunk<Earning>(
  '/earning/fetchEarning',
  async(_,{rejectWithValue})=>{
    try {
      const res=await axiosInstance.get('/wallet/getEarning',{})
      console.log(res.data)
      return res.data
    } catch (error:any) {
      return rejectWithValue(error.response?.data?.message||'failed to fetch earning of delivery partner')
    }
  }
)

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
})
.addCase(fetchEarning.fulfilled, (state, action: PayloadAction<Earning>) => {
  state.loading = false;
  state.earning=action.payload
 
})

  },
});

export const { clearWallet } = walletSlice.actions;
export default walletSlice.reducer;
