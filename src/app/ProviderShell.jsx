'use client';
import { store } from '../redux/store';
import { Provider } from 'react-redux';
import { useRef } from 'react';

export default function ProviderShell({ children }) {
  const storeRef = useRef();
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = store();
  }
  return <Provider store={storeRef.current}>{children}</Provider>;
}
