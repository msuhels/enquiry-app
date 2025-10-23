import React from "react";
import { SearchIcon, PlusIcon, Trash2Icon } from "lucide-react";

interface CustomFieldEntry {
  field: string;
  value: number | "";
}

interface CustomFieldsSectionProps {
  customFieldsData: CustomFieldEntry[];
  customFields: string[];
  handleCustomFieldChange: (
    index: number,
    key: "field" | "value",
    value: string | number | ""
  ) => void;
  addCustomField: () => void;
  removeCustomField: (index: number) => void;
}

const CustomFieldsSection: React.FC<CustomFieldsSectionProps> = ({
  customFieldsData = [],
  customFields = [],
  handleCustomFieldChange,
  addCustomField,
  removeCustomField,
}) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <SearchIcon className="h-5 w-5 mr-2 text-blue-600" />
        Custom Fields
      </h2>

      {customFieldsData.length === 0 && (
        <p className="text-gray-500 text-sm mb-4">
          No custom fields added yet.
        </p>
      )}

      <div className="space-y-4">
        {customFieldsData.map((cf, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row md:items-center md:space-x-4 border border-gray-200 rounded-lg p-4"
          >
            {/* Select Field */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Field
              </label>
              <select
                value={cf.field}
                onChange={(e) =>
                  handleCustomFieldChange(index, "field", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Field</option>
                {customFields.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            {/* Value Input */}
            <div className="flex-1 mt-4 md:mt-0">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Score/Value
              </label>
              <input
                type="number"
                value={cf.value}
                onChange={(e) =>
                  handleCustomFieldChange(
                    index,
                    "value",
                    e.target.value === "" ? "" : parseFloat(e.target.value)
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your score or value"
              />
            </div>

            {/* Remove Button */}
            <button
              type="button"
              onClick={() => removeCustomField(index)}
              className="mt-4 md:mt-0 md:ml-4 px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 text-sm font-medium flex items-center"
            >
              <Trash2Icon className="h-4 w-4 mr-1" />
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Add Button */}
      <div className="mt-6">
        <button
          type="button"
          onClick={addCustomField}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium"
        >
          <PlusIcon className="h-4 w-4 mr-2" /> Add Custom Field
        </button>
      </div>
    </div>
  );
};

export default CustomFieldsSection;
