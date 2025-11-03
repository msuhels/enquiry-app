import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/adapters/service-role";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServiceRoleClient();
    const { searchParams } = new URL(req.url);

    const { id } = await params;

    const createdById = id;

    const limit = Number(searchParams.get("limit") ?? 10);
    const offset = Number(searchParams.get("offset") ?? 0);

    const name = searchParams.get("name") ?? "";
    const organisation = searchParams.get("organisation") ?? "";
    const city = searchParams.get("city") ?? "";
    const state = searchParams.get("state") ?? "";
    const fromDate = searchParams.get("from_date") ?? "";
    const toDate = searchParams.get("to_date") ?? "";
    const exportFile = searchParams.get("export");

    console.log("LOGGING : API received enquiries for creator:", createdById);

    let query = supabase
      .from("enquiries")
      .select(
        "*, createdby:users!inner(id, full_name, phone_number, city, state, organization)",
        { count: "exact" }
      )
      .eq("createdby", createdById)
      .order("created_at", { ascending: false });

    if (fromDate) {
      query = query.gte("created_at", `${fromDate}T00:00:00.000Z`);
    }

    if (toDate) {
      query = query.lte("created_at", `${toDate}T23:59:59.999Z`);
    }

    if (name) {
      query = query.ilike("createdby.full_name", `%${name}%`);
    }
    if (organisation) {
      query = query.ilike("createdby.organization", `%${organisation}%`);
    }
    if (city) {
      query = query.ilike("createdby.city", `%${city}%`);
    }
    if (state) {
      query = query.ilike("createdby.state", `%${state}%`);
    }

    if (!exportFile) {
      query = query.range(offset, offset + limit - 1);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("LOGGING: Error fetching enquiries:", error);
      return NextResponse.json(
        { success: false, message: "Failed to fetch enquiries" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        total: count ?? 0,
        limit,
        offset,
        totalPages: Math.ceil((count ?? 0) / limit),
        currentPage: Math.floor(offset / limit) + 1,
        hasMore: offset + limit < (count ?? 0),
      },
    });
  } catch (error) {
    console.error("API enquiries fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
