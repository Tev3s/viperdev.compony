import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { IconX } from '../components/Icons';

interface Toast {
  id: number;
  msg: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'process';
}

interface ToastContextType {
  addToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info' | 'process') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((msg: string, type: Toast['type'] = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => {
      if (prev.some(t => t.msg === msg)) return prev;
      return [...prev, { id, msg, type }];
    });
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const removeToast = (id: number) => setToasts(prev => prev.filter(t => t.id !== id));

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-[11000] flex flex-col gap-2 items-center pointer-events-none w-[90%] sm:w-auto">
        {toasts.map(t => {
          let colors = '', icon = '';
          if (t.type === 'success') { colors = 'bg-emerald-500/95 border-emerald-400 text-white'; icon = '🟢'; }
          else if (t.type === 'error') { colors = 'bg-red-500/95 border-red-400 text-white'; icon = '🔴'; }
          else if (t.type === 'warning') { colors = 'bg-blue-500/95 border-blue-400 text-white'; icon = '🟠'; }
          else if (t.type === 'info' || t.type === 'process') { colors = 'bg-primary/95 border-primary text-white'; icon = '🔵'; }

          return (
            <div key={t.id} className={`pointer-events-auto flex items-center gap-3 px-5 py-3 rounded-full shadow-2xl backdrop-blur-xl border ${colors} animate-slide-down transition-all`}>
              <span className={`text-sm shrink-0 drop-shadow-md ${t.type === 'process' ? 'animate-spin' : ''}`}>
                {t.type === 'process' ? '⏳' : icon}
              </span>
              <span className="text-xs sm:text-sm font-bold drop-shadow-md truncate max-w-[250px]">{t.msg}</span>
              <button onClick={() => removeToast(t.id)} className="ml-2 opacity-70 hover:opacity-100 transition shrink-0">
                <IconX className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};
