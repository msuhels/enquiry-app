"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import AdvancedDataTable from "@/components/table/globalTable";
import { useFetch } from "@/hooks/api/useFetch";
import { useRouter } from "next/navigation";

interface Escalation {
  id: string;
  zone: string;
  user_message: string;
  level: string;
  user: {
    full_name: string;
  };
  status: string;
  created_at: string;
  updated_at: string;
}

const escalationpage = () => {
  const [escalations, setEscalations] = useState<Escalation[]>([]);
  const [search, setSearch] = useState<Record<string, string>>({
    "search escalation users": "",
    zone: "",
    from_date: new Date().toISOString().slice(0, 10),
    to_date: new Date().toISOString().slice(0, 10),
  });
  const [sortKey, setSortKey] = useState("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [debouncedSearch] = useDebounce(search, 400);
  const router = useRouter();

  // Zone filter options
  const zoneOptions = [
    { value: "central", label: "Central" },
    { value: "east", label: "East" },
    { value: "west", label: "West" },
    { value: "north", label: "North" },
    { value: "south", label: "South" },
  ];

  // Zone display names
  const zoneDisplayNames: Record<string, string> = {
    central: "Central",
    east: "East",
    west: "West",
    north: "North",
    south: "South",
  };

  // Get simple level display (Level 1, Level 2, etc.)
  const getSimpleLevel = (level: string) => {
    const levelMap: Record<string, string> = {
      "1": "Level 1",
      "2": "Level 1",
      "3": "Level 2",
      "4": "Level 3",
      "5": "Level 4",
    };
    return levelMap[level] || `Level ${level}`;
  };

  // Analytics data
  const [zoneAnalytics, setZoneAnalytics] = useState<Array<{ zone: string; count: number }>>([]);
  const [levelAnalytics, setLevelAnalytics] = useState<Array<{ level: string; count: number }>>([]);
  const [analyticsSummary, setAnalyticsSummary] = useState<{ totalEscalations: number; totalEnquiries: number }>({ totalEscalations: 0, totalEnquiries: 0 });

  // Fetch analytics data
  const { data: analyticsData, isLoading: analyticsLoading } = useFetch("/api/admin/analytics/zone-level");

  useEffect(() => {
    if (analyticsData?.success && analyticsData?.data) {
      setZoneAnalytics(analyticsData.data.zones || []);
      setLevelAnalytics(analyticsData.data.levels || []);
      setAnalyticsSummary(analyticsData.data.summary || { totalEscalations: 0, totalEnquiries: 0 });
    }
  }, [analyticsData]);

  const offset = (page - 1) * itemsPerPage;

  const apiUrl = `/api/admin/escalations/getallescalations?search=${encodeURIComponent(
    debouncedSearch["search escalation users"] || ""
  )}&zone=${encodeURIComponent(debouncedSearch.zone || "")}&from_date=${encodeURIComponent(debouncedSearch.from_date || "")}&to_date=${encodeURIComponent(debouncedSearch.to_date || "")}&limit=${itemsPerPage}&offset=${offset}`;

  const { data, isLoading } = useFetch(apiUrl);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    if (data?.success) {
      setEscalations(data.data);
    }
  }, [data]);

  const handleSearchChange = (val: Record<string, string>) => {
    setSearch(val);
  };

  // Define table columns
  const columns = [
    {
      key: "Zone",
      label: "Zone",
      render: (row: Escalation) => (
        <div>
          <div className="text-xl font-medium text-gray-900">{zoneDisplayNames[row.zone?.toLowerCase()] || row.zone}</div>
        </div>
      ),
    },
    {
      key: "user_message",
      label: "User Message",
      render: (row: Escalation) => (
        <div>
          <div
            title={row?.user_message as string}
            className="text-xl text-gray-500 w-72 truncate"
          >
            {row.user_message}
          </div>
        </div>
      ),
    },
    {
      key: "level",
      label: "Level",
      render: (row: Escalation) => (
        <div>
          <div
            title={row?.level as string}
            className="text-xl text-gray-500 w-72 truncate"
          >
            {getSimpleLevel(row.level)}
          </div>
        </div>
      ),
    },
    {
      key: "user",
      label: "user",
      render: (row: Escalation) => (
        <div>
          <div
            title={row?.user?.full_name as string}
            className="text-xl text-gray-500 w-72 truncate"
          >
            {row?.user?.full_name}
          </div>
        </div>
      ),
    },

    {
      key: "created_at",
      label: "Created At",
      render: (row: Escalation) => (
        <div className="text-xl font-medium text-gray-900">
          {row.created_at ? new Date(row.created_at).toLocaleDateString() : "-"}
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row: Escalation) => {
        const status = row.status || "open";
        const isOpen = status === "open";
        return (
          <div className="flex items-center gap-2">
            <span className={`
                    inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium capitalize border
                    ${isOpen
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-amber-50 text-amber-700 border-amber-200"
              }
                `}>
              <span className={`w-2 h-2 rounded-full ${isOpen ? "bg-emerald-500" : "bg-amber-500 "}`}></span>
              {status}
            </span>
          </div>
        );
      },

    },
    {
      key: "action",
      label: "Action",
      render: (row: Escalation) => (
        <button onClick={() => router.push(`/admin/escalations/view/${row.id}`)}>
          view
        </button>
      ),
    },
  ];

  // Transform analytics data for 2 smaller cards (Zones and Levels)
  const escalationAnalyticsCards = [
    {
      title: "Zones",
      data: zoneAnalytics.map(z => ({ label: z.zone.charAt(0).toUpperCase() + z.zone.slice(1), value: z.count })),
      total: analyticsSummary.totalEscalations,
    },
    {
      title: "Levels",
      data: levelAnalytics.map(l => ({ label: ` ${l.level}`, value: l.count })),
      total: analyticsSummary.totalEscalations,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto p-8">

        {/* Escalations Table */}
        <AdvancedDataTable
          title="Escalations"
          columns={columns}
          data={escalations}
          sortKey={sortKey}
          sortDir={sortDir}
          searchQuery={search}
          onSearchChange={handleSearchChange}
          // searchParameters={["title and description"]}
          searchSelectFilters={[
            {
              key: "zone",
              label: "Zone",
              options: zoneOptions,
            },
          ]}
          dateFilters={{ from_date: search.from_date, to_date: search.to_date }}
          onSortChange={(key, dir) => {
            setSortKey(key);
            setSortDir(dir);
          }}
          onPageChange={setPage}
          currentPage={page}
          total={data?.pagination?.total || 0}
          itemsPerPage={itemsPerPage}
          escalationAnalyticsCards={escalationAnalyticsCards}
          isLoading={isLoading}
          emptyMessage="No escalations found."
        />
      </div>
    </div>
  );
};

export default escalationpage;