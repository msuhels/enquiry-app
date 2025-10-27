"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Copy, Mail, Eye, Save } from "lucide-react";
import Breadcrumbs from "@/components/ui/breadCrumbs";
import * as Switch from "@radix-ui/react-switch";
import { usePatch } from "@/hooks/api/usePatch";
import { usePut } from "@/hooks/api/usePut";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  full_name?: string | null;
  phone_number?: string | null;
  password?: string | null;
  role?: string;
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
  const { patch } = usePatch();
  const { put } = usePut();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/admin/users?id=${userId}`);
        const data = await res.json();
        if (res.ok) {
          setUser(data.data);
        } else {
          alert(data.error || "Failed to fetch user");
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, [userId]);

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
    alert("Password copied to clipboard!");
  };

  const sendPasswordEmail = async () => {
    if (!user.password) return;
    try {
      // Example: call your email endpoint
      // const res = await fetch("/api/admin/send-password-email", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ userId: user.id, password: user.password }),
      // });
      // if (res.ok) alert("Password sent via email!");
      console.log("Password sent via email!", user.email, user.password);
    } catch (err) {
      console.error(err);
      alert("Error sending email");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await put(`/api/admin/users/${user.id}`, user);
      if (res.success) {
        toast.success("User saved successfully!", {
          position: "top-center",
          richColors: true,
        });
        router.push("/admin/users");
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs disabledItemIndex={2} />
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit User</h1>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            <Save size={18} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-4">
            <label className="block font-medium">Email</label>
            <input
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="mt-1 p-2 border rounded w-full"
            />
          </div>

          {/* Status */}
          <div className="mb-4 flex items-center justify-start gap-5 ">
            <label htmlFor="status" className="font-bold">
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
              <span className="text-sm text-gray-700">
                {user.is_active ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          {/* Full Name */}
          <div className="mb-4">
            <label className="block font-medium">Full Name</label>
            <input
              type="text"
              value={user.full_name || ""}
              onChange={(e) => setUser({ ...user, full_name: e.target.value })}
              className="mt-1 p-2 border rounded w-full"
            />
          </div>

          {/* Phone */}
          <div className="mb-4">
            <label className="block font-medium">Phone</label>
            <input
              type="text"
              value={user.phone_number || ""}
              onChange={(e) =>
                setUser({ ...user, phone_number: e.target.value })
              }
              className="mt-1 p-2 border rounded w-full"
            />
          </div>

          {/* Role */}
          <div className="mb-4">
            <label className="block font-medium">Role</label>
            <select
              value={user.role}
              onChange={(e) => setUser({ ...user, role: e.target.value })}
              className="mt-1 p-2 border rounded w-full"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Profile Picture */}
          <div className="mb-4">
            <label className="block font-medium">Profile Picture URL</label>
            <input
              type="text"
              value={user.profile_picture_url || ""}
              onChange={(e) =>
                setUser({ ...user, profile_picture_url: e.target.value })
              }
              className="mt-1 p-2 border rounded w-full"
            />
            {user.profile_picture_url && (
              <img
                src={user.profile_picture_url}
                alt="Profile"
                className="w-24 h-24 rounded-full mt-2 object-cover border"
              />
            )}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block font-medium">Password</label>
            <div className="flex gap-2 items-center mt-1">
              <input
                type={showPassword ? "text" : "password"}
                value={user.password || ""}
                readOnly
                className="p-2 border rounded flex-1"
              />
              <button
                onClick={fetchPassword}
                disabled={loadingPassword}
                className="p-2 bg-gray-200 rounded hover:bg-gray-300"
                title="Show password"
              >
                <Eye size={18} />
              </button>
              {showPassword && (
                <>
                  <button
                    onClick={copyPassword}
                    className="p-2 bg-gray-200 rounded hover:bg-gray-300"
                    title="Copy password"
                  >
                    <Copy size={18} />
                  </button>
                  <button
                    onClick={sendPasswordEmail}
                    className="p-2 bg-gray-200 rounded hover:bg-gray-300"
                    title="Send via email"
                  >
                    <Mail size={18} />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div>
              <label className="block font-medium">Created At</label>
              <input
                type="text"
                readOnly
                value={
                  user.created_at
                    ? new Date(user.created_at).toLocaleString()
                    : ""
                }
                className="mt-1 p-2 border rounded w-full bg-gray-100"
              />
            </div>
            <div>
              <label className="block font-medium">Updated At</label>
              <input
                type="text"
                readOnly
                value={
                  user.updated_at
                    ? new Date(user.updated_at).toLocaleString()
                    : ""
                }
                className="mt-1 p-2 border rounded w-full bg-gray-100"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
