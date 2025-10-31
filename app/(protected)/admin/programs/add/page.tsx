"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SaveIcon } from "lucide-react";
import Link from "next/link";
import { ProgramFormData } from "@/lib/types";
import Breadcrumbs from "@/components/ui/breadCrumbs";
import FormInput from "@/components/form/formInput";
import { toast } from "sonner";
import { useFetch } from "@/hooks/api/useFetch";
import SearchSelect from "@/components/form/FormSearchSelect";

export default function NewProgramPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProgramFormData>({
    university: "",
    previous_or_current_study: "",
    degree_going_for: "",
    course_name: "",
    ielts_requirement: "",
    special_requirements: "",
    remarks: "",
    ielts_na: false,
    special_requirements_na: false,
    remarks_na: false,
  });

  console.log("formData", formData);

  const { data: degreeGoingFor } = useFetch("/api/admin/degree-going-for");
  const { data: previousCurrentStudy } = useFetch(
    "/api/admin/previous-or-current-study"
  );

  // Transform API data to select options format
  const getPreviousStudyOptions = () => {
    const data =
      previousCurrentStudy?.data ||
      (previousCurrentStudy?.success && previousCurrentStudy?.data);
    if (!data || !Array.isArray(data)) return [];

    return data.map((item: any) => ({
      value: item.name,
      label: item.name,
    }));
  };

  const getDegreeGoingForOptions = () => {
    const data =
      degreeGoingFor?.data || (degreeGoingFor?.success && degreeGoingFor?.data);
    if (!data || !Array.isArray(data)) return [];

    return data.map((item: any) => ({
      value: item.name,
      label: item.name,
    }));
  };

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
          : name.includes("score") ||
            name.includes("ranking") ||
            name.includes("required") ||
            name.includes("fees")
          ? parseFloat(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const requiredGroups = [
      ["ielts_requirement", "ielts_na"],
      ["special_requirements", "special_requirements_na"],
      ["remarks", "remarks_na"],
    ];

    for (const [valueKey, naKey] of requiredGroups) {
      if (!formData[naKey] && !formData[valueKey]) {
        toast.error(`${valueKey.replace(/_/g, " ")} is required`);
        setLoading(false);
        return;
      }
    }

    try {
      const response = await fetch("/api/admin/programs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (!result.success) {
        toast.error(result.error || "Failed to create program.", {
          position: "top-center",
          richColors: true,
        });
        return;
      }

      router.push("/admin/programs");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const basicInfoFields = [
    { label: "University", name: "university" },
    { label: "Course Name", name: "course_name" },

    {
      label: "IELTS Requirement",
      name: "ielts_requirement",
      naKey: "ielts_na",
      textarea: true,
    },
    {
      label: "Special Requirements",
      name: "special_requirements",
      naKey: "special_requirements_na",
      textarea: true,
    },
    {
      label: "Remarks",
      name: "remarks",
      naKey: "remarks_na",
      textarea: true,
    },
  ];

  const handleNACheck = (naKey: string, checked: boolean) => {
    const valueKey = basicInfoFields.find((f) => f.naKey === naKey)?.name;

    if (!valueKey) return;

    console.log(valueKey);

    setFormData((prev) => ({
      ...prev,
      [naKey]: checked,
      [valueKey]: checked ? "Not Applicable" : "",
    }));
  };

  const renderFields = (fields: any[]) =>
    fields.map((field) => {
      const isNA = field.naKey ? formData[field.naKey] : false;

      return (
        <div key={field.name} className="flex flex-col space-y-1 relative">
          {/* <div className="flex justify-between items-center mb-1">
            <label className="font-medium text-gray-700">{field.label}</label>

            {field.naKey && (
              <label className="flex items-center space-x-1 text-sm">
                <input
                  type="checkbox"
                  checked={isNA}
                  onChange={(e) => handleNACheck(field.naKey, e.target.checked)}
                />
                <span>Not Applicable</span>
              </label>
            )}
          </div> */}

          <FormInput
            key={field.name}
            naKey={field.naKey || ""}
            isNA={isNA}
            onNAChange={handleNACheck}
            label={field.label}
            name={field.name}
            type={field.type}
            value={formData?.[field.name]}
            onChange={handleInputChange}
            required={!isNA}
            textarea={field.textarea}
            placeholder={field.placeholder}
            disabled={isNA}
          />
        </div>
      );
    });

  const handlePrevStudyChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      previous_or_current_study: val,
    }));
  };

  const handleDegreeGoingChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      degree_going_for: val,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Breadcrumbs />
          <h1 className="text-3xl font-bold text-[#3a3886]">Add New Program</h1>
          <p className="mt-2 text-gray-600">
            Enter the details for the new university program
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderFields(basicInfoFields.slice(0, 2))}

              <SearchSelect
                label="Previous / Current Study"
                name="previous_or_current_study"
                width="full"
                value={formData.previous_or_current_study || ""}
                options={getPreviousStudyOptions()}
                onChange={handlePrevStudyChange}
              />

              <SearchSelect
                label="Degree Going For"
                name="degree_going_for"
                width="full"
                value={formData.degree_going_for || ""}
                options={getDegreeGoingForOptions()}
                onChange={handleDegreeGoingChange}
              />

              {renderFields(basicInfoFields.slice(2))}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Link
              href="/admin/programs"
              className="inline-flex items-center px-4 py-2.5 bg-[#F97316] text-white rounded-lg hover:bg-[#ea6a0f] transition-all duration-200 shadow-sm hover:shadow-md font-medium"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2.5 bg-[#3a3886] text-white rounded-lg hover:bg-[#2d2b6b] transition-all duration-200 shadow-sm hover:shadow-md font-medium"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <SaveIcon className="h-4 w-4 mr-2" />
              )}
              {loading ? "Creating..." : "Create Program"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
