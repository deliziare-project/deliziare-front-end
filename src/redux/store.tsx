
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import chefReducer from '../features/chefSlice'
import hostReducer from '../features/userManagementSlice'
import userPostReducer from '../features/userPostSlice'
import chefPostReducer from '../features/chefPostSlice'
import bidReducer from '../features/bidSlice'
import profileImageReducer from '../features/profileImageSlice'
import fileUploadReducer from '../features/fileUploadSlice'
import adminReducer from '../features/adminSlice'
import paymentReducer from '../features/paymentSlice'
import walletReducer from '../features/walletSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    hosts:hostReducer,
    chef: chefReducer,
    userPosts:userPostReducer,
    chefPost:chefPostReducer,
    chefBids:bidReducer,
    profileImage:profileImageReducer,
    Certificate:fileUploadReducer,
    admin:adminReducer,
    payment:paymentReducer,
    wallet:walletReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;