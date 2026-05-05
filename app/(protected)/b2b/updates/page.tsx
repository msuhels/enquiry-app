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
  update_type: string;
};

export default function UpdatesPage() {
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filter, setFilter] = useState("all");
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

   const UPDATE_TYPES = [
  { value: "all", label: "All" },
  { value: "General", label: "General" },
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