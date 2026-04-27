"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft as ArrowLeftIcon, Star } from "lucide-react";
import Breadcrumbs from "@/components/ui/breadCrumbs";

type Feedback = {
    id: string;
    department: string;
    rating: number;
    remarks: string;
    user_id: string;
    created_at: string;
    user_full_name: string | null;
    user_email: string | null;
};

export default function ViewFeedbackPage() {
    const { id } = useParams();
    const router = useRouter();
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        const fetchFeedback = async () => {
            try {
                const res = await fetch(`/api/admin/feedbacks/${id}`);
                const data = await res.json();
                if (data.success) {
                    setFeedback(data.data);
                } else {
                    console.error("Error fetching feedback:", data.message);
                }
            } catch (error) {
                console.error("Error fetching feedback:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFeedback();
    }, [id]);

    if (loading)
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <p className="text-gray-600">Loading feedback...</p>
            </div>
        );

    if (!feedback)
        return (
            <div className="min-h-screen bg-gray-50 p-8 text-center text-gray-500">
                Feedback not found.
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
                                    Feedback Details
                                </h1>
                                <p className="text-sm text-gray-500 mt-2">
                                    Created on{" "}
                                    {new Date(feedback.created_at).toLocaleDateString("en-US", {
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
                                User Name
                            </label>
                            <p className="text-gray-900">{feedback.user_full_name || "N/A"}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <p className="text-gray-900">{feedback.user_email || "N/A"}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Department
                            </label>
                            <p className="text-gray-900 capitalize">{feedback.department}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Rating
                            </label>
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={`w-5 h-5 ${feedback.rating >= star
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "text-gray-300"
                                            }`}
                                    />
                                ))}
                                <span className="ml-2 text-gray-600">
                                    {feedback.rating} out of 5
                                </span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Remarks / Message
                            </label>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-gray-900 whitespace-pre-wrap">
                                    {feedback.remarks}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
