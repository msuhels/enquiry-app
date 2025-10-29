"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { SaveIcon } from "lucide-react";
import Link from "next/link";
import Breadcrumbs from "@/components/ui/breadCrumbs";
import FormInput from "@/components/form/formInput";
import { ProgramFormData } from "@/lib/types";
import { toast } from "sonner";
import { useFetch } from "@/hooks/api/useFetch";

export default function EditProgramPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  const getPreviousStudyOptions = () => {
    const data = previousCurrentStudy?.data || (previousCurrentStudy?.success && previousCurrentStudy?.data);
    if (!data || !Array.isArray(data)) return [];
    
    return data.map((item: any) => ({
      value: item.id,
      label: item.name
    }));
  };

  const getDegreeGoingForOptions = () => {
    const data = degreeGoingFor?.data || (degreeGoingFor?.success && degreeGoingFor?.data);
    if (!data || !Array.isArray(data)) return [];
    
    return data.map((item: any) => ({
      value: item.id,
      label: item.name
    }));
  };

  useEffect(() => {
    if (!id) return;
    const fetchProgram = async () => {
      try {
        const res = await fetch(`/api/admin/programs/${id}`);
        const data = await res.json();
        if (data.success) {
          setFormData(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch program:", err);
        toast.error("Failed to fetch program data");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    console.log("formData 🚀🚀", formData)

    try {
      const response = await fetch(`/api/admin/programs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (!result.success) {
        toast.error(result.error || "Failed to update program.", {
          position: "top-center",
          richColors: true,
        });
        return;
      }

      toast.success("Program updated successfully!", {
        position: "top-center",
        richColors: true,
      });
      router.push(`/admin/programs`);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading program data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Breadcrumbs disabledItemIndex={2} />
          <h1 className="text-3xl font-bold text-gray-900">Edit Program</h1>
          <p className="mt-2 text-gray-600">
            Update the details for this university program
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
              href={`/admin/programs`}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
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
