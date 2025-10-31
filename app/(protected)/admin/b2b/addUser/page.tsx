"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { SaveIcon } from "lucide-react";
import Link from "next/link";
import { State, City } from "country-state-city";
import Breadcrumbs from "@/components/ui/breadCrumbs";
import FormInput from "@/components/form/formInput";
import SearchSelect from "@/components/form/FormSearchSelect";
import * as Switch from "@radix-ui/react-switch";

export default function NewUserPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    organization: "",
    state: "",
    city: "",
    role: "user",
    is_active: true,
  });

  // Get all states from India (country code: IN)
  const stateOptions = useMemo(() => {
    const indianStates = State.getStatesOfCountry("IN");
    return indianStates.map((state) => ({
      value: state.name,
      label: state.name,
      isoCode: state.isoCode,
    }));
  }, []);

  // Get cities based on selected state
  const cityOptions = useMemo(() => {
    if (!formData.state) return [];

    // Find the state ISO code
    const selectedState = stateOptions.find(
      (state) => state.value === formData.state
    );

    if (!selectedState) return [];

    const cities = City.getCitiesOfState("IN", selectedState.isoCode);
    return cities.map((city) => ({
      value: city.name,
      label: city.name,
    }));
  }, [formData.state, stateOptions]);

  // Handle input change
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleStatusChange = (checked) => {
    setFormData((prev) => (
      {
        ...prev, is_active:checked
      }
    ))
  }

  // Handle SearchSelect change
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => {
      // If state changes, reset city
      if (name === "state") {
        return {
          ...prev,
          state: value,
          city: "",
        };
      }
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
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
    { label: "Email", name: "email", type: "email", required: true },
    { label: "Phone Number", name: "phone_number", type: "text" },
    { label: "Organization", name: "organization", type: "text" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs />
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#3a3886]">
            Create New B2B Partner
          </h1>
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
                  value={formData[f.name as keyof typeof formData] as string}
                  onChange={handleInputChange}
                  required={f.required}
                />
              ))}

              {/* State SearchSelect */}
              <SearchSelect
                label="State"
                name="state"
                value={formData.state}
                options={stateOptions}
                onChange={(value) => handleSelectChange("state", value)}
                placeholder="Select a state..."
                allowCreate={false}
              />

              {/* City SearchSelect */}
              <SearchSelect
                label="City"
                name="city"
                value={formData.city}
                options={cityOptions}
                onChange={(value) => handleSelectChange("city", value)}
                placeholder={
                  formData.state
                    ? "Select a city..."
                    : "Please first select a state"
                }
                allowCreate={false}
              />

              {/* Status */}
              <div className="mb-4 flex items-center justify-start gap-5 ">
                <label
                  htmlFor="status"
                  className="block text-sm font-semibold text-[#3a3886] mb-2"
                >
                  Status
                </label>
                <div className="flex items-center gap-3">
                  <Switch.Root
                    checked={formData.is_active}
                    onClick={(e) => e.stopPropagation()}
                    onCheckedChange={(checked) => handleStatusChange(checked)}
                    className={`relative w-10 h-5 rounded-full transition-colors ${
                      formData.is_active ? "bg-indigo-600" : "bg-gray-300"
                    }`}
                  >
                    <Switch.Thumb
                      className={`block w-4 h-4 bg-white rounded-full shadow transition-transform ${
                        formData.is_active ? "translate-x-5" : "translate-x-1"
                      }`}
                    />
                  </Switch.Root>
                  <span className="text-sm text-gray-700">
                    {formData.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              {/* <div className="flex items-center space-x-2 mt-2 md:col-span-2">
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
              </div> */}
            </div>

            <div className="flex justify-end space-x-4">
              <Link
                href="/admin/b2b"
                className="inline-flex items-center px-4 py-2.5 bg-[#F97316] text-white rounded-lg hover:bg-[#ea6a0f] transition-all duration-200 shadow-sm hover:shadow-md font-medium"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2.5 bg-[#3a3886] text-white rounded-lg hover:bg-[#2d2b6b] transition-all duration-200 shadow-sm hover:shadow-md font-medium"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <SaveIcon className="h-4 w-4 mr-2" />
                )}
                {loading ? "Creating..." : "Create B2B Partner"}
              </button>
            </div>
          </div>

          {/* Submit */}
        </form>
      </div>
    </div>
  );
}
