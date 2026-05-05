"use client";

import { useState, useEffect, useMemo } from "react";
import Table from "@/components/table/globalTable";
import { useFetch } from "@/hooks/api/useFetch";
import { useDebounce } from "use-debounce";
import { User } from "@/lib/types";
import { State, City } from "country-state-city";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { useAuth } from "@/hooks/auth-modules";

interface ActivityLog {
  id: string;
  user_id: string | null;
  event_type: string;
  metadata?: Record<string, any> | null;
  ip_address: string | null;
  created_at: string;
  role: string | null;
  user?: User | null;
}

interface UserActionSummary {
  user_id: string;
  user_name: string;
  email: string;
  organization: string;
  role: string;
  location: string;
  action_counts: Record<string, number>;
  total_actions: number;
  last_activity: string;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [allLogs, setAllLogs] = useState<ActivityLog[]>([]);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState<"datalist" | "action_count">(
    "datalist"
  );
  const [search, setSearch] = useState({
    email: "",
    name: "",
    action: "",
    organization: "",
    city: "",
    state: "",
    from_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10),
    to_date: new Date().toISOString().slice(0, 10),
  });

  const [debouncedSearch] = useDebounce(search, 400);
  const { userDetails } = useAuth();

  const offset = (page - 1) * itemsPerPage;
  const userId = userDetails?.id;

  const queryParams = new URLSearchParams();

  Object.entries(debouncedSearch).forEach(([k, v]) => {
    if (v) queryParams.append(k, v);
  });

  queryParams.append("tab", activeTab);

  const apiUrl = userId ? `/api/admin/logs?${queryParams.toString()}&limit=${itemsPerPage}&offset=${offset}` : null;

  const { data: logsData, isLoading } = useFetch(apiUrl);

  const { data: allLogsData, isLoading: isLoadingAllLogs } = useFetch(
    userId ? `/api/admin/logs?${queryParams.toString()}` : null
  );

  const stateOptions = useMemo(() => {
    const indianStates = State.getStatesOfCountry("IN");
    return indianStates.map((state) => ({
      value: state.name,
      label: state.name,
      isoCode: state.isoCode,
    }));
  }, []);

  const cityOptions = useMemo(() => {
    if (!search.state) return [];

    const selectedState = stateOptions.find(
      (state) => state.value === search.state
    );

    if (!selectedState) return [];

    const cities = City.getCitiesOfState("IN", selectedState.isoCode);
    return cities.map((city) => ({
      value: city.name,
      label: city.name,
    }));
  }, [search.state, stateOptions]);

  // Calculate user action summaries
  const userActionSummaries = useMemo(() => {
    if (!allLogsData?.data || viewMode !== "action_count") return [];

    const userMap: Record<string, UserActionSummary> = {};

    allLogsData.data.forEach((log: ActivityLog) => {
      if (!log.user_id) return;

      const md = log.metadata ?? {};
      const user = md.user ?? {};
      const ip = md.ip_info ?? {};
      const locationParts = [ip.city, ip.state, ip.country].filter(Boolean);
      const userExists = log.user ? true : false;

      if (!userMap[log.user_id]) {
        userMap[log.user_id] = {
          user_id: log.user_id,
          user_name: user.full_name || user.username || "Unknown",
          email: userExists ? log.user?.email || user.email || "Unknown" : "user deleted or not found",
          organization: user.organization || "Unknown",
          role: log.role || "-",
          location: locationParts.join(", ") || "-",
          action_counts: {},
          total_actions: 0,
          last_activity: log.created_at,
        };
      }

      const action = log.event_type;
      userMap[log.user_id].action_counts[action] =
        (userMap[log.user_id].action_counts[action] || 0) + 1;
      userMap[log.user_id].total_actions += 1;

      if (
        new Date(log.created_at) > new Date(userMap[log.user_id].last_activity)
      ) {
        userMap[log.user_id].last_activity = log.created_at;
      }
    });

    return Object.values(userMap);
  }, [allLogsData, viewMode]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, activeTab, viewMode]);

  useEffect(() => {
    if (logsData?.success) {
      setLogs(logsData?.data || []);
    }
  }, [logsData]);

  // Columns for Data List view (original)
  const dataListColumns = [
    {
      key: "user",
      label: "User",
      render: (row: ActivityLog) => {
        const md = row.metadata ?? {};
        const user = md.user ?? {};

        return (
          <div className="w-64">
            <div className="text-xl font-medium text-gray-900">
              {user.full_name || user.username || "Unknown"}
            </div>
          </div>
        );
      },
    },
    {
      key: "organization",
      label: "Organization",
      render: (row: ActivityLog) => {
        const md = row.metadata ?? {};
        const user = md.user ?? {};

        return (
          <div className="w-64">
            <div className="text-xl font-medium text-gray-900">
              {user.organization || "Unknown"}
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
          {row.role == "admin" ? "Admin" : "B2B" ?? "-"}
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

  // Columns for Action Count view (aggregated by user)
  const actionCountColumns = [
    {
      key: "user_name",
      label: "User",
      render: (row: UserActionSummary) => (
        <div className="w-64">
          <div className="text-xl font-medium text-gray-900">
            {row.user_name}
          </div>
        </div>
      ),
    },
    {
      key: "organization",
      label: "Organization",
      render: (row: UserActionSummary) => (
        <div className="w-64">
          <div className="text-xl font-medium text-gray-900">
            {row.organization}
          </div>
        </div>
      ),
    },
    {
      key: "email",
      label: "Email",
      render: (row: UserActionSummary) => (
        <span className="text-xl text-gray-700">{row.email}</span>
      ),
    },
    {
      key: "location",
      label: "Location",
      render: (row: UserActionSummary) => (
        <span className="text-xl text-gray-700">
          <div className="text-gray-500 text-xl mt-1">{row.location}</div>
        </span>
      ),
    },
    {
      key: "action_counts",
      label: "Action Summary",
      render: (row: UserActionSummary) => {
        const entries = Object.entries(row.action_counts);

        if (entries.length === 0) {
          return <span className="text-gray-400 text-xl">No data</span>;
        }

        return (
          <div className="flex flex-wrap gap-2 min-w-[300px]">
            {entries.map(([action, count]) => {
              let badgeColor = "bg-gray-100 text-gray-700 border-gray-300";

              switch (action) {
                case "login":
                  badgeColor = "bg-green-50 text-green-700 border-green-200";
                  break;
                case "logout":
                  badgeColor = "bg-red-50 text-red-700 border-red-200";
                  break;
                case "enquiry_created":
                  badgeColor = "bg-purple-50 text-purple-700 border-purple-200";
                  break;
                case "program_search":
                  badgeColor = "bg-blue-50 text-blue-700 border-blue-200";
                  break;
                case "download":
                  badgeColor = "bg-orange-50 text-orange-700 border-orange-200";
                  break;
              }

              return (
                <div
                  key={action}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium ${badgeColor}`}
                >
                  <span className="capitalize">
                    {action.replace(/_/g, " ")}
                  </span>
                  <span className="font-bold bg-white/60 px-2 py-0.5 rounded">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        );
      },
    },
    {
      key: "total_actions",
      label: "Total Activities",
      render: (row: UserActionSummary) => (
        <div className="text-center">
          <span className="text-2xl font-bold text-[#3a3886]">
            {row.total_actions}
          </span>
        </div>
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (row: UserActionSummary) => (
        <span className="text-xl text-gray-700 capitalize">
          {row.role == "admin" ? "Admin" : "B2B"}
        </span>
      ),
    },
    {
      key: "last_activity",
      label: "Last Activity",
      render: (row: UserActionSummary) => (
        <div className="text-xl">
          <div className="text-gray-900 font-medium">
            {new Date(row.last_activity).toLocaleDateString()}
          </div>
          <div className="text-gray-500">
            {new Date(row.last_activity).toLocaleTimeString()}
          </div>
        </div>
      ),
    },
  ];

  const filterTabs = [
    {
      key: "all",
      label: "All Logs",
      count:
        viewMode === "datalist"
          ? logsData?.pagination?.total
          : userActionSummaries.length,
    },
    {
      key: "admin",
      label: "Admin Logs",
      count:
        viewMode === "datalist"
          ? logsData?.pagination?.total
          : userActionSummaries.length,
    },
    {
      key: "user",
      label: "B2B Logs",
      count:
        viewMode === "datalist"
          ? logsData?.pagination?.total
          : userActionSummaries.length,
    },
  ];

  const searchSelectFilters = [
    {
      key: "state",
      label: "State",
      options: stateOptions,
    },
    {
      key: "city",
      label: "City",
      options: cityOptions,
    },
  ];

  const handleExportToExcel = async () => {
    try {
      if (viewMode === "action_count") {
        // Export aggregated user action summaries
        const exportData = userActionSummaries.map((summary) => {
          const actionColumns: Record<string, number> = {};

          // Create separate columns for each action type
          Object.entries(summary.action_counts).forEach(([action, count]) => {
            actionColumns[action.replace(/_/g, " ").toUpperCase()] = count;
          });

          return {
            User: summary.user_name,
            Organization: summary.organization,
            Email: summary.email,
            Location: summary.location,
            ...actionColumns,
            Role: summary.role === "admin" ? "Admin" : "B2B",
            "Total Activities": summary.total_actions,
            "Last Activity Date": new Date(summary.last_activity).toLocaleDateString(),
            "Last Activity Time": new Date(summary.last_activity).toLocaleTimeString(),
          };
        });

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "User Activity Summary");

        // Dynamic column widths based on content
        const columnCount = Object.keys(exportData[0] || {}).length;
        worksheet["!cols"] = Array(columnCount).fill({ wch: 20 });

        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const filename = `alzato_user_activity_summary_${timestamp}.xlsx`;

        XLSX.writeFile(workbook, filename);

        toast.success("Excel file exported successfully!");
      } else {
        // Export detailed activity logs (original datalist view)
        const exportUrl = `/api/admin/logs?${queryParams.toString()}&export=true`;
        const res = await fetch(exportUrl);
        const { data } = await res.json();

        const logsData = data.map((log: any) => {
          const md = log.metadata ?? {};
          const user = md.user ?? {};
          const ip = md.ip_info ?? {};
          const locationParts = [ip.city, ip.state, ip.country].filter(Boolean);

          return {
            User: user.full_name || user.username || "Unknown",
            Organization: user.organization || "Unknown",
            Email: log.user?.email ?? "-",
            Location: locationParts.join(", "),
            Action: log.event_type.replace("_", " "),
            Role: log.role === "admin" ? "Admin" : "B2B",
            Date: new Date(log.created_at).toLocaleDateString(),
            Time: new Date(log.created_at).toLocaleTimeString(),
          };
        });

        const worksheet = XLSX.utils.json_to_sheet(logsData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Activity Logs");

        worksheet["!cols"] = [
          { wch: 20 }, // User
          { wch: 25 }, // Organization
          { wch: 30 }, // Email
          { wch: 25 }, // Location
          { wch: 20 }, // Action
          { wch: 15 }, // Role
          { wch: 20 }, // Date
          { wch: 20 }, // Time
        ];

        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const filename = `alzato_activity_logs_${timestamp}.xlsx`;

        XLSX.writeFile(workbook, filename);

        toast.success("Excel file exported successfully!");
      }
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export Excel file");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* View Mode Tabs */}
        <Table
          title={
            viewMode === "datalist" ? "Activity Logs" : "User Activity Summary"
          }
          columns={
            viewMode === "datalist" ? dataListColumns : actionCountColumns
          }
          data={viewMode === "datalist" ? logs : userActionSummaries}
          searchQuery={search}
          onSearchChange={setSearch}
          setViewMode={setViewMode}
          viewMode={viewMode}
          isLoading={isLoading}
          searchParameters={["name", "organization"]}
          onPageChange={setPage}
          currentPage={page}
          total={
            viewMode === "datalist"
              ? logsData?.pagination?.total || 0
              : userActionSummaries.length
          }
          itemsPerPage={itemsPerPage}
          emptyMessage={
            viewMode === "datalist"
              ? "No logs found."
              : "No user activity found."
          }
          searchSelectFilters={searchSelectFilters}
          dateFilters={{
            from_date: search.from_date,
            to_date: search.to_date,
          }}
          filterTabs={filterTabs}
          activeFilter={activeTab}
          onFilterChange={setActiveTab}
          onExport={handleExportToExcel}
        />
      </div>
    </div>
  );
}
