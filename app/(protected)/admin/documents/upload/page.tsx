"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { SaveIcon, Upload, X, FileText, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import Breadcrumbs from "@/components/ui/breadCrumbs";
import FormInput from "@/components/form/formInput";

const ACCEPTED_FILE_TYPES = {
  "application/pdf": [".pdf"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
  "application/vnd.ms-excel": [".xls"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
    ".xlsx",
  ],
  "text/csv": [".csv"],
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

interface FormData {
  title: string;
  description: string;
  file: File | null;
}

export default function UploadDocumentPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    file: null,
  });

  // Handle input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validate file
  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return "File size must be less than 10MB";
    }

    // Check file type
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
    const isValidType = Object.values(ACCEPTED_FILE_TYPES)
      .flat()
      .includes(fileExtension);

    if (!isValidType) {
      return "Invalid file type. Please upload PDF, Word, Excel, or CSV files only";
    }

    return null;
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const error = validateFile(file);
      if (error) {
        toast.error(error);
        e.target.value = "";
        return;
      }
      setFormData((prev) => ({ ...prev, file }));
    }
  };

  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      const error = validateFile(file);
      if (error) {
        toast.error(error);
        return;
      }
      setFormData((prev) => ({ ...prev, file }));
    }
  };

  // Remove selected file
  const handleRemoveFile = () => {
    setFormData((prev) => ({ ...prev, file: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (!formData.file) {
      toast.error("Please select a file to upload");
      return;
    }

    setLoading(true);

    try {
      // Create FormData object
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);
      submitData.append("file", formData.file);
      submitData.append("file_type", formData.file.type);

      const response = await fetch("/api/admin/documents", {
        method: "POST",
        body: submitData,
      });

      const result = await response.json();

      if (!result.success) {
        toast.error(result.error || "Failed to upload document");
        return;
      }

      toast.success("Document uploaded successfully!");
      router.push("/admin/documents");
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs />
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#3a3886]">Upload Document</h1>
          <p className="mt-2 text-xl text-gray-600">
            Upload a new document to the system
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Document Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Document Information
            </h2>
            <div className="space-y-6">
              {/* Title */}
              <FormInput
                label="Title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleInputChange}
                required={true}
                placeholder="Enter document title"
              />

              {/* Description */}
              <div className="mb-4">
                <FormInput
                  label="Description"
                  name="description"
                  type="text"
                  value={formData.description}
                  onChange={handleInputChange}
                  required={false}
                  placeholder="Enter document description (optional)"
                />
              </div>

              {/* File Upload */}
              <div className="mb-4">
                <label className="block text-xl font-semibold text-[#3a3886] mb-2">
                  Upload File <span className="text-red-500">*</span>
                </label>

                {/* File Drop Zone */}
                {!formData.file ? (
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragActive
                        ? "border-[#3a3886] bg-indigo-50"
                        : "border-gray-300 hover:border-[#3a3886]"
                    }`}
                  >
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <div className="space-y-2">
                      <p className="text-lg text-gray-600">
                        Drag and drop your file here, or
                      </p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center px-4 py-2 text-lg bg-[#3a3886] text-white rounded-lg hover:bg-[#2d2b6b] transition-all duration-200"
                      >
                        Browse Files
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-4">
                      Supported formats: PDF, Word, Excel, CSV (Max 10MB)
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.csv"
                      className="hidden"
                    />
                  </div>
                ) : (
                  /* Selected File Display */
                  <div className="border-2 border-gray-300 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-8 w-8 text-[#3a3886]" />
                        <div>
                          <p className="text-lg font-medium text-gray-900">
                            {formData.file.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatFileSize(formData.file.size)}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 mt-6">
              <Link
                href="/admin/documents"
                className="inline-flex items-center px-4 py-2.5 text-xl bg-[#F97316] text-white rounded-lg hover:bg-[#ea6a0f] transition-all duration-200 shadow-sm hover:shadow-md font-medium"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2.5 text-xl bg-[#3a3886] text-white rounded-lg hover:bg-[#2d2b6b] transition-all duration-200 shadow-sm hover:shadow-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="animate-spin mr-2" />
                ) : (
                  <SaveIcon className="h-4 w-4 mr-2" />
                )}
                {loading ? "Uploading..." : "Upload Document"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
