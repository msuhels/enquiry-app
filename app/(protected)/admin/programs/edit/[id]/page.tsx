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
    ielts_na: false,
    special_requirements_na: false,
    remarks_na: false,
  });


  const { data: degreeGoingFor } = useFetch("/api/admin/degree-going-for");
  const { data: previousCurrentStudy } = useFetch(
    "/api/admin/previous-or-current-study"
  );

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

  // Field definitions
  const specialFields = [
    {
      label: "IELTS Requirement",
      name: "ielts_requirement",
      naKey: "ielts_na",
    },
    {
      label: "Special Requirements",
      name: "special_requirements",
      naKey: "special_requirements_na",
    },
    {
      label: "Remarks",
      name: "remarks",
      naKey: "remarks_na",
    },
  ];

  // fetch program
  useEffect(() => {
    if (!id) return;

    const fetchProgram = async () => {
      try {
        const res = await fetch(`/api/admin/programs/${id}`);
        const data = await res.json();

        if (data.success) {
          const mapped = {
            ...data.data,
            ielts_na: data.data.ielts_requirement === "Not Applicable",
            special_requirements_na:
              data.data.special_requirements === "Not Applicable",
            remarks_na: data.data.remarks === "Not Applicable",
          };
          setFormData(mapped);
        }
      } catch {
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

  // ✅ NA checkbox toggle logic
  const handleNACheck = (naKey: string, checked: boolean) => {
    const field = specialFields.find((f) => f.naKey === naKey);
    if (!field) return;

    const valueKey = field.name;

    setFormData((prev) => ({
      ...prev,
      [naKey]: checked,
      [valueKey]: checked ? "Not Applicable" : "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // ✅ Validation: user must fill or NA must be checked
    for (const field of specialFields) {
      if (
        !formData[field.naKey] &&
        (!formData[field.name] || formData[field.name].trim() === "")
      ) {
        toast.error(`${field.label} is required`);
        setSaving(false);
        return;
      }
    }

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
    } catch {
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
                onChange={(value) => handleChange("degree_going_for", value)}
                options={degreeGoingForOptions}
              />

              {specialFields.map((field) => {
                const isNA = formData[field.naKey];

                return (
                  <div key={field.name} className="flex flex-col space-y-1">
                    <div className="flex justify-between items-center mb-1">
                      <label className="font-medium text-gray-700">
                        {field.label}
                      </label>

                      <label className="flex items-center space-x-1 text-sm">
                        <input
                          type="checkbox"
                          checked={isNA}
                          onChange={(e) =>
                            handleNACheck(field.naKey, e.target.checked)
                          }
                        />
                        <span>Not Applicable</span>
                      </label>
                    </div>

                    <FormInput
                      name={field.name}
                      value={formData[field.name] || ""}
                      textarea
                      onChange={handleInputChange}
                      disabled={isNA}
                      required={!isNA}
                    />
                  </div>
                );
              })}
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
