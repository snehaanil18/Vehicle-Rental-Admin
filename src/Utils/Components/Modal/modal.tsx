import React, { useEffect } from 'react';
import styles from './modal.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  modalStyle?: string; 
  overlayStyle?: string; 
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  modalStyle = '',
  overlayStyle = '',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className={`${styles.modalOverlay} ${overlayStyle}`}
      onClick={handleOverlayClick}
    >
      <div className={`${styles.modalContent} ${modalStyle}`}> 
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
