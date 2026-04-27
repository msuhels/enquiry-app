"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdvancedDataTable from "@/components/table/globalTable";
import { useFetch } from "@/hooks/api/useFetch";

type Announcement = {
  id: string;
  title: string;
  content: string;
  image_url?: string | null;
  created_at: string;
};

export default function UpdatesPage() {
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const offset = (page - 1) * itemsPerPage;

  const apiUrl = `/api/admin/announcements?page=${page}&limit=${itemsPerPage}`;

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

  // Table columns
  const columns = [
    {
      key: "title",
      label: "Title",
      sortable: true,
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
      key: "actions",
      label: "action",
      render: (row: Announcement) => (
        <button
          onClick={() => router.push(`/b2b/updates/view/${row.id}`)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View
        </button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto p-8">
        <AdvancedDataTable
          title="updates"
          columns={columns}
          data={announcements}
          isLoading={isLoading}
          emptyMessage="No updates found."
          onPageChange={setPage}
          currentPage={page}
          total={data?.pagination?.total || 0}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </div>
  );
}