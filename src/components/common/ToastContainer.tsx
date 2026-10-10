import React from 'react';
import { useDocuments } from '../../context/DocumentContext';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useDocuments();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 left-4 md:left-auto md:w-96 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-[#283044] text-[#eef0ff] px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-white/10 animate-fade-in"
        >
          <span className="material-symbols-outlined text-[20px] text-[#c3c0ff]">
            {toast.icon || 'info'}
          </span>
          <span className="text-[13px] font-medium flex-1 truncate">
            {toast.message}
          </span>
          <button
            onClick={() => dismissToast(toast.id)}
            className="text-white/60 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      ))}
    </div>
  );
};
