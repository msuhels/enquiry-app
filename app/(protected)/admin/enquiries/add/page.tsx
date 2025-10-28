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
import { useFetch } from "@/hooks/api/useFetch";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const [academicEntries, setAcademicEntries] = useState<AcademicEntry[]>([
    {
      study_level: "",
      study_area: "",
      duration: "",
      discipline_area: "",
      what_to_pursue: "",
      study_year: "",
      score: 0,
      completion_date: "",
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

  const { data: availableFieldsData, error: fieldsError } = useFetch(
    "/api/admin/fields/availableCustomFields"
  );

  useEffect(() => {
    if (
      availableFieldsData?.success &&
      Array.isArray(availableFieldsData.data)
    ) {
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

  console.log("customSuggestions", customSuggestions);

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
    if (customFieldsData.length === 0) {
      setCustomFieldsData([{ field: "", value: "" }]);
      return;
    }

    const lastEntry = customFieldsData[customFieldsData.length - 1];

    if (!lastEntry.field || lastEntry.value === "") return;

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


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        student_name: formData.student_name,
        email: formData.email,
        phone: formData.phone,
        overall_percentage: formData.percentage,
        is_gap: gapInfo.is_gap,
        gap_years: gapInfo.gap_years,
        custom_fields: customFieldsData,
        academic_entries: academicEntries,
      };

      const res = await fetch("/api/admin/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to save enquiry");
      }

      console.log("Enquiry saved successfully:", result.data);
      // setCustomSuggestions(result.suggestions);
      // setShowSuggestions(true);
      router.push(`/admin/enquiries/${result.data.id}/suggestions`);
    } catch (err: any) {
      console.error("Error submitting enquiry:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
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

        {/* {customSuggestions?.length > 0 && customSuggestions ? (
          <SuggestionDisplay
            suggestions={[]}
            customSuggestions={customSuggestions}
            showSuggestions={false}
            exportCSV={exportCSV}
            setShowSuggestions={setShowSuggestions}
          />
        ) : ( */}
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
            {/* {customSuggestions.length > 0 && (
              <SuggestionDisplay
                suggestions={[]}
                customSuggestions={customSuggestions}
                showSuggestions={false}
                exportCSV={exportCSV}
                setShowSuggestions={setShowSuggestions}
              />
            )} */}
          </div>
        {/* )} */}
      </div>
    </div>
  );
}
