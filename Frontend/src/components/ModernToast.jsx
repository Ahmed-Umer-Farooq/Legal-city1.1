import React, { useEffect, useState } from 'react';
import { X, CheckCircle, XCircle } from 'lucide-react';

const ModernToast = ({ message = "Login successful!", type = 'success', onClose, autoDismiss = true, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  const handleClose = () => {
    setIsAnimatingOut(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose && onClose();
    }, 300); // Match fade-out duration
  };

  useEffect(() => {
    if (autoDismiss && duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [autoDismiss, duration]);

  const getIcon = () => {
    return type === 'success' ? (
      <CheckCircle className="w-5 h-5 flex-shrink-0" />
    ) : (
      <XCircle className="w-5 h-5 flex-shrink-0" />
    );
  };

  const getBgColor = () => {
    return type === 'success'
      ? 'bg-emerald-500 border-emerald-600'
      : 'bg-red-500 border-red-600';
  };

  const getHoverColor = () => {
    return type === 'success' ? 'hover:text-emerald-100' : 'hover:text-red-100';
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-500 ease-out ${
        isAnimatingOut
          ? 'opacity-0 translate-x-full'
          : 'opacity-100 translate-x-0'
      }`}
    >
      <div className={`${getBgColor()} text-white px-4 py-3 rounded-lg shadow-lg border flex items-center gap-3 max-w-sm w-full`}>
        {getIcon()}
        <span className="text-sm font-medium flex-1">{message}</span>
        <button
          onClick={handleClose}
          className={`text-white ${getHoverColor()} transition-colors flex-shrink-0`}
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ModernToast;
