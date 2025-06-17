// chatSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChefPost } from './profileSlice';
import {Message} from '@/types/message';


interface Size{ 
  width: number,
  height: number
  }
 export interface User {
  _id: string;
  name: string;
  profileImage: string;
  unreadCount: number;
}
interface ChatState {
  messages: Message[];
  onlineUsers: string[];
  chatUsers: User[];
  currentConversation: string | null;
  loading: boolean;
  error: string | null;
  isChatOpen: boolean;
  unreadCount: number;
  currentChatId: string | null;
  isMinimized: boolean;
  position: { x: number; y: number };
  size: Size;
  requstBidpopUp:boolean;
  replayMessage:ChefPost|null
}

const initialState: ChatState = {
  messages: [],
  onlineUsers: [],
  chatUsers: [],
  currentConversation: null,
  loading: false,
  error: null,
  isChatOpen: false,
  unreadCount: 0,
  currentChatId: null,
  isMinimized: false,
  position: { x: 20, y: 20 },
  size:{ width: 400, height: 500 },
  replayMessage:null,
  requstBidpopUp:false
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setMessages(state, action: PayloadAction<Message[]>) {
    state.messages = action.payload;  
    },
    updateRequstBid(state, action: PayloadAction<boolean>) {
    state.requstBidpopUp = action.payload;  
    },
    addMessage(state, action: PayloadAction<Message>) {
      state.messages.push(action.payload);
      const message = action.payload;
      const otherUserId = message.senderId === state.currentChatId ? message.receiverId : message.senderId;
      const userIndex = state.chatUsers.findIndex((u) => u._id === otherUserId);
      if (userIndex >= 0) {
      
        if (!message.isRead && message.receiverId === state.currentChatId) {
          state.chatUsers[userIndex].unreadCount += 1;
        }
        
        const user = state.chatUsers.splice(userIndex, 1)[0];
        state.chatUsers.unshift(user);
      }
      state.unreadCount = state.chatUsers.reduce((sum, user) => sum + user.unreadCount, 0);
    },
    setOnlineUsers(state, action: PayloadAction<string[]>) {
      state.onlineUsers = action.payload;
    },
    
    setChatUsers(state, action: PayloadAction<User[]>) {
      state.chatUsers = action.payload;
      state.unreadCount = action.payload.reduce((sum, user) => sum + user.unreadCount, 0);
    },
    updateChatUser(state, action: PayloadAction<{ userId: string; updates: Partial<User> }>) {
      const userIndex = state.chatUsers.findIndex((u) => u._id === action.payload.userId);
      if (userIndex >= 0) {
        state.chatUsers[userIndex] = { ...state.chatUsers[userIndex], ...action.payload.updates };
        state.unreadCount = state.chatUsers.reduce((sum, user) => sum + user.unreadCount, 0);
      }
    },
    setCurrentConversation(state, action: PayloadAction<string>) {
      state.currentConversation = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string|null>) {
      state.error = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
     openChat: (state, action: PayloadAction<string>) => {
      state.isChatOpen = true
      state.currentChatId = action.payload
      state.isMinimized = false
    },
      updateMessage: (state, action: PayloadAction<Message>) => {
  const index = state.messages.findIndex((msg) => msg._id === action.payload._id);
      if (index !== -1) {
        state.messages[index] = action.payload;
      }
  },
    replayChat:(state, action: PayloadAction<ChefPost|null>)=>{   
      state.replayMessage = action.payload
      
    },
    closeChat: (state) => {
      state.isChatOpen = false
      state.currentChatId = null
    },
    toggleMinimize: (state) => {
      state.isMinimized = !state.isMinimized
    },
    updatePosition: (state, action: PayloadAction<{ x: number; y: number }>) => {
      state.position = action.payload
    },
    updateSize: (state, action: PayloadAction<Size>) => {
      state.size = action.payload
    },
    setUnreadCount(state, action: PayloadAction<number>) {
      state.unreadCount = action.payload;
    },
    incrementUnreadCount(state) {
      state.unreadCount += 1;
    },
    markMessagesAsRead(state, action: PayloadAction<string>) {
      
      state.messages = state.messages.map((msg) =>
        msg.senderId === action.payload ? { ...msg, isRead: true } : msg
      );
    },
    updateUnreadCounts(state, action: PayloadAction<Record<string, number>>) {
      state.chatUsers = state.chatUsers.map(user => ({
        ...user,
        unreadCount: action.payload[user._id] || 0
      }));
      state.unreadCount = state.chatUsers.reduce((sum, user) => sum + user.unreadCount, 0);
    },

  },
});

export const {
  setMessages,
  addMessage,
  setOnlineUsers,
  setChatUsers,
  updateChatUser,
  setCurrentConversation,
  setLoading,
  setError,
  setUnreadCount,
  incrementUnreadCount,
  markMessagesAsRead,
  clearError,
  updateUnreadCounts,
  updateRequstBid,
  updateMessage,
  openChat, closeChat, toggleMinimize, updatePosition,updateSize ,replayChat
} = chatSlice.actions;

export default chatSlice.reducer;