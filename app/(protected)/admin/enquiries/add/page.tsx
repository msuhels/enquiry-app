"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Breadcrumbs from "@/components/ui/breadCrumbs";
import { useFetch } from "@/hooks/api/useFetch";
import SearchSelect from "@/components/form/FormSearchSelect";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { usePost } from "@/hooks/api/usePost";
import { Download, Funnel, Search } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Program } from "@/lib/types";
import { useUserStore } from "@/lib/stores/auth-module";

export default function EnquirySystem() {
  const router = useRouter();

  const [previousOrCurrentStudy, setPreviousOrCurrentStudy] = useState("");
  const [previousOrCurrentStudyOptions, setPreviousOrCurrentStudyOptions] =
    useState([]);
  const { ip } = useUserStore();
  const [degreeGoingFor, setDegreeGoingFor] = useState("");
  const [degreeGoingForOptions, setDegreeGoingForOptions] = useState([]);
  const [enquiry, setEnquiry] = useState<{ id?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [programs, setPrograms] = useState([]);

  const {data: filterSettings} = useFetch("/api/admin/settings");

  const isFilterEnabled = (key: String)=> {
    return filterSettings?.data?.[key] !== true;
  }


  // IELTS Score options - add more values as needed
  const ieltsScoreOptions = [
    { value: "A1 Level", label: "A1 Level" },
    { value: "A2 Level", label: "A2 Level" },
    { value: "B1 Level", label: "B1 Level" },
    { value: "B2 Level", label: "B2 Level" },
    { value: "C1 Level", label: "C1 Level" },
    { value: "C2 Level", label: "C2 Level" },
  ];

  // Degree Duration options (1-10 years)
  const degreeDurationOptions = [
    { value: "", label: "Select Duration" },
    { value: "1", label: "1 Year" },
    { value: "2", label: "2 Years" },
    { value: "3", label: "3 Years" },
    { value: "4", label: "4 Years" },
    { value: "5", label: "5 Years" },
    { value: "6", label: "6 Years" },
    { value: "7", label: "7 Years" },
    { value: "8", label: "8 Years" },
    { value: "9", label: "9 Years" },
    { value: "10", label: "10 Years" },
  ];

  // Minimum Percentage options
  const minimumPercentageOptions = [
    { value: "", label: "Select Percentage" },
    { value: "100", label: "100%" },
    { value: "95", label: "95%" },
    { value: "90", label: "90%" },
    { value: "85", label: "85%" },
    { value: "80", label: "80%" },
    { value: "75", label: "75%" },
    { value: "70", label: "70%" },
    { value: "65", label: "65%" },
    { value: "60", label: "60%" },
    { value: "55", label: "55%" },
    { value: "50", label: "50%" },
    { value: "45", label: "45%" },
    { value: "40", label: "40%" },
    { value: "35", label: "35%" },
    { value: "30", label: "30%" },
  ];


  const [showAdvanceFilter, setShowAdvanceFilter] = useState(false);
  const [advanceFilters, setAdvanceFilters] = useState({
    required_band: "",
    degreeDuration: "",
    minimumPercentage: "",
    english_proficiency_type: "",
    prev_degree_required: "",
    others_exams: ""
  });

  const englishProficiencyOptions = [
    { value: "", label: "Select English Proficiency" },
    { value: "MOI", label: "MOI" },
    { value: "IELTS", label: "IELTS" },
  ];

  const prevDegreeRequiredOptions = [
    {value : "3 years", label : "3 Years"},
    { value: "3 Years Hons", label: "3 Years Hons" },
    { value: "4 Years", label: "4 Years" },
    { value: "12 Years Studies", label: "12 Years Studies" },
  ]

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

  // Only clear programs when both search fields are cleared (not during partial changes)
  useEffect(() => {
    if (!previousOrCurrentStudy && !degreeGoingFor && hasSearched) {
      setHasSearched(false);
      setPrograms([]);
    }
  }, [previousOrCurrentStudy, degreeGoingFor, hasSearched]);

  const handleFindPrograms = async () => {
    // Validate user data before proceeding
    if (!user?.userDetails?.id) {
      toast.error("User not authenticated. Please refresh the page.");
      return;
    }

    try {
      setLoading(true);
      setHasSearched(false);
      setPrograms([]);

      const enquiryResponse = await post("/api/admin/enquiries", {
        previous_or_current_study: previousOrCurrentStudy,
        degree_going_for: degreeGoingFor,
        userId: user.userDetails.id,
      });

      if (enquiryResponse?.data?.id) {
        setEnquiry(enquiryResponse.data);
        try {
          await post("/api/admin/record-login", {
            event_type: "enquiry_created",
            user_id: user.userDetails.id,
            enquiry_id: enquiryResponse.data.id,
            ip: ip || ""
          });
        } catch (e) {
          console.error("Failed to log enquiry creation:", e);
        }
      }
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
      if (!result.data || !Array.isArray(result.data)) {
        throw new Error("Invalid response: programs data not found");
      }

      // Apply client-side filtering for advance filters
      let filteredPrograms = result.data;
      if (advanceFilters.required_band) {
        filteredPrograms = filteredPrograms.filter((p: Program) =>
          p.required_band && parseFloat(p.required_band) <= parseFloat(advanceFilters.required_band)
        );
      }
      if (advanceFilters.degreeDuration) {
        filteredPrograms = filteredPrograms.filter((p: Program) =>
          p.degree_duration && parseFloat(p.degree_duration) <= parseFloat(advanceFilters.degreeDuration)
        );
      }
      if (advanceFilters.minimumPercentage) {
        filteredPrograms = filteredPrograms.filter((p: Program) =>
          p.minimum_percentage && parseFloat(p.minimum_percentage) <= parseFloat(advanceFilters.minimumPercentage)
        );
      }

      if (advanceFilters.english_proficiency_type) {
        filteredPrograms = filteredPrograms.filter((p: Program) =>
          p.english_proficiency_type && p.english_proficiency_type === advanceFilters.english_proficiency_type
        );
      }

      if (advanceFilters.prev_degree_required) {
  filteredPrograms = filteredPrograms.filter((p: Program) =>
    p.prev_degree_required && 
    p.prev_degree_required.toLowerCase().includes(advanceFilters.prev_degree_required.toLowerCase())
  );
} 

      // Filter by others_exams when Bachelor degree is selected
      if (advanceFilters.others_exams && degreeGoingFor === "Bachelor") {
        filteredPrograms = filteredPrograms.filter((p: Program) =>
          p.others_exams && p.others_exams === advanceFilters.others_exams
        );
      }

      setPrograms(filteredPrograms);
      setHasSearched(true);
      toast.success("Programs fetched successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch programs");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPrograms = async () => {
    // Validate user data before proceeding
    if (!user?.userDetails?.id) {
      toast.error("User not authenticated. Please refresh the page.");
      return;
    }

    try {
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
      if (!result.data || !Array.isArray(result.data)) {
        throw new Error("Invalid response: programs data not found");
      }

      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.text("Program Data", 14, 20);

      doc.setFontSize(10);
      let yPos = 30;
      if (previousOrCurrentStudy) {
        doc.text(`Previous/Current Study: ${previousOrCurrentStudy}`, 14, yPos);
        yPos += 7;
      }
      if (degreeGoingFor) {
        doc.text(`Degree Going For: ${degreeGoingFor}`, 14, yPos);
        yPos += 10;
      }

      const tableData = result.data.map((program: Program) => [
        program.university || "",
        program.course_name || "",
        program.previous_or_current_study || "",
        program.degree_going_for || "",
        program.required_band || "",
        program.others_exams || "",
        program.ielts_requirement || "",
        program.degree_duration || "",
        program.english_proficiency_type || "",
        program.prev_degree_required || "",
        program.minimum_percentage || "",
        program.special_requirements || "",
      ]);

      autoTable(doc, {
        head: [
          [
            "University",
            "Program Name",
            "Previous / Current Study",
            "Degree Going For",
            "IELTS Requirment",
            "Others exams",
            "Degree Duration",
            "English Proficiency",
            "Required band",
            "Previous Degree Required",
            "Minimum Percentage",
            "Special Requirements",
          ],
        ],
        body: tableData,
        startY: yPos,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [66, 139, 202] },
        margin: { top: 10 },
      });

      doc.save(`programs-${new Date().toISOString()}.pdf`);

      try {
        await post("/api/admin/record-login", {
          event_type: "program_download",
          enquiry_id: enquiry?.id || "",
          user_id: user.userDetails.id,
          ip: ip || ""
        });
      } catch (e) {
        console.error("Failed to log program download:", e);
      }

      toast.success("Programs downloaded successfully!");
    } catch (error: any) {
      console.error("Download error:", error);
      toast.error(error.message || "Failed to download programs");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <div className="max-w-full mx-auto p-6 md:p-8">
        <Breadcrumbs />
        <div className="w-full flex items-center mb-5 justify-center">
          <span className="text-5xl pt-10 font-bold text-[#3a3886]">
            “Trusted by the Wise. Chosen by the Best”
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
                label="Degree Going For"
                name="degree_going_for"
                width="90%"
                value={degreeGoingFor}
                allowCreate={false}
                onChange={setDegreeGoingFor}
                options={degreeGoingForOptions}
              />

              <SearchSelect
                label="Previous/Current Study"
                name="previous_or_current_study"
                width="90%"
                value={previousOrCurrentStudy}
                allowCreate={false}
                onChange={setPreviousOrCurrentStudy}
                options={previousOrCurrentStudyOptions}
              />

              <button
                onClick={handleFindPrograms}
                className="bg-gradient-to-r from-[#F97316] to-[#ea6a0f] text-white hover:from-[#ea6a0f] hover:to-[#d85e0a] px-6 py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                disabled={loading || !previousOrCurrentStudy || !degreeGoingFor}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Find
                  </>
                )}
              </button>

              <button
                onClick={() => setShowAdvanceFilter(!showAdvanceFilter)}
                className={`flex items-center gap-2 w-[400px] px-6 py-3 rounded-lg shadow-md transition-all duration-200 ${showAdvanceFilter
                  ? "bg-[#3a3886] text-white"
                  : "bg-[#F97316] text-white hover:bg-[#ea6a0f]"
                  }`}
              >
                <Funnel className="w-4 h-4" />
                <span>Advance Filter</span>
              </button>
            </div>



            <div className="flex flex-col items-end gap-3">

              {showAdvanceFilter && (<>
                <button
                  onClick={() => {
                    setAdvanceFilters({
                      required_band: "",
                      degreeDuration: "",
                      minimumPercentage: "",
                      english_proficiency_type: "",
                      prev_degree_required: "",
                      others_exams: ""
                    });
                  }}
                  className="px-9 py-2 h-[38px] mt-auto text-white bg-[#F97316] rounded-lg hover:bg-[#ea6a0f] transition-all duration-200 text-sm font-medium"
                >
                  Clear
                </button>
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 p-4 bg-white animate-in fade-in slide-in-from-top-2 duration-200">
                  

                  {isFilterEnabled("minimum_percentage") && (
                  <SearchSelect
                    label="Minimum Percentage"
                    name="minimumPercentage"
                    value={advanceFilters.minimumPercentage}
                    allowCreate={false}
                    onChange={(value: string) => setAdvanceFilters({ ...advanceFilters, minimumPercentage: value })}
                    options={minimumPercentageOptions}
                  /> )}

                  {isFilterEnabled("english_profficiency") && (
                    <SearchSelect
                    label="English Proficiency"
                    name="english_proficiency_type"
                    value={advanceFilters.english_proficiency_type}
                    allowCreate={false}
                    onChange={(value: string) => setAdvanceFilters({
                      ...advanceFilters,
                      english_proficiency_type: value,
                      required_band: value === "MOI" ? "" : advanceFilters.required_band
                    })}
                    options={englishProficiencyOptions}
                  />
                  )}
                  

                  {advanceFilters.english_proficiency_type === "IELTS" && isFilterEnabled("required_band") && (
                    <SearchSelect
                      label="Required Band"
                      name="required_band"
                      value={advanceFilters.required_band}
                      allowCreate={false}
                      onChange={(value: string) => setAdvanceFilters({ ...advanceFilters, required_band: value })}
                      options={ieltsScoreOptions}
                    />
                  )}

                  {isFilterEnabled("prev_degree_duration") && (
                    <SearchSelect
                    label="Previous Degree Duration Required"
                    name="prev_degree_required"
                    value={advanceFilters.prev_degree_required}
                    allowCreate={false}
                    onChange={(value: string) => setAdvanceFilters({ ...advanceFilters, prev_degree_required: value })}
                    options={prevDegreeRequiredOptions}
                  />
                  )}
                  
                  {degreeGoingFor === "Bachelor" && isFilterEnabled("others_exams") && (
                    <SearchSelect
                      label="Others Exams"
                      name="others_exams"
                      value={advanceFilters.others_exams}
                      allowCreate={false}
                      onChange={(value: string) => setAdvanceFilters({ ...advanceFilters, others_exams: value })}
                      options={[
                        { value: "", label: "Select Exam" },
                        { value: "PTE", label: "PTE" },
                        { value: "Duolingo", label: "Duolingo" },
                      ]}
                    />
                  )}
                 
                  

                </div>
              </>)}
            </div>
            <div className="bg-[#F97316]/5 border-l-4 border-[#F97316] rounded-lg p-4">
              <p className="text-[#F97316] font-semibold text-xl">
                <span className="font-bold">*Note:</span> This course finder is
                for counselling purposes only. Final course options will be
                provided by our subject matter experts after a detailed analysis
                of your profile.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="mt-6 w-full">
          {programs.length > 0 ? (
            <div>
              <div className="w-full flex items-center justify-end">
                <button
                  onClick={handleDownloadPrograms}
                  className="bg-gradient-to-r from-[#F97316] to-[#ea6a0f] text-xl text-white hover:from-[#ea6a0f] hover:to-[#d85e0a] px-6 py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  disabled={
                    loading || !previousOrCurrentStudy || !degreeGoingFor
                  }
                >
                  <span>
                    <Download className="w-5 h-5" />
                  </span>
                  <span>download</span>
                </button>
              </div>
              <ProgramsTable data={programs} />
            </div>
          ) : hasSearched && !loading ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-600 text-2xl font-medium">
                No programs found.
              </p>
              <p className="text-gray-400 text-xl mt-2">
                Try adjusting your search criteria
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

const ProgramsTable = ({ data }: any) => {
  return (
    <div className="bg-white w-full rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-[#3a3886] to-[#2d2b6b]">
            <tr>
              {[
                "University",
                "Course Name",
                "Previous Study",
                "Degree Going For",
                "English Proficiency",
                "Required Band",
                "Previous Degree Required",
                "Special Requirements",
                "Remarks",
                "degree duration",
                "minimum %",
                "Other Exams"
              ].map((head) => (
                <th
                  key={head}
                  className="px-6 py-4 text-left text-xl font-semibold text-white uppercase tracking-wider"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-100">
            {data.map((item: any) => (
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
                <td className="px-6 py-4 text-xl text-gray-700">
                  {item.english_proficiency_type || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xl font-medium text-[#F97316]">
                  {item.required_band || "-"}
                </td>
                <td className="px-6 py-4 text-xl text-gray-700">
                  {item.prev_degree_required || "-"}
                </td>
                <td className="px-6 py-4 text-xl text-gray-700">
                  {item.special_requirements || "-"}
                </td>
                <td className="px-6 py-4 text-xl text-gray-700">
                  {item.remarks || "-"}
                </td>
                <td className="px-6 py-4 text-xl text-gray-700">
                  {item.degree_duration || "-"}
                </td>
                <td className="px-6 py-4 text-xl text-gray-700">
                  {item.minimum_percentage || "-"}
                </td>
                <td className="px-6 py-4 text-xl text-gray-700">
                  {item.others_exams || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};