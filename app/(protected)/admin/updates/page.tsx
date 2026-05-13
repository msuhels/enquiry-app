"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdvancedDataTable from "@/components/table/globalTable";
import { useFetch } from "@/hooks/api/useFetch";
import { useModal } from "@/components/ui/modal";
import DeleteUpdateConfirmationModal from "./components/DeleteUpdateConfirmationModal";
import { toast } from "sonner";
import "ckeditor5/ckeditor5.css";
import { send } from "process";
import { Loader2, Send } from "lucide-react";

type Announcement = {
  id: string;
  title: string;
  content: string;
  image_url?: string | null;
  created_at: string;
  update_type?: string;
};

export default function UpdatesPage() {
  const router = useRouter();
  const { openModal, closeModal } = useModal();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filter, setFilter] = useState("all");
  const [sendingEmailId, setSendingEmailId] = useState<string | null>(null);
  const [search, setSearch] = useState({
    search: "",
    update_type: "",
  });


  const offset = (page - 1) * itemsPerPage;

  const apiUrl = `/api/admin/announcements?page=${page}&limit=${itemsPerPage}&update_type=${search.update_type}`;

  // Call your API
  const { data, isLoading, error } = useFetch(apiUrl);



  // Debug logging
  console.log("Announcements API response:", { data, isLoading, error });

  useEffect(() => {
    if (data) {
      console.log("Data structure:", JSON.stringify(data));
      if (data.success && Array.isArray(data.data)) {
        console.log("Setting announcements:", data.data);
        setAnnouncements(data.data);
      } else {
        console.log("Data success:", data.success, "Data:", data.data);
      }
    }
    if (error) {
      console.error("API error:", error);
    }
  }, [data, error]);


  const sendAnnouncementEmail = async (announcementId: string) => {
    setSendingEmailId(announcementId);
    try {
      const response = await fetch(
        "/api/admin/announcements/send-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            announcementId,
          }),
        }
      );

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to send emails");
      }

      alert(`Email sent to ${result.sentCount} users`);
    } catch (error) {
      console.error(error);
      alert("Failed to send email");
    } finally {
      setSendingEmailId(null);
    }
  };
  // Table columns
  const columns = [
    {
      key: "title",
      label: "Title",
      sortable: true,
    },
    {
      key: "update_type",
      label: "Type",
      sortable: true,
      render: (row: Announcement) => (
        <span>{row.update_type}</span>
      ),
    },
    {
      key: "created_at",
      label: "Created At",
      sortable: true,
      render: (row: Announcement) => (
        <span>{new Date(row.created_at).toLocaleDateString()}</span>
      ),
    },
    {
      key: "email",
      label: "Send Email",
      render: (row: Announcement) => {
        const isSending = sendingEmailId === row.id;
        return (
          <button
            onClick={() => sendAnnouncementEmail(row.id)}
            disabled={isSending}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${isSending
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-[#3a3886] text-white hover:bg-[#2d2b6b] shadow-md hover:shadow-lg"
              }`}
          >
            {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {isSending ? "Sending..." : "Send Email"}
          </button>
        );
      },
    },
    {
      key: "actions",
      label: "action",
      render: (row: Announcement) => (
        <button
          onClick={() => router.push(`/admin/updates/view/${row.id}`)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View
        </button>
      ),
    },
    {
      key: "delete",
      label: "Delete",
      render: (row: Announcement) => (
        <button
          onClick={() => handleDelete(row)}
          className="text-red-600 hover:text-red-800 text-sm font-medium"
        >
          Delete
        </button>
      ),
    },

  ];

  const UPDATE_TYPES = [
    { value: "all", label: "All" },
    { value: "Sales", label: "Sales" },
    { value: "Admission", label: "Admission" },
    { value: "Scholarship", label: "Scholarship" },
    { value: "Pre Enrollment", label: "Pre Enrollment" },
    { value: "Visa", label: "Visa" },
    { value: "Post Visa", label: "Post Visa" },
    { value: "Marketing Updates", label: "Marketing Updates" },
  ];

  const searchSelectFilters = [
    {
      key: "update_type",
      label: "Update Type",
      options: UPDATE_TYPES,
    },
  ];

  const handleDelete = (update: Announcement) => {
    const modalId = openModal(
      <DeleteUpdateConfirmationModal
        update={update}
        onDelete={() => handleConfirmDelete(update, modalId)}
        onClose={() => closeModal(modalId)}
      />,
      { size: "half" }
    );
  };

  const handleConfirmDelete = async (update: Announcement, modalId: string) => {
    try {
      const response = await fetch(`/api/admin/announcements/${update.id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Update deleted successfully!");
        setAnnouncements(announcements.filter(a => a.id !== update.id));
      } else {
        toast.error(result.message || "Failed to delete update");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete update");
    }
    closeModal(modalId);
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto p-8">
        <AdvancedDataTable
          title="Updates"
          columns={columns}
          data={announcements}
          addHref="/admin/updates/add"
          isLoading={isLoading}
          emptyMessage="No announcements found."
          onPageChange={setPage}
          currentPage={page}
          total={data?.pagination?.total || 0}
          itemsPerPage={itemsPerPage}
          searchQuery={search}
          onSearchChange={setSearch}
          searchSelectFilters={searchSelectFilters}
          activeFilter={filter}
          onFilterChange={setFilter}
        />
      </div>
    </div>
  );
}