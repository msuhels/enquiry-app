"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Breadcrumbs from "@/components/ui/breadCrumbs";
import { useFetch } from "@/hooks/api/useFetch";
import SearchSelect from "@/components/form/FormSearchSelect";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { usePost } from "@/hooks/api/usePost";
import { Download, Search } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Program } from "@/lib/types";
import { useUserStore } from "@/lib/stores/auth-module";

export default function EnquirySystem() {
  const router = useRouter();

  const [previousOrCurrentStudy, setPreviousOrCurrentStudy] = useState("");
  const [previousOrCurrentStudyOptions, setPreviousOrCurrentStudyOptions] =
    useState([]);

  const [degreeGoingFor, setDegreeGoingFor] = useState("");
  const [degreeGoingForOptions, setDegreeGoingForOptions] = useState([]);
  const [enquiry, setEnquiry] = useState({});
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [programs, setPrograms] = useState([]);
  const { ip } = useUserStore();

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
            ip
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

      setPrograms(result.data);
      setHasSearched(true);
      toast.success("Programs fetched successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch programs");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPrograms = async () => {
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

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();

      doc.setFillColor(58, 56, 134)
      doc.rect(0, 0, pageWidth, 40, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("Program Search Results", pageWidth / 2, 18, {
        align: "center",
      });

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text('"Trusted by the Wise. Chosen by the Best"', pageWidth / 2, 28, {
        align: "center",
      });

      let yPos = 45;
      const boxWidth = (pageWidth - 42) / 2;

      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(14, yPos, boxWidth, 20, 1, 1, "FD");

      doc.setTextColor(58, 56, 134);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("Previous/Current Study", 18, yPos + 6);

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(previousOrCurrentStudy || "-", 18, yPos + 14);

      doc.setDrawColor(200, 200, 200);
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(14 + boxWidth + 4, yPos, boxWidth, 20, 1, 1, "FD");

      doc.setTextColor(58, 56, 134);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("Degree Going For", 18 + boxWidth + 4, yPos + 6);

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(degreeGoingFor || "-", 18 + boxWidth + 4, yPos + 14);

      yPos = 70;

      doc.setDrawColor(249, 115, 22);
      doc.setLineWidth(0.5);
      doc.setFillColor(255, 247, 237);

      const noteText =
        "This course finder is for counselling purposes only. Final course options will be provided by our subject matter experts after a detailed analysis of your profile.";
      const splitNote = doc.splitTextToSize(noteText, pageWidth - 60);
      const textHeight = splitNote.length * 4;
      const boxHeight = textHeight + 8;

      doc.roundedRect(14, yPos, pageWidth - 28, boxHeight, 2, 2, "FD");

      doc.setTextColor(249, 115, 22);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text("*Note:", 18, yPos + 6);

      doc.setFont("helvetica", "normal");
      doc.text(splitNote, 32, yPos + 6);

      yPos += boxHeight + 5;

      const showSpecialRequirements =
        settings?.data?.is_special_requirements_enabled;
      const showRemarks = settings?.data?.is_remarks_enabled;

      const headers = [
        "University",
        "Course Name",
        "Previous Study",
        "Degree Going For",
        "IELTS Req.",
      ];

      if (showSpecialRequirements) {
        headers.push("Special Requirements");
      }
      if (showRemarks) {
        headers.push("Remarks");
      }

      const tableData = result.data.map((program: Program) => {
        const row = [
          program.university || "-",
          program.course_name || "-",
          program.previous_or_current_study || "-",
          program.degree_going_for || "-",
          program.ielts_requirement || "-",
        ];

        if (showSpecialRequirements) {
          row.push(program.special_requirements || "-");
        }
        if (showRemarks) {
          row.push(program.remarks || "-");
        }

        return row;
      });

      autoTable(doc, {
        head: [headers],
        body: tableData,
        startY: yPos,
        styles: {
          fontSize: 8,
          cellPadding: 3,
          lineColor: [220, 220, 220],
          lineWidth: 0.1,
        },
        headStyles: {
          fillColor: [58, 56, 134],
          textColor: [255, 255, 255],
          fontSize: 9,
          fontStyle: "bold",
          halign: "left",
        },
        alternateRowStyles: {
          fillColor: [249, 250, 251],
        },
        margin: { left: 14, right: 14 },
        theme: "grid",
      });

      const pageCount = doc.internal.pages.length - 1;
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text(
          `Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`,
          14,
          doc.internal.pageSize.getHeight() - 10
        );
        doc.text(
          `Page ${i} of ${pageCount}`,
          pageWidth - 14,
          doc.internal.pageSize.getHeight() - 10,
          { align: "right" }
        );
      }

      doc.save(`programs-${new Date().toISOString()}.pdf`);

      try {
        await post("/api/admin/record-login", {
          event_type: "program_download",
          enquiry_id: enquiry?.id,
          user_id: user.userDetails.id,
          ip
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
            <div>
              {/*<div className="w-full flex items-center justify-end">
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
               */}
              <ProgramsTable data={programs} settings={settings?.data} />
            </div>
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
