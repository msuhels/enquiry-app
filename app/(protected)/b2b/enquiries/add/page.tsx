"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Breadcrumbs from "@/components/ui/breadCrumbs";
import { useFetch } from "@/hooks/api/useFetch";
import SearchSelect from "@/components/form/FormSearchSelect";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { usePost } from "@/hooks/api/usePost";
import { Search } from "lucide-react";

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
  const { data: settings, mutate } = useFetch("/api/admin/settings");
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
      setPrograms([]);

      await mutate();
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

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <div className="max-w-full mx-auto p-6 md:p-8">
        <Breadcrumbs />
        <div className="w-full flex items-center mb-5 justify-center">
          <span className="text-4xl pt-10 font-bold text-[#3a3886]">
            Trusted by the Wise. Chosen by the Best.
          </span>
        </div>

        <motion.div
          animate={{
            y: isCentered ? "20vh" : 0,
          }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="flex items-end justify-center gap-6 mb-6">
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
                className="bg-gradient-to-r from-[#F97316] to-[#ea6a0f] text-xl text-white hover:from-[#ea6a0f] hover:to-[#d85e0a] px-6 py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                disabled={loading || !previousOrCurrentStudy || !degreeGoingFor}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Search className="w-6 h-6" />
                    Find
                  </>
                )}
              </button>
            </div>

            <div className="bg-[#F97316]/5 border-l-4 border-[#F97316] rounded-lg p-4">
              <p className="text-[#F97316] font-semibold text-lg">
                <span className="font-bold">*Note:</span> This course finder is
                for counselling purposes only. Final course options will be
                provided by our subject matter experts after a detailed analysis
                of your profile.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Result */}
        <div className="mt-6 w-full">
          {programs.length > 0 ? (
            <ProgramsTable data={programs} settings={settings?.data} />
          ) : hasSearched && !loading ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-600 text-xl font-medium">
                No programs found.
              </p>
              <p className="text-gray-400 text-2xl mt-2">
                Try adjusting your search criteria
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

const ProgramsTable = ({ data, settings }: any) => {
  const showSpecialRequirements = settings?.is_special_requirements_enabled;
  const showRemarks = settings?.is_remarks_enabled;

  return (
    <div className="bg-white w-full rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-[#3a3886] to-[#2d2b6b]">
            <tr>
              <th className="px-6 py-4 text-left text-xl font-semibold text-white uppercase tracking-wider">
                University
              </th>
              <th className="px-6 py-4 text-left text-xl font-semibold text-white uppercase tracking-wider">
                Course Name
              </th>
              <th className="px-6 py-4 text-left text-xl font-semibold text-white uppercase tracking-wider">
                Previous Study
              </th>
              <th className="px-6 py-4 text-left text-xl font-semibold text-white uppercase tracking-wider">
                Degree Going For
              </th>

              <th className="px-6 py-4 text-left text-xl font-semibold text-white uppercase tracking-wider">
                IELTS Requirement
              </th>

              {showSpecialRequirements && (
                <th className="px-6 py-4 text-left text-xl font-semibold text-white uppercase tracking-wider">
                  Special Requirements
                </th>
              )}

              {showRemarks && (
                <th className="px-6 py-4 text-left text-xl font-semibold text-white uppercase tracking-wider">
                  Remarks
                </th>
              )}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-100">
            {data.map((item: any, index: number) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-xl font-medium text-[#3a3886]">
                  {item.university || "-"}
                </td>
                <td className="px-6 py-4 text-xl text-gray-900">
                  {item.course_name || "-"}
                </td>
                <td className="px-6 py-4 text-xl text-gray-700">
                  {item.previous_or_current_study || "-"}
                </td>
                <td className="px-6 py-4 text-xl text-gray-700">
                  {item.degree_going_for || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xl font-medium text-[#F97316]">
                  {item.ielts_requirement || "-"}
                </td>

                {showSpecialRequirements && (
                  <td className="px-6 py-4 text-xl text-gray-700">
                    {item.special_requirements || "-"}
                  </td>
                )}

                {showRemarks && (
                  <td className="px-6 py-4 text-xl text-gray-700">
                    {item.remarks || "-"}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
