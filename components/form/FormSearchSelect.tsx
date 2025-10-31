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
  allowCreate?: boolean;
}

const SearchSelect: React.FC<SearchSelectProps> = ({
  label,
  name,
  value,
  options,
  onChange,
  placeholder = "Search or type to add...",
  width = "100%",
  allowCreate = true,
}) => {

  const selectedOption =
    options.find((opt) => opt.value === value) ||
    (value ? { value, label: value } : null);

  const Component = allowCreate ? CreatableSelect : Select;

  return (
    <div style={{ width }}>
      {label?.trim() && (
        <label
          htmlFor={name}
          className="block text-sm font-semibold text-[#3a3886] mb-2"
        >
          {label}
        </label>
      )}

      <Component
        id={name}
        name={name}
        value={selectedOption}
        onChange={(newValue: any) => onChange(newValue?.value ?? "")}
        options={options}
        placeholder={placeholder}
        isClearable
        classNamePrefix="react-select"
        className={`${width ? width : "w-80"} rounded-lg`}
        styles={{
          control: (base, state) => ({
            ...base,
            borderColor: state.isFocused ? "#F97316" : "#E5E7EB",
            borderWidth: "2px",
            boxShadow: state.isFocused ? "0 0 0 3px rgba(249, 115, 22, 0.1)" : "none",
            borderRadius: "0.5rem",
            minHeight: "42px",
            transition: "all 0.2s",
            "&:hover": { 
              borderColor: state.isFocused ? "#F97316" : "#3a3886",
            },
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected 
              ? "#F97316" 
              : state.isFocused 
              ? "#F97316/10" 
              : "white",
            color: state.isSelected ? "white" : "#3a3886",
            fontWeight: state.isSelected ? "600" : "400",
            cursor: "pointer",
            transition: "all 0.2s",
            "&:active": {
              backgroundColor: "#F97316",
            },
          }),
          placeholder: (base) => ({
            ...base,
            color: "#9CA3AF",
            fontSize: "0.875rem",
          }),
          singleValue: (base) => ({
            ...base,
            color: "#3a3886",
            fontWeight: "500",
          }),
          dropdownIndicator: (base, state) => ({
            ...base,
            color: state.isFocused ? "#F97316" : "#9CA3AF",
            transition: "all 0.2s",
            "&:hover": {
              color: "#F97316",
            },
          }),
          clearIndicator: (base) => ({
            ...base,
            color: "#9CA3AF",
            transition: "all 0.2s",
            "&:hover": {
              color: "#F97316",
            },
          }),
          indicatorSeparator: (base) => ({
            ...base,
            backgroundColor: "#E5E7EB",
          }),
          menu: (base) => ({
            ...base,
            borderRadius: "0.5rem",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            border: "1px solid #E5E7EB",
            overflow: "hidden",
          }),
          menuList: (base) => ({
            ...base,
            padding: "0.25rem",
          }),
          multiValue: (base) => ({
            ...base,
            backgroundColor: "#F97316/10",
            borderRadius: "0.375rem",
          }),
          multiValueLabel: (base) => ({
            ...base,
            color: "#F97316",
            fontWeight: "500",
          }),
          multiValueRemove: (base) => ({
            ...base,
            color: "#F97316",
            "&:hover": {
              backgroundColor: "#F97316",
              color: "white",
            },
          }),
        }}
      />
    </div>
  );
};

export default SearchSelect;