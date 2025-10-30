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

export default function EnquiriesPage() {
  const router = useRouter();
  const { openModal, closeModal } = useModal();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 400);
  const { del } = useDelete();

  const offset = (page - 1) * itemsPerPage;
  const apiUrl = `/api/admin/enquiries?search=${encodeURIComponent(
    debouncedSearch
  )}&limit=${itemsPerPage}&offset=${offset}`;

  const { data: enquiriesData, isLoading } = useFetch(apiUrl);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    if (enquiriesData?.success) {
      setEnquiries(enquiriesData?.data);
    }
  }, [enquiriesData]);

  const handleView = (enquiry: Enquiry) => {
    router.push(`/admin/enquiries/${enquiry.id}`);
  };

  const handleDelete = (enquiry: Enquiry) => {
    const modalId = openModal(
      <DeleteConfirmationModal
        onDelete={() => handleConfirmDelete(enquiry, modalId)}
        onClose={() => closeModal(modalId)}
      />,
      { size: "half" }
    );
  };

  const handleConfirmDelete = async (enquiry: Enquiry, modalId: string) => {
    const res = await del(`/api/admin/enquiries?id=${enquiry.id}`);
    if (res.success) {
      toast.success("Enquiry deleted successfully!");
      setEnquiries((prev) => prev.filter((e) => e.id !== enquiry.id));
    } else {
      toast.error(res.error || "Failed to delete enquiry");
    }
    closeModal(modalId);
  };

  const handleStatusChange = (enquiry: Enquiry) => {
    const nextStatus =
      enquiry.status === "pending"
        ? "in_progress"
        : enquiry.status === "in_progress"
        ? "completed"
        : enquiry.status === "completed"
        ? "rejected"
        : "pending";

    setEnquiries((prev) =>
      prev.map((e) => (e.id === enquiry.id ? { ...e, status: nextStatus } : e))
    );
  };

  const columns = [
    {
      key: "createdby",
      label: "Created By",
      render: (row: Enquiry) => (
        <div>
          <div className="text-sm font-medium text-gray-900">
            {row.createdby.full_name}
          </div>
          {/* <div className="text-sm text-gray-500">{row.email}</div> */}
        </div>
      ),
    },
    {
      key: "phone_number",
      label: "Phone",
      render: (row: Enquiry) => (
        <span>{row.createdby.phone_number || "-"}</span>
      ),
    },
    { key: "degree_going_for", label: "Program Interest" },
    { key: "previous_or_current_study", label: "Previous/Current Degree" },
    // {
    //   key: "status",
    //   label: "Status",
    //   render: (row: Enquiry) => (
    //     <button
    //       onClick={() => handleStatusChange(row)}
    //       className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full transition ${
    //         row.status === "pending"
    //           ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
    //           : row.status === "in_progress"
    //           ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
    //           : row.status === "completed"
    //           ? "bg-green-100 text-green-800 hover:bg-green-200"
    //           : "bg-red-100 text-red-800 hover:bg-red-200"
    //       }`}
    //     >
    //       {row?.status?.replace("_", " ") || "-"}
    //     </button>
    //   ),
    // },
    {
      key: "created_at",
      label: "Date",
      render: (row: Enquiry) => new Date(row.created_at).toLocaleDateString(),
    },
  ];

  // if (isLoading) {
  //   return (
  //     <div className="flex items-center justify-center h-64">
  //      <Loader2 className="h-10 w-10 mr-2 animate-spin inline text-indigo-600" />
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Table
          title="Enquiries"
          columns={columns}
          data={enquiries}
          searchKeys={["student_name", "email", "program_interest", "status"]}
          searchQuery={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by name, email, or phone..."
          // onEdit={handleView}
          // onDelete={handleDelete}
          onPageChange={setPage}
          currentPage={page}
          total={enquiriesData?.pagination?.total || 0}
          itemsPerPage={itemsPerPage}
          addHref="/admin/enquiries/add"
          emptyMessage="No enquiries found."
          filterTabs={[
            {
              key: "all",
              label: "All",
              count: enquiries.length,
              filter: () => true,
            },
          ]}
        />
      </div>
    </div>
  );
}
