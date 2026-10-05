import React from 'react';

export default function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-gray-800 text-white px-4 py-2 rounded shadow-lg flex items-center justify-between gap-4 min-w-[200px]"
        >
          <span>{toast.message}</span>
          <button onClick={() => removeToast(toast.id)} className="text-xs text-gray-400 hover:text-white">
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}