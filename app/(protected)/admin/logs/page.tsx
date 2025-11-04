"use client";

import { useState, useEffect } from "react";
import Table from "@/components/table/globalTable";
import { useFetch } from "@/hooks/api/useFetch";
import { useDebounce } from "use-debounce";
import { User } from "@/lib/types";

interface ActivityLog {
  id: string;
  user_id: string | null;
  event_type: string;
  metadata?: Record<string, any> | null;
  ip_address: string | null;
  created_at: string;
  role: string | null;
  user?: User | null; // if API joins users
}

export default function LogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState({
    email: "",
    name: "",
    action: "",
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

  queryParams.append("tab", activeTab);

  const apiUrl = `/api/admin/logs?${queryParams.toString()}&limit=${itemsPerPage}&offset=${offset}`;

  const { data: logsData, isLoading } = useFetch(apiUrl, {
    enabled: !!userId,
  });

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, activeTab]);

  useEffect(() => {
    if (logsData?.success) {
      setLogs(logsData?.data || []);
    }
  }, [logsData]);

  const columns = [
    {
      key: "user",
      label: "User",
      render: (row: ActivityLog) => {
        const md = row.metadata ?? {};
        const user = md.user ?? {};
        const ip = md.ip_info ?? {};

        return (
          <div className="w-64">
            <div className="text-xl font-medium text-gray-900">
              {user.full_name || user.username || "Unknown"}
            </div>

            <div className="text-gray-500 text-sm">
              ID: {row.user_id?.slice(0, 8)}...
            </div>
          </div>
        );
      },
    },
    {
      key: "email",
      label: "Email",
      render: (row: ActivityLog) => (
        <span className="text-xl text-gray-700">{row.user?.email ?? "-"}</span>
      ),
    },
    {
      key: "location",
      label: "Location",
      render: (row: ActivityLog) => {
        const ip = row.metadata?.ip_info ?? {};

        if (row.event_type !== "enquiry_created" || !ip?.city) {
          return <span className="text-xl text-gray-400">-</span>;
        }

        const locationParts = [ip.city, ip.state, ip.country].filter(Boolean);

        return (
          <span className="text-xl text-gray-700">
            <div className="text-gray-500 text-xl mt-1">
              {locationParts.join(", ")}
            </div>
          </span>
        );
      },
    },
    {
      key: "event_type",
      label: "Action",
      render: (row: ActivityLog) => {
        let style = "bg-blue-100 text-blue-800";

        switch (row.event_type) {
          case "login":
            style = "bg-green-100 text-green-800";
            break;
          case "logout":
            style = "bg-red-100 text-red-800";
            break;
          case "enquiry_created":
            style = "bg-purple-100 text-purple-800";
            break;
        }

        return (
          <span
            className={`inline-flex justify-center min-w-48 text-center items-center px-3 py-1 rounded-full text-xl font-medium ${style}`}
          >
            {row.event_type.replace("_", " ")}
          </span>
        );
      },
    },
    {
      key: "role",
      label: "Role",
      render: (row: ActivityLog) => (
        <span className="text-xl text-gray-700 capitalize">
          {row.role ?? "-"}
        </span>
      ),
    },
    {
      key: "created_at",
      label: "Date & Time",
      render: (row: ActivityLog) => (
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
    { key: "user", label: "B2B Logs", count: logsData?.pagination?.total },
  ];

  const actionFilterOptions = [
    { value: "", label: "All Actions" },
    { value: "login", label: "Login" },
    { value: "logout", label: "Logout" },
    { value: "program_search", label: "Program Search" },
    { value: "download", label: "Download" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Table
          title="Activity Logs"
          columns={columns}
          data={logs}
          searchQuery={search}
          onSearchChange={setSearch}
          isLoading={isLoading}
          searchParameters={["name","email"]}
          // searchSelectFilters={[
          //   {
          //     name: "action",
          //     label: "Action",
          //     key: "action",
          //     options: actionFilterOptions,
          //   },
          // ]}
          onPageChange={setPage}
          currentPage={page}
          total={logsData?.pagination?.total || 0}
          itemsPerPage={itemsPerPage}
          emptyMessage="No logs found."
          dateFilters={{
            from_date: search.from_date,
            to_date: search.to_date,
          }}
          filterTabs={filterTabs}
          activeFilter={activeTab}
          onFilterChange={setActiveTab}
        />
      </div>
    </div>
  );
}
