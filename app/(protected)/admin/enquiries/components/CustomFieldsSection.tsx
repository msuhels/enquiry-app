import React from "react";
import { SearchIcon, PlusIcon, Trash2Icon } from "lucide-react";
import FormInput from "@/components/form/formInput";
import { CustomFieldEntry } from "@/lib/types";

interface CustomFieldsSectionProps {
  customFieldsData: CustomFieldEntry[];
  customFields: {
    value: string;
    label: string;
  }[];
  handleCustomFieldChange: (
    index: number,
    key: "field" | "value" | "comparison",
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
  const comparisonOptions = [
    { value: ">", label: "Greater than" },
    { value: ">=", label: "Greater than or equal to" },
    { value: "=", label: "Equal to" },
    { value: "<=", label: "Less than or equal to" },
    { value: "<", label: "Less than" },
  ];
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
            <div className="flex-1">
              <FormInput
                label="Field"
                name={`field-${index}`}
                type="select"
                select={customFields}
                value={cf.field}
                onChange={(e) =>
                  handleCustomFieldChange(index, "field", e.target.value)
                }
              />
            </div>

            {/* Comparison Operator */}
            <div className="flex-1">
              <FormInput
                label="Comparison"
                name={`comparison-${index}`}
                select={comparisonOptions}
                value={cf.comparison}
                onChange={(e) =>
                  handleCustomFieldChange(index, "comparison", e.target.value)
                }
              />
            </div>

            {/* Input Value */}
            <div className="flex-1">
              <FormInput
                label="Value"
                name={`value-${index}`}
                type="number"
                value={cf.value}
                onChange={(e) =>
                  handleCustomFieldChange(
                    index,
                    "value",
                    e.target.value === "" ? "" : parseFloat(e.target.value)
                  )
                }
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
          disabled={
            customFieldsData.length >= customFields.length ||
            (customFieldsData.length > 0 &&
              (!customFieldsData[customFieldsData.length - 1].field ||
                customFieldsData[customFieldsData.length - 1].value === ""))
          }
          className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${
            customFieldsData.length >= customFields.length ||
            (customFieldsData.length > 0 &&
              (!customFieldsData[customFieldsData.length - 1].field ||
                customFieldsData[customFieldsData.length - 1].value === ""))
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          <PlusIcon className="h-4 w-4 mr-2" /> Add Custom Field
        </button>
      </div>
    </div>
  );
};

export default CustomFieldsSection;
