import React, { memo } from 'react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'info';
}

interface Props {
  toasts: Toast[];
}

const ICONS = { success: '✅', warning: '⚠️', info: 'ℹ️' };

const ToastContainer = memo(function ToastContainer({ toasts }: Props) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span className="toast-icon">{ICONS[t.type]}</span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
});

export default ToastContainer;
