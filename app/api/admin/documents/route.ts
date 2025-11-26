import { createServiceRoleClient } from "@/lib/supabase/adapters/service-role";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceRoleClient();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const search = searchParams.get("search");

    if (id) {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching document:", error);

        if (error.code === "PGRST116") {
          return NextResponse.json(
            { success: false, error: "Document not found" },
            { status: 404 }
          );
        }

        throw error;
      }

      return NextResponse.json({
        success: true,
        data,
      });
    }

    const limit = Number(searchParams.get("limit")) || 10;
    const offset = Number(searchParams.get("offset")) || 0;

    // Build the base query
    let countQuery = supabase
      .from("documents")
      .select("*", { count: "exact", head: true });
    let dataQuery = supabase.from("documents").select("*");

    // Apply search filter if search param exists
    if (search && search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      countQuery = countQuery.or(
        `title.ilike.${searchTerm},description.ilike.${searchTerm}`
      );
      dataQuery = dataQuery.or(
        `title.ilike.${searchTerm},description.ilike.${searchTerm}`
      );
    }

    const { count: totalRecords, error: countError } = await countQuery;

    if (countError) {
      console.error("Count error:", countError);
      throw countError;
    }

    const { data, error } = await dataQuery
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Error fetching documents:", error);
      throw error;
    }

    const totalPages = Math.ceil((totalRecords || 0) / limit);
    const currentPage = Math.floor(offset / limit) + 1;

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        total: totalRecords || 0,
        limit,
        offset,
        totalPages,
        currentPage,
        hasMore: offset + limit < (totalRecords || 0),
      },
    });
  } catch (error) {
    console.error("API document fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// export async function GET(request: NextRequest) {
//   try {
//     const supabase = createServiceRoleClient();

//     const { searchParams } = new URL(request.url);
//     const id = searchParams.get("id");

//     if (id) {
//       const { data, error } = await supabase
//         .from("documents")
//         .select("*")
//         .eq("id", id)
//         .single();

//       if (error) {
//         console.error("Error fetching document:", error);

//         if (error.code === "PGRST116") {
//           return NextResponse.json(
//             { success: false, error: "Document not found" },
//             { status: 404 }
//           );
//         }

//         throw error;
//       }

//       return NextResponse.json({
//         success: true,
//         data,
//       });
//     }

//     const limit = Number(searchParams.get("limit")) || 10;
//     const offset = Number(searchParams.get("offset")) || 0;

//     const { count: totalRecords, error: countError } = await supabase
//       .from("documents")
//       .select("*", { count: "exact", head: true });

//     if (countError) {
//       console.error("Count error:", countError);
//       throw countError;
//     }

//     const { data, error } = await supabase
//       .from("documents")
//       .select("*")
//       .order("created_at", { ascending: false })
//       .range(offset, offset + limit - 1);

//     if (error) {
//       console.error("Error fetching documents:", error);
//       throw error;
//     }

//     const totalPages = Math.ceil((totalRecords || 0) / limit);
//     const currentPage = Math.floor(offset / limit) + 1;

//     return NextResponse.json({
//       success: true,
//       data,
//       pagination: {
//         total: totalRecords || 0,
//         limit,
//         offset,
//         totalPages,
//         currentPage,
//         hasMore: offset + limit < (totalRecords || 0),
//       },
//     });
//   } catch (error) {
//     console.error("API document fetch error:", error);
//     return NextResponse.json(
//       { success: false, error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// POST - Create new document
export async function POST(request: NextRequest) {
  try {
    const supabase = createServiceRoleClient();

    // Parse form data
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const file = formData.get("file") as File;
    const fileType = formData.get("file_type") as string;

    // Validation
    if (!title || !title.trim()) {
      return NextResponse.json(
        { success: false, error: "Title is required" },
        { status: 400 }
      );
    }

    if (!file) {
      return NextResponse.json(
        { success: false, error: "File is required" },
        { status: 400 }
      );
    }

    // Validate file
    const fileValidationError = validateFile(file);
    if (fileValidationError) {
      return NextResponse.json(
        { success: false, error: fileValidationError },
        { status: 400 }
      );
    }

    // Upload file to storage
    const { path: filePath, error: uploadError } = await uploadFileToStorage(
      supabase,
      file
    );

    if (uploadError || !filePath) {
      return NextResponse.json(
        {
          success: false,
          error: uploadError || "Failed to upload file to storage",
        },
        { status: 500 }
      );
    }

    // Insert document record in database
    const { data, error: dbError } = await supabase
      .from("documents")
      .insert({
        title: title.trim(),
        description: description?.trim() || null,
        file_path: filePath,
        file_type: fileType || file.type,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database insert error:", dbError);

      // Rollback: Delete uploaded file
      await deleteFileFromStorage(supabase, filePath);

      return NextResponse.json(
        { success: false, error: "Failed to create document record" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: "Document uploaded successfully",
    });
  } catch (error: any) {
    console.error("POST API error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH - Update document
export async function PATCH(request: NextRequest) {
  try {
    const supabase = createServiceRoleClient();

    // Get document ID from query params
    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get("id");

    if (!documentId) {
      return NextResponse.json(
        { success: false, error: "Document ID is required" },
        { status: 400 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const file = formData.get("file") as File | null;
    const fileType = formData.get("file_type") as string;

    // Validation
    if (!title || !title.trim()) {
      return NextResponse.json(
        { success: false, error: "Title is required" },
        { status: 400 }
      );
    }

    // Fetch existing document
    const { data: existingDoc, error: fetchError } = await supabase
      .from("documents")
      .select("*")
      .eq("id", documentId)
      .single();

    if (fetchError || !existingDoc) {
      return NextResponse.json(
        { success: false, error: "Document not found" },
        { status: 404 }
      );
    }

    let newFilePath = existingDoc.file_path;
    let newFileType = existingDoc.file_type;
    const oldFilePath = existingDoc.file_path;

    // If new file is uploaded
    if (file && file.size > 0) {
      // Validate new file
      const fileValidationError = validateFile(file);
      if (fileValidationError) {
        return NextResponse.json(
          { success: false, error: fileValidationError },
          { status: 400 }
        );
      }

      // Upload new file
      const { path: uploadedPath, error: uploadError } =
        await uploadFileToStorage(supabase, file);

      if (uploadError || !uploadedPath) {
        return NextResponse.json(
          {
            success: false,
            error: uploadError || "Failed to upload new file",
          },
          { status: 500 }
        );
      }

      newFilePath = uploadedPath;
      newFileType = fileType || file.type;
    }

    // Update document in database
    const { data: updatedDoc, error: updateError } = await supabase
      .from("documents")
      .update({
        title: title.trim(),
        description: description?.trim() || null,
        file_path: newFilePath,
        file_type: newFileType,
        updated_at: new Date().toISOString(),
      })
      .eq("id", documentId)
      .select()
      .single();

    if (updateError) {
      console.error("Database update error:", updateError);

      // Rollback: Delete new file if uploaded
      if (file && file.size > 0 && newFilePath !== oldFilePath) {
        await deleteFileFromStorage(supabase, newFilePath);
      }

      return NextResponse.json(
        { success: false, error: "Failed to update document" },
        { status: 500 }
      );
    }

    // Delete old file if new file was uploaded successfully
    if (file && file.size > 0 && newFilePath !== oldFilePath) {
      await deleteFileFromStorage(supabase, oldFilePath);
    }

    return NextResponse.json({
      success: true,
      data: updatedDoc,
      message: "Document updated successfully",
    });
  } catch (error) {
    console.error("PATCH API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete document
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createServiceRoleClient();

    // Get document ID from query params
    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get("id");

    if (!documentId) {
      return NextResponse.json(
        { success: false, error: "Document ID is required" },
        { status: 400 }
      );
    }

    // Fetch document to get file path
    const { data: document, error: fetchError } = await supabase
      .from("documents")
      .select("*")
      .eq("id", documentId)
      .single();

    if (fetchError || !document) {
      return NextResponse.json(
        { success: false, error: "Document not found" },
        { status: 404 }
      );
    }

    // Delete from database first
    const { error: deleteError } = await supabase
      .from("documents")
      .delete()
      .eq("id", documentId);

    if (deleteError) {
      console.error("Database delete error:", deleteError);
      return NextResponse.json(
        { success: false, error: "Failed to delete document" },
        { status: 500 }
      );
    }

    // Delete file from storage
    const fileDeleted = await deleteFileFromStorage(
      supabase,
      document.file_path
    );

    if (!fileDeleted) {
      console.warn(
        `File ${document.file_path} could not be deleted from storage, but database record was removed`
      );
    }

    return NextResponse.json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    console.error("DELETE API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Constants
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/csv",
];
const STORAGE_BUCKET = "documents";
const STORAGE_FOLDER = "admin_docs";

// Validate file
function validateFile(file: File): string | null {
  if (file.size > MAX_FILE_SIZE) {
    return "File size must be less than 10MB";
  }

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return "Invalid file type. Only PDF, Word, Excel, and CSV files are allowed";
  }

  return null;
}

// Generate unique filename
function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now();
  const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, "_");
  return `${timestamp}-${sanitizedName}`;
}

// Upload file to Supabase storage
async function uploadFileToStorage(
  supabase: any,
  file: File
): Promise<{ path: string; error: string | null }> {
  try {
    const uniqueFilename = generateUniqueFilename(file.name);
    const filePath = `${STORAGE_FOLDER}/${uniqueFilename}`;

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Storage upload error:", error);
      return { path: "", error: error.message };
    }

    return { path: data.path, error: null };
  } catch (error) {
    console.error("Upload file error:", error);
    return { path: "", error: "Failed to upload file" };
  }
}

// Delete file from Supabase storage
async function deleteFileFromStorage(
  supabase: any,
  filePath: string
): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([filePath]);

    if (error) {
      console.error("Storage delete error:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Delete file error:", error);
    return false;
  }
}
