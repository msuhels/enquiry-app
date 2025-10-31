"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Copy, Mail, Eye, Save } from "lucide-react";
import { State, City } from "country-state-city";
import Breadcrumbs from "@/components/ui/breadCrumbs";
import SearchSelect from "@/components/form/FormSearchSelect";
import * as Switch from "@radix-ui/react-switch";
import { usePatch } from "@/hooks/api/usePatch";
import { usePut } from "@/hooks/api/usePut";
import { toast } from "sonner";
import { usePost } from "@/hooks/api/usePost";
import { useFetch } from "@/hooks/api/useFetch";
import Link from "next/link";

interface User {
  id: string;
  email: string;
  full_name?: string | null;
  phone_number?: string | null;
  password?: string | null;
  role?: string;
  organization?: string;
  state?: string;
  city?: string;
  is_active?: boolean;
  status?: string;
  email_verified?: boolean;
  profile_picture_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export default function UserUpdatePage() {
  const [user, setUser] = useState<User>({
    id: "",
    email: "",
    full_name: null,
    phone_number: null,
    password: null,
    role: "",
    is_active: false,
    status: "",
    organization: "",
    state: "",
    city: "",
    email_verified: false,
    profile_picture_url: null,
    created_at: "",
    updated_at: "",
  });

  const [loadingPassword, setLoadingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const userId = useParams().id;
  const { data: userData, isLoading } = useFetch(
    `/api/admin/users?id=${userId}`
  );
  const { patch } = usePatch();
  const { put } = usePut();
  const { post } = usePost();

  useEffect(() => {
    if (userData?.data) {
      setUser(userData?.data);
    }
  }, [userData]);

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
    if (!user.state) return [];

    // Find the state ISO code
    const selectedState = stateOptions.find(
      (state) => state.value === user.state
    );

    if (!selectedState) return [];

    const cities = City.getCitiesOfState("IN", selectedState.isoCode);
    return cities.map((city) => ({
      value: city.name,
      label: city.name,
    }));
  }, [user.state, stateOptions]);

  // Handle SearchSelect change
  const handleSelectChange = (name: string, value: string) => {
    setUser((prev) => {
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

  const fetchPassword = async () => {
    if (showPassword) return;
    setLoadingPassword(true);
    try {
      const res = await fetch("/api/admin/decrypt-password", {
        method: "POST",
        body: JSON.stringify({ authUserId: user.id }),
      });

      const data = await res.json();
      if (res.ok) {
        setUser((prev) => ({ ...prev, password: data.password }));
        setShowPassword(true);
      } else {
        alert(data.error || "Failed to fetch password");
      }
    } catch (err) {
      console.error(err);
      alert("Error fetching password");
    } finally {
      setLoadingPassword(false);
    }
  };

  const copyPassword = () => {
    if (!user.password) return;
    navigator.clipboard.writeText(user.password);
    toast.success("Password copied to clipboard!", {
      position: "top-center",
      richColors: true,
    });
  };

  const sendPasswordEmail = async () => {
    if (!user.password || !user.email) return;

    try {
      const res = await post("/api/admin/send-password-email", {
        email: user.email,
        password: user.password,
      });

      if (res.success) {
        toast.success("Email sent successfully!", {
          position: "top-center",
          richColors: true,
        });
      } else {
        toast.error(res.error || "Failed to send email", {
          position: "top-center",
          richColors: true,
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Error sending email", {
        position: "top-center",
        richColors: true,
      });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { password, ...userDataToSave } = user;
      const res = await put(`/api/admin/users/${user.id}`, userDataToSave);
      if (res.success) {
        toast.success("User saved successfully!", {
          position: "top-center",
          richColors: true,
        });
        router.push("/admin/b2b");
      } else {
        toast.error(res.error || "Failed to save user", {
          position: "top-center",
          richColors: true,
        });
      }
    } catch (err) {
      console.error(err);
      alert("Error saving user");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (user: User) => {
    const newStatus = !user.is_active;

    try {
      const response = await patch(`/api/admin/users/toggle`, {
        userId: user.id,
        status: newStatus,
      });
      if (!response?.success) {
        console.error("Error toggling user status:", response.error);
        return;
      }
    } catch (error) {
      console.error("Error toggling user status:", error);
    }
    setUser({
      ...user,
      is_active: newStatus,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs disabledItemIndex={2} />
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-[#3a3886] mb-8">
            Edit B2B Partner
          </h1>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="mb-4  w-full">
              <label className="block text-xl font-semibold text-[#3a3886] mb-2">
                Email
              </label>
              <input
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                className="w-full px-4 py-2.5 border-2 text-xl  border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#F97316] focus:border-[#F97316] transition-all disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500 placeholder:text-gray-400"
              />
            </div>

            {/* Full Name */}
            <div className="mb-4  w-full">
              <label className="block text-xl font-semibold text-[#3a3886] mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={user.full_name || ""}
                onChange={(e) =>
                  setUser({ ...user, full_name: e.target.value })
                }
                className="w-full px-4 py-2.5 border-2 text-xl border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#F97316] focus:border-[#F97316] transition-all disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500 placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Phone */}
            <div className="mb-4 w-full">
              <label className="block text-xl font-semibold text-[#3a3886] mb-2">
                Phone
              </label>
              <input
                type="text"
                value={user.phone_number || ""}
                onChange={(e) =>
                  setUser({ ...user, phone_number: e.target.value })
                }
                className="w-full px-4 py-2.5 border-2 text-xl border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#F97316] focus:border-[#F97316] transition-all disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500 placeholder:text-gray-400"
              />
            </div>

            {/* Organization */}
            <div className="mb-4 w-full">
              <label className="block text-xl font-semibold text-[#3a3886] mb-2">
                Organization
              </label>
              <input
                type="text"
                value={user.organization || ""}
                onChange={(e) =>
                  setUser({ ...user, organization: e.target.value })
                }
                className="w-full px-4 py-2.5 border-2 text-xl border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#F97316] focus:border-[#F97316] transition-all disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500 placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* State */}
            <div className="mb-4 w-full">
              <SearchSelect
                label="State"
                name="state"
                value={user.state || ""}
                options={stateOptions}
                onChange={(value) => handleSelectChange("state", value)}
                placeholder="Select a state..."
                allowCreate={false}
              />
            </div>

            {/* City */}
            <div className="mb-4 w-full">
              <SearchSelect
                label="City"
                name="city"
                value={user.city || ""}
                options={cityOptions}
                onChange={(value) => handleSelectChange("city", value)}
                placeholder={
                  user.state
                    ? "Select a city..."
                    : "Please first select a state"
                }
                allowCreate={false}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Role */}
            <div className="mb-4 w-full">
              {/* <label className="block text-xl font-semibold text-[#3a3886] mb-2">Role</label> */}
              <SearchSelect
                label="Role"
                name="role"
                value={user.role || ""}
                options={[
                  { value: "user", label: "User" },
                  { value: "admin", label: "Admin" },
                ]}
                onChange={(value) => setUser({ ...user, role: value })}
                placeholder="Select user role"
                allowCreate={false}
              />
              {/* <select
                value={user.role}
                onChange={(e) => setUser({ ...user, role: e.target.value })}
                className="mt-1 p-2 border rounded w-full"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select> */}
            </div>

            {/* Password */}
            <div className="mb-4 w-full">
              <label className="block text-xl font-semibold text-[#3a3886] mb-2">
                Password
              </label>
              <div className="flex gap-2 items-center mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  value={user.password || ""}
                  readOnly
                  className="w-full px-4 py-2.5 border-2 text-xl border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#F97316] focus:border-[#F97316] transition-all disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500 placeholder:text-gray-400"
                />
                <button
                  onClick={fetchPassword}
                  disabled={loadingPassword}
                  className="p-2 py-2.5 bg-gray-200 rounded hover:bg-gray-300"
                  title="Show password"
                >
                  <Eye size={18} />
                </button>
                {showPassword && (
                  <>
                    <button
                      onClick={copyPassword}
                      className="px-2 py-2.5 bg-gray-200 rounded hover:bg-gray-300"
                      title="Copy password"
                    >
                      <Copy size={18} />
                    </button>
                    <button
                      onClick={sendPasswordEmail}
                      className="p-2 py-2.5 bg-gray-200 rounded hover:bg-gray-300"
                      title="Send via email"
                    >
                      <Mail size={18} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <label className="block text-xl font-semibold text-[#3a3886] mb-2">
                Created At
              </label>
              <input
                type="text"
                readOnly
                value={
                  user.created_at
                    ? new Date(user.created_at).toLocaleString()
                    : ""
                }
                className="w-full px-4 py-2.5 border-2 text-xl border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#F97316] focus:border-[#F97316] transition-all disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500 placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-xl font-semibold text-[#3a3886] mb-2">
                Updated At
              </label>
              <input
                type="text"
                readOnly
                value={
                  user.updated_at
                    ? new Date(user.updated_at).toLocaleString()
                    : ""
                }
                className="w-full px-4 py-2.5 border-2 text-xl border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#F97316] focus:border-[#F97316] transition-all disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500 placeholder:text-gray-400"
              />
            </div>

            {/* Status */}
            <div className="mb-4 flex items-center justify-start gap-5 ">
              <label
                htmlFor="status"
                className="block text-xl font-semibold text-[#3a3886] mb-2"
              >
                Status
              </label>
              <div className="flex items-center gap-3">
                <Switch.Root
                  checked={user.is_active}
                  onClick={(e) => e.stopPropagation()}
                  onCheckedChange={() => handleToggleActive(user)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    user.is_active ? "bg-indigo-600" : "bg-gray-300"
                  }`}
                >
                  <Switch.Thumb
                    className={`block w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      user.is_active ? "translate-x-5" : "translate-x-1"
                    }`}
                  />
                </Switch.Root>
                <span className="text-xl text-gray-700">
                  {user.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Link
              href="/admin/b2b"
              className="inline-flex items-center px-4 py-2.5 text-xl bg-[#F97316] text-white rounded-lg hover:bg-[#ea6a0f] transition-all duration-200 shadow-sm hover:shadow-md font-medium"
            >
              Cancel
            </Link>

            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center px-4 py-2.5 text-xl bg-[#3a3886] text-white rounded-lg hover:bg-[#2d2b6b] transition-all duration-200 shadow-sm hover:shadow-md font-medium"
            >
              <Save size={18} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
