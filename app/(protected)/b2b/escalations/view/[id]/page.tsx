"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Breadcrumbs from "@/components/ui/breadCrumbs";

type Escalation = {
    id: string;
    zone: string;
    user_message: string;
    level: string;
    user_id: string;
    user: {
        full_name: string;
    };
    created_at: string;
};

export default function ViewEscalationPage() {
    const { id } = useParams();
    const router = useRouter();
    const [escalation, setEscalation] = useState<Escalation | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        const fetchEscalation = async () => {
            try {
                const res = await fetch(`/api/admin/escalations/${id}`);
                const data = await res.json();
                if (data.success) setEscalation(data.data);
            } catch (error) {
                console.error("Error fetching escalation:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEscalation();
    }, [id]);

    if (loading)
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <p className="text-gray-600">Loading escalation...</p>
            </div>
        );

    if (!escalation)
        return (
            <div className="min-h-screen bg-gray-50 p-8 text-center text-gray-500">
                Escalation not found.
            </div>
        );

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="p-8">
                <Breadcrumbs />

                <div className="bg-white shadow rounded-lg mt-4">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Escalation Details
                                </h1>
                                <p className="text-sm text-gray-500 mt-2">
                                    Created on{" "}
                                    {new Date(escalation.created_at).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </p>
                            </div>
                            
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Zone
                            </label>
                            <p className="text-gray-900">{escalation.zone}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Message
                            </label>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-gray-900 whitespace-pre-wrap">
                                    {escalation.user_message}
                                </p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                level
                            </label>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-gray-900">
                                    {escalation.level}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-gray-200">
                        {/* <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <ArrowLeftIcon className="w-4 h-4" />
                            Back to Escalations
                        </button> */}
                    </div>
                </div>
            </div>
        </div>
    );
}
