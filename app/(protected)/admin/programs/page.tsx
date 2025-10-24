"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  SearchIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import Link from "next/link";
import { Program } from "@/lib/types";
import Breadcrumbs from "@/components/ui/breadCrumbs";
import Table from "@/components/table/globalTable";
import { useApi } from "@/hooks/auth-modules/useFetch";

export default function ProgramsPage() {
  const router = useRouter();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalItems = 15;
  const { data, error, isLoading } = useApi("/api/admin/programs");
  console.log("data", data);
  useEffect(() => {
    if (data?.data) {
      if (data.success) {
        setPrograms(data?.data);
      } else {
        console.error("Error fetching programs:", data.error);
        return;
      }
    }
  }, [data]);

  const fetchPrograms = async () => {
    try {
      const response = await fetch("/api/admin/programs");
      const result = await response.json();
      if (!result.success) {
        console.error("Error fetching programs:", result.error);
        return;
      }
      const mockPrograms = result.data || [];
      setPrograms(mockPrograms);
    } catch (error) {
      console.error("Error fetching programs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this program?")) {
      try {
        // In a real app, you would call your API here
        console.log("Deleting program:", id);
        setPrograms((prev) => prev.filter((program) => program.id !== id));
      } catch (error) {
        console.error("Error deleting program:", error);
        alert("Error deleting program. Please try again.");
      }
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/programs/${id}`);
  };

  const filteredPrograms = programs.filter(
    (program) =>
      program.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.programme_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.study_area?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedPrograms = filteredPrograms.slice(0, itemsPerPage);

  const columns = [
    {
      key: "university",
      label: "University",
      render: (row: Program) => (
        <div>
          <div
            onClick={() => {
              router.push(`/admin/programs/view/${row.id}`);
            }}
            className="text-sm underline cursor-pointer font-medium text-gray-900"
          >
            {row.university}
          </div>
          {row.campus && (
            <div className="text-sm text-gray-500">{row.campus}</div>
          )}
        </div>
      ),
    },
    {
      key: "programme_name",
      label: "Program",
      render: (row: Program) => (
        <div className="max-w-[220px] truncate">
          <div className="text-sm text-gray-900 font-medium truncate">
            {row.programme_name}
          </div>
          {row.study_area && (
            <div className="text-sm text-gray-500 truncate">
              {row.study_area}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "study_level",
      label: "Study Level",
      render: (row: Program) => (
        <div className="max-w-[220px] truncate">
          <div className="text-sm text-gray-900 font-medium truncate">
            {row.study_level}
          </div>
        </div>
      ),
    },
    {
      key: "duration",
      label: "Duration",
    },
    {
      key: "university_ranking",
      label: "Ranking",
      render: (row: Program) =>
        row.university_ranking ? `#${row.university_ranking}` : "-",
    },
    {
      key: "application_deadline",
      label: "Deadline",
      render: (row: Program) =>
        row.application_deadline
          ? new Date(row.application_deadline).toLocaleDateString()
          : "-",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Table
          title="Programs"
          columns={columns}
          data={programs}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyMessage="No programs available."
          addHref="/admin/programs/addProgram"
          addBulkHeref="/admin/programs/upload"
        />
      </div>
    </div>
  );
}
