'use client'

import AdvancedDataTable from '@/components/table/globalTable';
import { Star } from 'lucide-react';
import { useFetch } from '@/hooks/api/useFetch';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from "next/navigation";

function getColorForRating(rating: number) {
    if (rating >= 4) return 'green';
    if (rating >= 3) return 'yellow';
    if (rating >= 2) return 'orange';
    return 'red';
}

export default function FeedbacksPage() {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const offset = (page - 1) * itemsPerPage;
    const apiUrl = `/api/admin/feedbacks/admin?page=${page}&limit=${itemsPerPage}`;

    const { data, isLoading, error } = useFetch(apiUrl);

    console.log("feedbacks API response:", { data, isLoading, error });
    const feedbacks = data?.data || [];

    // Calculate average rating by department (for analytics)
    // Note: This needs all data, so we'll fetch separately for analytics
    const analyticsCards = useMemo(() => {
        if (!feedbacks || feedbacks.length === 0) return [];

        // Group by department and calculate average
        const deptStats: Record<string, { total: number; count: number }> = {};

        feedbacks.forEach((feedback: any) => {
            const dept = feedback.department?.toLowerCase() || 'unknown';
            if (!deptStats[dept]) {
                deptStats[dept] = { total: 0, count: 0 };
            }
            // Convert rating to number to avoid string concatenation
            deptStats[dept].total += Number(feedback.rating) || 0;
            deptStats[dept].count += 1;
        });

        // Convert to analytics format
        const deptData = Object.entries(deptStats).map(([dept, stats]) => ({
            label: dept.charAt(0).toUpperCase() + dept.slice(1),
            value: stats.count > 0 ? parseFloat((stats.total / stats.count).toFixed(1)) : 0,
            color: getColorForRating(stats.count > 0 ? Number(stats.total) / stats.count : 0)
        }));

        return [
            {
                title: "Avg Rating (out of 5) by Department",
                data: deptData,
                total: feedbacks.length
            }
        ];
    }, [feedbacks]);

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
        {
            key: "action",
            label: "Action",
            sortable: false,
            render: (row: any) => (
                <button
                    onClick={() => router.push(`/admin/feedbacks/view/${row.id}`)}
                    className="text-[#3A3886] hover:underline font-medium"
                >
                    View
                </button>
            ),
        },
    ];

    useEffect(() => {
        if (data) {
            console.log("Data structure:", JSON.stringify(data));
        }
        if (error) {
            console.error("API error:", error);
        }
    }, [data, error]);

    // Reset to page 1 when itemsPerPage changes
    useEffect(() => {
        setPage(1);
    }, [itemsPerPage]);


    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-full mx-auto p-8">
                <AdvancedDataTable
                    title="Feedbacks"
                    columns={columns}
                    analyticsCards={analyticsCards}
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
