"use client";

import { useFetch } from "@/hooks/api/useFetch";
import SuggestionDisplay from "../../add/components/SuggestionDisplay";
import { Program } from "@/lib/types";
import { useParams } from "next/navigation";
import Breadcrumbs from "@/components/ui/breadCrumbs";

export default function EnquirySuggestionsPage() {
  const { id } = useParams<{ id: string }>();
  console.log("id...........", id);
  const { data, error, isLoading } = useFetch(
    `/api/admin/enquiries/${id}/suggestions`
  );

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
    const rows = (data.data as Program[]).map((p) => [
      p.university,
      p.programme_name,
      p.study_level,
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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        <Breadcrumbs disabledItemIndex={2} />
        <h1 className="text-3xl font-bold mb-6">Program Suggestions</h1>
        <SuggestionDisplay
          suggestions={[]}
          customSuggestions={data.data as Program[]}
          showSuggestions={false}
          exportCSV={exportCSV}
          setShowSuggestions={() => {}}
        />
      </div>
    </div>
  );
}
