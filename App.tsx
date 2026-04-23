import React from 'react';
import { ToastProvider } from './context/ToastContext';
import { AppCore } from './AppCore';

export default function App() {
  return (
    <ToastProvider>
      <AppCore />
    </ToastProvider>
  );
}
