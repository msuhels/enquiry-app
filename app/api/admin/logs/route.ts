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
    const userName = searchParams.get("name") ?? "";
    const fromDate = searchParams.get("from_date") ?? "";
    const toDate = searchParams.get("to_date") ?? "";
    const tab = searchParams.get("tab") ?? "all";

    // Step 1: Build user filter if email or name is provided
    let userIdsToFilter: string[] | null = null;

    if (userEmail || userName) {
      let userQuery = supabase.from("users").select("id");

      if (userEmail) {
        userQuery = userQuery.ilike("email", `%${userEmail}%`);
      }
      if (userName) {
        userQuery = userQuery.ilike("full_name", `%${userName}%`);
      }

      const { data: matchedUsers, error: userError } = await userQuery;

      if (userError) {
        console.error("LOGGING: Error fetching users:", userError);
        return NextResponse.json(
          { success: false, message: "Failed to fetch users" },
          { status: 500 }
        );
      }

      userIdsToFilter = matchedUsers?.map((u) => u.id) ?? [];

      // If filters are applied but no users match, return empty result
      if (userIdsToFilter.length === 0) {
        return NextResponse.json({
          success: true,
          data: [],
          pagination: {
            total: 0,
            limit,
            offset,
            totalPages: 0,
            currentPage: 1,
            hasMore: false,
          },
        });
      }
    }

    // Step 2: Build logs query with all filters
    let query = supabase
      .from("user_activity_logs")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    // Apply tab filter
    if (tab === "admin") {
      query = query.eq("role", "admin");
    } else if (tab === "user") {
      query = query.neq("role", "admin");
    }

    // Apply date filters
    if (fromDate) {
      query = query.gte("created_at", `${fromDate}T00:00:00.000Z`);
    }
    if (toDate) {
      query = query.lte("created_at", `${toDate}T23:59:59.999Z`);
    }

    // Apply event filter
    if (event) {
      query = query.ilike("event_type", `%${event}%`);
    }

    // Apply user filter from Step 1
    if (userIdsToFilter !== null) {
      query = query.in("user_id", userIdsToFilter);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: logs, error, count } = await query;

    if (error) {
      console.error("LOGGING: Error fetching logs:", error);
      return NextResponse.json(
        { success: false, message: "Failed to fetch logs" },
        { status: 500 }
      );
    }

    // Step 3: Enrich logs with user data
    let enrichedLogs = logs ?? [];

    if (enrichedLogs.length > 0) {
      const userIds = [
        ...new Set(enrichedLogs.map((log) => log.user_id).filter(Boolean)),
      ];

      if (userIds.length > 0) {
        const { data: users, error: usersError } = await supabase
          .from("users")
          .select(
            "id, email, full_name, phone_number, organization, city, state, role"
          )
          .in("id", userIds);

        if (usersError) {
          console.error("LOGGING: Error fetching user details:", usersError);
          // Continue without user enrichment rather than failing
        } else if (users) {
          const userMap = new Map(users.map((user) => [user.id, user]));
          enrichedLogs = enrichedLogs.map((log) => ({
            ...log,
            user: userMap.get(log.user_id) || null,
          }));
        }
      }
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
