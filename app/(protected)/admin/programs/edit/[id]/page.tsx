"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Breadcrumbs from "@/components/ui/breadCrumbs";
import FormInput from "@/components/form/formInput";
import SearchSelect from "@/components/form/FormSearchSelect";
import { ProgramFormData } from "@/lib/types";
import { toast } from "sonner";
import { useFetch } from "@/hooks/api/useFetch";
import { SaveIcon } from "lucide-react";

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

  const previousStudyOptions =
    previousCurrentStudy?.data?.map((item: any) => ({
      value: item.name,
      label: item.name,
    })) ?? [];

  const degreeGoingForOptions =
    degreeGoingFor?.data?.map((item: any) => ({
      value: item.name,
      label: item.name,
    })) ?? [];

  // fetch single program
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
        toast.error("Failed to fetch program data");
      } finally {
        setLoading(false);
      }
    };

    fetchProgram();
  }, [id]);

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    handleChange(name, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/admin/programs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (!result.success) {
        toast.error(result.error || "Failed to update program");
        return;
      }

      toast.success("Program updated successfully!");
      router.push(`/admin/programs`);
    } catch (err: any) {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading program...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
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

              <FormInput
                label="University"
                name="university"
                value={formData.university}
                onChange={handleInputChange}
                placeholder="Ex: University of Sydney"
              />

              <FormInput
                label="Course Name"
                name="course_name"
                value={formData.course_name}
                onChange={handleInputChange}
              />

              <SearchSelect
                label="Previous / Current Study"
                name="previous_or_current_study"
                value={formData.previous_or_current_study}
                onChange={(value) =>
                  handleChange("previous_or_current_study", value)
                }
                options={previousStudyOptions}
              />

              <SearchSelect
                label="Degree Going For"
                name="degree_going_for"
                value={formData.degree_going_for}
                onChange={(value) =>
                  handleChange("degree_going_for", value)
                }
                options={degreeGoingForOptions}
              />

              <FormInput
                label="IELTS Requirement"
                name="ielts_requirement"
                value={formData.ielts_requirement}
                textarea
                onChange={handleInputChange}
              />

              <FormInput
                label="Special Requirements"
                name="special_requirements"
                value={formData.special_requirements}
                textarea
                onChange={handleInputChange}
              />

              <FormInput
                label="Remarks"
                name="remarks"
                value={formData.remarks}
                textarea
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Link
              href={`/admin/programs`}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
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
