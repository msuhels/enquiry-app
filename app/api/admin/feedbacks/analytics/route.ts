import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/adapters/server";

export async function GET() {
    const supabase = await createClient();

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        // Get all feedbacks for analytics
        const { data: feedbacks, error } = await supabase
            .from("feedbacks")
            .select("department, rating")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching feedbacks for analytics:", error);
            return new NextResponse("Error fetching feedbacks", { status: 500 });
        }

        // Calculate analytics by department
        const deptStats: Record<string, { total: number; count: number }> = {};
        let totalRating = 0;
        
        feedbacks?.forEach((feedback) => {
            const dept = feedback.department?.toLowerCase() || 'unknown';
            if (!deptStats[dept]) {
                deptStats[dept] = { total: 0, count: 0 };
            }
            deptStats[dept].total += Number(feedback.rating) || 0;
            deptStats[dept].count += 1;
            totalRating += Number(feedback.rating) || 0;
        });

        const totalFeedbacks = feedbacks?.length || 0;
        const overallAverage = totalFeedbacks > 0 ? (totalRating / totalFeedbacks).toFixed(1) : '0.0';

        // Convert to analytics format
        const departmentAnalytics = Object.entries(deptStats).map(([dept, stats]) => ({
            department: dept.charAt(0).toUpperCase() + dept.slice(1),
            averageRating: stats.count > 0 ? (stats.total / stats.count).toFixed(1) : '0.0',
            totalFeedbacks: stats.count,
            percentage: totalFeedbacks > 0 ? Math.round((stats.count / totalFeedbacks) * 100) : 0
        }));

        // Sort by average rating descending
        departmentAnalytics.sort((a, b) => parseFloat(b.averageRating) - parseFloat(a.averageRating));

        return NextResponse.json({
            success: true,
            data: {
                overallAverage,
                totalFeedbacks,
                departmentAnalytics
            }
        });
    } catch (error) {
        console.error("Error in feedback analytics API:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

