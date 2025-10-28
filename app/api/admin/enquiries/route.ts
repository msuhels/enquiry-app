import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/adapters/service-role";

export async function GET(req: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
    const { searchParams } = new URL(req.url);

    const filters = {
      search: searchParams.get("search") || undefined,
      limit: searchParams.get("limit")
        ? parseInt(searchParams.get("limit")!)
        : 10,
      offset: searchParams.get("offset")
        ? parseInt(searchParams.get("offset")!)
        : 0,
    };

    console.log(
      "LOGGING : API received enquiries fetch request with filters:",
      filters
    );

    let query = supabase
      .from("enquiries")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (filters.search) {
      query = query.or(
        `student_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`
      );
    }

    const from = filters.offset;
    const to = filters.offset + filters.limit - 1;
    query = query.range(from, to);

    const { data: enquiries, error, count } = await query;

    if (error) {
      console.error("LOGGING : Error fetching enquiries:", error);
      return NextResponse.json(
        { success: false, message: "Failed to fetch enquiries" },
        { status: 500 }
      );
    }

    console.log(
      "LOGGING : Enquiries service result:",
      `Found ${enquiries?.length} enquiries out of ${count} total`
    );

    const response = await Promise.all(
      enquiries.map(async (enquiry: any) => ({
        ...enquiry,
        academic_entries: await supabase
          .from("academic_entries")
          .select(
            "*, study_level:education_levels(id,level_name), stream:streams(id,name), course:courses(id,course_name)"
          )
          .eq("enquiry_id", enquiry.id),
      }))
    );

    const interestInfo = await Promise.all(
      enquiries.map(async (enquiry: any) => ({
        ...enquiry,
        interestInfo: await supabase
          .from("interest_infos")
          .select("*")
          .eq("enquiry_id", enquiry.id)
          .single(),
      }))
    );

    const totalRecords = count || 0;
    const totalPages = Math.ceil(totalRecords / filters.limit);
    const currentPage = Math.floor(filters.offset / filters.limit) + 1;

    return NextResponse.json({
      success: true,
      data: response,
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
    console.error("API enquiries fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const supabase = createServiceRoleClient();

  try {
    const body = await req.json();
    const {
      student_name,
      email,
      phone,
      overall_percentage,
      is_gap,
      gap_years,
      custom_fields,
      academic_entries,
      interestInfo,
    } = body;

    const { data: enquiry, error: enquiryError } = await supabase
      .from("enquiries")
      .insert([
        {
          student_name,
          email,
          phone,
          overall_percentage,
          is_gap,
          gap_years,
          custom_fields: custom_fields ? JSON.stringify(custom_fields) : null,
        },
      ])
      .select("id")
      .single();

    if (enquiryError) throw enquiryError;

    if (academic_entries?.length) {
      const formatted = academic_entries.map((entry: any) => ({
        enquiry_id: enquiry.id,
        study_level: entry.study_level || null,
        stream: entry.discipline_area || null,
        pursue: entry.what_to_pursue || null,
        score: entry.score || null,
        completion_year: entry.study_year ? parseInt(entry.study_year) : null,
        duration_years: entry.duration ? parseInt(entry.duration) : null,
        completion_date: entry.completion_date || null,
        course: entry.study_area || null,
      }));

      const { error } = await supabase
        .from("academic_entries")
        .insert(formatted);
      if (error) throw error;
    }

    // enquiry_id uuid not null,
    // study_level uuid null,
    // stream uuid null,
    // pursue text null,
    // course uuid null,

    const interestInfoFormatted = {
      enquiry_id: enquiry.id,
      study_level: interestInfo.interested_level,
      course: interestInfo.study_area,
      stream: interestInfo.discipline_area,
      pursue: interestInfo.what_to_pursue,
    };
    const { data, error } = await supabase
      .from("interest_information")
      .insert([interestInfoFormatted])
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "Enquiry created successfully",
      data: enquiry,
    });
  } catch (error: any) {
    console.error("Error creating enquiry:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
