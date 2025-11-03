import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/adapters/service-role";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createServiceRoleClient();
    const { searchParams } = new URL(req.url);

    const limit = Number(searchParams.get("limit") ?? 10);
    const offset = Number(searchParams.get("offset") ?? 0);

    const event = searchParams.get("action") ?? "";
    const userEmail = searchParams.get("email") ?? "";
    const fromDate = searchParams.get("from_date") ?? "";
    const toDate = searchParams.get("to_date") ?? "";
    const tab = searchParams.get("tab") ?? "all";

    let query = supabase
      .from("user_activity_logs")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (tab === "admin") {
      query = query.eq("role", "admin");
    } else if (tab === "user") {
      query = query.neq("role", "admin");
    }

    if (fromDate) {
      query = query.gte("created_at", `${fromDate}T00:00:00.000Z`);
    }
    if (toDate) {
      query = query.lte("created_at", `${toDate}T23:59:59.999Z`);
    }

    if (event) {
      query = query.ilike("event_type", `%${event}%`);
    }

    query = query.range(offset, offset + limit - 1);

    const { data: logs, error, count } = await query;

    if (error) {
      console.error("LOGGING: Error fetching logs:", error);
      return NextResponse.json(
        { success: false, message: "Failed to fetch logs" },
        { status: 500 }
      );
    }

    const userIds = [...new Set(logs?.map(log => log.user_id).filter(Boolean))];

    let enrichedLogs = logs;

    if (userIds.length > 0) {
      // Fetch user objects
      let userQuery = supabase
        .from("users")
        .select("id, email, full_name, phone_number, organization, city, state, role")
        .in("id", userIds);

      const { data: users } = await userQuery;
      const userMap = new Map(users?.map(user => [user.id, user]));

      enrichedLogs = logs
        .map(log => ({
          ...log,
          user: userMap.get(log.user_id) || null,
        }))
        .filter(log => {
          if (!userEmail) return true;
          return log.user?.email?.toLowerCase().includes(userEmail.toLowerCase());
        });
    }

    return NextResponse.json({
      success: true,
      data: enrichedLogs,
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
    console.error("/api/admin/logs error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
