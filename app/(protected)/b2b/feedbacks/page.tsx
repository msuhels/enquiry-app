'use client'

import AdvancedDataTable from '@/components/table/globalTable';
import { Star } from 'lucide-react';
import { useFetch } from '@/hooks/api/useFetch';
import { useEffect, useState } from 'react';

export default function FeedbacksPage() {
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const apiUrl = `/api/admin/feedbacks?page=${page}&limit=${itemsPerPage}`;

    const { data, isLoading, error } = useFetch(apiUrl);

    console.log("feedbacks API response:", { data, isLoading, error });
    const feedbacks = data?.data || [];

    // Reset to page 1 when itemsPerPage changes
    useEffect(() => {
        setPage(1);
    }, [itemsPerPage]);

    const columns = [
        {
            key: "department",
            label: "Department",
            sortable: true,
            render: (row: any) => (
                <span className="capitalize">{row.department}</span>
            )
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
                            className={`w-4 h-4 ${row.rating >= star
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                        />
                    ))}
                </div>
            ),
        },
        {
            key: "message",
            label: "Message",
            sortable: true,
            render: (row: any) => (
                <span className="line-clamp-2">{row.remarks}</span>
            ),
        },
        {
            key: "created_at",
            label: "Created At",
            sortable: true,
            render: (row: any) => new Date(row.created_at).toLocaleString(),
        },
    ];

    useEffect(() => {
        if (data) {
            console.log("Data structure:", JSON.stringify(data));
            if (data.success && Array.isArray(data.data)) {
                console.log("Setting feedbacks:", data.data);
            } else {
                console.log("Data success:", data.success, "Data:", data.data);
            }
        }
        if (error) {
            console.error("API error:", error);
        }
    }, [data, error]);


    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-full mx-auto p-8">
                <AdvancedDataTable
                    title="Feedbacks"
                    columns={columns}
                    addHref="/b2b/feedbacks/add"
                    data={feedbacks || []}
                    onPageChange={setPage}
                    currentPage={page}
                    total={data?.pagination?.total || 0}
                    itemsPerPage={itemsPerPage}
                    emptyMessage="No feedbacks found."
                />
            </div>
        </div>
    )
}
