import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/adapters/server";

// Rating value mapping (converted to 5-point scale)
// "Very Good" (4) becomes 5/5, others are proportionally calculated
const RATING_VALUES: Record<string, number> = {
    "Very Good": 5,
    "Good": 3.75,
    "Average": 2.5,
    "Poor": 1.25
};

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
        // Get all feedbacks
        const { data: feedbacks, error: feedbackError } = await supabase
            .from("feedbacks")
            .select("id, department")
            .order("created_at", { ascending: false });

        if (feedbackError) {
            console.error("Error fetching feedbacks:", feedbackError);
            return new NextResponse("Error fetching feedbacks", { status: 500 });
        }

        // Get all ratings from feedback_ratings table
        const { data: allRatings, error: ratingsError } = await supabase
            .from("feedback_ratings")
            .select("*");

        if (ratingsError) {
            console.error("Error fetching ratings:", ratingsError);
            return new NextResponse("Error fetching ratings", { status: 500 });
        }

        // Convert ratings to numbers and calculate analytics
        const totalRatings = allRatings?.length || 0;
        let totalRatingValue = 0;

        // Rating distribution
        const ratingDistribution: Record<string, number> = {
            "Very Good": 0,
            "Good": 0,
            "Average": 0,
            "Poor": 0
        };

        // Department stats
        const deptStats: Record<string, { total: number; count: number }> = {};

        // Parameter stats
        const parameterStats: Record<string, { total: number; count: number; ratings: Record<string, number> }> = {};

        allRatings?.forEach((rating) => {
            const numericValue = RATING_VALUES[rating.rating] || 0;
            totalRatingValue += numericValue;

            // Rating distribution
            if (ratingDistribution[rating.rating] !== undefined) {
                ratingDistribution[rating.rating]++;
            }

            // Department stats
            const dept = rating.department?.toLowerCase() || 'unknown';
            if (!deptStats[dept]) {
                deptStats[dept] = { total: 0, count: 0 };
            }
            deptStats[dept].total += numericValue;
            deptStats[dept].count += 1;

            // Parameter stats
            if (!parameterStats[rating.parameter]) {
                parameterStats[rating.parameter] = {
                    total: 0,
                    count: 0,
                    ratings: { "Very Good": 0, "Good": 0, "Average": 0, "Poor": 0 }
                };
            }
            parameterStats[rating.parameter].total += numericValue;
            parameterStats[rating.parameter].count += 1;
            if (parameterStats[rating.parameter].ratings[rating.rating] !== undefined) {
                parameterStats[rating.parameter].ratings[rating.rating]++;
            }
        });

        // Calculate overall average
        const overallAverage = totalRatings > 0 ? (totalRatingValue / totalRatings).toFixed(1) : '0.0';
        const totalFeedbacks = feedbacks?.length || 0;

        // Department analytics
        const departmentAnalytics = Object.entries(deptStats).map(([dept, stats]) => ({
            department: dept.charAt(0).toUpperCase() + dept.slice(1),
            averageRating: stats.count > 0 ? (stats.total / stats.count).toFixed(1) : '0.0',
            totalRatings: stats.count,
            percentage: totalRatings > 0 ? Math.round((stats.count / totalRatings) * 100) : 0
        }));

        // Sort by average rating descending
        departmentAnalytics.sort((a, b) => parseFloat(b.averageRating) - parseFloat(a.averageRating));

        // Top performing parameters (highest average)
        const topParameters = Object.entries(parameterStats)
            .map(([param, stats]) => ({
                parameter: param,
                averageRating: stats.count > 0 ? (stats.total / stats.count).toFixed(1) : '0.0',
                totalRatings: stats.count,
                ratings: stats.ratings
            }))
            .sort((a, b) => parseFloat(b.averageRating) - parseFloat(a.averageRating))
            .slice(0, 5);

        // Bottom performing parameters (lowest average)
        const bottomParameters = Object.entries(parameterStats)
            .map(([param, stats]) => ({
                parameter: param,
                averageRating: stats.count > 0 ? (stats.total / stats.count).toFixed(1) : '0.0',
                totalRatings: stats.count,
                ratings: stats.ratings
            }))
            .sort((a, b) => parseFloat(a.averageRating) - parseFloat(b.averageRating))
            .slice(0, 5);

        // Rating distribution with percentages
        const ratingDistributionWithPercent = Object.entries(ratingDistribution).map(([rating, count]) => ({
            rating,
            count,
            percentage: totalRatings > 0 ? Math.round((count / totalRatings) * 100) : 0
        }));

        return NextResponse.json({
            success: true,
            data: {
                // Basic stats
                totalFeedbacks,
                totalRatings,
                overallAverage,

                // Department breakdown
                departmentAnalytics,

                // Rating distribution
                ratingDistribution: ratingDistributionWithPercent,

                // Top/Bottom parameters
                topParameters,
                bottomParameters
            }
        });
    } catch (error) {
        console.error("Error in feedback analytics API:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

