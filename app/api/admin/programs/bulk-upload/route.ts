// app/api/programs/bulk-upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { bulkCreateProgramsWithValidation } from "@/lib/supabase/program/admin-program.services";

/**
 * POST - Upload and process CSV/Excel/XML files
 * This endpoint receives pre-parsed program data from the frontend
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { programs, filename } = body;

    if (!Array.isArray(programs)) {
      return NextResponse.json(
        { error: "Programs must be an array" },
        { status: 400 }
      );
    }

    if (programs.length === 0) {
      return NextResponse.json(
        { error: "No programs to upload" },
        { status: 400 }
      );
    }
    
    console.log(`LOGGING : API received bulk upload for ${programs.length} programs from file: ${filename}`);

    // Use the validation version for better error handling
    const result = await bulkCreateProgramsWithValidation(programs);
    
    console.log(`LOGGING : Bulk upload completed - Success: ${result.successful}, Failed: ${result.failed}`);

    if (result.failed > 0) {
      console.warn(`LOGGING : ${result.failed} programs failed to upload:`, result.errors);
    }

    return NextResponse.json({
      success: result.success,
      total: result.total,
      successful: result.successful,
      failed: result.failed,
      errors: result.errors,
      data: result.data,
    }, { status: result.success ? 200 : 207 }); // 207 = Multi-Status (partial success)

  } catch (error) {
    console.error("API bulk upload error:", error);
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// app/api/programs/validate-bulk/route.ts

// // Client-side usage component example
// // components/BulkUploadComponent.tsx
// 'use client';

// import { useState } from 'react';
// import { BulkUploadService } from '@/lib/services/bulk-upload.service';
// import { ProgramFormData } from '@/lib/types';

// export function BulkUploadComponent() {
//   const [file, setFile] = useState<File | null>(null);
//   const [uploading, setUploading] = useState(false);
//   const [result, setResult] = useState<any>(null);
//   const bulkService = new BulkUploadService();

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = e.target.files?.[0];
//     if (selectedFile && bulkService.validateFileType(selectedFile)) {
//       setFile(selectedFile);
//     } else {
//       alert('Invalid file type. Please upload CSV, Excel, or XML files.');
//     }
//   };

//   const handleUpload = async () => {
//     if (!file) return;

//     setUploading(true);
//     try {
//       // Parse file based on extension
//       let programs: ProgramFormData[] = [];
//       const extension = bulkService.getFileExtension(file.name);

//       if (extension === 'csv') {
//         programs = await bulkService.parseCSV(file);
//       } else if (extension === 'xls' || extension === 'xlsx') {
//         programs = await bulkService.parseExcel(file);
//       } else if (extension === 'xml') {
//         programs = await bulkService.parseXML(file);
//       }

//       console.log(`Parsed ${programs.length} programs from file`);

//       // Validate programs first (optional but recommended)
//       const validationResponse = await fetch('/api/programs/validate-bulk', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ programs }),
//       });

//       const validationResult = await validationResponse.json();
      
//       if (!validationResult.valid) {
//         console.warn('Validation errors found:', validationResult.errors);
//         // You can show these errors to the user and let them decide to proceed
//       }

//       // Upload to database
//       const uploadResponse = await fetch('/api/programs/bulk-upload', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ 
//           programs,
//           filename: file.name 
//         }),
//       });

//       const uploadResult = await uploadResponse.json();
//       setResult(uploadResult);

//       if (uploadResult.success) {
//         alert(`Successfully uploaded ${uploadResult.successful} programs!`);
//       } else {
//         alert(`Upload completed with errors. Successful: ${uploadResult.successful}, Failed: ${uploadResult.failed}`);
//       }

//     } catch (error) {
//       console.error('Upload error:', error);
//       alert('Failed to upload file');
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div className="p-4">
//       <h2 className="text-2xl font-bold mb-4">Bulk Program Upload</h2>
      
//       <div className="mb-4">
//         <input
//           type="file"
//           accept=".csv,.xls,.xlsx,.xml"
//           onChange={handleFileChange}
//           className="border p-2 rounded"
//         />
//       </div>

//       <button
//         onClick={handleUpload}
//         disabled={!file || uploading}
//         className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
//       >
//         {uploading ? 'Uploading...' : 'Upload Programs'}
//       </button>

//       {result && (
//         <div className="mt-4 p-4 border rounded">
//           <h3 className="font-bold">Upload Results:</h3>
//           <p>Total: {result.total}</p>
//           <p>Successful: {result.successful}</p>
//           <p>Failed: {result.failed}</p>
          
//           {result.errors && result.errors.length > 0 && (
//             <div className="mt-2">
//               <h4 className="font-semibold text-red-600">Errors:</h4>
//               <ul className="text-sm">
//                 {result.errors.slice(0, 10).map((error: any, index: number) => (
//                   <li key={index}>
//                     Row {error.row}: {error.error}
//                   </li>
//                 ))}
//                 {result.errors.length > 10 && (
//                   <li>... and {result.errors.length - 10} more errors</li>
//                 )}
//               </ul>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }