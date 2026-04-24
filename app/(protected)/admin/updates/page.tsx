"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdvancedDataTable from "@/components/table/globalTable";
import { useFetch } from "@/hooks/api/useFetch";
import "ckeditor5/ckeditor5.css";

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

  // Call your API
  const { data, isLoading, error } = useFetch("/api/admin/announcements");

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
          onClick={() => router.push(`/admin/updates/view/${row.id}`)}
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
          title="Announcements"
          columns={columns}
          data={announcements}
          addHref="/admin/updates/add"
          isLoading={isLoading}
          emptyMessage="No announcements found."
        />
      </div>
    </div>
  );
}