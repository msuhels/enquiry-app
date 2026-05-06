'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDebounce } from 'use-debounce';

import Table from '@/components/table/globalTable';
import { useFetch } from '@/hooks/api/useFetch';

export default function FeedbacksPage() {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // Search/filter state
    const [search, setSearch] = useState({
        department: "",
        from_date: "",
        to_date: "",
    });

    const [debouncedSearch] = useDebounce(search, 400);

    // Reset to page 1 when filters change
    useEffect(() => {
        setPage(1);
    }, [debouncedSearch]);

    // Build query params
    const queryParams = new URLSearchParams();
    if (debouncedSearch.department) {
        queryParams.append("department", debouncedSearch.department);
    }
    if (debouncedSearch.from_date) {
        queryParams.append("from_date", debouncedSearch.from_date);
    }
    if (debouncedSearch.to_date) {
        queryParams.append("to_date", debouncedSearch.to_date);
    }

    const offset = (page - 1) * itemsPerPage;
    const apiUrl = `/api/admin/feedbacks?${queryParams.toString()}&page=${page}&limit=${itemsPerPage}`;

    const { data, isLoading, error } = useFetch(apiUrl);

    console.log("feedbacks API response:", { data, isLoading, error });
    const feedbacks = data?.data || [];

    const departmentOptions = [
        { value: "sales", label: "Sales" },
        { value: "admission", label: "Admission" },
        { value: "scholarship", label: "Scholarship" },
        { value: "visa", label: "Visa" },
        { value: "overall", label: "Overall Feedback" },
    ];

    const searchSelectFilters = [
        {
            key: "department",
            label: "Department",
            options: departmentOptions,
        },
    ];

    const columns = [
        {
            key: "department",
            label: "Department",
            sortable: true,
            render: (row: any) => (
                <span className="capitalize">{row.department || "-"}</span>
            )
        },
        {
            key: "createdby",
            label: "Created By",
            sortable: true,
            render: (row: any) => (
                <span>{row.createdby?.full_name || "Unknown"}</span>
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
        if (error) {
            console.error("API error:", error);
        }
    }, [data, error]);


    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Table
                    title="Feedbacks"
                    columns={columns}
                    data={feedbacks || []}
                    searchQuery={search}
                    onSearchChange={setSearch}
                    isLoading={isLoading}
                    searchSelectFilters={searchSelectFilters}
                    dateFilters={{ from_date: search.from_date, to_date: search.to_date }}
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
