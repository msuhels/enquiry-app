"use client";

import React from "react";
import CreatableSelect from "react-select/creatable";

interface SearchSelectProps {
  label: string;
  name: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchSelect: React.FC<SearchSelectProps> = ({
  label,
  name,
  value,
  options,
  onChange,
  placeholder = "Search or type to add...",
}) => {
  // Always make sure the selected value is an object
  const selectedOption =
    options.find((opt) => opt.value === value) ||
    (value ? { value, label: value } : null);

  console.log("selectedOption", selectedOption);

  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
      </label>
      <CreatableSelect
        id={name}
        name={name}
        value={selectedOption}
        onChange={(newValue) => onChange(newValue ? newValue.value : "")}
        options={options}
        placeholder={placeholder}
        isClearable
        classNamePrefix="react-select"
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
