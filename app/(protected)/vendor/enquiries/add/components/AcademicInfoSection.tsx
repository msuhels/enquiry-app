// src/app/enquiry/components/AcademicInfoSection.tsx

import {
  BookOpenIcon,
  PlusIcon,
  Trash2Icon,
  GraduationCapIcon,
} from "lucide-react";
import FormInput from "@/components/form/formInput";
import { AcademicEntry } from "@/lib/types";
import { createClient } from "@/lib/supabase/adapters/client";
import { useEffect, useState } from "react";

interface AcademicInfoSectionProps {
  academicEntries: AcademicEntry[];
  gapInfo: { is_gap: boolean; gap_years: number };
  interestInfo: {
    interested_level: string;
    study_area: string;
    discipline_area: string;
    what_to_pursue: string;
    percentage: string;
    study_year: string;
  };
  handleAcademicChange: (index: number, field: string, value: string) => void;
  handleInterestChange: (field: string, value: string) => void;
  addAcademicEntry: () => void;
  removeAcademicEntry: (index: number) => void;
  setGapInfo: React.Dispatch<
    React.SetStateAction<{ is_gap: boolean; gap_years: number }>
  >;
}

const academicFields = [
  {
    name: "study_level",
    label: "Study Level",
    type: "select",
    options: [
      { value: "Bachelor", label: "Bachelor" },
      { value: "Master", label: "Master" },
      { value: "PhD", label: "PhD" },
      { value: "Diploma", label: "Diploma" },
      { value: "Certificate", label: "Certificate" },
    ],
  },
  { name: "study_area", label: "Area of Study(course)", type: "text" },
  { name: "discipline_area", label: "Discipline Area/Stream", type: "text" },
  {
    name: "score",
    label: "Score (% | GPA)",
    type: "number",
    step: 0.01,
    min: 0,
    max: 100,
  },
  { name: "study_year", label: "Study/Completion Year", type: "text" },
  { name: "duration", label: "Duration (in years)", type: "text" },
  { name: "completion_date", label: "Completion Date", type: "date" },
];

export default function AcademicInfoSection({
  academicEntries,
  gapInfo,
  interestInfo,
  handleAcademicChange,
  handleInterestChange,
  addAcademicEntry,
  removeAcademicEntry,
  setGapInfo,
}: AcademicInfoSectionProps) {
  const [studyLevelOptions, setStudyLevelOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [courseOptions, setCourseOptions] = useState<
    Record<number, { value: string; label: string }[]>
  >({});
  const [streamOptions, setStreamOptions] = useState<
    Record<number, { value: string; label: string }[]>
  >({});

  const supbase = createClient();

  useEffect(() => {
    async function fetchStudyLevels() {
      const { data: levels } = await supbase
        .from("education_levels")
        .select("*");
      setStudyLevelOptions(
        levels?.map((l) => ({ value: l.id, label: l.level_name })) || []
      );
    }
    fetchStudyLevels();
  }, []);

  const handleStudyLevelChange = async (
    index: number,
    studyLevelId: string
  ) => {
    handleAcademicChange(index, "study_level", studyLevelId);
    const { data: courses } = await supbase
      .from("courses")
      .select("*")
      .eq("level_id", studyLevelId);

    setCourseOptions((prev) => ({
      ...prev,
      [index]:
        courses?.map((c) => ({ value: c.id, label: c.course_name })) || [],
    }));

    // Reset course and stream selection
    handleAcademicChange(index, "study_area", "");
    handleAcademicChange(index, "discipline_area", "");
    setStreamOptions((prev) => ({ ...prev, [index]: [] }));
  };

  const handleCourseChange = async (index: number, courseId: string) => {
    handleAcademicChange(index, "study_area", courseId);
    const { data: streams } = await supbase
      .from("streams")
      .select("*")
      .eq("course", courseId);

    console.log("streams", streams);

    setStreamOptions((prev) => ({
      ...prev,
      [index]: streams?.map((s) => ({ value: s.id, label: s.name })) || [],
    }));

    // Reset stream selection
    handleAcademicChange(index, "discipline_area", "");
  };

  const renderFields = (data: AcademicEntry, index: number) => (
    <>
      {/* Study Level */}
      <FormInput
        label="Study Level"
        name="study_level"
        type="select"
        select={studyLevelOptions}
        value={data.study_level || ""}
        onChange={(e) => handleStudyLevelChange(index, e.target.value)}
      />

      {/* Area of Study / Courses */}
      <FormInput
        label="Area of Study (Course)"
        name="study_area"
        type="select"
        select={courseOptions[index] || []}
        value={data.study_area || ""}
        onChange={(e) => handleCourseChange(index, e.target.value)}
      />

      {/* Discipline Area / Stream */}
      <FormInput
        label="Discipline Area / Stream"
        name="discipline_area"
        type="select"
        select={streamOptions[index] || []}
        value={data.discipline_area || ""}
        onChange={(e) =>
          handleAcademicChange(index, "discipline_area", e.target.value)
        }
      />

      {/* Other fields */}
      {["score", "study_year", "duration", "completion_date"].map((field) => (
        <FormInput
          key={field}
          label={academicFields.find((f) => f.name === field)?.label || field}
          name={field}
          type={academicFields.find((f) => f.name === field)?.type as any}
          value={data[field as keyof AcademicEntry] || ""}
          onChange={(e) => handleAcademicChange(index, field, e.target.value)}
        />
      ))}
    </>
  );

  return (
    <>
      {/* --- Academic Entries Section --- */}
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
            <div key={index} className="border border-gray-200 rounded-lg p-4">
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
                {renderFields(entry, index)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- Interest Information Section ---
      <div className="bg-white shadow rounded-lg mt-6 p-6 mb-6">
        <div className="flex items-center mb-4">
          <GraduationCapIcon className="h-5 w-5 mr-2 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            Interest Information
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Interest"
            name="interested_level"
            type="select"
            select={[
              { value: "Bachelor", label: "Bachelor" },
              { value: "Master", label: "Master" },
              { value: "PhD", label: "PhD" },
              { value: "Diploma", label: "Diploma" },
              { value: "Certificate", label: "Certificate" },
            ]}
            value={interestInfo.interested_level}
            onChange={(e) =>
              handleInterestChange(e.target.name, e.target.value)
            }
          />

          <FormInput
            label="Area of Study(course)"
            name="study_area"
            type="text"
            value={interestInfo.study_area}
            onChange={(e) =>
              handleInterestChange(e.target.name, e.target.value)
            }
          />

          <FormInput
            label="Discipline Area / Stream"
            name="discipline_area"
            type="text"
            value={interestInfo.discipline_area}
            onChange={(e) =>
              handleInterestChange(e.target.name, e.target.value)
            }
          />

          <FormInput
            label="What You Want to Pursue"
            name="what_to_pursue"
            type="text"
            value={interestInfo.what_to_pursue}
            onChange={(e) =>
              handleInterestChange(e.target.name, e.target.value)
            }
          />

          <FormInput
            label="Percentage or GPA"
            name="percentage"
            type="number"
            step={0.01}
            min={0}
            max={100}
            value={interestInfo.percentage}
            onChange={(e) =>
              handleInterestChange(e.target.name, e.target.value)
            }
          />

          <FormInput
            label="Study Year"
            name="study_year"
            type="text"
            value={interestInfo.study_year}
            onChange={(e) =>
              handleInterestChange(e.target.name, e.target.value)
            }
          />
        </div>
      </div> */}

      {/* --- Gap Info Section --- */}
      <div className="bg-white shadow rounded-lg mt-6 p-6">
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
