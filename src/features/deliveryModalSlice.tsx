import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DeliveryModalState {
  show: boolean;
  postId: string | null;
}

const initialState: DeliveryModalState = {
  show: false,
  postId: null,
};

const deliveryModalSlice = createSlice({
  name: 'deliveryModal',
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<string>) => {
      state.show = true;
      state.postId = action.payload;
    },
    closeModal: (state) => {
      state.show = false;
      state.postId = null;
    },
  },
});

export const { openModal, closeModal } = deliveryModalSlice.actions;
export default deliveryModalSlice.reducer;
