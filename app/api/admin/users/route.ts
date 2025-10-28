import { NextRequest, NextResponse } from "next/server";
import { createUser, getUser, getUsers } from "@/lib/supabase/auth-module/services/admin-user.services";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;
    
    console.log("LOGGING : API received user creation request:", { email });

    const result = await createUser({user:body, email});
    
    console.log("LOGGING : Admin service result:", result);

    if (!result.success) {
      console.error("LOGGING : Failed to create user:", result.error);
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    console.log("LOGGING : User created successfully via API");
    return NextResponse.json({
      success: true,
      data: result.data,
    });

  } catch (error) {
    console.error("API user creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("id");

    // If specific user ID is requested, return that user
    if (userId) {
      const result = await getUser(userId);
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 500 });
      }
      return NextResponse.json({ success: true, data: result.data });
    }

    // Parse query parameters for pagination, search, and sorting
    const filters = {
      search: url.searchParams.get("search") || undefined,
      filter: url.searchParams.get("filter") || undefined,
      sort: url.searchParams.get("sort") || undefined,
      limit: url.searchParams.get("limit")
        ? parseInt(url.searchParams.get("limit")!)
        : 10,
      offset: url.searchParams.get("offset")
        ? parseInt(url.searchParams.get("offset")!)
        : 0,
    };

    console.log("LOGGING : API received users fetch request with filters:", filters);

    // Parse sort parameter (format: "field:direction")
    let sortKey = "created_at"; // default sort field
    let sortDir: "asc" | "desc" = "desc"; // default sort direction
    
    if (filters.sort) {
      const [key, dir] = filters.sort.split(":");
      if (key) sortKey = key;
      if (dir === "asc" || dir === "desc") sortDir = dir;
    }

    // GET all users with filters
    const result = await getUsers({
      search: filters.search,
      filter: filters.filter,
      sortKey,
      sortDir,
      limit: filters.limit,
      offset: filters.offset,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    console.log(
      "LOGGING : Users service result:",
      `Found ${result.data?.length} users out of ${result.total} total`
    );

    // Calculate pagination metadata
    const totalRecords = result.total || 0;
    const totalPages = Math.ceil(totalRecords / filters.limit);
    const currentPage = Math.floor(filters.offset / filters.limit) + 1;

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: {
        total: totalRecords,
        limit: filters.limit,
        offset: filters.offset,
        totalPages,
        currentPage,
        hasMore: filters.offset + filters.limit < totalRecords,
      },
    });
  } catch (error) {
    console.error("API user fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


// export async function GET(request: NextRequest) {
//   try {
//     const url = new URL(request.url);
//     const userId = url.searchParams.get("id");

//     if (userId) {
//       // GET user by ID
//       const result = await getUser(userId);
//       if (!result.success) {
//         return NextResponse.json({ error: result.error }, { status: 500 });
//       }
//       return NextResponse.json({ success: true, data: result.data });
//     }

//     // GET all users
//     const result = await getUsers();
//     if (!result.success) {
//       return NextResponse.json({ error: result.error }, { status: 500 });
//     }

//     return NextResponse.json({ success: true, data: result.data });
//   } catch (error) {
//     console.error("API user fetch error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }