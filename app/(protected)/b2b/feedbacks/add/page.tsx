"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SaveIcon, Star } from "lucide-react";
import { toast } from "sonner";
import Breadcrumbs from "@/components/ui/breadCrumbs";

export default function NewFeedbackPage() {
    const router = useRouter();

    const [department, setDepartment] = useState("");
    const [rating, setRating] = useState("");
    const [remarks, setRemarks] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const departmentOptions = [
        { value: "sales", label: "Sales" },
        { value: "admission", label: "Admission" },
        { value: "scholarship", label: "Scholarship" },
        { value: "visa", label: "Visa" },
        { value: "post visa", label: "Post Visa" },
    ];


const handleSubmit = async () => {
    if (!department) {
        toast.error("Please select a department");
        return;
    }

    if (!rating) {
        toast.error("Please select a rating");
        return;
    }

    if (!remarks.trim()) {
        toast.error("Please enter a remark");
        return;
    }

    setIsSubmitting(true);

    try {
        const response = await fetch("/api/admin/feedbacks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                department,
                rating: parseInt(rating),
                remarks: remarks.trim(),
            }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || "Failed to create feedback");
        }

        await fetch("/api/admin/addnotification", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                notification_type: "feedback",
                reference_id: data.data.id,
                title: `New feedback submitted for ${department} department`,
                message: `A new feedback has been submitted for the ${department} department.`,
            }),
            });

        toast.success("Feedback submitted successfully!");
        router.push("/b2b/feedbacks");
    } catch (error: any) {
        toast.error(error.message || "Something went wrong");
    } finally {
        setIsSubmitting(false);
    }
};

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="px-4 py-8 sm:px-6 lg:px-8">
                <Breadcrumbs />

                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-[#3a3886]">
                        Create Feedback
                    </h1>

                    <p className="mt-2 text-xl text-gray-600">
                        Submit a new feedback
                    </p>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-lg">
                    <div className="space-y-6">
                        {/* Department */}
                        <div>
                            <label className="mb-2 block text-lg font-semibold text-gray-700">
                                Department <span className="text-red-500">*</span>
                            </label>

                            <select
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                className="w-full rounded-xl border px-4 py-3 text-lg focus:border-[#3a3886] focus:outline-none focus:ring-2 focus:ring-[#3a3886]/20"
                            >
                                <option value="">Select Department</option>
                                {departmentOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Rating */}
                        <div>
                            <label className="mb-2 block text-lg font-semibold text-gray-700">
                                Rating <span className="text-red-500">*</span>
                            </label>

                            <div className="flex gap-2 items-center h-[54px] rounded-xl border px-4 w-full border-gray-200 bg-white">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={`w-8 h-8 cursor-pointer transition-colors ${
                                            parseInt(rating) >= star
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "text-gray-300"
                                        }`}
                                        onClick={() => setRating(star.toString())}
                                    />
                                ))}
                                <span className="ml-2 text-gray-500 text-sm">
                                    {rating ? `${rating} out of 5` : "Select a rating"}
                                </span>
                            </div>
                        </div>

                        {/* Message */}
                        <div>
                            <label className="mb-2 block text-lg font-semibold text-gray-700">
                                Remark / Message <span className="text-red-500">*</span>
                            </label>

                            <textarea
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                placeholder="Enter your remark or message"
                                rows={6}
                                className="w-full rounded-xl border px-4 py-3 text-lg focus:border-[#3a3886] focus:outline-none focus:ring-2 focus:ring-[#3a3886]/20 resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-8 flex justify-end gap-4">
                    <Link
                        href="/b2b/feedbacks"
                        className="rounded-xl bg-gray-500 px-6 py-3 text-white hover:bg-gray-600"
                    >
                        Cancel
                    </Link>

                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex items-center gap-2 rounded-xl bg-[#3a3886] px-6 py-3 text-white hover:bg-[#2d2b6b] disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-b-transparent" />
                        ) : (
                            <SaveIcon className="h-5 w-5" />
                        )}

                        {isSubmitting ? "Processing..." : "Submit Feedback"}
                    </button>
                </div>
            </div>
        </div>
    );
}
 