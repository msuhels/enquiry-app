"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Table from "@/components/table/globalTable";
import Breadcrumbs from "@/components/ui/breadCrumbs";
import { Enquiry } from "@/lib/types";
import { FileTextIcon, Loader2, MessageSquareIcon } from "lucide-react";
import { useFetch } from "@/hooks/api/useFetch";
import { useDebounce } from "use-debounce";
import { useModal } from "@/components/ui/modal";
import DeleteConfirmationModal from "./components/DeleteConfirmationModal";
import { useDelete } from "@/hooks/api/useDelete";
import { toast } from "sonner";
import SearchSelect from "@/components/form/FormSearchSelect";

export default function EnquiriesPage() {
  const router = useRouter();
  const [previousOrCurrentStudy, setPreviousOrCurrentStudy] = useState("");
  const [previousOrCurrentStudyOptions, setPreviousOrCurrentStudyOptions] =
    useState([]);
  const [degreeGoingFor, setDegreeGoingFor] = useState("");
  const [degreeGoingForOptions, setDegreeGoingForOptions] = useState([]);

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

  const handleFindPrograms = () => {}


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`w-full `}>
          <div className="mb-8">
            <Breadcrumbs />
          </div>
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
            <button onClick={handleFindPrograms} className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded">
              Find Programs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
