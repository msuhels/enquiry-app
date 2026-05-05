"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, SaveIcon } from "lucide-react";
import Link from "next/link";
import { ProgramFormData } from "@/lib/types";
import Breadcrumbs from "@/components/ui/breadCrumbs";
import FormInput from "@/components/form/formInput";
import { toast } from "sonner";
import { useFetch } from "@/hooks/api/useFetch";
import SearchSelect from "@/components/form/FormSearchSelect";

export default function EditProgramPage() {
  const params = useParams();
  const id = params?.id as string;

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<ProgramFormData>({
    university: "",
    previous_or_current_study: "",
    degree_going_for: "",
    course_name: "",
    ielts_requirement: "",
    minimum_percentage: "",
    degree_duration: "",
    english_proficiency_type: "",
    minimum_ielts_score: "",
    special_requirements: "",
    remarks: "",
    ielts_na: false,
    special_requirements_na: false,
    remarks_na: false,
  });

  const { data: degreeGoingFor } = useFetch(
    "/api/admin/degree-going-for"
  );
  const { data: previousCurrentStudy } = useFetch(
    "/api/admin/previous-or-current-study"
  );

  const ieltsScoreOptions = [
    { value: "5.0", label: "5.0" },
    { value: "5.5", label: "5.5" },
    { value: "6.0", label: "6.0" },
    { value: "6.5", label: "6.5" },
    { value: "7.0", label: "7.0" },
    { value: "7.5", label: "7.5" },
    { value: "8.0", label: "8.0" },
  ];

  const degreeDurationOptions = [
    { value: "1 year", label: "1 year" },
    { value: "2 year", label: "2 year" },
    { value: "3 year", label: "3 year" },
    { value: "4 year", label: "4 year" },
    { value: "5 year", label: "5 year" },
    { value: "6 year", label: "6 year" },
    { value: "7 year", label: "7 year" },
    { value: "8 year", label: "8 year" },
    { value: "9 year", label: "9 year" },
    { value: "10 year", label: "10 year" },
  ];

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

  const getPreviousStudyOptions = () => {
    const data =
      previousCurrentStudy?.data ||
      (previousCurrentStudy?.success
        ? previousCurrentStudy?.data
        : []);

    if (!Array.isArray(data)) return [];

    return data.map((item: any) => ({
      value: item.name,
      label: item.name,
    }));
  };

  const getDegreeGoingForOptions = () => {
    const data =
      degreeGoingFor?.data ||
      (degreeGoingFor?.success
        ? degreeGoingFor?.data
        : []);

    if (!Array.isArray(data)) return [];

    return data.map((item: any) => ({
      value: item.name,
      label: item.name,
    }));
  };

  const fetchProgram = async () => {
    try {
      const response = await fetch(`/api/admin/programs/${id}`);
      const result = await response.json();

      if (!result.success) {
        toast.error("Failed to fetch program");
        return;
      }

      setFormData({
        ...result.data,
        minimum_ielts_score:
          result.data.minimum_ielts_score ||
          result.data.ielts_requirement ||
          "",
        ielts_na:
          result.data.ielts_requirement === "Not Applicable",
        special_requirements_na:
          result.data.special_requirements ===
          "Not Applicable",
        remarks_na:
          result.data.remarks === "Not Applicable",
      });
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProgram();
    }
  }, [id]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePrevStudyChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      previous_or_current_study: value,
    }));
  };

  const handleDegreeGoingChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      degree_going_for: value,
    }));
  };

  const handleProficiencyChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      english_proficiency_type: value,
      ...(value === "MOU" && {
        minimum_ielts_score: "",
        ielts_requirement: "Not Applicable",
        ielts_na: true,
      }),
      ...(value === "IELTS" && {
        minimum_ielts_score: "",
        ielts_requirement: "",
        ielts_na: false,
      }),
    }));
  };

  const handleNACheck = (
    naKey: string,
    checked: boolean
  ) => {
    const valueKey = basicInfoFields.find(
      (field) => field.naKey === naKey
    )?.name;

    if (!valueKey) return;

    setFormData((prev) => ({
      ...prev,
      [naKey]: checked,
      [valueKey]: checked
        ? "Not Applicable"
        : "",
    }));
  };

  const renderFields = (fields: any[]) =>
    fields.map((field) => {
      const isNA = field.naKey
        ? formData[field.naKey as keyof ProgramFormData]
        : false;

      return (
        <FormInput
          key={field.name}
          label={field.label}
          name={field.name}
          value={
            formData[
              field.name as keyof ProgramFormData
            ] as string
          }
          onChange={handleInputChange}
          required={!isNA}
          textarea={field.textarea}
          disabled={!!isNA}
          naKey={field.naKey}
          isNA={!!isNA}
          onNAChange={handleNACheck}
        />
      );
    });

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(
        `/api/admin/programs/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (!result.success) {
        toast.error(
          result.error ||
            "Failed to update program"
        );
        return;
      }

      toast.success(
        "Program updated successfully!"
      );
      router.push("/admin/programs");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-[#F97316]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Breadcrumbs />
          <h1 className="text-4xl font-bold text-[#3a3886]">
            Edit Program
          </h1>
          <p className="mt-2 text-xl text-gray-600">
            Update the details for this
            university program
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderFields(
                basicInfoFields.slice(0, 2)
              )}

              <SearchSelect
                label="Previous / Current Study"
                name="previous_or_current_study"
                width="full"
                value={
                  formData.previous_or_current_study
                }
                options={
                  getPreviousStudyOptions()
                }
                onChange={
                  handlePrevStudyChange
                }
              />

              <SearchSelect
                label="Degree Going For"
                name="degree_going_for"
                width="full"
                value={formData.degree_going_for}
                options={
                  getDegreeGoingForOptions()
                }
                onChange={
                  handleDegreeGoingChange
                }
              />

              <SearchSelect
                label="Degree Duration"
                name="degree_duration"
                width="full"
                value={formData.degree_duration}
                options={
                  degreeDurationOptions
                }
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    degree_duration: value,
                  }))
                }
              />

              <SearchSelect
                label="English Proficiency"
                name="english_proficiency_type"
                width="full"
                value={
                  formData.english_proficiency_type
                }
                options={[
                  {
                    value: "IELTS",
                    label: "IELTS",
                  },
                  {
                    value: "MOU",
                    label: "MOU",
                  },
                ]}
                onChange={
                  handleProficiencyChange
                }
              />

              {formData.english_proficiency_type ===
                "IELTS" && (
                <SearchSelect
                  label="Minimum IELTS Score"
                  name="minimum_ielts_score"
                  width="full"
                  value={
                    formData.minimum_ielts_score
                  }
                  options={
                    ieltsScoreOptions
                  }
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      minimum_ielts_score:
                        value,
                      ielts_requirement:
                        value,
                    }))
                  }
                />
              )}

              <FormInput
                label="Minimum Percentage Required"
                name="minimum_percentage"
                type="number"
                value={
                  formData.minimum_percentage
                }
                onChange={
                  handleInputChange
                }
                required
                placeholder="Enter minimum percentage"
              />

              {renderFields(
                basicInfoFields.slice(2)
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Link
              href="/admin/programs"
              className="inline-flex items-center px-4 py-2.5 text-xl bg-[#F97316] text-white rounded-lg hover:bg-[#ea6a0f] transition-all"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center px-4 py-2.5 text-xl bg-[#3a3886] text-white rounded-lg hover:bg-[#2d2b6b] disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <SaveIcon className="mr-2 h-4 w-4" />
              )}

              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}