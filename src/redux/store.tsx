
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import chefReducer from '../features/chefSlice'
import hostReducer from '../features/userManagementSlice'
import userPostReducer from '../features/userPostSlice'
import chefPostReducer from '../features/chefPostSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    hosts:hostReducer,
    chef: chefReducer,
    userPosts:userPostReducer,
    chefPost:chefPostReducer,
    
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;