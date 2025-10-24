// src/app/enquiry/EnquirySystem.tsx

"use client";

import { useEffect, useState } from "react";
import { SearchIcon } from "lucide-react";
import {
  AcademicEntry,
  EnquiryFormData,
  Program,
  Suggestion,
  CustomFieldEntry,
} from "@/lib/types";
import CustomFieldsSection from "../components/CustomFieldsSection";
import Breadcrumbs from "@/components/ui/breadCrumbs";
import PersonalInfoSection from "./components/PersonalInfoSection";
import AcademicInfoSection from "./components/AcademicInfoSection";
import SuggestionDisplay from "./components/SuggestionDisplay";
import InterestInfoSection from "./components/InterestInfoSection";
import { useApi } from "@/hooks/auth-modules/useFetch";

const customFields = [
  "CGPA",
  "Percentage",
  "GRE Score",
  "GMAT Score",
  "IELTS",
  "TOEFL",
  "PTE",
  "DET",
];

export default function EnquirySystem() {
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [formData, setFormData] = useState<EnquiryFormData>({
    student_name: "",
    email: "",
    phone: "",
    percentage: undefined,
  });

  const [academicEntries, setAcademicEntries] = useState<AcademicEntry[]>([
    {
      study_level: "",
      study_area: "",
      discipline_area: "", // New
      what_to_pursue: "", // New
      duration: "",
      completion_date: "",
      score: 0,
      study_year: "", // New
    },
  ]);

  const [interestInfo, setInterestInfo] = useState({
    interested_level: "",
    study_area: "",
    discipline_area: "",
    what_to_pursue: "",
    percentage: "",
    study_year: "",
  });

  const [availableFields, setAvailableFields] = useState<string[]>([]);

  const { data: availableFieldsData, error: fieldsError } = useApi(
    "/api/admin/fields/availableCustomFields"
  );

  console.log("fields data", availableFieldsData);
  useEffect(() => {
    if (
      availableFieldsData?.success &&
      Array.isArray(availableFieldsData.data)
    ) {
      // Map API response to array of field names
      setAvailableFields(
        availableFieldsData.data.map((f: any) => f.field_name)
      );
    }
  }, [availableFieldsData]);

  const handleInterestChange = (field: string, value: string) => {
    setInterestInfo((prev) => ({ ...prev, [field]: value }));
  };

  const [gapInfo, setGapInfo] = useState({
    is_gap: false,
    gap_years: 0,
  });

  const [customFieldsData, setCustomFieldsData] = useState<CustomFieldEntry[]>(
    []
  );
  const [customSuggestions, setCustomSuggestions] = useState<Program[]>([]);

  // --- Handlers ---

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        value === ""
          ? undefined
          : name === "percentage"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleAcademicChange = (
    index: number,
    field: string,
    value: string
  ) => {
    setAcademicEntries((prev) => {
      const updated = [...prev];
      // Convert 'score' and 'study_year' to appropriate types if needed, though they are currently treated as strings in the input handlers.
      updated[index] = {
        ...updated[index],
        [field]:
          field === "score"
            ? parseFloat(value) || 0
            : field === "study_year"
            ? value.toString()
            : value,
      } as AcademicEntry;
      return updated;
    });
  };

  const addAcademicEntry = () => {
    setAcademicEntries((prev) => [
      ...prev,
      {
        study_level: "",
        study_area: "",
        discipline_area: "", // New
        what_to_pursue: "", // New
        duration: "",
        completion_date: "",
        score: 0,
        study_year: "", // New
      },
    ]);
  };

  const removeAcademicEntry = (index: number) => {
    if (academicEntries.length > 1) {
      setAcademicEntries((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const addCustomField = () => {
    // Allow adding the first row
    if (customFieldsData.length === 0) {
      setCustomFieldsData([{ field: "", value: "" }]);
      return;
    }

    const lastEntry = customFieldsData[customFieldsData.length - 1];

    // Prevent adding if last entry is incomplete
    if (!lastEntry.field || lastEntry.value === "") return;

    // Prevent adding more than available fields
    if (customFieldsData.length >= availableFields.length) return;

    setCustomFieldsData((prev) => [...prev, { field: "", value: "" }]);
  };

  const removeCustomField = (index: number) => {
    setCustomFieldsData((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCustomFieldChange = (
    index: number,
    key: "field" | "value",
    value: string | number | ""
  ) => {
    setCustomFieldsData((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [key]: value,
      };
      return updated;
    });
  };

  const handleCustomSuggest = () => {
    // Simplified logic for custom suggestions based on the first custom field entry
    setLoading(true);
    setTimeout(() => {
      setLoading(false);

      const customQuery = customFieldsData[0];
      const selectedField = customQuery?.field;
      const fieldValue = customQuery?.value;

      const dummyPrograms: Program[] = [
        {
          id: "1",
          university: "University of Toronto",
          programme_name: "Computer Science",
          study_level: "Bachelor",
          study_area: "Computer Science",
          campus: "St. George Campus",
          duration: "4 years",
          percentage_required: 85,
          ielts_score: 6.5,
          // discipline_area: "Science",
          // what_to_pursue: "Software Dev",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "2",
          university: "University of British Columbia",
          programme_name: "Software Engineering",
          study_level: "Bachelor",
          study_area: "Engineering",
          campus: "Vancouver Campus",
          duration: "4 years",
          percentage_required: 88,
          ielts_score: 6.5,
          // discipline_area: "Engineering",
          // what_to_pursue: "Cyber Security",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "3",
          university: "McGill University",
          programme_name: "Data Science",
          study_level: "Master",
          study_area: "Computer Science",
          campus: "Downtown Campus",
          duration: "2 years",
          percentage_required: 90,
          ielts_score: 7,
          // discipline_area: "Science",
          // what_to_pursue: "ML Research",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

      if (selectedField && fieldValue !== "") {
        const filtered = dummyPrograms.filter((p) => {
          if (selectedField === "Percentage" && p.percentage_required) {
            return p.percentage_required <= fieldValue;
          }
          if (selectedField === "IELTS" && p.ielts_score) {
            return p.ielts_score <= fieldValue;
          }
          // Placeholder for other fields
          return true;
        });
        setCustomSuggestions(filtered);
      } else {
        setCustomSuggestions(dummyPrograms);
      }
    }, 500);
  };

  // The original handleSubmit simulates a full match, using the old 'suggestions' state
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const mockSuggestions: Suggestion[] = [
        // ... (mock data is detailed in the original code, keeping it concise here)
        // Program 1: University of Toronto
        {
          program: {
            id: "1",
            university: "University of Toronto",
            programme_name: "Computer Science",
            university_ranking: 18,
            study_level: "Bachelor",
            study_area: "Computer Science",
            campus: "St. George Campus",
            duration: "4 years",
            application_deadline: "2024-03-01",
            percentage_required: 85,
            ielts_score: 6.5,
            application_fees: 180,
            // discipline_area: "Science",
            // what_to_pursue: "Software Dev",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          match_score: 92,
          reasons: [
            "Perfect match for Bachelor study level",
            "Exact match in Computer Science field",
            "You meet the academic requirements (85% required)",
            "IELTS score meets requirements (6.5 required)",
            "Top-ranked university (#18)",
          ],
        },
        // Program 2: University of British Columbia
        {
          program: {
            id: "2",
            university: "University of British Columbia",
            programme_name: "Software Engineering",
            university_ranking: 47,
            study_level: "Bachelor",
            study_area: "Computer Science",
            campus: "Vancouver Campus",
            duration: "4 years",
            application_deadline: "2024-01-15",
            percentage_required: 88,
            ielts_score: 6.5,
            application_fees: 168,
            // discipline_area: "Engineering",
            // what_to_pursue: "Cyber Security",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          match_score: 88,
          reasons: [
            "Perfect match for Bachelor study level",
            "Exact match in Computer Science field",
            "Close to meeting academic requirements (88% required)",
            "IELTS score meets requirements (6.5 required)",
            "Well-ranked university (#47)",
          ],
        },
      ];

      setSuggestions(mockSuggestions);
      setShowSuggestions(true);
      setLoading(false);
    }, 1000);
  };

  const exportCSV = () => {
    const headers = [
      "University",
      "Program",
      "Study Level",
      "Discipline Area", // New
      "What to Pursue", // New
      "Percentage Required",
      "IELTS Required",
    ];
    const rows = customSuggestions.map((p) => [
      p.university,
      p.programme_name,
      p.study_level,
      // p.discipline_area || "-",
      // p.what_to_pursue || "-",
      p.percentage_required || "-",
      p.ielts_score || "-",
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((item) => `"${item}"`).join(",")) // Quote items for safer CSV
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "programs.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs />
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            University Program Enquiry
          </h1>
        </div>

        {/* Display Suggestions or Form */}
        {showSuggestions ? (
          <SuggestionDisplay
            suggestions={suggestions}
            customSuggestions={[]} // Only use this for the main path for now
            showSuggestions={showSuggestions}
            exportCSV={exportCSV}
            setShowSuggestions={setShowSuggestions}
          />
        ) : (
          <div className="space-y-8">
            <form onSubmit={handleSubmit}>
              <PersonalInfoSection
                formData={formData}
                handleInputChange={handleInputChange}
              />
              <div className="mt-8">
                <AcademicInfoSection
                  academicEntries={academicEntries}
                  gapInfo={gapInfo}
                  handleAcademicChange={handleAcademicChange}
                  addAcademicEntry={addAcademicEntry}
                  removeAcademicEntry={removeAcademicEntry}
                  setGapInfo={setGapInfo}
                  interestInfo={interestInfo}
                  handleInterestChange={handleInterestChange}
                />
              </div>

              <div className="mt-8">
                <InterestInfoSection
                  interestInfo={interestInfo}
                  handleInterestChange={handleInterestChange}
                />
              </div>

              <div className="mt-8">
                <CustomFieldsSection
                  customFieldsData={customFieldsData}
                  customFields={availableFields}
                  handleCustomFieldChange={handleCustomFieldChange}
                  addCustomField={addCustomField}
                  removeCustomField={removeCustomField}
                />
              </div>

              <div className="flex justify-center mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 text-lg font-medium"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  ) : (
                    <SearchIcon className="h-5 w-5 mr-2" />
                  )}
                  {loading ? "Finding Programs..." : "Find Programs"}
                </button>
              </div>
            </form>
            {customSuggestions.length > 0 && (
              <SuggestionDisplay
                suggestions={[]}
                customSuggestions={customSuggestions}
                showSuggestions={false} // Always false for custom suggestions table
                exportCSV={exportCSV}
                setShowSuggestions={setShowSuggestions}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
