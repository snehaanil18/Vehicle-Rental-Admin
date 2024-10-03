// InputField.tsx
import React from 'react';

interface InputFieldProps {
  label: string;
  type: string;
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;
  onBlur: React.FocusEventHandler<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>;
  placeholder?: string;
  required?: boolean;  // Add this line
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  required = false,  // Default value can be set
}) => {
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required} // Use the required prop here
      />
    </div>
  );
};

export default InputField;
