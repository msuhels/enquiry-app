"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeftIcon, PencilIcon } from "lucide-react";
import Link from "next/link";
import Breadcrumbs from "@/components/ui/breadCrumbs";
import { ProgramFormData } from "@/lib/types";

export default function ViewProgramPage() {
  const { id } = useParams();
  const router = useRouter();
  const [program, setProgram] = useState<ProgramFormData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchProgram = async () => {
      try {
        const res = await fetch(`/api/admin/programs/${id}`);
        const data = await res.json();
        if (data.success) setProgram(data.data);
      } catch (error) {
        console.error("Error fetching program:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProgram();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading program details...
      </div>
    );

  if (!program)
    return (
      <div className="p-8 text-center text-gray-500">
        Program not found.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs disabledItemIndex={2} />
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {program.programme_name}
          </h1>
          <Link
            href={`/admin/programs/edit/${id}`}
            className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <PencilIcon className="h-4 w-4 mr-1" /> Edit
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg p-6 space-y-6">
          <Section title="Basic Information" fields={[
            ["University", program.university],
            ["Programme Name", program.programme_name],
            ["University Ranking", program.university_ranking],
            ["Study Level", program.study_level],
            ["Study Area", program.study_area],
            ["Campus", program.campus],
            ["Duration", program.duration],
            ["Application Deadline", program.application_deadline],
          ]} />

          <Section title="Academic Requirements" fields={[
            ["Percentage Required", program.percentage_required],
            ["Medium of Instruction", program.moi],
            ["Entry Requirements", program.entry_requirements],
          ]} />

          <Section title="English Language Requirements" fields={[
            ["IELTS Score", program.ielts_score],
            ["IELTS No Band Less Than", program.ielts_no_band_less_than],
            ["TOEFL Score", program.toefl_score],
            ["TOEFL No Band Less Than", program.toefl_no_band_less_than],
            ["PTE Score", program.pte_score],
            ["DET Score", program.det_score],
          ]} />

          <Section title="Additional Information" fields={[
            ["Remarks", program.remarks],
            ["Additional Requirements", program.additional_requirements],
          ]} />
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  fields,
}: {
  title: string;
  fields: [string, any][];
}) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map(([label, value]) => (
          <div key={label}>
            <p className="text-sm font-medium text-gray-600">{label}</p>
            <p className="text-gray-900">{value ?? "—"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
