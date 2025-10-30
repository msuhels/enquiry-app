"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Breadcrumbs from "@/components/ui/breadCrumbs";
import { useFetch } from "@/hooks/api/useFetch";
import SearchSelect from "@/components/form/FormSearchSelect";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { usePost } from "@/hooks/api/usePost";

export default function EnquirySystem() {
  const router = useRouter();

  const [previousOrCurrentStudy, setPreviousOrCurrentStudy] = useState("");
  const [previousOrCurrentStudyOptions, setPreviousOrCurrentStudyOptions] =
    useState([]);

  const [degreeGoingFor, setDegreeGoingFor] = useState("");
  const [degreeGoingForOptions, setDegreeGoingForOptions] = useState([]);

  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [programs, setPrograms] = useState([]);

  const isCentered = !hasSearched;

  const { data: previousOrCurrentStudyData } = useFetch(
    `/api/admin/previous-or-current-study`
  );
  const { data: user } = useFetch(`/api/admin/users/getAuthUser`);
  const { post } = usePost();

  const { data: degreeGoingForData } = useFetch(`/api/admin/degree-going-for`);

  useEffect(() => {
    if (previousOrCurrentStudyData?.success) {
      const options = previousOrCurrentStudyData?.data.map(
        (option: { id: string; name: string }) => ({
          value: option.name,
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
          value: option.name,
          label: option.name,
        })
      );
      setDegreeGoingForOptions(options);
    }
  }, [degreeGoingForData]);

  useEffect(() => {
    if (!previousOrCurrentStudy || !degreeGoingFor) {
      setHasSearched(false);
      setPrograms([]);
    }
  }, [previousOrCurrentStudy, degreeGoingFor]);

  const handleFindPrograms = async () => {
    try {
      setLoading(true);
      setHasSearched(false);

      await post("/api/admin/enquiries", {
        previous_or_current_study: previousOrCurrentStudy,
        degree_going_for: degreeGoingFor,
        userId: user.userDetails.id,
      });
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
      setHasSearched(true);
      toast.success("Programs fetched successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch programs");
    } finally {
      setLoading(false);
    }
  };

  // const isCentered =
  //   programs.length === 0 && (!previousOrCurrentStudy || !degreeGoingFor);

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 pt-4">
          <Breadcrumbs />
        </div>

        <motion.div
          animate={{
            y: isCentered ? "40vh" : 0,
          }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          <div className="flex items-end justify-center gap-6 mb-4">
            <SearchSelect
              label="Previous/Current Study"
              name="previous_or_current_study"
              value={previousOrCurrentStudy}
              allowCreate={false}
              onChange={setPreviousOrCurrentStudy}
              options={previousOrCurrentStudyOptions}
            />

            <SearchSelect
              label="Degree Going For"
              name="degree_going_for"
              value={degreeGoingFor}
              allowCreate={false}
              onChange={setDegreeGoingFor}
              options={degreeGoingForOptions}
            />

            <button
              onClick={handleFindPrograms}
              className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded"
              disabled={loading || !previousOrCurrentStudy || !degreeGoingFor}
            >
              {loading ? "Loading..." : "Find"}
            </button>
          </div>
          <div>
            <p className="text-orange-700 font-bold">
              *This course finder is for counselling purposes only. Final course
              options will be provided by our subject matter experts after a
              detailed analysis of your profile*
            </p>
          </div>
        </motion.div>

        {/* Result */}
        <div className="mt-6 w-full">
          {programs.length > 0 ? (
            <ProgramsTable data={programs} />
          ) : hasSearched && !loading ? (
            <p className="text-gray-500 text-center">No programs found.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

const ProgramsTable = ({ data }: any) => {
  return (
    <div className="bg-white w-full rounded-lg shadow overflow-hidden">
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
              {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th> */}
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
                  {item.previous_or_current_study || "-"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {item.degree_going_for || "-"}
                </td>
                {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.duration || "-"}
                </td> */}
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
