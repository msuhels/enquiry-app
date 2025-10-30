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

    // Fetch all enquiries if search is provided, otherwise use pagination
    let query = supabase
      .from("enquiries")
      .select("*, createdby:users(id, full_name, phone_number)", {
        count: "exact",
      })
      .order("created_at", { ascending: false });

    if (!filters.search) {
      const from = filters.offset;
      const to = filters.offset + filters.limit - 1;
      query = query.range(from, to);
    }

    const { data: enquiries, error, count } = await query;

    if (error) {
      console.error("LOGGING : Error fetching enquiries:", error);
      return NextResponse.json(
        { success: false, message: "Failed to fetch enquiries" },
        { status: 500 }
      );
    }

    let filteredEnquiries = enquiries || [];

    if (filters.search && enquiries) {
      const searchTerm = filters.search.toLowerCase();
      filteredEnquiries = enquiries.filter((enquiry: any) => {
        const createdByName = enquiry.createdby?.full_name?.toLowerCase() || "";
        const createdByPhone = enquiry.createdby?.phone_number?.toLowerCase() || "";
        const enquiryPhone = enquiry.phone_number?.toLowerCase() || "";
        
        return (
          createdByName.includes(searchTerm) ||
          createdByPhone.includes(searchTerm) ||
          enquiryPhone.includes(searchTerm)
        );
      });
    }

    // Apply pagination to filtered results
    const totalFiltered = filteredEnquiries.length;
    const paginatedEnquiries = filters.search 
      ? filteredEnquiries.slice(filters.offset, filters.offset + filters.limit)
      : filteredEnquiries;

    console.log(
      "LOGGING : Enquiries service result:",
      `Found ${paginatedEnquiries.length} enquiries out of ${filters.search ? totalFiltered : count} total`
    );

    const totalRecords = filters.search ? totalFiltered : (count || 0);
    const totalPages = Math.ceil(totalRecords / filters.limit);
    const currentPage = Math.floor(filters.offset / filters.limit) + 1;

    return NextResponse.json({
      success: true,
      data: paginatedEnquiries,
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
    const { degree_going_for, previous_or_current_study, userId } = body;

    const { data: enquiry, error: enquiryError } = await supabase
      .from("enquiries")
      .insert([
        {
          degree_going_for,
          previous_or_current_study,
          createdby: userId,
        },
      ])
      .select("id")
      .single();

    if (enquiryError) throw enquiryError;

    // if (academic_entries?.length) {
    //   const formatted = academic_entries.map((entry: any) => ({
    //     enquiry_id: enquiry.id,
    //     study_level: entry.study_level || null,
    //     stream: entry.discipline_area || null,
    //     pursue: entry.what_to_pursue || null,
    //     score: entry.score || null,
    //     completion_year: entry.study_year ? parseInt(entry.study_year) : null,
    //     duration_years: entry.duration ? parseInt(entry.duration) : null,
    //     completion_date: entry.completion_date || null,
    //     course: entry.study_area || null,
    //   }));

    //   const { error } = await supabase
    //     .from("academic_entries")
    //     .insert(formatted);
    //   if (error) throw error;
    // }

    // enquiry_id uuid not null,
    // study_level uuid null,
    // stream uuid null,
    // pursue text null,
    // course uuid null,

    // const interestInfoFormatted = {
    //   enquiry_id: enquiry.id,
    //   study_level: interestInfo.interested_level,
    //   course: interestInfo.study_area,
    //   stream: interestInfo.discipline_area,
    //   pursue: interestInfo.what_to_pursue,
    // };
    // const { data, error } = await supabase
    //   .from("interest_information")
    //   .insert([interestInfoFormatted])
    //   .single();

    // if (error) throw error;

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

export async function PATCH(req: NextRequest) {
  const supabase = createServiceRoleClient();

  try {
    const body = await req.json();
    const {
      id,
      student_name,
      email,
      phone,
      overall_percentage,
      is_gap,
      gap_years,
      custom_fields,
      academic_entries,
    } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Enquiry ID is required" },
        { status: 400 }
      );
    }

    const updateData: any = {};

    if (student_name !== undefined) updateData.student_name = student_name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (overall_percentage !== undefined)
      updateData.overall_percentage = overall_percentage;
    if (is_gap !== undefined) updateData.is_gap = is_gap;
    if (gap_years !== undefined) updateData.gap_years = gap_years;
    if (custom_fields !== undefined) {
      updateData.custom_fields = custom_fields
        ? JSON.stringify(custom_fields)
        : null;
    }

    if (Object.keys(updateData).length === 0 && !academic_entries) {
      return NextResponse.json(
        { success: false, message: "No fields to update" },
        { status: 400 }
      );
    }

    let enquiry = null;
    if (Object.keys(updateData).length > 0) {
      const { data, error: enquiryError } = await supabase
        .from("enquiries")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (enquiryError) throw enquiryError;
      enquiry = data;
    }

    if (academic_entries !== undefined) {
      const { error: deleteError } = await supabase
        .from("academic_entries")
        .delete()
        .eq("enquiry_id", id);

      if (deleteError) throw deleteError;

      if (academic_entries?.length > 0) {
        const formatted = academic_entries.map((entry: any) => ({
          enquiry_id: id,
          study_level: entry.study_level || null,
          stream: entry.discipline_area || null,
          pursue: entry.what_to_pursue || null,
          score: entry.score || null,
          completion_year: entry.study_year ? parseInt(entry.study_year) : null,
          duration_years: entry.duration ? parseInt(entry.duration) : null,
          completion_date: entry.completion_date || null,
          course: entry.study_area || null,
        }));

        const { error: insertError } = await supabase
          .from("academic_entries")
          .insert(formatted);

        if (insertError) throw insertError;
      }
    }

    const { data: updatedEnquiry, error: fetchError } = await supabase
      .from("enquiries")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;

    const { data: academicData } = await supabase
      .from("academic_entries")
      .select(
        "*, study_level:education_levels(id,level_name), stream:streams(id,name), course:courses(id,course_name)"
      )
      .eq("enquiry_id", id);

    return NextResponse.json({
      success: true,
      message: "Enquiry updated successfully",
      data: {
        ...updatedEnquiry,
        academic_entries: academicData || [],
      },
    });
  } catch (error: any) {
    console.error("Error updating enquiry:", error);
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

export async function DELETE(req: NextRequest) {
  const supabase = createServiceRoleClient();

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Enquiry ID is required" },
        { status: 400 }
      );
    }

    const { error: enquiryError } = await supabase
      .from("enquiries")
      .delete()
      .eq("id", id);

    if (enquiryError) throw enquiryError;

    return NextResponse.json({
      success: true,
      message: "Enquiry deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting enquiry:", error);
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
