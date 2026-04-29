import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/adapters/server";

export async function GET(request: Request) {
    try {
        const supabase = await createClient();

        const { searchParams } = new URL(request.url);

        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const search = searchParams.get("search") || "";
        const department = searchParams.get("department") || "";
        const offset = (page - 1) * limit;

        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Unauthorized",
                },
                { status: 401 }
            );
        }

        // Base query for count
        let countQuery = supabase
            .from("feedbacks")
            .select("*", {
                count: "exact",
                head: true,
            });

        // Base query for data
        let dataQuery = supabase
            .from("feedbacks")
            .select("*");

        // Global search
        if (search) {
            const searchCondition = `department.ilike.%${search}%,remarks.ilike.%${search}%`;

            countQuery = countQuery.or(searchCondition);
            dataQuery = dataQuery.or(searchCondition);
        }

        // Department filter
        if (department) {
            countQuery = countQuery.eq("department", department);
            dataQuery = dataQuery.eq("department", department);
        }

        // Fetch total count
        const {
            count,
            error: countError,
        } = await countQuery;

        if (countError) {
            console.error("Count error:", countError);
            return NextResponse.json(
                {
                    success: false,
                    error: countError.message,
                },
                { status: 500 }
            );
        }

        // Fetch paginated data
        const {
            data: feedbacks,
            error,
        } = await dataQuery
            .order("created_at", { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) {
            console.error("Fetch error:", error);
            return NextResponse.json(
                {
                    success: false,
                    error: error.message,
                },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            data: feedbacks || [],
            pagination: {
                page,
                limit,
                total: count || 0,
                totalPages: Math.ceil((count || 0) / limit),
            },
            filters: {
                search,
                department,
            },
        });
    } catch (error) {
        console.error("API Error:", error);

        return NextResponse.json(
            {
                success: false,
                error: "Internal server error",
            },
            { status: 500 }
        );
    }
}