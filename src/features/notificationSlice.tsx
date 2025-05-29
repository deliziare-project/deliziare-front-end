import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../api/axiosInstance';


export interface NotificationType {
  _id: string;
  recipient: string;
  sender?: string;
  message: string;
  postId?: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}


interface NotificationState {
  notifications: NotificationType[];
  loading: boolean;
  error: string | null;
}


const initialState: NotificationState = {
  notifications: [],
  loading: false,
  error: null,
};


export const fetchNotifications = createAsyncThunk<NotificationType[]>(
  'notifications/fetchNotifications',
  async () => {
    const response = await axiosInstance.get<NotificationType[]>('/notifications');
    return response.data;
  }
);

export const markNotificationAsRead = createAsyncThunk<void>(
  'notifications/markAsRead',
  async () => {
    await axiosInstance.post('/notifications/read');
  }
);


const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<NotificationType>) => {
      state.notifications.unshift({
        ...action.payload,
        isRead: action.payload.isRead ?? false,
      });
    },
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload;
        state.loading = false;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch notifications';
      })
      .addCase(markNotificationAsRead.fulfilled, (state) => {
        state.notifications = state.notifications.map((n) => ({
          ...n,
          isRead: true,
        }));
      });
  },
});

export const { addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
