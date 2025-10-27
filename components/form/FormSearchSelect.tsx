'use client';

import React, { useState, useEffect, useRef } from 'react';

interface SearchSelectOption {
  value: string;
  label: string;
}

interface FormSearchSelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: SearchSelectOption[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

const FormSearchSelect: React.FC<FormSearchSelectProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = 'Search...',
  required = false,
  disabled = false,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<SearchSelectOption[]>(options);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter options as user types
  useEffect(() => {
    if (query.trim() === '') {
      setFilteredOptions(options);
    } else {
      setFilteredOptions(
        options.filter((opt) =>
          opt.label.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
  }, [query, options]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLabel =
    options.find((opt) => opt.value === value)?.label || '';

  return (
    <div className="relative" ref={containerRef}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && '*'}
      </label>
      <div
        className={`w-full border border-gray-300 rounded-md px-3 py-2 flex justify-between items-center cursor-pointer ${
          disabled ? 'bg-gray-100 cursor-not-allowed' : 'focus:ring-2 focus:ring-indigo-600'
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className={selectedLabel ? 'text-gray-900' : 'text-gray-400'}>
          {selectedLabel || placeholder}
        </span>
        <svg
          className={`w-4 h-4 ml-2 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-auto">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to search..."
            className="w-full px-3 py-2 border-b border-gray-200 outline-none focus:ring-0"
          />
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => (
              <div
                key={opt.value}
                className={`px-3 py-2 cursor-pointer hover:bg-indigo-100 ${
                  value === opt.value ? 'bg-indigo-50 text-indigo-700 font-medium' : ''
                }`}
                onClick={() => {
                  onChange(opt.value);
                  setQuery('');
                  setIsOpen(false);
                }}
              >
                {opt.label}
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-gray-500 text-sm">No results found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default FormSearchSelect;
