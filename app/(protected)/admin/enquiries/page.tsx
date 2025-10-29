"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Breadcrumbs from "@/components/ui/breadCrumbs";
import { useFetch } from "@/hooks/api/useFetch";
import SearchSelect from "@/components/form/FormSearchSelect";
import { toast } from "sonner";

export default function EnquiriesPage() {
  const router = useRouter();

  const [previousOrCurrentStudy, setPreviousOrCurrentStudy] = useState("");
  const [previousOrCurrentStudyOptions, setPreviousOrCurrentStudyOptions] =
    useState([]);

  const [degreeGoingFor, setDegreeGoingFor] = useState("");
  const [degreeGoingForOptions, setDegreeGoingForOptions] = useState([]);

  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    data: previousOrCurrentStudyData,
    isLoading: previousOrCurrentStudyLoading,
  } = useFetch(`/api/admin/previous-or-current-study`);

  const { data: degreeGoingForData, isLoading: degreeGoingForLoading } =
    useFetch(`/api/admin/degree-going-for`);

  useEffect(() => {
    if (previousOrCurrentStudyData?.success) {
      const options = previousOrCurrentStudyData?.data.map(
        (option: { id: string; name: string }) => ({
          value: option.id,
          label: option.name,
        })
      );
      setPreviousOrCurrentStudyOptions(options);
    }
  }, [previousOrCurrentStudyData]);

  useEffect(() => {
    if (degreeGoingForData?.success) {
      const options = degreeGoingForData?.data.map(
        (option: { id: string; name: string }) => ({
          value: option.id,
          label: option.name,
        })
      );
      setDegreeGoingForOptions(options);
    }
  }, [degreeGoingForData]);

  const handleFindPrograms = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (previousOrCurrentStudy) {
        params.append("previous_or_current_study", previousOrCurrentStudy);
      }
      if (degreeGoingFor) {
        params.append("degree_going_for", degreeGoingFor);
      }

      const response = await fetch(
        `/api/admin/programs/suggestions?${params.toString()}`
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      setPrograms(result.data);
      toast.success("Programs fetched successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch programs");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Breadcrumbs />
        </div>

        {/* Filters */}
        <div className="flex items-end justify-start gap-6 mb-4">
          <SearchSelect
            label="Previous/Current Study"
            name="previous_or_current_study"
            value={previousOrCurrentStudy}
            onChange={setPreviousOrCurrentStudy}
            options={previousOrCurrentStudyOptions}
          />

          <SearchSelect
            label="Degree Going For"
            name="degree_going_for"
            value={degreeGoingFor}
            onChange={setDegreeGoingFor}
            options={degreeGoingForOptions}
          />

          <button
            onClick={handleFindPrograms}
            className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded disabled:"
            disabled={loading || !previousOrCurrentStudy || !degreeGoingFor}
          >
            {loading ? "Loading..." : "Find Programs"}
          </button>
        </div>

        {/* Result */}
        <div className="mt-6">
          {programs.length > 0 ? (
            <ProgramsTable data={programs} />
          ) : (
            previousOrCurrentStudy &&
            degreeGoingFor && (
              <p className="text-gray-500">No programs found.</p>
            )
          )}
        </div>
      </div>
    </div>
  );
}
const ProgramsTable = ({ data }: any) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                University
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Course Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Previous Study
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Degree Going For
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                IELTS Requirement
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Special Requirements
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Remarks
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item: any) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.university || "-"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {item.course_name || "-"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {item.previous_or_current_study?.name || "-"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {item.degree_going_for?.name || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.duration || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.ielts_requirement || "-"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {item.special_requirements || "-"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {item.remarks || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
