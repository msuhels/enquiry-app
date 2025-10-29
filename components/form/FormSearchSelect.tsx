"use client";

import React from "react";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";

interface SearchSelectProps {
  label: string;
  name: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  placeholder?: string;
  width?: string;
  allowCreate?: boolean;   // ✅ NEW
}

const SearchSelect: React.FC<SearchSelectProps> = ({
  label,
  name,
  value,
  options,
  onChange,
  placeholder = "Search or type to add...",
  width = "100%",
  allowCreate = true,       // ✅ default = true
}) => {

  const selectedOption =
    options.find((opt) => opt.value === value) ||
    (value ? { value, label: value } : null);

  const Component = allowCreate ? CreatableSelect : Select;   // ✅ choose component

  return (
    <div style={{ width }}>
      <label
        htmlFor={name}
        className="block text-lg font-medium text-gray-700 mb-2"
      >
        {label}
      </label>

      <Component
        id={name}
        name={name}
        value={selectedOption}
        onChange={(newValue: any) => onChange(newValue?.value ?? "")}
        options={options}
        placeholder={placeholder}
        isClearable
        classNamePrefix="react-select"
        className={`min-w-80 ${width ? width : "w-80"}`}
        styles={{
          control: (base) => ({
            ...base,
            borderColor: "#D1D5DB",
            boxShadow: "none",
            "&:hover": { borderColor: "#4F46E5" },
          }),
        }}
      />
    </div>
  );
};

export default SearchSelect;
