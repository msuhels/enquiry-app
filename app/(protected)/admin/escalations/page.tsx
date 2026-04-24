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
  created_at: string;
  updated_at: string;
}

const escalationpage = () => {
  const [escalations, setEscalations] = useState<Escalation[]>([]);
  const [search, setSearch] = useState<Record<string, string>>({ "title and description": "" });
  const [sortKey, setSortKey] = useState("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [debouncedSearch] = useDebounce(search, 400);
  const router = useRouter();

  const offset = (page - 1) * itemsPerPage;

  const apiUrl = `/api/admin/escalations/getallescalations?search=${encodeURIComponent(
    debouncedSearch["title and description"] || ""
  )}&limit=${itemsPerPage}&offset=${offset}`;

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
          <div className="text-xl font-medium text-gray-900">{row.zone}</div>
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
            {row.level}
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
      key: "action",
      label: "Action",
      render: (row: Escalation) => (
        <button onClick={() => router.push(`/admin/escalations/view/${row.id}`)}>
          view
        </button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto p-8">
        <AdvancedDataTable
          title="Escalations"
          columns={columns}
          data={escalations}
          sortKey={sortKey}
          sortDir={sortDir}
          searchQuery={search}
          onSearchChange={handleSearchChange}
          searchParameters={["title and description"]}
          onSortChange={(key, dir) => {
            setSortKey(key);
            setSortDir(dir);
          }}
          onPageChange={setPage}
          currentPage={page}
          total={data?.pagination?.total || 0}
          itemsPerPage={itemsPerPage}
          isLoading={isLoading}
          emptyMessage="No escalations found."
        />
      </div>
    </div>
  );
};

export default escalationpage;