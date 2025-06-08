'use client';

import { Provider } from 'react-redux';
import { store } from '../redux/store';
import AuthInitializer from '@/lib/authInitializer';
import FloatingChat from '@/components/chat/FloatingChat';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInitializer /> 
      <FloatingChat />
     
      {children}
    </Provider>
  );
}
