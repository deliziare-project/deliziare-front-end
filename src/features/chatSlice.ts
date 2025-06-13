// chatSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChefPost } from './profileSlice';

interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
   isRead: boolean;
}
interface Size{ 
  width: number,
  height: number
  }
interface ChatState {
  messages: Message[];
  onlineUsers: string[];
  currentConversation: string | null;
  loading: boolean;
  error: string | null;
  isChatOpen: boolean;
  unreadCount: number;
  currentChatId: string | null;
  isMinimized: boolean;
  position: { x: number; y: number };
  size: Size;
  replayMessage:ChefPost|null
}

const initialState: ChatState = {
  messages: [],
  onlineUsers: [],
  currentConversation: null,
  loading: false,
  error: null,
  isChatOpen: false,
  unreadCount: 0,
  currentChatId: null,
  isMinimized: false,
  position: { x: 20, y: 20 },
  size:{ width: 400, height: 500 },
  replayMessage:null
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setMessages(state, action: PayloadAction<Message[]>) {
    state.messages = action.payload;  
    },
    addMessage(state, action: PayloadAction<Message>) {
      state.messages.push(action.payload);
    },
    setOnlineUsers(state, action: PayloadAction<string[]>) {
      state.onlineUsers = action.payload;
    },
    setCurrentConversation(state, action: PayloadAction<string>) {
      state.currentConversation = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string>) {
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

  },
});

export const {
  setMessages,
  addMessage,
  setOnlineUsers,
  setCurrentConversation,
  setLoading,
  setError,
  setUnreadCount,
  incrementUnreadCount,
  markMessagesAsRead,
  clearError,
  openChat, closeChat, toggleMinimize, updatePosition,updateSize ,replayChat
} = chatSlice.actions;

export default chatSlice.reducer;