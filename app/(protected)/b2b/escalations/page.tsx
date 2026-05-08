"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";
import AdvancedDataTable from "@/components/table/globalTable";
import { useFetch } from "@/hooks/api/useFetch";
import { mutate } from "swr";
import { toast } from "sonner";

type Escalation = {
    id: string;
    zone: string;
    user_message: string;
    level: string;
    user_id: string;
    created_at: string;
    user?: {
        full_name: string;
    };
    status?: string;
};

export default function EscalationsPage() {
    const router = useRouter();
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

    // Zone filter options
    const zoneOptions = [
        { value: "central", label: "Central" },
        { value: "east", label: "East" },
        { value: "west", label: "West" },
        { value: "north", label: "North" },
        { value: "south", label: "South" },
    ];

    const offset = (page - 1) * itemsPerPage;

    // Build API URL with filters
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

    const handleStatusChange = async (id: string, status: string) => {
        try {
            const response = await fetch(`/api/admin/escalations/updateescalation/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status }),
            });

            if (response.ok) {
                // Refresh the data
                await mutate(apiUrl);
            }
            toast.success("Status updated successfully");
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    // Table columns
    const columns = [
        {
            key: "zone",
            label: "Zone",
            render: (row: Escalation) => (
                <div>
                    <div className="text-xl font-medium text-gray-900">{row.zone}</div>
                </div>
            ),
        },
        {
            key: "user_message",
            label: "Message",
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
            label: "User",
            render: (row: Escalation) => (
                <div>
                    <div
                        title={row?.user?.full_name as string}
                        className="text-xl text-gray-500 w-72 truncate"
                    >
                        {row?.user?.full_name || "-"}
                    </div>
                </div>
            ),
        },
        {
            key: "status",
            label: "Status",
            render: (row: Escalation) => (
                <div>
                    <select
                        value={row.status || "open"}
                        onChange={(e) => handleStatusChange(row.id, e.target.value)}
                        name="status"
                        id="status"
                    >
                        <option  value="open"> Open</option>
                        <option  value="closed">Closed</option>
                    </select>
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
            key: "actions",
            label: "Action",
            render: (row: Escalation) => (
                <button
                    onClick={() => router.push(`/b2b/escalations/view/${row.id}`)}
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
                    title="Escalations"
                    columns={columns}
                    addHref="/b2b/escalations/add"
                    data={escalations}
                    sortKey={sortKey}
                    sortDir={sortDir}


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
                    isLoading={isLoading}
                    emptyMessage="No escalations found."
                />
            </div>
        </div>
    );
}
