"use client";

import { useState, useEffect } from "react";
import Table from "@/components/table/globalTable";
import { useFetch } from "@/hooks/api/useFetch";
import { useDebounce } from "use-debounce";
import { User } from "@/lib/types";

interface AuditLog {
  id: string;
  instance_id: string;
  payload: {
    action: string;
    actor_id: string;
    actor_username: string;
    actor_via_sso: boolean;
    log_type: string;
    traits?: {
      provider?: string;
    };
  };
  user: User;
  created_at: string;
  ip_address: string;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState({
    email: "",
    action: "", // Added action filter
    from_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10),
    to_date: new Date().toISOString().slice(0, 10),
  });
  const [debouncedSearch] = useDebounce(search, 400);
  const { data: user } = useFetch("/api/admin/users/getAuthUser");

  const offset = (page - 1) * itemsPerPage;
  const userId = user?.userDetails?.id;
  const queryParams = new URLSearchParams();

  Object.entries(debouncedSearch).forEach(([k, v]) => {
    if (v) queryParams.append(k, v);
  });

  // Add tab parameter to API call
  queryParams.append("tab", activeTab);

  const apiUrl = `/api/admin/logs?${queryParams.toString()}&limit=${itemsPerPage}&offset=${offset}`;

  const { data: logsData, isLoading } = useFetch(apiUrl, {
    enabled: !!userId,
  });

  // Reset to page 1 when filters or tab changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, activeTab]);

  // Update logs when data changes
  useEffect(() => {
    if (logsData?.success) {
      setLogs(logsData?.data || []);
    }
  }, [logsData]);

  const columns = [
    {
      key: "user",
      label: "User",
      render: (row: AuditLog) => (
        <div className="w-64">
          <div className="text-xl font-medium text-gray-900">
            {row.payload.actor_username || "Unknown"}
          </div>
          <div className="text-lg text-gray-500">
            ID: {row.payload.actor_id?.slice(0, 8)}...
          </div>
        </div>
      ),
    },
    {
      key: "action",
      label: "Action",
      render: (row: AuditLog) => (
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xl font-medium ${
            row.payload.action === "login"
              ? "bg-green-100 text-green-800"
              : row.payload.action === "logout"
              ? "bg-red-100 text-red-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {row.payload.action}
        </span>
      ),
    },
    {
      key: "log_type",
      label: "Type",
      render: (row: AuditLog) => (
        <span className="text-xl text-gray-700 capitalize">
          {row?.user?.role || "-"}
        </span>
      ),
    },
    {
      key: "created_at",
      label: "Date & Time",
      render: (row: AuditLog) => (
        <div className="text-xl">
          <div className="text-gray-900 font-medium">
            {new Date(row.created_at).toLocaleDateString()}
          </div>
          <div className="text-gray-500">
            {new Date(row.created_at).toLocaleTimeString()}
          </div>
        </div>
      ),
    },
  ];

  const filterTabs = [
    { key: "all", label: "All Logs", count: logsData?.pagination?.total },
    { key: "admin", label: "Admin Logs", count: logsData?.pagination?.total },
    { key: "user", label: "User Logs", count: logsData?.pagination?.total },
  ];

  const actionFilterOptions = [
    { value: "", label: "All Actions" },
    { value: "login", label: "Login" },
    { value: "logout", label: "Logout" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Table
          title="Audit Logs"
          columns={columns}
          data={logs}
          searchQuery={search}
          onSearchChange={setSearch}
          isLoading={isLoading}
          searchParameters={["email"]}
          searchSelectFilters={[
            {
              name: "action",
              label: "Action",
              key: "action",
              options: actionFilterOptions,
            },
          ]}
          onPageChange={setPage}
          currentPage={page}
          total={logsData?.pagination?.total || 0}
          itemsPerPage={itemsPerPage}
          emptyMessage="No logs found."
          dateFilters={{ from_date: search.from_date, to_date: search.to_date }}
          filterTabs={filterTabs}
          activeFilter={activeTab}
          onFilterChange={setActiveTab}
        />
      </div>
    </div>
  );
}