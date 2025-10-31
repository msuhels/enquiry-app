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
} from "lucide-react";
import Link from "next/link";
import * as BulkUploadService from "@/lib/user-bulk-upload-service";
import { useModal } from "@/components/ui/modal";
import FileFormatInstructions from "@/components/modals/fileInstructionModal";
import Breadcrumbs from "@/components/ui/breadCrumbs";
import GeneratePasswordModal from "@/components/modals/generatePasswordModal";

export interface UserFormData {
  email: string;
  name: string;
  role: "admin" | "user";
  phone?: string;
  organization?: string;
  state?: string;
  city?: string;
}

interface ValidationError {
  row: number;
  field: string;
  message: string;
  value: any;
}

interface ValidationResponse {
  valid: boolean;
  totalUsers: number;
  validUsers: number;
  invalidUsers: number;
  errors: ValidationError[];
}

interface UploadResult {
  success: boolean;
  total: number;
  successful: number;
  failed: number;
  errors?: Array<{ row: number; error: string }>;
}

const ITEMS_PER_PAGE = 10;

export default function BulkUploadUsersPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [validating, setValidating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [parsedData, setParsedData] = useState<UserFormData[] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  );
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string>("");

  const { openModal, closeModal } = useModal();

  const totalPages = parsedData
    ? Math.ceil(parsedData.length / ITEMS_PER_PAGE)
    : 0;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = parsedData ? parsedData.slice(startIndex, endIndex) : [];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (BulkUploadService.validateFileType(file)) {
        setSelectedFile(file);
        setParsedData(null);
        setValidationErrors([]);
        setUploadResult(null);
        setError("");
        setCurrentPage(1);
      } else {
        setError(
          "Invalid file type. Please select a CSV, Excel (.xls, .xlsx), or XML file."
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
    setValidationErrors([]);
    setCurrentPage(1);

    try {
      const fileExtension = BulkUploadService.getFileExtension(
        selectedFile.name
      );
      let data: UserFormData[] = [];

      switch (fileExtension) {
        case "csv":
          data = await BulkUploadService.parseCSV(selectedFile);
          break;
        case "xls":
        case "xlsx":
          data = await BulkUploadService.parseExcel(selectedFile);
          break;
        case "xml":
          data = await BulkUploadService.parseXML(selectedFile);
          break;
        default:
          throw new Error("Unsupported file type");
      }

      if (data.length === 0) {
        throw new Error("No valid data found in the file");
      }

      setParsedData(data);
      console.log(`Successfully parsed ${data.length} users`);
    } catch (err) {
      console.error("Parse error:", err);
      setError(err instanceof Error ? err.message : "Failed to parse file");
    } finally {
      setParsing(false);
    }
  };

  const handleSaveToDatabase = async () => {
    if (!parsedData || !selectedFile) return;

    // Warn if there are validation errors
    if (validationErrors.length > 0) {
      const confirmed = window.confirm(
        `There are ${validationErrors.length} validation errors. Some users may fail to upload. Do you want to continue?`
      );
      if (!confirmed) return;
    }

    setUploading(true);
    setUploadResult(null);
    setError("");

    try {
      const modifiedData: any = parsedData.map((user) => ({
        full_name: user.name,
        email: user.email,
        role: user.role,
        phone_number: user.phone,
        organization: user.organization,
        state: user.state,
        city: user.city,
      }));

      const response = await fetch("/api/admin/users/bulk-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          users: modifiedData,
          filename: selectedFile.name,
        }),
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
        // Clear form on complete success after 3 seconds
        setTimeout(() => {
          setSelectedFile(null);
          setParsedData(null);
          setValidationErrors([]);
          setCurrentPage(1);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }, 3000);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : "Failed to upload users");
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const headers = [
      "Sr.No.",
      "Name",
      "Email",
      "Phone",
      "Role",
      "Organization",
      "State",
      "City",
    ];

    const sampleData = [
      "1",
      "Alice Smith",
      "alice.smith@example.com",
      "123-456-7890",
      "user",
      "ABC Corp",
      "Madhya Pradesh",
      "Indore",
    ];

    const csvContent = [headers.join(","), sampleData.join(",")].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "user_template.csv";
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

  const handleOpenGeneratePasswordModal = () => {
    // @ts-ignore
    const modalId = openModal(
      <GeneratePasswordModal
        handleConfirmation={() => {
          console.log("done done done");
          // @ts-ignore
          closeModal(modalId);
        }}
      />,
      { size: "md", closeOnOverlayClick: true, showCloseButton: true }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Breadcrumbs />
          <h1 className="text-3xl font-bold text-gray-900">
            Bulk Upload B2B Partners
          </h1>
          <p className="mt-2 text-gray-600">
            Upload multiple users using CSV, Excel, or XML files
          </p>
        </div>

        {!parsedData && (
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
                        Click to upload
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
                      disabled={parsing || validating || uploading}
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
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
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
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Upload Progress */}
        {uploading && (
          <div className="bg-white shadow rounded-lg p-8 mb-6">
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                Uploading users to database...
              </p>
              <p className="text-sm text-gray-500">
                This may take a few moments. Please don't close this page.
              </p>
            </div>
          </div>
        )}

        {/* Upload Result */}
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
                      Total users: {uploadResult.total}
                    </p>
                    <p className="font-medium">
                      Successfully uploaded: {uploadResult.successful}
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
                                Row {err.row}:
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
                        href="/admin/b2b"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        Go Back
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        { !uploadResult && parsedData && (
          <div className="bg-white shadow rounded-lg p-8 mb-6">
            <div className="mb-6">
              <div className="w-full flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Review Parsed Data
                </h2>
                {/* <button
                  onClick={handleOpenGeneratePasswordModal}
                  className="inline-flex items-center p-1 border bg-indigo-600 border-indigo-600 rounded-md text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
                >
                  Generate Passwords
                </button> */}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
                <div className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-800">
                      Successfully parsed {parsedData.length} users from file
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
                      #
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Organization
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      State
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      City
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.map((user, idx) => (
                    <tr key={startIndex + idx} className="hover:bg-gray-50">
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {startIndex + idx + 1}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.name || "-"}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-900">
                        {user.email || "-"}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.phone || "-"}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.role || "-"}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.organization || "-"}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.state || "-"}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.city || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="text-sm text-gray-700">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(endIndex, parsedData.length)} of {parsedData.length}{" "}
                  users
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

        {/* Save to Database Section */}
        {parsedData && !uploading && !uploadResult && (
          <div className="w-full flex justify-end mb-6">
            <button
              onClick={handleSaveToDatabase}
              disabled={uploading}
              className="flex justify-center items-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Saving to database...
                </>
              ) : (
                <>
                  <UploadIcon className="h-5 w-5 mr-2" />
                  Save {parsedData.length} Users to Database
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
