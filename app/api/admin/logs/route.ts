import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/adapters/service-role";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createServiceRoleClient();
    const { searchParams } = new URL(req.url);

    const limit = Number(searchParams.get("limit") ?? 10);
    const offset = Number(searchParams.get("offset") ?? 0);

    const event = searchParams.get("event") ?? "";
    const userEmail = searchParams.get("email") ?? "";
    const fromDate = searchParams.get("from_date") ?? "";
    const toDate = searchParams.get("to_date") ?? "";
    const tab = searchParams.get("action") ?? "all";

    let query = supabase
      .from("audit_logs")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    query = query.or("payload->>action.eq.login,payload->>action.eq.logout");

    if (tab === "admin") {
      query = query.or(
        "payload->>actor_username.ilike.%admin%,payload->>log_type.eq.admin"
      );
    } else if (tab === "user") {
      query = query.not("payload->>actor_username", "ilike", "%admin%");
      query = query.neq("payload->>log_type", "admin");
    } else if (tab === "login") {
      query = query.eq("payload->>action", "login");
    } else if (tab === "logout") {
      query = query.eq("payload->>action", "logout");
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

    if (userEmail) {
      query = query.ilike("payload->>actor_username", `%${userEmail}%`);
    }

    query = query.range(offset, offset + limit - 1);

    const { data: logs, error, count } = await query;

    if (error) {
      console.error("LOGGING: Error fetching audit logs:", error);
      return NextResponse.json(
        { success: false, message: "Failed to fetch logs" },
        { status: 500 }
      );
    }

    const userIds = [...new Set(logs?.map(log => log.payload.actor_id).filter(Boolean))];

    let enrichedLogs = logs;
    if (userIds.length > 0) {
      const { data: users } = await supabase
        .from("users")
        .select("id, email, full_name, phone_number, organization, city, state, role")
        .in("id", userIds);

      const userMap = new Map(users?.map(user => [user.id, user]));

      enrichedLogs = logs.map(log => ({
        ...log,
        user: userMap.get(log.payload.actor_id) || null,
      }));
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
    console.error("API logs fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}