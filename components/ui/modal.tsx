'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { X } from 'lucide-react';

// Modal Context
const ModalContext = createContext(null);

// Modal Provider Component
export function ModalProvider({ children }) {
  const [modals, setModals] = useState([]);

  const openModal = useCallback((component, options = {}) => {
    const id = Math.random().toString(36).substr(2, 9);
    setModals(prev => [...prev, { id, component, options }]);
    return id;
  }, []);

  const closeModal = useCallback((id) => {
    setModals(prev => prev.filter(modal => modal.id !== id));
  }, []);

  const closeAllModals = useCallback(() => {
    setModals([]);
  }, []);

  return (
    <ModalContext.Provider value={{ openModal, closeModal, closeAllModals }}>
      {children}
      {modals.map(modal => (
        <ModalWrapper
          key={modal.id}
          onClose={() => closeModal(modal.id)}
          options={modal.options}
        >
          {modal.component}
        </ModalWrapper>
      ))}
    </ModalContext.Provider>
  );
}

// Hook to use modal
export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within ModalProvider');
  }
  return context;
}

// Modal Wrapper Component
function ModalWrapper({ children, onClose, options }) {
  const {
    size = 'md',
    closeOnOverlayClick = true,
    showCloseButton = true,
  } = options;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-full mx-4'
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={handleOverlayClick}
    >
      <div className={`relative bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden`}>
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        )}
        <div className="overflow-y-auto max-h-[90vh]">
          {children}
        </div>
      </div>
    </div>
  );
}