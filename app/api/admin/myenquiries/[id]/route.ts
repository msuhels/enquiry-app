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
    
    console.log("LOGGING : API received enquiries fetch request for creator:", createdById);
    const search = searchParams.get("search") || undefined;
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : 10;
    const offset = searchParams.get("offset")
      ? parseInt(searchParams.get("offset")!)
      : 0;

    console.log("LOGGING => Creator filter:", createdById);

    let query = supabase
      .from("enquiries")
      .select("*, createdby:users(id, full_name, phone_number)", {
        count: "exact",
      })
      .eq("createdby", createdById)
      .order("created_at", { ascending: false });

    // Pagination only when no search
    if (!search) {
      query = query.range(offset, offset + limit - 1);
    }

    const { data: enquiries, error, count } = await query;

    if (error) {
      console.error("LOGGING : Error fetching enquiries:", error);
      return NextResponse.json(
        { success: false, message: "Failed to fetch enquiries" },
        { status: 500 }
      );
    }

    let filteredEnquiries = enquiries ?? [];

    // ✅ Local search
    if (search && enquiries) {
      const searchTerm = search.toLowerCase();

      filteredEnquiries = enquiries.filter((e: any) => {
        const createdName = e.createdby?.full_name?.toLowerCase() || "";
        const createdPhone = e.createdby?.phone_number?.toLowerCase() || "";
        const enquiryPhone = e.phone_number?.toLowerCase() || "";

        return (
          createdName.includes(searchTerm) ||
          createdPhone.includes(searchTerm) ||
          enquiryPhone.includes(searchTerm)
        );
      });
    }

    const totalFiltered = filteredEnquiries.length;
    const paginated = search
      ? filteredEnquiries.slice(offset, offset + limit)
      : filteredEnquiries;

    return NextResponse.json({
      success: true,
      data: paginated,
      pagination: {
        total: search ? totalFiltered : count,
        limit,
        offset,
        totalPages: Math.ceil((search ? totalFiltered : count!) / limit),
        currentPage: Math.floor(offset / limit) + 1,
        hasMore: offset + limit < (search ? totalFiltered : count!),
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