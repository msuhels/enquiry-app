"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  UploadIcon,
  FileIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  XCircleIcon,
  Loader2,
  ChevronLeft,
  ChevronRight,
  FileDown,
  Info,
  X,
} from "lucide-react";
import Link from "next/link";
import { BulkUploadService } from "@/lib/bulk-upload";
import { ProgramFormData } from "@/lib/types";
import { useModal } from "@/components/ui/modal";
import FileFormatInstructions from "@/components/modals/fileInstructionModal";
import Breadcrumbs from "@/components/ui/breadCrumbs";

interface ValidationError {
  row: number;
  field: string;
  message: string;
  value: any;
}

interface ValidationResponse {
  valid: boolean;
  totalPrograms: number;
  validPrograms: number;
  invalidPrograms: number;
  errors: ValidationError[];
}

interface UploadResult {
  success: boolean;
  total: number;
  created: number;
  failed: number;
  errors?: Array<{ index: number; programme_name: string; error: string }>;
}

interface IExtraField {
  field: string;
  accept: boolean;
}

const ITEMS_PER_PAGE = 10;

// Comparison operator mapping
const COMPARISON_MAP: Record<string, string> = {
  gt: ">",
  gte: ">=",
  lt: "<",
  lte: "<=",
  eq: "=",
};

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
  const [extraFields, setExtraFields] = useState<IExtraField[]>([]);

  const bulkUploadService = new BulkUploadService();
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
      if (bulkUploadService.validateFileType(file)) {
        setSelectedFile(file);
        setParsedData(null);
        setUploadResult(null);
        setError("");
        setCurrentPage(1);
        setExtraFields([]);
      } else {
        setError(
          "Invalid file type. Please select a CSV, Excel (.xls, .xlsx), or XML file."
        );
        setSelectedFile(null);
      }
    }
  };

  type ProgramFormDataWithExtra = ProgramFormData & {
    extraFields: Record<string, any>;
  };

  const handleParseFile = async () => {
    if (!selectedFile) return;

    setParsing(true);
    setError("");
    setParsedData(null);
    setCurrentPage(1);

    try {
      const fileExtension = bulkUploadService.getFileExtension(
        selectedFile.name
      );

      let data: ProgramFormData[] = [];

      switch (fileExtension) {
        case "csv":
          data = await bulkUploadService.parseCSV(selectedFile);
          break;
        case "xls":
        case "xlsx":
          data = await bulkUploadService.parseExcel(selectedFile);
          break;
        case "xml":
          data = await bulkUploadService.parseXML(selectedFile);
          break;
        default:
          throw new Error("Unsupported file type");
      }

      if (data.length === 0) {
        throw new Error("No valid data found in the file");
      }

      setParsedData(data);
      const extraFields = (data[0] as ProgramFormDataWithExtra)?.extraFields;

      if (extraFields) {
        const fields = Object.keys(extraFields)
          .filter((key) => !key.toLowerCase().startsWith("comp-"))
          .map((key) => ({ field: key, accept: true }));
        setExtraFields(fields);
      }

      console.log(`Successfully parsed ${data.length} programs`);
    } catch (err) {
      console.error("Parse error:", err);
      setError(err instanceof Error ? err.message : "Failed to parse file");
    } finally {
      setParsing(false);
    }
  };

  const transformDataForAPI = () => {
    if (!parsedData) return [];

    const acceptedFields = extraFields
      .filter((field) => field.accept)
      .map((field) => field.field);

    return parsedData.map((program) => {
      const { extraFields: programExtraFields, ...restProgram } =
        program as ProgramFormDataWithExtra;

      // Build custom_fields array
      const custom_fields: Array<{
        field: string;
        comparison: string;
        value: number | string;
      }> = [];

      if (programExtraFields && acceptedFields.length > 0) {
        acceptedFields.forEach((fieldName) => {
          const value = programExtraFields[fieldName];
          const comparisonKey = `Comp-${fieldName}`;
          const comparisonOperator = programExtraFields[comparisonKey];

          // Only add if value exists and is not empty
          if (
            value !== null &&
            value !== undefined &&
            value.toString().trim() !== ""
          ) {
            const mappedComparison =
              COMPARISON_MAP[comparisonOperator?.toLowerCase()] || ">";

            custom_fields.push({
              field: fieldName,
              comparison: mappedComparison,
              value: value,
            });
          }
        });
      }

      return {
        ...restProgram,
        custom_fields,
      };
    });
  };

  const handleSaveToDatabase = async () => {
    if (!parsedData || !selectedFile) return;

    setUploading(true);
    setUploadResult(null);
    setError("");

    try {
      const transformedPrograms = transformDataForAPI();
      const response = await fetch("/api/admin/programs/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transformedPrograms),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: `Server error: ${response.status} ${response.statusText}`,
        }));
        throw new Error(errorData.error || "Upload failed");
      }

      const result: UploadResult = await response.json();
      setUploadResult(result);

      if (result.success && result.failed === 0) {
        setTimeout(() => {
          setSelectedFile(null);
          setParsedData(null);
          setExtraFields([]);
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
      "Sr.No.",
      "UNIVERSITY",
      "University Ranking",
      "Study Level",
      "Study Area",
      "PROGRAMME Name",
      "Campus",
      "Duration",
      "Open Intake",
      "Open Call",
      "Application Deadline",
      "Entry REQUIREMENTS",
      "PERCENTAGE Required",
      "MOI",
      "Ielts Score",
      "No band less than",
      "Toefl Score",
      "No ban less than",
      "PTE Score",
      "No band less than",
      "DET Score",
      "No band less than",
      "TOLC Score",
      "SAT Score",
      "GRE Score",
      "GMAT Score",
      "CENTS Score",
      "TIL Score",
      "ARCHED Test",
      "Application Fees",
      "Additional Requirement",
      "Remarks",
      "My Custom Field",
      "Comp-My Custom Field"
    ];

    const sampleData = [
      "1",
      "University of Example",
      "100",
      "Bachelor",
      "Computer Science",
      "Computer Science",
      "Main Campus",
      "4 years",
      "Fall 2024",
      "Open",
      "2024-03-15",
      "High school diploma",
      "80",
      "English",
      "6.5",
      "6.0",
      "90",
      "20",
      "65",
      "60",
      "120",
      "100",
      "25",
      "1200",
      "320",
      "650",
      "85",
      "75",
      "Pass",
      "100",
      "Portfolio required",
      "Popular program",
      "custom field value",
      "gt"
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
    setExtraFields([]);
    setCurrentPage(1);
    setUploadResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSelectExtraField = (
    index: number,
    isChecked: boolean
  ) => {
    const updated = extraFields.map((field, i) =>
      i === index ? { ...field, accept: isChecked } : field
    );
    setExtraFields(updated);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!parsedData && (
          <>
            <div className="mb-8">
              <Breadcrumbs />
              <h1 className="text-3xl font-bold text-gray-900">
                Bulk Upload Programs
              </h1>
              <p className="mt-2 text-gray-600">
                Upload multiple university programs using CSV, Excel, or XML
                files
              </p>
            </div>

            <div className="bg-white shadow rounded-lg p-8 mb-6">
              {/* File Upload Section */}
              <div className="mb-8">
                <div className="flex justify-between">
                  <div className="flex items-center justify-center gap-2">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Upload File
                    </h2>
                    <Info
                      onClick={handleOpenInstructions}
                      className="h-4 w-4 text-gray-600 cursor-pointer"
                    />
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
                          Click to upload or drag and drop
                        </span>
                        <span className="mt-1 block text-sm text-gray-500">
                          CSV, Excel (.xls, .xlsx), or XML files up to 10MB
                        </span>
                      </label>
                      <input
                        ref={fileInputRef}
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        accept=".csv,.xls,.xlsx,.xml"
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
                      className="px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

        {/* Parsed Data Section */}
        {parsedData && (
          <div className="bg-white shadow rounded-lg p-8 mb-6">
            <div className="mb-6">
              <div className="w-full flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Review Parsed Data
                </h2>

                <div className="flex gap-2 items-center justify-center">
                  <button
                    className="w-full p-2 border bg-red-600 border-red-600 rounded-md text-sm font-medium text-white hover:bg-red-700 transition-colors flex items-center"
                    onClick={handleUploadAnotherFile}
                  >
                   <X className="h-5 w-5 mr-2" />
                    Cancel Upload 
                  </button>
                  {parsedData && !uploading && !uploadResult && (
                    <button
                      onClick={handleSaveToDatabase}
                      disabled={uploading}
                      className="w-full items-center p-2 border bg-indigo-600 border-indigo-600 rounded-md text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
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

              {extraFields.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
                  <h3 className="text-sm font-semibold text-yellow-900 mb-3">
                   Detected {extraFields.length} Custom field(s). Select
                    which to include:
                  </h3>

                  <ul className="space-y-2">
                    {extraFields.map((item, index) => {
                      return (
                        <li key={index} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`field-${index}`}
                            checked={item.accept}
                            onChange={(e) =>
                              handleSelectExtraField(
                                index,
                                e.target.checked
                              )
                            }
                            className="h-4 w-4 text-indigo-600 checked:bg-indigo-500 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor={`field-${index}`}
                            className="ml-2 text-sm text-gray-700 cursor-pointer"
                          >
                            {item.field}
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      University
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Programme
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Study Level
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Study Area
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      IELTS
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Application Fee
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
                      <td className="px-3 py-4 text-sm text-gray-900">
                        {program.programme_name || "-"}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {program.study_level || "-"}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {program.study_area || "-"}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {program.duration || "-"}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {program.ielts_score || "-"}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {program.application_fees || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="text-sm text-gray-700">
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

        {/* Upload Result */}
        {uploadResult && (
          <div className="bg-white shadow rounded-lg p-8">
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
                    <AlertCircleIcon className="h-8 w-8 text-yellow-400" />
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
                      Total programs: {uploadResult.total}
                    </p>
                    <p className="font-medium">
                      Successfully uploaded: {uploadResult.created}
                    </p>
                    {uploadResult.failed > 0 && (
                      <p className="font-medium text-red-600">
                        Failed: {uploadResult.failed}
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
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
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
      </div>
    </div>
  );
}