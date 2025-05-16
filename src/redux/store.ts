
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import hostReducer from '../features/userManagementSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    hosts:hostReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;