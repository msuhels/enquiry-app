"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SaveIcon, Check } from "lucide-react";
import { toast } from "sonner";
import Breadcrumbs from "@/components/ui/breadCrumbs";

type RatingValue = "Very Good" | "Good" | "Average" | "Poor";

interface ParameterRating {
    department: string;
    parameter: string;
    rating: RatingValue | "";
    remark: string;
}

const departmentParameters: Record<string, { department: string, parameter: string }[]> = {
    sales: [
        { department: "sales", parameter: "Marketing Material Quality" },
        { department: "sales", parameter: "Lead Response Time" },
        { department: "sales", parameter: "Sales Assistance Support" },
        { department: "sales", parameter: "Course Options Availability" },
        { department: "sales", parameter: "Query Resolution Speed" },
        { department: "sales", parameter: "Communication & Coordination" },
        { department: "sales", parameter: "Product & Process Training" },
        { department: "sales", parameter: "Overall Experience" },
    ],
    admission: [
        { department: "admission", parameter: "Documentation Checking Accuracy" },
        { department: "admission", parameter: "Document Correction Support" },
        { department: "admission", parameter: "SOP Writing Quality" },
        { department: "admission", parameter: "CV Editing & Profile Enhancement" },
        { department: "admission", parameter: "Application Submission Timeliness" },
        { department: "admission", parameter: "University Follow-up Efficiency" },
        { department: "admission", parameter: "Offer / Rejection Updates Speed" },
        { department: "admission", parameter: "Interview Preparation and dealines Support" },
        { department: "admission", parameter: "Exam Guidance (if required)" },
        { department: "admission", parameter: "Deadline Management (Opening/Closing)" },
        { department: "admission", parameter: "Regular Updates & Communication" },
        { department: "admission", parameter: "Issue Resolution / Escalation Handling" },
        { department: "admission", parameter: "Overall Application Handling Experience" },
    ],
    scholarship: [
        { department: "scholarship", parameter: "Scholarship Information Clarity" },
        { department: "scholarship", parameter: "Timely Sharing of Scholarship Options" },
        { department: "scholarship", parameter: "Document Requirement Guidance" },
        { department: "scholarship", parameter: "Documentation Checking Accuracy" },
        { department: "scholarship", parameter: "Application Submission Timeliness" },
        { department: "scholarship", parameter: "Follow-ups on Scholarship Status" },
        { department: "scholarship", parameter: "Communication & Updates" },
        { department: "scholarship", parameter: "Transparency in Chances / Outcomes" },
        { department: "scholarship", parameter: "Overall Scholarship Support Experience" }
    ],
    visa: [
        { department: "visa", parameter: "Visa Process Explanation Clarity" },
        { department: "visa", parameter: "Documentation Guidance" },
        { department: "visa", parameter: "Documentation Checking Accuracy" },
        { department: "visa", parameter: "Financial Documentation Support" },
        { department: "visa", parameter: "Visa Letter Preparation" },
        { department: "visa", parameter: "Appointment Booking Support" },
        { department: "visa", parameter: "Interview Preparation (if applicable)" },
        { department: "visa", parameter: "Timely Updates & Communication" },
        { department: "visa", parameter: "Handling of Queries / Urgent Cases" },
        { department: "visa", parameter: "Transparency in Chances / Risk" },
        { department: "visa", parameter: "Rejection Handling & Re-application Support" },
        { department: "visa", parameter: "Overall Visa Process Experience" }

    ],
    overall: [
        { department: "sales", parameter: " Marketing Material Quality" },
        { department: "sales", parameter: "Lead Handling & Counseling" },
        { department: "sales", parameter: "Objection Handling and Response Time" },
        { department: "admission", parameter: "Documentation & SOP/CV Support" },
        { department: "admission", parameter: "Application Submission Timeliness" },
        { department: "admission", parameter: "University Follow-ups & Updates" },
        { department: "scholarship", parameter: "Scholarship Guidance & Clarity" },
        { department: "scholarship", parameter: "Scholarship Documentation Guidance" },
        { department: "scholarship", parameter: "Application Support & Updates" },
        { department: "visa", parameter: "Documentation & Financial Guidance" },
        { department: "visa", parameter: "Interview / Appointment Support" },
        { department: "visa", parameter: "Communication & Transparency" },
        { department: "overall", parameter: "End-to-End Experience" }

    ]
};

const ratingOptions: RatingValue[] = ["Very Good", "Good", "Average", "Poor"];

const improvementOptions: Record<string, string[]> = {
    "sales": [
        "Faster Response Required",
        "Better Training Needed",
        "More Marketing Support",
        "Better Conversion Support",
        "More Transparency"
    ],
    "admission": [
        "Documentation Stage",
        "SOP / CV Stage",
        "Application Submission",
        "University Follow-ups",
        "Communication Delays",
        "Lack of Updates"
    ],
    "scholarship": [
        "Understanding Eligibility",
        "Documentation Requirements",
        "Application Deadlines",
        "Lack of Updates",
        "Low Success Rate",
        "Student Expectations Mismatch"
    ],
    "visa": [
        "Documentation Preparation",
        "Financial Requirements",
        "Appointment Delays",
        "Interview Preparation",
        "Lack of Updates",
        "Student Fear / Confusion"
    ]
};

const ratingColors: Record<RatingValue, string> = {
    "Very Good": "bg-green-500 hover:bg-green-600",
    "Good": "bg-blue-500 hover:bg-blue-600",
    "Average": "bg-yellow-500 hover:bg-yellow-600",
    "Poor": "bg-red-500 hover:bg-red-600"
};

export default function NewFeedbackPage() {
    const router = useRouter();

    const [department, setDepartment] = useState("");
    const [ratings, setRatings] = useState<ParameterRating[]>([]);
    const [openFeedback, setOpenFeedback] = useState("");
    const [improvementArea, setImprovementArea] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const departmentOptions = [
        { value: "sales", label: "Sales" },
        { value: "admission", label: "Admission" },
        { value: "scholarship", label: "Scholarship" },
        { value: "visa", label: "Visa" },
        { value: "overall", label: "Overall Feedback" },
    ];

    const handleDepartmentChange = (dept: string) => {
        setDepartment(dept);
        if (dept && departmentParameters[dept]) {
            const initialRatings: ParameterRating[] = departmentParameters[dept].map(item => ({
                department: item.department,
                parameter: item.parameter,
                rating: "",
                remark: ""
            }));
            setRatings(initialRatings);
        } else {
            setRatings([]);
        }
    };

    const handleRatingChange = (index: number, rating: RatingValue) => {
        const newRatings = [...ratings];
        newRatings[index] = { ...newRatings[index], rating };
        setRatings(newRatings);
    };

    const handleRemarkChange = (index: number, remark: string) => {
        const newRatings = [...ratings];
        newRatings[index] = { ...newRatings[index], remark };
        setRatings(newRatings);
    };

    const handleImprovementChange = (option: string) => {
        setImprovementArea(improvementArea === option ? "" : option);
    };

    const handleSubmit = async () => {
        if (!department) {
            toast.error("Please select a department");
            return;
        }

        if (ratings.length === 0) {
            toast.error("Please select a department to see rating parameters");
            return;
        }

        const hasAllRatings = ratings.every(r => r.rating);
        if (!hasAllRatings) {
            toast.error("Please provide rating for all parameters");
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
                    improvement_area: improvementArea || undefined,
                    open_feedback: openFeedback.trim() || undefined,
                    ratings: ratings.map(r => ({
                        department: r.department,
                        parameter: r.parameter,
                        rating: r.rating,
                        remark: r.remark.trim()
                    }))
                }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Failed to create feedback");
            }

            toast.success("Feedback submitted successfully!");
            router.push("/b2b/feedbacks");
        } catch (error: any) {
            toast.error(error.message || "Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    const groupedRatings = ratings.reduce((acc, item) => {
        if (!acc[item.department]) acc[item.department] = [];
        acc[item.department].push(item);
        return acc;
    }, {} as Record<string, ParameterRating[]>);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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

                <div className="rounded-2xl bg-white shadow-xl">
                    <div className="p-6 sm:p-8">
                        <div className="space-y-8">
                            {/* Department Selection */}
                            <div>
                                <label className="mb-3 block text-lg font-semibold text-gray-800">
                                    Department <span className="text-red-500">*</span>
                                </label>

                                <div className="relative">
                                    <select
                                        value={department}
                                        onChange={(e) => handleDepartmentChange(e.target.value)}
                                        className="w-full appearance-none rounded-xl border-2 border-gray-200 bg-white px-4 py-4 pr-10 text-lg text-gray-700 transition-all focus:border-[#3a3886] focus:outline-none focus:ring-4 focus:ring-[#3a3886]/10"
                                    >
                                        <option value="">Select Department</option>
                                        {departmentOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Rating Table Section */}
                            {department && ratings.length > 0 && (
                                <div className="overflow-hidden rounded-xl border border-gray-200">

                                    {/* Header */}
                                    <div className="grid grid-cols-12 bg-[#3a3886] text-white text-sm font-semibold">
                                        <div className="col-span-4 px-4 py-3">Parameter</div>
                                        <div className="col-span-1 text-center py-3">Very Good</div>
                                        <div className="col-span-1 text-center py-3">Good</div>
                                        <div className="col-span-1 text-center py-3">Average</div>
                                        <div className="col-span-1 text-center py-3">Poor</div>
                                        <div className="col-span-4 px-4 py-3">Remarks</div>
                                    </div>

                                    {/* Body */}
                                    <div className="divide-y">
                                        {department === "overall" ? (
                                            // ✅ GROUPED VIEW (for overall)
                                            Object.entries(groupedRatings).map(([dept, items]) => (
                                                <div key={dept}>

                                                    {/* Department Header */}
                                                    <div className="bg-gray-100 px-4 py-2 font-semibold text-[#3a3886] uppercase">
                                                        {dept}
                                                    </div>

                                                    {items.map((item) => {
                                                        const realIndex = ratings.findIndex(
                                                            r => r.parameter === item.parameter && r.department === item.department
                                                        );

                                                        return (
                                                            <div key={item.parameter} className="grid grid-cols-12 items-center bg-white hover:bg-gray-50">

                                                                {/* Parameter */}
                                                                <div className="col-span-4 px-4 py-3 text-sm font-medium text-gray-700">
                                                                    {item.parameter}
                                                                </div>

                                                                {/* Ratings */}
                                                                {ratingOptions.map((option) => (
                                                                    <div key={option} className="col-span-1 flex justify-center">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={item.rating === option}
                                                                            onChange={() => handleRatingChange(realIndex, option)}
                                                                            className="h-5 w-5 cursor-pointer accent-[#3a3886]"
                                                                        />
                                                                    </div>
                                                                ))}

                                                                {/* Remark */}
                                                                <div className="col-span-4 px-4 py-3">
                                                                    <input
                                                                        type="text"
                                                                        value={item.remark}
                                                                        onChange={(e) => handleRemarkChange(realIndex, e.target.value)}
                                                                        placeholder="Add remark"
                                                                        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-[#3a3886] focus:outline-none"
                                                                    />
                                                                </div>

                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ))
                                        ) : (
                                            // ✅ NORMAL VIEW (existing one)
                                            ratings.map((item, index) => (
                                                <div key={item.parameter} className="grid grid-cols-12 items-center bg-white hover:bg-gray-50">

                                                    <div className="col-span-4 px-4 py-3 text-sm font-medium text-gray-700">
                                                        {item.parameter}
                                                    </div>

                                                    {ratingOptions.map((option) => (
                                                        <div key={option} className="col-span-1 flex justify-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={item.rating === option}
                                                                onChange={() => handleRatingChange(index, option)}
                                                                className="h-5 w-5 cursor-pointer accent-[#3a3886]"
                                                            />
                                                        </div>
                                                    ))}

                                                    <div className="col-span-4 px-4 py-3">
                                                        <input
                                                            type="text"
                                                            value={item.remark}
                                                            onChange={(e) => handleRemarkChange(index, e.target.value)}
                                                            placeholder="Add remark"
                                                            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-[#3a3886] focus:outline-none"
                                                        />
                                                    </div>

                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Overall Feedback Section - For all departments including overall */}
                            {department && ratings.length > 0 && (
                                <div className="space-y-4">
                                    <div className="border-b-2 border-gray-100 pb-4">
                                        <h2 className="text-2xl font-bold text-[#3a3886]">
                                            Overall Feedback
                                        </h2>
                                        <p className="mt-1 text-gray-500">
                                            Share your overall experience or suggestions
                                        </p>
                                    </div>

                                    <textarea
                                        value={openFeedback}
                                        onChange={(e) => setOpenFeedback(e.target.value)}
                                        placeholder="Enter your overall feedback or comments..."
                                        rows={4}
                                        className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-4 text-lg text-gray-700 transition-all focus:border-[#3a3886] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#3a3886]/10 resize-none"
                                    />
                                </div>
                            )}


                            {/* Key Improvement Area Section */}

                            {department == "overall" ? (<></>) : (
                                <>
                                    {department && ratings.length > 0 && (
                                        <div className="space-y-4">
                                            <div className="border-b-2 border-gray-100 pb-4">
                                                <h2 className="text-2xl font-bold text-[#3a3886]">
                                                    Key Improvement Area
                                                </h2>
                                                <p className="mt-1 text-gray-500">
                                                    Select one area that needs improvement
                                                </p>
                                            </div>

                                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                                {improvementOptions[department]?.map((option) => (
                                                    <button
                                                        key={option}
                                                        type="button"
                                                        onClick={() => handleImprovementChange(option)}
                                                        className={`flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all ${improvementArea === option
                                                            ? "border-[#3a3886] bg-[#3a3886]/5 shadow-md"
                                                            : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                                                            }`}
                                                    >
                                                        <div className={`flex h-6 w-6 items-center justify-center rounded-md border-2 transition-all ${improvementArea === option
                                                            ? "border-[#3a3886] bg-[#3a3886]"
                                                            : "border-gray-300"
                                                            }`}>
                                                            {improvementArea === option && (
                                                                <Check className="h-4 w-4 text-white" />
                                                            )}
                                                        </div>
                                                        <span className={`text-sm font-medium ${improvementArea === option
                                                            ? "text-[#3a3886]"
                                                            : "text-gray-600"
                                                            }`}>
                                                            {option}
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>

                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-4 border-t border-gray-100 bg-gray-50 px-6 py-4 sm:flex-row sm:justify-end sm:gap-4 sm:px-8 sm:py-6">
                        <Link
                            href="/b2b/feedbacks"
                            className="flex items-center justify-center rounded-xl border-2 border-gray-300 px-6 py-3 text-base font-semibold text-gray-600 transition-all hover:border-gray-400 hover:bg-gray-100"
                        >
                            Cancel
                        </Link>

                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || !department || ratings.length === 0}
                            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#3a3886] to-[#5a5896] px-8 py-3 text-base font-semibold text-white shadow-lg transition-all hover:from-[#2d2b6b] hover:to-[#4a4896] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
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
        </div>
    );
}
