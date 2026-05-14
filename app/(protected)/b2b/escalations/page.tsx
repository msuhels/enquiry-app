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
    const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

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

    const offset = (page - 1) * itemsPerPage;

    // Build API URL with filters
    const apiUrl = `/api/admin/escalations?search=${encodeURIComponent(
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

    const handleStatusChange = async (id: string) => {
        const currentStatus = escalations.find(e => e.id === id)?.status || "open";
        const newStatus = currentStatus === "open" ? "closed" : "open";

        setLoadingStates(prev => ({ ...prev, [id]: true }));
        try {
            const response = await fetch(`/api/admin/escalations/updateescalation/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status: newStatus }),
            });

            if (response.ok) {
                // Refresh the data
                await mutate(apiUrl);
            }
            toast.success("Status updated successfully");
        } catch (error) {
            console.error("Error updating status:", error);
        } finally {
            setLoadingStates(prev => ({ ...prev, [id]: false }));
            setEscalations((prev) =>
                prev.map((e) =>
                    e.id === id ? { ...e, status: newStatus } : e
                )
            );
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "open":
                return "bg-emerald-100 text-emerald-800 border-emerald-200";
            case "closed":
                return "bg-amber-100 text-amber-800 border-amber-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    // Table columns
    const columns = [
        {
            key: "zone",
            label: "Zone",
            render: (row: Escalation) => (
                <div>
                    <div className="text-xl font-medium text-gray-900">{zoneDisplayNames[row.zone?.toLowerCase()] || row.zone}</div>
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
                        {getSimpleLevel(row.level)}
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
                return (
                    <div className="flex flex-col gap-1">
                        <button
                            disabled={loadingStates[row.id]}
                            onClick={() => handleStatusChange(row.id)}
                            className={`
                        flex items-center justify-center gap-2 px-4 py-2 rounded-lg border font-medium text-sm capitalize
                        transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
                        ${getStatusColor(status)}
                        ${loadingStates[row.id] ? 'opacity-70' : 'hover:scale-105 hover:shadow-md'}
                    `}
                        >
                            {loadingStates[row.id] ? (
                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <span className={`w-2 h-2 rounded-full ${status === "open" ? "bg-emerald-500" : "bg-amber-500"}`}></span>
                            )}
                            {status}
                        </button>
                        <span className="text-[10px] text-center">
                            Click to {status === "open" ? "close" : "open"}
                        </span>
                    </div>
                );
            },
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
                    searchQuery={search}
                    onSearchChange={handleSearchChange}
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
