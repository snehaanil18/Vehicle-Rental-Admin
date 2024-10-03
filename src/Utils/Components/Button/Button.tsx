import React from 'react';
import styles from './button.module.css'

interface ButtonProps {
  label: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, type = 'button', disabled = false, className = '' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${styles.btn} ${className}`} 
      // className={`${styles.btn} ${className && styles[className]}`}
    >
      {label}
      
    </button>
  );
};

export default Button;
