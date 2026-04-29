"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";
import { Star } from "lucide-react";

import AdvancedDataTable from "@/components/table/globalTable";
import { useFetch } from "@/hooks/api/useFetch";

export default function FeedbacksPage() {
  const router = useRouter();

  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const [search, setSearch] = useState({
    search: "",
    department: "",
  });

  const [filter, setFilter] = useState("all");
  const [sortKey, setSortKey] = useState("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const [analytics, setAnalytics] = useState<any>(null);
  const [departmentAnalytics, setDepartmentAnalytics] = useState<any[]>([]);

  const [debouncedSearch] = useDebounce(search, 400);

  const offset = (page - 1) * itemsPerPage;

  const apiUrl =
    `/api/admin/feedbacks/admin?` +
    `search=${encodeURIComponent(debouncedSearch.search)}` +
    `&department=${encodeURIComponent(debouncedSearch.department)}` +
    `&sort=${sortKey}:${sortDir}` +
    `&limit=${itemsPerPage}` +
    `&offset=${offset}`;

  const { data, isLoading, error } = useFetch(apiUrl);
  const { data: analyticsData } = useFetch(
    "/api/admin/feedbacks/analytics"
  );

  const feedbacks = data?.data || [];

  /**
   * Static department options
   * No API needed.
   */
  const departmentOptions = [
    { value: "sales", label: "Sales" },
    { value: "visa", label: "Visa" },
    { value: "admission", label: "Admission" },
    { value: "scholarship", label: "Scholarship" },
    { value: "post visa", label: "Post Visa" },
  ];

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, sortKey, sortDir]);

  useEffect(() => {
    if (analyticsData?.data) {
      setAnalytics(analyticsData.data);
      setDepartmentAnalytics(
        analyticsData.data.departmentAnalytics || []
      );
    }
  }, [analyticsData]);

  useEffect(() => {
    if (error) {
      console.error("Feedback API Error:", error);
    }
  }, [error]);

  const columns = [
    {
      key: "department",
      label: "Department",
      sortable: true,
      render: (row: any) => (
        <span className="capitalize">
          {row.department}
        </span>
      ),
    },
    {
      key: "rating",
      label: "Rating",
      sortable: true,
      render: (row: any) => (
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-4 h-4 ${
                row.rating >= star
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
      ),
    },
    {
      key: "remarks",
      label: "Message",
      sortable: false,
      render: (row: any) => (
        <span className="line-clamp-2">
          {row.remarks || "-"}
        </span>
      ),
    },
    {
      key: "created_at",
      label: "Created At",
      sortable: true,
      render: (row: any) =>
        new Date(row.created_at).toLocaleString(),
    },
    {
      key: "action",
      label: "Action",
      sortable: false,
      render: (row: any) => (
        <button
          onClick={() =>
            router.push(
              `/admin/feedbacks/view/${row.id}`
            )
          }
          className="text-[#3A3886] hover:underline font-medium"
        >
          View
        </button>
      ),
    },
  ];

  const searchSelectFilters = [
    {
      key: "department",
      label: "Department",
      options: departmentOptions,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto p-8">
        <AdvancedDataTable
          title="Feedbacks"
          columns={columns}
          data={feedbacks}
          searchQuery={search}
          searchPlaceholder="Search feedbacks..."
          activeFilter={filter}
          sortKey={sortKey}
          sortDir={sortDir}
          searchSelectFilters={searchSelectFilters}
          onSearchChange={setSearch}
          onFilterChange={setFilter}
          onSortChange={(key, dir) => {
            setSortKey(key);
            setSortDir(dir);
          }}
          onPageChange={setPage}
          currentPage={page}
          total={data?.pagination?.total || 0}
          itemsPerPage={itemsPerPage}
          isLoading={isLoading}
          emptyMessage="No feedbacks found."
          departmentAnalytics={departmentAnalytics}
          overallAnalytics={
            analytics
              ? {
                  overallAverage:
                    analytics.overallAverage,
                  totalFeedbacks:
                    analytics.totalFeedbacks,
                  departmentCount:
                    departmentAnalytics.length,
                }
              : undefined
          }
        />
      </div>
    </div>
  );
}