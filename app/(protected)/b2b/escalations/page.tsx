"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdvancedDataTable from "@/components/table/globalTable";
import { useFetch } from "@/hooks/api/useFetch";

type Escalation = {
    id: string;
    zone: string;
    user_message: string;
    level: string;
    user_id: string;
    created_at: string;
};

export default function EscalationsPage() {
    const router = useRouter();
    const [escalations, setEscalations] = useState<Escalation[]>([]);

    // Call your API
    const { data, isLoading, error } = useFetch("/api/admin/escalations");

    // Debug logging
    console.log("Escalations API response:", { data, isLoading, error });

    useEffect(() => {
        if (data) {
            console.log("Data structure:", JSON.stringify(data));
            if (data.success && Array.isArray(data.data)) {
                console.log("Setting escalations:", data.data);
                setEscalations(data.data);
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
            key: "zone",
            label: "Zone",
            sortable: true,
        },
        {
            key: "user_message",
            label: "Message",
            sortable: true,
            render: (row: Escalation) => (
                <span className="line-clamp-2">{row.user_message}</span>
            ),
        },
        {
            key: "level",
            label: "Level",
            sortable: true,
            render: (row: Escalation) => (
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${row.level === "high"
                            ? "bg-red-100 text-red-800"
                            : row.level === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                        }`}
                >
                    {row.level}
                </span>
            ),
        },
        {
            key: "created_at",
            label: "Created At",
            sortable: true,
            render: (row: Escalation) => (
                <span>{new Date(row.created_at).toLocaleDateString()}</span>
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
                    isLoading={isLoading}
                    emptyMessage="No escalations found."
                />
            </div>
        </div>
    );
}
