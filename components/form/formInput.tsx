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
        <label htmlFor={name} className="block text-sm font-semibold text-[#3a3886] mb-2">
          {label}
          {required && <span className="text-[#F97316] ml-1">*</span>}
        </label>
        <textarea
          id={name}
          name={name}
          rows={3}
          disabled={disabled}
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#F97316] focus:border-[#F97316] transition-all resize-none h-24 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500"
        />
      </div>
    );
  }

  if (select) {
    return (
      <div>
        <label htmlFor={name} className="block text-sm font-semibold text-[#3a3886] mb-2">
          {label}
          {required && <span className="text-[#F97316] ml-1">*</span>}
        </label>
        <select
          id={name}
          name={name}
          value={value || ''}
          disabled={disabled}
          onChange={onChange}
          className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#F97316] focus:border-[#F97316] transition-all bg-white disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500 appearance-none cursor-pointer"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%233a3886' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
            backgroundPosition: 'right 0.5rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.5em 1.5em',
            paddingRight: '2.5rem'
          }}
        >
          <option value="" className="text-gray-500">Select {label}</option>
          {select.map((opt) => (
            <option key={opt.value} value={opt.value} className="text-[#3a3886]">
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if(checkbox){
    return (
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id={name}
          disabled={disabled}
          name={name}
          checked={!!value}
          onChange={onChange}
          className="h-5 w-5 cursor-pointer rounded border-2 border-gray-300 text-[#F97316] focus:ring-1 focus:ring-[#F97316] focus:ring-offset-0 transition-all disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            accentColor: '#F97316'
          }}
        />
        <label htmlFor={name} className="text-sm font-medium text-[#3a3886] cursor-pointer select-none">
          {label}
          {required && <span className="text-[#F97316] ml-1">*</span>}
        </label>
      </div>
    );
  }

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold text-[#3a3886] mb-2">
        {label}
        {required && <span className="text-[#F97316] ml-1">*</span>}
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
        className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#F97316] focus:border-[#F97316] transition-all disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500 placeholder:text-gray-400"
      />
    </div>
  );
};

export default FormInput;