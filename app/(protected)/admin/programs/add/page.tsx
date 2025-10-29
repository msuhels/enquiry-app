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
  });

  const { data: degreeGoingFor } = useFetch("/api/admin/degree-going-for");
  const { data: previousCurrentStudy } = useFetch("/api/admin/previous-or-current-study");

  console.log("degreeGoingFor 🚀🚀", degreeGoingFor);
  console.log("previousCurrentStudy 🚀🚀", previousCurrentStudy);

  // Transform API data to select options format
  const getPreviousStudyOptions = () => {
    const data = previousCurrentStudy?.data || previousCurrentStudy?.success && previousCurrentStudy?.data;
    if (!data || !Array.isArray(data)) return [];
    
    return data.map((item: any) => ({
      value: item.id,
      label: item.name
    }));
  };

  const getDegreeGoingForOptions = () => {
    const data = degreeGoingFor?.data || degreeGoingFor?.success && degreeGoingFor?.data;
    if (!data || !Array.isArray(data)) return [];
    
    return data.map((item: any) => ({
      value: item.id,
      label: item.name
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

    console.log("formData 🚀🚀🚀", formData);

    setLoading(true);

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
      label: "Previous / Current Study",
      name: "previous_or_current_study",
      select: getPreviousStudyOptions(),
      disabled: !previousCurrentStudy || getPreviousStudyOptions().length === 0
    },
    {
      label: "Degree Going For",
      name: "degree_going_for",
      select: getDegreeGoingForOptions(),
      disabled: !degreeGoingFor || getDegreeGoingForOptions().length === 0
    },
    { label: "IELTS Requirement", name: "ielts_requirement", textarea: true },
    {
      label: "Special Requirements",
      name: "special_requirements",
      textarea: true,
    },
    { label: "Remarks", name: "remarks", textarea: true },
  ];

  const renderFields = (fields: any[]) =>
    fields.map((field) => {
      return (
        <div key={field.name} className="flex flex-col space-y-1 relative">
          <div className="flex justify-between items-center mb-1">
            <label className="font-medium text-gray-700">{field.label}</label>
            {field.disabled && (
              <span className="text-xs text-gray-400">Loading...</span>
            )}
          </div>

          <FormInput
            key={field.name}
            label=""
            name={field.name}
            type={field.type}
            value={formData[field.name]}
            onChange={handleInputChange}
            required={field.required}
            select={field.select}
            step={field.step}
            min={field.min}
            max={field.max}
            textarea={field.textarea}
            placeholder={field.placeholder}
            disabled={field.disabled}
          />
        </div>
      );
    });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Breadcrumbs />
          <h1 className="text-3xl font-bold text-gray-900">Add New Program</h1>
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
              {renderFields(basicInfoFields)}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Link
              href="/admin"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
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

