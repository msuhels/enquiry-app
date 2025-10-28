"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { SaveIcon, PlusIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import Breadcrumbs from "@/components/ui/breadCrumbs";
import FormInput from "@/components/form/formInput";
import { ProgramFormData } from "@/lib/types";
import { toast } from "sonner";

export default function EditProgramPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<ProgramFormData>({
    university: "",
    programme_name: "",
    university_ranking: undefined,
    study_level: "",
    study_area: "",
    campus: "",
    duration: "",
    open_intake: "",
    open_call: "",
    application_deadline: "",
    entry_requirements: "",
    percentage_required: undefined,
    moi: "",
    ielts_score: undefined,
    ielts_no_band_less_than: undefined,
    toefl_score: undefined,
    toefl_no_band_less_than: undefined,
    pte_score: undefined,
    pte_no_band_less_than: undefined,
    det_score: undefined,
    det_no_band_less_than: undefined,
    tolc_score: undefined,
    sat_score: undefined,
    gre_score: undefined,
    gmat_score: undefined,
    cents_score: undefined,
    til_score: undefined,
    arched_test: "",
    application_fees: undefined,
    additional_requirements: "",
    remarks: "",
  });

  const [dynamicAcademicRequirements, setDynamicAcademicRequirements] = useState<
    { field: string; comparison: string; value: number | "" }[]
  >([{ field: "", comparison: ">", value: "" }]);

  const comparisonOptions = [
    { value: ">", label: "Greater than" },
    { value: ">=", label: "Greater than or equal to" },
    { value: "=", label: "Equal to" },
    { value: "<=", label: "Less than or equal to" },
    { value: "<", label: "Less than" },
  ];

  useEffect(() => {
    if (!id) return;
    const fetchProgram = async () => {
      try {
        const res = await fetch(`/api/admin/programs/${id}`);
        const data = await res.json();
        if (data.success) {
          setFormData(data.data);
          if (data.data.custom_fields?.length) {
            setDynamicAcademicRequirements(data.data.custom_fields);
          }
        }
      } catch (err) {
        console.error("Failed to fetch program:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgram();
  }, [id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        value === ""
          ? undefined
          : name.includes("score") ||
            name.includes("ranking") ||
            name.includes("required") ||
            name.includes("fees")
          ? parseFloat(value)
          : value,
    }));
  };

  const handleDynamicRequirementChange = (
    index: number,
    key: "field" | "comparison" | "value",
    value: string | number
  ) => {
    setDynamicAcademicRequirements((prev) => {
      const updated = [...prev];
      updated[index][key] =
        key === "value" ? (value === "" ? "" : Number(value)) : value;
      return updated;
    });
  };

  const addDynamicRequirement = () => {
    setDynamicAcademicRequirements((prev) => [
      ...prev,
      { field: "", comparison: ">", value: "" },
    ]);
  };

  const removeDynamicRequirement = (index: number) => {
    setDynamicAcademicRequirements((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // setSaving(true);

    toast.warning("under development", {position: "top-center", richColors: true});
    // try {
    //   const payload = {
    //     ...formData,
    //     custom_fields: dynamicAcademicRequirements.filter(
    //       (r) => r.field && r.value !== ""
    //     ),
    //   };

    //   const response = await fetch(`/api/admin/programs/${id}`, {
    //     method: "PUT",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(payload),
    //   });

    //   const result = await response.json();
    //   if (!result.success) {
    //     alert("Error updating program. Please try again.");
    //     return;
    //   }
    //   router.push(`/admin/programs/${id}`);
    // } catch (error) {
    //   alert("Error updating program. Please try again.");
    // } finally {
    //   setSaving(false);
    // }
  };

  const basicInfoFields = [
    { label: "University", name: "university" },
    { label: "Programme Name", name: "programme_name" },
    { label: "University Ranking", name: "university_ranking", type: "number" },
    {
      label: "Study Level",
      name: "study_level",
      select: [
        { value: "Bachelor", label: "Bachelor" },
        { value: "Master", label: "Master" },
        { value: "PhD", label: "PhD" },
        { value: "Diploma", label: "Diploma" },
        { value: "Certificate", label: "Certificate" },
      ],
    },
    { label: "Study Area", name: "study_area" },
    { label: "Campus", name: "campus" },
    { label: "Duration", name: "duration", type: "number" },
    { label: "Application Deadline", name: "application_deadline", type: "date" },
  ];

  const academicRequirementsFields = [
    { label: "Percentage Required", name: "percentage_required", type: "number", step: 0.01, min: 0, max: 100 },
    { label: "Medium of Instruction", name: "moi" },
    { label: "Entry Requirements", name: "entry_requirements", textarea: true },
  ];

  const englishRequirementsFields = [
    { label: "IELTS Score", name: "ielts_score", type: "number", step: 0.5, min: 0, max: 9 },
    { label: "IELTS No Band Less Than", name: "ielts_no_band_less_than", type: "number", step: 0.5, min: 0, max: 9 },
    { label: "TOEFL Score", name: "toefl_score", type: "number", min: 0, max: 120 },
    { label: "TOEFL No Band Less Than", name: "toefl_no_band_less_than", type: "number", min: 0, max: 30 },
    { label: "PTE Score", name: "pte_score", type: "number", min: 0, max: 90 },
    { label: "PTE No Band Less Than", name: "pte_no_band_less_than", type: "number", min: 0, max: 90 },
    { label: "DET Score", name: "det_score", type: "number", min: 0, max: 120 },
    { label: "DET No Band Less Than", name: "det_no_band_less_than", type: "number", min: 0, max: 30 },
  ];

  const testScoresFields = [
    { label: "GRE Score", name: "gre_score", type: "number", min: 260, max: 340 },
    { label: "GMAT Score", name: "gmat_score", type: "number", min: 200, max: 800 },
    { label: "SAT Score", name: "sat_score", type: "number", min: 400, max: 1600 },
    { label: "Application Fees", name: "application_fees", type: "number", step: 0.01, min: 0 },
  ];

  const additionalTestFields = [
    { label: "Open Intake", name: "open_intake" },
    { label: "Open Call", name: "open_call" },
    { label: "TOLC Score", name: "tolc_score", type: "number" },
    { label: "CENTS Score", name: "cents_score", type: "number" },
    { label: "TIL Score", name: "til_score", type: "number" },
    { label: "ARCHED Test", name: "arched_test" },
  ];

  const additionalInfoFields = [
    { label: "Additional Requirements", name: "additional_requirements", textarea: true },
    { label: "Remarks", name: "remarks", textarea: true },
  ];

  const renderFields = (fields: any[]) =>
    fields.map((field) => (
      <FormInput
        key={field.name}
        label={field.label}
        name={field.name}
        type={field.type}
        value={formData[field.name]}
        onChange={handleInputChange}
        select={field.select}
        step={field.step}
        min={field.min}
        max={field.max}
        textarea={field.textarea}
      />
    ));

  if (loading) return <div className="p-8 text-center">Loading program data...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs disabledItemIndex={2} />
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Program</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{renderFields(basicInfoFields)}</div>
          </div>

          {/* Academic Requirements */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Academic Requirements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{renderFields(academicRequirementsFields)}</div>
          </div>

          {/* Dynamic Academic Requirements */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Custom Academic Requirements</h2>
            <div className="space-y-4">
              {dynamicAcademicRequirements.map((req, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <FormInput
                    label="Field"
                    name={`field-${index}`}
                    value={req.field}
                    onChange={(e) => handleDynamicRequirementChange(index, "field", e.target.value)}
                  />
                  <FormInput
                    label="Comparison"
                    name={`comparison-${index}`}
                    select={comparisonOptions}
                    value={req.comparison}
                    onChange={(e) => handleDynamicRequirementChange(index, "comparison", e.target.value)}
                  />
                  <FormInput
                    label="Value"
                    name={`value-${index}`}
                    type="number"
                    value={req.value}
                    onChange={(e) => handleDynamicRequirementChange(index, "value", e.target.value)}
                  />
                  <div className="h-full flex justify-center items-center">
                    <button
                      type="button"
                      onClick={() => removeDynamicRequirement(index)}
                      className="text-red-500 flex items-center mt-1"
                    >
                      <Trash2Icon className="h-5 w-5 mr-1" /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addDynamicRequirement}
              className="mt-4 inline-flex items-center px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              <PlusIcon className="h-4 w-4 mr-1" /> Add Requirement
            </button>
          </div>

          {/* English Requirements */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">English Language Requirements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{renderFields(englishRequirementsFields)}</div>
          </div>

          {/* Test Scores */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Scores</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{renderFields(testScoresFields)}</div>
          </div>

          {/* Additional Tests & Intake */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Test & Intake Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{renderFields(additionalTestFields)}</div>
          </div>

          {/* Additional Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h2>
            <div className="space-y-6">{renderFields(additionalInfoFields)}</div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4">
            <Link
              href={`/admin/programs`}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <SaveIcon className="h-4 w-4 mr-2" />
              )}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
