// src/app/enquiry/components/AcademicInfoSection.tsx

import { BookOpenIcon, PlusIcon, Trash2Icon } from "lucide-react";
import FormInput from "@/components/form/formInput";
import { AcademicEntry } from "@/lib/types";

interface AcademicInfoSectionProps {
  academicEntries: AcademicEntry[];
  gapInfo: { is_gap: boolean; gap_years: number };
  handleAcademicChange: (index: number, field: string, value: string) => void;
  addAcademicEntry: () => void;
  removeAcademicEntry: (index: number) => void;
  setGapInfo: React.Dispatch<
    React.SetStateAction<{ is_gap: boolean; gap_years: number }>
  >;
}

const academicFields = [
  {
    name: "study_level",
    label: "Study Level (Bachelor's or Master's)",
    type: "select",
    options: [
      { value: "Bachelor", label: "Bachelor" },
      { value: "Master", label: "Master" },
      { value: "PhD", label: "PhD" },
      { value: "Diploma", label: "Diploma" },
      { value: "Certificate", label: "Certificate" },
    ],
    
  },
  {
    name: "study_area",
    label: "Area of Study",
    type: "text",
    
  },
  {
    name: "discipline_area",
    label: "Discipline Area/Stream", // New field
    type: "text",
    
  },
  {
    name: "what_to_pursue",
    label: "What you want to pursue", // New field
    type: "text",
    required: false,
  },
  {
    name: "score",
    label: "Score (% | GPA)",
    type: "number",
    step: 0.01,
    min: 0,
    max: 100,
    
  },
  {
    name: "study_year",
    label: "Study/Completion Year", // New field (renamed completion_date to study_year for flexibility)
    type: "text",
    
  },
  {
    name: "duration",
    label: "Duration (in years)",
    type: "text",
    
  },
  {
    name: "completion_date",
    label: "Completion Date",
    type: "date",
    
    // Note: The original logic still uses completion_date, but the prompt's "study year" is more likely a textual field for the year, so study_year was added. I'll keep completion_date for now as it's used in the AcademicEntry type.
  },
];

const renderFields = (
  fields: typeof academicFields,
  data: AcademicEntry,
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
) =>
  fields.map((field) => (
    <FormInput
      key={field.name}
      label={field.label}
      name={field.name}
      type={field.type}
      value={data[field.name as keyof AcademicEntry] || ""}
      onChange={onChange}
      required={field.required}
      select={field.options}
      step={field.step}
      min={field.min}
      max={field.max}
    />
  ));

export default function AcademicInfoSection({
  academicEntries,
  gapInfo,
  handleAcademicChange,
  addAcademicEntry,
  removeAcademicEntry,
  setGapInfo,
}: AcademicInfoSectionProps) {
  return (
    <>
      {/* Academic Entries Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <BookOpenIcon className="h-5 w-5 mr-2 text-blue-600" />
            Academic Information
          </h2>
          <button
            type="button"
            onClick={addAcademicEntry}
            className="inline-flex items-center px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium"
          >
            <PlusIcon className="h-4 w-4 mr-1" /> Add Academic Entry
          </button>
        </div>

        <div className="space-y-6">
          {academicEntries.map((entry, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium text-gray-700">
                  Academic Entry #{index + 1}
                </h3>
                {academicEntries.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAcademicEntry(index)}
                    className="text-red-600 hover:text-red-800 text-sm flex items-center"
                  >
                    <Trash2Icon className="h-4 w-4 mr-1" /> Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderFields(
                  academicFields,
                  entry,
                  (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
                    handleAcademicChange(index, e.target.name, e.target.value)
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional/Gap Info Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Additional Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Gap between 10th and Bachelor's (If applicable)"
            name="is_gap"
            checkbox
            value={gapInfo.is_gap}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setGapInfo((prev) => ({
                ...prev,
                is_gap: e.target.checked,
              }))
            }
          />

          {gapInfo.is_gap && (
            <FormInput
              label="Gap Years"
              name="gap_years"
              type="number"
              placeholder="0"
              min={0}
              max={20}
              value={gapInfo.gap_years}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setGapInfo((prev) => ({
                  ...prev,
                  gap_years: parseInt(e.target.value || "0"),
                }))
              }
            />
          )}
        </div>
      </div>
    </>
  );
}