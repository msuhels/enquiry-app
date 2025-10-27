'use client';

import React from 'react';

interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  value: string | number | boolean | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void | undefined | Promise<void>;
  required?: boolean;
  placeholder?: string;
  step?: string | number;
  min?: number;
  max?: number;
  textarea?: boolean;
  select?: { value: string; label: string }[];
  checkbox?: boolean
  disabled?: boolean
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  required = false,
  placeholder,
  step,
  min,
  max,
  textarea = false,
  select,
  checkbox= false,
  disabled = false
}) => {
  if (textarea) {
    return (
      <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        <textarea
          id={name}
          name={name}
          rows={3}
          disabled={disabled}
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />
      </div>
    );
  }

  if (select) {
    return (
      <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        <select
          id={name}
          name={name}
          value={value || ''}
          disabled={disabled}
          onChange={onChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
        >
          <option value="">Select {label}</option>
          {select.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if(checkbox){
    return (
      <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        <input
          type="checkbox"
          id={name}
          disabled={disabled}
          name={name}
          value={value || ''}
          onChange={onChange}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:ring-indigo-600 h-4 w-4 cursor-pointer checked:bg-indigo-600"
        />
      </div>
    );
  }

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && '*'}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        disabled={disabled}
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        step={step}
        min={min}
        max={max}
        required={required}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
      />
    </div>
  );
};

export default FormInput;
