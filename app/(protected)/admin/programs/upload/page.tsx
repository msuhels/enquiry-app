"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  UploadIcon,
  FileIcon,
  CheckCircleIcon,
  XCircleIcon,
  Loader2,
  ChevronLeft,
  ChevronRight,
  FileDown,
  Info,
  X,
} from "lucide-react";
import Link from "next/link";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import Breadcrumbs from "@/components/ui/breadCrumbs";
import { useModal } from "@/components/ui/modal";
import FileFormatInstructions from "@/components/modals/fileInstructionModal";

// Types
interface ProgramFormData {
  university: string;
  previous_or_current_study: string;
  degree_going_for: string;
  course_name: string;
  ielts_requirement?: string;
  special_requirements?: string;
  remarks?: string;
}

interface UploadResult {
  success: boolean;
  successCount: number;
  failedCount: number;
  errors?: Array<{ index: number; programme_name: string; error: string }>;
}

const ITEMS_PER_PAGE = 10;

// Helper Functions
const parseCSV = (file: File): Promise<ProgramFormData[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const programs = mapDataToPrograms(results.data as any[]);
          resolve(programs);
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};

const parseExcel = (file: File): Promise<ProgramFormData[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const programs = mapDataToPrograms(jsonData as any[]);
        resolve(programs);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error("Failed to read Excel file"));
    reader.readAsArrayBuffer(file);
  });
};

const mapDataToPrograms = (data: any[]): ProgramFormData[] => {
  return data.map((row) => ({
    university: row["University"] || row["university"] || "",
    previous_or_current_study:
      row["Previous / Current Study"] || row["previous_or_current_study"] || "",
    degree_going_for: row["Degree Going For"] || row["degree_going_for"] || "",
    course_name: row["Courses Name"] || row["course_name"] || "",
    ielts_requirement:
      row["IELTS Requirment"] || row["ielts_requirement"] || undefined,
    special_requirements:
      row["Special Requirments"] || row["special_requirements"] || undefined,
    remarks: row["Remarks"] || row["remarks"] || undefined,
  }));
};

const validateFileType = (file: File): boolean => {
  const allowedTypes = [
    "text/csv",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  const allowedExtensions = [".csv", ".xls", ".xlsx"];
  const fileExtension = file.name
    .toLowerCase()
    .substring(file.name.lastIndexOf("."));

  return (
    allowedTypes.includes(file.type) ||
    allowedExtensions.includes(fileExtension)
  );
};

const getFileExtension = (filename: string): string => {
  return filename.toLowerCase().substring(filename.lastIndexOf(".") + 1);
};

// Main Component
export default function BulkUploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [parsedData, setParsedData] = useState<ProgramFormData[] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string>("");

  console.log("uploadResult 🚀🚀", uploadResult);

  const { openModal } = useModal();

  // Pagination calculations
  const totalPages = parsedData
    ? Math.ceil(parsedData.length / ITEMS_PER_PAGE)
    : 0;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = parsedData ? parsedData.slice(startIndex, endIndex) : [];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (validateFileType(file)) {
        setSelectedFile(file);
        setParsedData(null);
        setUploadResult(null);
        setError("");
        setCurrentPage(1);
      } else {
        setError(
          "Invalid file type. Please select a CSV or Excel (.xls, .xlsx) file."
        );
        setSelectedFile(null);
      }
    }
  };

  const handleParseFile = async () => {
    if (!selectedFile) return;

    setParsing(true);
    setError("");
    setParsedData(null);
    setCurrentPage(1);

    try {
      const fileExtension = getFileExtension(selectedFile.name);

      let data: ProgramFormData[] = [];

      switch (fileExtension) {
        case "csv":
          data = await parseCSV(selectedFile);
          break;
        case "xls":
        case "xlsx":
          data = await parseExcel(selectedFile);
          break;
        default:
          throw new Error("Unsupported file type");
      }

      if (data.length === 0) {
        throw new Error("No valid data found in the file");
      }

      setParsedData(data);
      console.log(`Successfully parsed ${data.length} programs`);
    } catch (err) {
      console.error("Parse error:", err);
      setError(err instanceof Error ? err.message : "Failed to parse file");
    } finally {
      setParsing(false);
    }
  };

  const handleSaveToDatabase = async () => {
    if (!parsedData || !selectedFile) return;
    setUploading(true);
    setUploadResult(null);
    setError("");

    try {
      const response = await fetch("/api/admin/programs/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: `Server error: ${response.status} ${response.statusText}`,
        }));
        throw new Error(errorData.error || "Upload failed");
      }

      const result: UploadResult = await response.json();
      setUploadResult(result);

      if (result.success && result.failedCount === 0) {
        setTimeout(() => {
          setSelectedFile(null);
          setParsedData(null);
          setCurrentPage(1);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }, 3000);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to upload programs"
      );
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const headers = [
      "S. No.",
      "University",
      "Previous / Current Study",
      "Degree Going For",
      "Courses Name",
      "IELTS Requirment",
      "Special Requirments",
      "Remarks",
    ];

    const sampleData = [
      "1",
      "University of Milan",
      "Bcom",
      "Master",
      "Management of Innovation and Entrepreneurship",
      "Above 5.5",
      "no",
      "best in class",
    ];

    const csvContent = [headers.join(","), sampleData.join(",")].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "program_template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleOpenInstructions = () => {
    // @ts-ignore
    openModal(<FileFormatInstructions />, {
      size: "md",
      closeOnOverlayClick: true,
      showCloseButton: true,
    });
  };

  const handleUploadAnotherFile = () => {
    setSelectedFile(null);
    setParsedData(null);
    setCurrentPage(1);
    setUploadResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Breadcrumbs />
          <h1 className="text-3xl font-bold text-gray-900">
            Bulk Upload Programs
          </h1>
          <p className="mt-2 text-gray-600">
            Upload multiple university programs using CSV or Excel files
          </p>
        </div>
        {!parsedData && (
          <>
            <div className="bg-white shadow rounded-lg p-8 mb-6">
              {/* File Upload Section */}
              <div className="mb-8">
                <div className="flex justify-between">
                  <div className=" gap-2">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Upload File
                    </h2>
                    <p className="text-xs text-[#F97316]">
                      For file format please refer to the template
                    </p>
                    {/* <Info
                      onClick={handleOpenInstructions}
                      className="h-4 w-4 text-gray-600 cursor-pointer"
                    /> */}
                  </div>

                  {/* Template Download */}
                  <div className="mb-8 flex items-center gap-2 justify-center">
                    <h3 className="text-md font-medium text-gray-900">
                      Need a template?
                    </h3>
                    <button
                      onClick={downloadTemplate}
                      className="inline-flex items-center p-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                      <FileDown className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                  <UploadIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          Click to upload
                        </span>
                        <span className="mt-1 block text-sm text-gray-500">
                          CSV or Excel (.xls, .xlsx) files up to 10MB
                        </span>
                      </label>
                      <input
                        ref={fileInputRef}
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        accept=".csv,.xls,.xlsx"
                        className="sr-only"
                        onChange={handleFileSelect}
                        disabled={parsing || uploading}
                      />
                    </div>

                    {selectedFile && (
                      <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                        <FileIcon className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">{selectedFile.name}</span>
                        <span className="text-gray-400">
                          ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {selectedFile && !parsedData && (
                  <div className="mt-4 w-full flex justify-end items-center">
                    <button
                      onClick={handleParseFile}
                      disabled={parsing}
                      className="inline-flex items-center px-4 py-2.5 bg-[#3a3886] text-white rounded-lg hover:bg-[#2d2b6b] transition-all duration-200 shadow-sm hover:shadow-md font-medium"
                    >
                      {parsing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin inline" />
                          Parsing...
                        </>
                      ) : (
                        "Parse File"
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-8 bg-red-50 border border-red-200 rounded-md p-4">
                  <div className="flex">
                    <XCircleIcon className="h-5 w-5 text-red-400 flex-shrink-0" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-red-800">
                        {error}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Upload Progress */}
        {uploading && (
          <div className="bg-white shadow rounded-lg p-8 mb-6">
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                Uploading programs to database...
              </p>
              <p className="text-sm text-gray-500">
                This may take a few moments. Please don't close this page.
              </p>
            </div>
          </div>
        )}

        {uploadResult && (
          <div className="bg-white shadow rounded-lg p-8 mb-4">
            <div
              className={`rounded-md p-6 ${
                uploadResult.success
                  ? "bg-green-50 border border-green-200"
                  : "bg-yellow-50 border border-yellow-200"
              }`}
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  {uploadResult.success ? (
                    <CheckCircleIcon className="h-8 w-8 text-green-400" />
                  ) : (
                    <XCircleIcon className="h-8 w-8 text-yellow-400" />
                  )}
                </div>
                <div className="ml-4 flex-1">
                  <h3
                    className={`text-lg font-medium mb-3 ${
                      uploadResult.success
                        ? "text-green-800"
                        : "text-yellow-800"
                    }`}
                  >
                    Upload Complete
                  </h3>
                  <div
                    className={`text-sm space-y-1 mb-4 ${
                      uploadResult.success
                        ? "text-green-700"
                        : "text-yellow-700"
                    }`}
                  >
                    <p className="font-medium">
                      Successfully uploaded: {uploadResult.successCount}
                    </p>
                    {uploadResult.failedCount > 0 && (
                      <p className="font-medium text-red-600">
                        Failed: {uploadResult.failedCount}
                      </p>
                    )}
                  </div>

                  {uploadResult.errors && uploadResult.errors.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold text-red-800 mb-2">
                        Error Details:
                      </h4>
                      <div className="max-h-64 overflow-y-auto bg-white rounded p-3 border border-red-200">
                        <ul className="text-sm text-red-700 space-y-2">
                          {uploadResult.errors.map((err, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="font-medium mr-2 flex-shrink-0">
                                Program {err.index + 1} ({err.programme_name}):
                              </span>
                              <span>{err.error}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {uploadResult.success && (
                    <div className="mt-4">
                      <Link
                        href="/admin/programs"
                        className="inline-flex items-center px-4 py-2.5 bg-[#3a3886] text-white rounded-lg hover:bg-[#2d2b6b] transition-all duration-200 shadow-sm hover:shadow-md font-medium"
                      >
                        Go to Programs
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Parsed Data Section */}
        {!uploading && !uploadResult && parsedData && (
          <div className="bg-white shadow rounded-lg p-8 mb-6">
            <div className="mb-6">
              <div className="w-full flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Review Parsed Data
                </h2>

                <div className="flex gap-2 items-center justify-center">
                  {parsedData && !uploading && !uploadResult && (
                    <>
                      <button
                        className="inline-flex items-center px-4 py-2.5 bg-[#F97316] text-white rounded-lg hover:bg-[#ea6a0f] transition-all duration-200 shadow-sm hover:shadow-md font-medium"
                        onClick={handleUploadAnotherFile}
                      >
                        <X className="h-5 w-5 mr-2" />
                        Cancel Upload
                      </button>

                      <button
                        onClick={handleSaveToDatabase}
                        disabled={uploading}
                        className="inline-flex items-center px-4 py-2.5 bg-[#3a3886] text-white rounded-lg hover:bg-[#2d2b6b] transition-all duration-200 shadow-sm hover:shadow-md font-medium"
                      >
                        {uploading ? (
                          <>
                            <Loader2 className="h-5 w-5 mr-2 animate-spin inline" />
                            Saving to database...
                          </>
                        ) : (
                          <div className="w-full flex items-center">
                            <UploadIcon className="h-5 w-5 mr-2" />
                            <span className="min-w-min whitespace-nowrap">
                              Save {parsedData.length} Programs
                            </span>
                          </div>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-4 mb-4">
                <div className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-800">
                      Successfully parsed {parsedData.length} programs from file
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      S. No.
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      University
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Previous / Current Study
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Degree Going For
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Courses Name
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      IELTS Requirment
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.map((program, idx) => (
                    <tr key={startIndex + idx} className="hover:bg-gray-50">
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {startIndex + idx + 1}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {program.university || "-"}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {program.previous_or_current_study || "-"}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {program.degree_going_for || "-"}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-900">
                        {program.course_name || "-"}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {program.ielts_requirement || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="text-lg text-gray-700">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(endIndex, parsedData.length)} of {parsedData.length}{" "}
                  programs
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </button>

                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => goToPage(pageNum)}
                          className={`px-3 py-1 rounded-md text-sm font-medium ${
                            currentPage === pageNum
                              ? "bg-blue-600 text-white"
                              : "text-gray-700 hover:bg-gray-50 border border-gray-300"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
