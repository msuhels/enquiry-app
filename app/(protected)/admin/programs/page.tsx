"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";
import { toast } from "sonner";
import { useModal } from "@/components/ui/modal";
import DeleteProgramConfirmationModal from "./components/DeleteProgramConfirmationModal";
import { useFetch } from "@/hooks/api/useFetch";
import { useDelete } from "@/hooks/api/useDelete";
import AdvancedDataTable from "@/components/table/globalTable";
import { Program } from "@/lib/types";
import { usePatch } from "@/hooks/api/usePatch";

export default function ProgramsPage() {
  const router = useRouter();
  const { openModal, closeModal } = useModal();
  const { del } = useDelete();

  const [programs, setPrograms] = useState<Program[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortKey, setSortKey] = useState("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [debouncedSearch] = useDebounce(search, 400);
  const [fieldsSwitches, setFieldsSwitches] = useState([
    { key: "is_special_requirements_enabled", value: false },
    { key: "is_remarks_enabled", value: false },
  ]);

  const offset = (page - 1) * itemsPerPage;
  const apiUrl = `/api/admin/programs?search=${encodeURIComponent(
    debouncedSearch
  )}&filter=${filter}&sort=${sortKey}:${sortDir}&limit=${itemsPerPage}&offset=${offset}`;
  const { data, isLoading } = useFetch(apiUrl);
  const { data: settings } = useFetch("/api/admin/settings");
  const { patch } = usePatch();
  useEffect(() => {
    if (data?.success) {
      setPrograms(data.data);
    }
  }, [data]);

  useEffect(() => {
    if (settings?.data) {
      setFieldsSwitches((prev) =>
        prev.map((f) => ({ ...f, value: settings.data[f.key] }))
      );
    }
  }, [settings]);

  const handleDelete = (program: Program) => {
    const modalId = openModal(
      <DeleteProgramConfirmationModal
        program={program}
        onDelete={() => handleConfirmDelete(program, modalId)}
        onClose={() => closeModal(modalId)}
      />,
      { size: "half" }
    );
  };

  const handleConfirmDelete = async (program: Program, modalId: string) => {
    const res = await del(`/api/admin/programs/${program.id}`);
    if (res.success) {
      toast.success("Program deleted successfully!");
      setPrograms((prev) => prev.filter((p) => p.id !== program.id));
    } else {
      toast.error(res.error || "Failed to delete program");
    }
    closeModal(modalId);
  };

  const handleEdit = (row: Program) => {
    router.push(`/admin/programs/edit/${row.id}`);
  };

  const columns = [
    {
      key: "university",
      label: "University",
      sortable: true,
      render: (row) => <span>{row.university}</span>,
    },
    { key: "course_name", label: "Course Name", sortable: true },
    // { key: "study_level", label: "Study Level" },
    // { key: "duration", label: "Duration" },
    // { key: "university_ranking", label: "Ranking" },
    // { key: "application_deadline", label: "Deadline" },
  ];

  const filterTabs = [
    // { key: "all", label: "All" },
    // { key: "active", label: "Active" },
    // { key: "inactive", label: "Inactive" },
  ];

  const handleSwitchToggle = async (key: string, value: boolean) => {
    try {
      const res = await patch(`/api/admin/settings`, { [key]: value });

      if (res.success) {
        setFieldsSwitches((prev) =>
          prev.map((f) => (f.key === key ? { ...f, value } : f))
        );
        toast.success("Updated successfully", {
          richColors: true,
          position: "top-center",
        });
      } else {
        toast.error("Failed to update", {
          richColors: true,
          position: "top-center",
        });
      }
    } catch {
      toast.error("Server error", {
        richColors: true,
        position: "top-center",
      });
    }
  };

  return (
    <div className="min-h-screen overflow-auto bg-gray-50">
      <div className="max-w-full mx-auto p-8">
        <AdvancedDataTable
          title="Programs"
          columns={columns}
          data={programs}
          searchQuery={search}
          searchPlaceholder="Search programs..."
          filterTabs={filterTabs}
          activeFilter={filter}
          sortKey={sortKey}
          sortDir={sortDir}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSearchChange={setSearch}
          onFilterChange={setFilter}
          onSortChange={(key, dir) => {}}
          onPageChange={setPage}
          currentPage={page}
          total={data?.pagination?.total || 0}
          itemsPerPage={itemsPerPage}
          addHref="/admin/programs/add"
          addBulkHref="/admin/programs/upload"
          isLoading={isLoading}
          emptyMessage="No programs found."
          fieldsSwitches={fieldsSwitches}
          handleToggleActive={handleSwitchToggle}
        />
      </div>
    </div>
  );
}
