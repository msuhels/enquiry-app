"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SaveIcon } from "lucide-react";
import { toast } from "sonner";
import Breadcrumbs from "@/components/ui/breadCrumbs";
import { useFetch } from "@/hooks/api/useFetch";

export default function NewEscalationPage() {
    const router = useRouter();

    const [zone, setZone] = useState("");
    const [userMessage, setUserMessage] = useState("");
    const [level, setLevel] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: userData } = useFetch("/api/admin/users/getAuthUser");

    const zoneOptions = [
        { value: "central", label: "Central" },
        { value: "east", label: "East" },
        { value: "west", label: "West" },
        { value: "north", label: "North" },
        { value: "south", label: "South" },
    ];

    const levelOptions = [
        { value: "1", label: "Level 1" },
        { value: "2", label: "Level 2" },
        { value: "3", label: "Level 3" },
        { value: "4", label: "Level 4" },
        { value: "5", label: "Level 5" },
        { value: "6", label: "Sales and Marketing" },
    ];


    // Function to get zone-specific label for a level
    const getLevelLabel = (value: string) => {
        const zoneLabels: Record<string, Record<string, string>> = {
            central: {
                "1": "Level 1 - Admission to Pre enrolment-Ms. Anamika Tiwari",
                "2": "Level 1 - Visa Applications-Ms. Shivangi Patwa",
                "3": "Level 2 - Admission to Visa-Mr. Nikita Rahangdale",
                "4": "Level 3 - Admission to Visa-Mr. Ravi Upadhyay",
                "5": "Level 4 - Final Escalation for entire process- Director Office Sales and Marketing- Mr. Amit Upadhyay",
                "6": "Sales and Marketing - Mr. Amit Upadhyay"
            },
            east: {
                "1": "Level 1 - Admission to Pre enrolment-Ms. Anamika Tiwari",
                "2": "Level 1 - Visa Applications-Ms. Shivangi Patwa",
                "3": "Level 2 - Admission to Visa-Mr. Nikita Rahangdale",
                "4": "Level 3 - Admission to Visa-Mr. Ravi Upadhyay",
                "5": "Level 4 - Final Escalation for entire process- Director Office Sales and Marketing- Mr. Amit Upadhyay",
                "6": "Sales and Marketing - Mr. Amit Upadhyay"
            },
            west: {
                "1": "Level 1 - Admission to Pre enrolment-Ms. Anamika Tiwari",
                "2": "Level 1 - Visa Applications-Ms. Shivangi Patwa",
                "3": "Level 2 - Admission to Visa-Mr. Nikita Rahangdale",
                "4": "Level 3 - Admission to Visa-Mr. Ravi Upadhyay",
                "5": "Level 4 - Final Escalation for entire process- Director Office Sales and Marketing- Mr. Amit Upadhyay",
                "6": "Sales and Marketing - Mr. Amit Upadhyay"
            },
            north: {
                "1": "Level 1 - Admission to Pre enrolment-Ms. Anamika Tiwari",
                "2": "Level 1 - Visa Applications-Ms. Shivangi Patwa",
                "3": "Level 2 - Admission to Visa-Mr. Amit Upadhyay",
                "4": "Level 3 - Admission to Visa-Mr. Ravi Upadhyay",
                "5": "Level 4 - Final Escalation for entire process- Director Office Sales and Marketing- Mr. Amit Upadhyay",
                "6": "Sales and Marketing - Mr. Amit Upadhyay"
            },
            south: {
                "1": "Level 1 - Admission to Pre enrolment-Ms. Anamika Tiwari",
                "2": "Level 1 - Visa Applications-Ms. Shivangi Patwa",
                "3": "Level 2 - Admission to Visa-Ms. Nargis",
                "4": "Level 3 - Admission to Visa-Mr. Ravi Upadhyay",
                "5": "Level 4 - Final Escalation for entire process- Director Office Sales and Marketing- Mr. Amit Upadhyay",
                "6": "Sales and Marketing - Mr. Amit Upadhyay"
            },
        };

        // Default labels when no zone is selected



        return zoneLabels[zone]?.[value] || "";
    };


    const handleSubmit = async () => {
        if (!zone) {
            toast.error("Please select a zone");
            return;
        }

        if (!userMessage.trim()) {
            toast.error("Please enter a message");
            return;
        }

        if (!level) {
            toast.error("Please select a level");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch("/api/admin/escalations/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    zone,
                    user_message: userMessage.trim(),
                    level,
                }),
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || "Failed to create escalation");
            }

            toast.success("Escalation created successfully!");
            router.push("/b2b/escalations");
        } catch (error: any) {
            toast.error(error.message);
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
                        Create Escalation
                    </h1>

                    <p className="mt-2 text-xl text-gray-600">
                        Submit a new escalation request
                    </p>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-lg">
                    <div className="space-y-6">
                        {/* Zone */}
                        <div>
                            <label className="mb-2 block text-lg font-semibold text-gray-700">
                                Zone <span className="text-red-500">*</span>
                            </label>

                            <select
                                value={zone}
                                onChange={(e) => setZone(e.target.value)}
                                className="w-full rounded-xl border px-4 py-3 text-lg focus:border-[#3a3886] focus:outline-none focus:ring-2 focus:ring-[#3a3886]/20"
                            >
                                <option value="">Select Zone</option>
                                {zoneOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Level */}
                        <div>
                            <label className="mb-2 block text-lg font-semibold text-gray-700">
                                {zone ? `${zone.charAt(0).toUpperCase() + zone.slice(1)} ` : ""}{level === "6" ? "Option" : "Level"} <span className="text-red-500">*</span>
                            </label>

                            <select
                                value={level}
                                onChange={(e) => setLevel(e.target.value)}
                                disabled={!zone}
                                className={`w-full rounded-xl border px-4 py-3 text-lg focus:border-[#3a3886] focus:outline-none focus:ring-2 focus:ring-[#3a3886]/20 ${!zone ? "bg-gray-100 cursor-not-allowed" : ""}`}>
                                <option value="" disabled={!zone}>
                                    {zone ? (level === "6" ? "Select Option" : "Select Level") : "Select Zone First"}
                                </option>
                                {zone && levelOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {getLevelLabel(option.value)}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* Message */}
                        <div>
                            <label className="mb-2 block text-lg font-semibold text-gray-700">
                                Message <span className="text-red-500">*</span>
                            </label>

                            <textarea
                                value={userMessage}
                                onChange={(e) => setUserMessage(e.target.value)}
                                placeholder="Enter your message"
                                rows={6}
                                className="w-full rounded-xl border px-4 py-3 text-lg focus:border-[#3a3886] focus:outline-none focus:ring-2 focus:ring-[#3a3886]/20 resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-8 flex justify-end gap-4">
                    <Link
                        href="/b2b/escalations"
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

                        {isSubmitting ? "Processing..." : "Submit Escalation"}
                    </button>
                </div>
            </div>
        </div>
    );
}
