"use client";

import { useFetch } from "@/hooks/api/useFetch";
import SuggestionDisplay from "../../add/components/SuggestionDisplay";
import { Program } from "@/lib/types";
import { useParams } from "next/navigation";
import Breadcrumbs from "@/components/ui/breadCrumbs";

export default function EnquirySuggestionsPage() {
  const { id } = useParams<{ id: string }>();

  const {
    data: enquiryData,
    error: enquiryError,
    isLoading: enquiryLoading,
  } = useFetch(`/api/admin/enquiries/${id}`);

  const {
    data: suggestionData,
    error: suggestionError,
    isLoading: suggestionLoading,
  } = useFetch(`/api/admin/enquiries/${id}/suggestions`);

  const exportCSV = () => {
    const headers = [
      "University",
      "Program",
      "Study Level",
      "Discipline Area",
      "What to Pursue",
      "Percentage Required",
      "IELTS Required",
    ];
    const rows = (suggestionData?.data as Program[]).map((p) => [
      p.university,
      p.programme_name,
      p.study_level,
      //   p.discipline_area || "-",
      //   p.pursue || "-",
      p.percentage_required || "-",
      p.ielts_score || "-",
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((item) => `"${item}"`).join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "programs.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (enquiryLoading || suggestionLoading)
    return (
      <div className="w-dvw h-dvh flex items-center justify-center">
        Loading...
      </div>
    );
  if (enquiryError) return <div>Error: {enquiryError.message}</div>;
  if (suggestionError) return <div>Error: {suggestionError.message}</div>;

  const enquiry = enquiryData?.data;
  const academicEntries = enquiryData?.academicEntries?.data || [];
  const suggestionBasedOn = enquiry.custom_fields || [];
  const parsed = JSON.parse(suggestionBasedOn);

  const columns = [
    { key: "university", label: "University" },
    { key: "programme_name", label: "Program" },
    { key: "study_level", label: "Study Level" },
    { key: "study_area", label: "Discipline Area" },
    { key: "campus", label: "Campus" },
    { key: "duration", label: "Duration" },
    { key: "percentage_required", label: "Percentage Required" },
    { key: "ielts_score", label: "IELTS Score" },
    { key: "gre_score", label: "GRE Score" },
    { key: "gmat_score", label: "GMAT Score" },
    { key: "toefl_score", label: "TOEFL Score" },
    { key: "pte_score", label: "PTE Score" },
    { key: "det_score", label: "DET Score" },
    { key: "custom_programs_fields", label: "Custom Fields" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        <Breadcrumbs disabledItemIndex={2} />

        <h1 className="text-3xl font-bold mb-6">Program Suggestions</h1>

        {/* Enquiry Details Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border">
          <h2 className="text-xl font-semibold mb-4">Enquiry Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <div>
              <p>
                <span className="font-medium">Student Name:</span>{" "}
                {enquiry.student_name}
              </p>
              <p>
                <span className="font-medium">Email:</span> {enquiry.email}
              </p>
              <p>
                <span className="font-medium">Phone:</span>{" "}
                {enquiry.phone || "-"}
              </p>
            </div>
            <div>
              <p>
                <span className="font-medium">Overall Percentage:</span>{" "}
                {enquiry.overall_percentage ?? "-"}
              </p>
              <p>
                <span className="font-medium">Gap:</span>{" "}
                {enquiry.is_gap ? `Yes (${enquiry.gap_years} years)` : "No"}
              </p>
              <p>
                <span className="font-medium">Created At:</span>{" "}
                {new Date(enquiry.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {academicEntries.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Academic History</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border border-gray-200 rounded-lg">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left">Study Level</th>
                      <th className="px-4 py-2 text-left">Stream</th>
                      <th className="px-4 py-2 text-left">Pursue</th>
                      <th className="px-4 py-2 text-left">Score</th>
                      <th className="px-4 py-2 text-left">Completion Year</th>
                    </tr>
                  </thead>
                  <tbody>
                    {academicEntries.map((entry: any, index: number) => (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-2">
                          {entry?.study_level?.level_name || "-"}
                        </td>
                        <td className="px-4 py-2">
                          {entry?.stream?.name || "-"}
                        </td>
                        <td className="px-4 py-2">
                          {entry?.course?.course_name || "-"}
                        </td>
                        <td className="px-4 py-2">{entry?.score ?? "-"}</td>
                        <td className="px-4 py-2">
                          {entry?.completion_year ?? "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {parsed.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Custom Fields</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                {parsed.map((field: any, index: number) => (
                  <div className="flex gap-4" key={index}>
                    <p>
                      <span className="font-medium">{field.field} </span>
                    </p>
                    <p>
                      <span className="font-medium">{field.comparison} </span>
                    </p>
                    <p>
                      <span className="font-medium">{field.value} </span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Suggestion Table */}
        <SuggestionDisplay
          suggestions={[]}
          columns={columns}
          customSuggestions={suggestionData?.data as Program[]}
          showSuggestions={false}
          exportCSV={exportCSV}
          setShowSuggestions={() => {}}
        />
      </div>
    </div>
  );
}
