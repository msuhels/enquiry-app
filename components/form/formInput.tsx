"use client";

import React from "react";

interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  value: string | number | boolean | undefined;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void | Promise<void>;
  required?: boolean;
  placeholder?: string;
  step?: string | number;
  min?: number;
  max?: number;
  textarea?: boolean;
  select?: { value: string; label: string }[];
  checkbox?: boolean;
  disabled?: boolean;

  /** NA FUNCTIONALITY */
  naKey?: string; // field key for NA
  isNA?: boolean; // current NA state
  onNAChange?: (naKey: string, checked: boolean) => void;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  placeholder,
  step,
  min,
  max,
  textarea = false,
  select,
  checkbox = false,
  disabled = false,
  naKey,
  isNA,
  onNAChange,
}) => {
  const isDisabled = disabled || isNA;

  return (
    <div className="flex flex-col space-y-1 relative">
      {/* Label + NA toggle */}
      <div className="flex justify-between items-center mb-1">
        <label className="font-medium text-lg text-[#3a3886]">
          {label}{" "}
          {required && !isNA && <span className="text-[#F97316] ml-1">*</span>}
        </label>

        {naKey && (
          <label className="flex items-center space-x-1 text-base cursor-pointer">
            <input
              type="checkbox"
              checked={!!isNA}
              onChange={(e) => onNAChange?.(naKey, e.target.checked)}
            />
            <span>Not Applicable</span>
          </label>
        )}
      </div>

      {/* TEXTAREA */}
      {textarea ? (
        <textarea
          id={name}
          name={name}
          rows={3}
          disabled={isDisabled}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-4 py-2.5 border-2 text-lg border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#F97316] focus:border-[#F97316] transition-all resize-none h-24 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500"
        />
      ) : select ? (
        <select
          id={name}
          name={name}
          value={value}
          disabled={isDisabled}
          onChange={onChange}
          className="w-full px-4 py-2.5 text-lg border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#F97316] focus:border-[#F97316] transition-all bg-white disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500 appearance-none cursor-pointer"
        >
          <option value="" className="text-gray-500 text-lg">
            Select {label}
          </option>
          {select.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              className="text-gray-700 text-lg"
            >
              {opt.label}
            </option>
          ))}
        </select>
      ) : checkbox ? (
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id={name}
            name={name}
            disabled={isDisabled}
            checked={!!value}
            onChange={onChange}
            className="h-5 w-5 cursor-pointer text-lg rounded border-2 border-gray-300 focus:ring-1 focus:ring-[#F97316] transition-all disabled:cursor-not-allowed disabled:opacity-50"
            style={{ accentColor: "#F97316" }}
          />
          <label
            htmlFor={name}
            className="text-sm font-medium text-gray-700 cursor-pointer select-none"
          >
            {label}
          </label>
        </div>
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          disabled={isDisabled}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          step={step}
          min={min}
          max={max}
          required={required && !isNA}
          className="w-full px-4 py-2.5 border-2 text-lg border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#F97316] focus:border-[#F97316] transition-all disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500 placeholder:text-gray-400"
        />
      )}
    </div>
  );
};

export default FormInput;
