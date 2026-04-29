import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/adapters/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || "";
    const zone = searchParams.get("zone") || "";
    const limit = Number(searchParams.get("limit")) || 10;
    const offset = Number(searchParams.get("offset")) || 0;
    const sort = searchParams.get("sort") || "created_at:desc";

    const [sortKey, sortDir] = sort.split(":");

    const supabase = await createClient();

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

    let query = supabase
      .from("escalations")
      .select(
        `
          *,
          user:user_id (
            full_name
          )
        `,
        {
          count: "exact",
        }
      );

    /**
     * Global Search
     */
    if (search) {
      query = query.or(
        `user_message.ilike.%${search}%,zone.ilike.%${search}%,level.ilike.%${search}%`
      );
    }

    /**
     * Zone Filter
     */
    if (zone) {
      query = query.eq("zone", zone);
    }

    const {
      data: escalations,
      error,
      count,
    } = await query
      .order(sortKey, {
        ascending: sortDir === "asc",
      })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error(
        "Error fetching escalations:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    const totalRecords = count || 0;
    const totalPages = Math.ceil(
      totalRecords / limit
    );
    const currentPage =
      Math.floor(offset / limit) + 1;

    return NextResponse.json({
      success: true,
      data: escalations || [],
      pagination: {
        total: totalRecords,
        limit,
        offset,
        currentPage,
        totalPages,
        hasMore:
          offset + limit < totalRecords,
      },
      filters: {
        search,
        zone,
        sort,
      },
    });
  } catch (error) {
    console.error(
      "Escalations API Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}