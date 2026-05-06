"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Breadcrumbs from "@/components/ui/breadCrumbs";

type FeedbackRating = {
    id: string;
    feedback_id: string;
    department: string;
    parameter: string;
    rating: string;
    remark: string;
};

type Feedback = {
    id: string;
    department: string;
    improvement_area: string;
    open_feedback: string;
    user_id: string;
    created_at: string;
    user_full_name: string | null;
    user_email: string | null;
    ratings: FeedbackRating[];
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

    // Group ratings by department for "overall" feedback
    const groupedRatings = feedback.ratings?.reduce((acc, item) => {
        if (!acc[item.department]) acc[item.department] = [];
        acc[item.department].push(item);
        return acc;
    }, {} as Record<string, FeedbackRating[]>) || {};

    // Rating colors
    const getRatingColor = (rating: string) => {
        switch (rating) {
            case "Very Good":
                return "bg-green-100 text-green-800";
            case "Good":
                return "bg-blue-100 text-blue-800";
            case "Average":
                return "bg-yellow-100 text-yellow-800";
            case "Poor":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

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
                        {/* User Info */}
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

                        {/* Ratings Section */}
                        {feedback.ratings && feedback.ratings.length > 0 && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Ratings
                                </label>

                                {feedback.department === "overall" ? (
                                    // Grouped view for overall feedback
                                    Object.entries(groupedRatings).map(([dept, items]) => (
                                        <div key={dept} className="mb-6">
                                            <div className="bg-gray-100 px-4 py-2 font-semibold text-[#3a3886] uppercase text-sm mb-2 rounded">
                                                {dept}
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                {items.map((rating, idx) => (
                                                    <div key={idx} className="flex flex-col p-3 bg-gray-50 rounded-lg">
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-gray-700">{rating.parameter}</p>
                                                            {rating.remark && (
                                                                <p className="text-xs text-gray-500 mt-1">Remark: {rating.remark}</p>
                                                            )}
                                                        </div>
                                                        <div className="mt-2">
                                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRatingColor(rating.rating)}`}>
                                                                {rating.rating}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    // Normal view for single department - 3 column grid
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {feedback.ratings.map((rating, idx) => (
                                            <div key={idx} className="flex flex-col p-3 bg-gray-50 rounded-lg">
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-700">{rating.parameter}</p>
                                                    {rating.remark && (
                                                        <p className="text-xs text-gray-500 mt-1">Remark: {rating.remark}</p>
                                                    )}
                                                </div>
                                                <div className="mt-2">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRatingColor(rating.rating)}`}>
                                                        {rating.rating}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Improvement Area */}
                        {feedback.improvement_area && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Key Improvement Area
                                </label>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-gray-900">
                                        {feedback.improvement_area}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Open Feedback */}
                        {feedback.open_feedback && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Overall Feedback / Comments
                                </label>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-gray-900 whitespace-pre-wrap">
                                        {feedback.open_feedback}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-6 border-t border-gray-200">
                        {/* <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            ← Back to Feedbacks
                        </button> */}
                    </div>
                </div>
            </div>
        </div>
    );
}
