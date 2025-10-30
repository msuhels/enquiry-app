"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SaveIcon } from "lucide-react";
import Link from "next/link";
import Breadcrumbs from "@/components/ui/breadCrumbs";
import FormInput from "@/components/form/formInput";

export default function NewUserPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    role: "user",
    is_active: true,
  });

  const [generatedPassword, setGeneratedPassword] = useState<string>("");

  // handle input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData
      };

      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!result.success) {
        alert(result.error || "Failed to create user.");
        return;
      }

      router.push("/admin/b2b");
    } catch (error) {
      console.error(error);
      alert("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const basicFields = [
    { label: "Full Name", name: "full_name", required: true },
    { label: "Email", name: "email", type: "email", required:true},
    { label: "Phone Number", name: "phone_number", type: "text" },
    // {
    //   label: "Role",
    //   name: "role",
    //   select: [
    //     { value: "user", label: "User" },
    //     { value: "admin", label: "Admin" },
    //   ],
    // },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs />
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New B2B Partner</h1>
          <p className="mt-2 text-gray-600">
            Fill out the details to create a new b2b account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              B2B Partner Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {basicFields.map((f) => (
                <FormInput
                  key={f.name}
                  label={f.label}
                  name={f.name}
                  type={f.type}
                  select={f.select}
                  value={formData[f.name as keyof typeof formData] as string}
                  onChange={handleInputChange}
                  required={f.required}
                />
              ))}

              <div className="flex items-center space-x-2 mt-2">
                <input
                  id="is_active"
                  name="is_active"
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="h-4 w-4 border-gray-300 rounded"
                />
                <label
                  htmlFor="is_active"
                  className="text-sm font-medium text-gray-700"
                >
                  Active
                </label>
              </div>
            </div>
          </div>


          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/admin/b2b"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <SaveIcon className="h-4 w-4 mr-2" />
              )}
              {loading ? "Creating..." : "Create B2b Partner"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
