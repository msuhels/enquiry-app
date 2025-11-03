"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, SaveIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import Breadcrumbs from "@/components/ui/breadCrumbs";
import FormInput from "@/components/form/formInput";

interface FormData {
  title: string;
  description: string;
}

export default function UpdateDocumentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const docId = useParams().id;

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
  });

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await fetch(`/api/admin/documents?id=${docId}`);
        const result = await response.json();

        if (!result.success) {
          toast.error(result.error || "Failed to fetch document");
          router.push("/admin/documents");
          return;
        }

        setFormData({
          title: result.data.title || "",
          description: result.data.description || "",
        });
      } catch (error) {
        console.error(error);
        toast.error("An unexpected error occurred");
        router.push("/admin/documents");
      } finally {
        setFetching(false);
      }
    };

    fetchDocument();
  }, [docId, router]);

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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);

      const response = await fetch(`/api/admin/documents?id=${docId}`, {
        method: "PATCH",
        body: submitData,
      });

      const result = await response.json();

      if (!result.success) {
        toast.error(result.error || "Failed to update document");
        return;
      }

      toast.success("Document updated successfully!");
      router.push("/admin/documents");
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while fetching
  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-[#F97316] h-12 w-12" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs />
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#3a3886]">Update Document</h1>
          <p className="mt-2 text-xl text-gray-600">
            Update document title and description
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
                {loading ? "Updating..." : "Update Document"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
