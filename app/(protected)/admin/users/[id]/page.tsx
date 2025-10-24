"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Copy, Mail, Eye, Save } from "lucide-react";

interface User {
  id: string;
  email: string;
  full_name?: string | null;
  phone_number?: string | null;
  password?: string | null;
}


export default function UserUpdatePage() {
  const [user, setUser] = useState<User>({
    id: "",
    email: "",
    full_name: null,
    phone_number: null,
    password: null,
  });
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const userId = useParams().id;

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
          
      }
    };

    fetchUser();
  }, [userId]);

  const fetchPassword = async () => {
    if (showPassword) return; // already fetched

    setLoadingPassword(true);
    try {
      const res = await fetch("/api/admin/decrypt-password", {
        method: "POST",
        body: JSON.stringify({ authUserId: user.id }),
      });

      const data = await res.json();
      if (res.ok) {
        setUser(prev => ({ ...prev, password: data.password }));
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
      // const res = await fetch("/api/admin/send-password-email", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ userId: user.id, password: user.password }),
      // });
      // if (res.ok) alert("Password sent via email!");
      // else alert("Failed to send email");
      console.log("Password sent via email!",user.email, user.password);
    } catch (err) {
      console.error(err);
      alert("Error sending email");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      if (res.ok) {
        alert("User updated successfully");
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update user");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving user");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Update User</h1>

      <div className="mb-4">
        <label className="block font-medium">Email</label>
        <input
          type="email"
          value={user.email}
          onChange={e => setUser({ ...user, email: e.target.value })}
          className="mt-1 p-2 border rounded w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium">Full Name</label>
        <input
          type="text"
          value={user.full_name || ""}
          onChange={e => setUser({ ...user, full_name: e.target.value })}
          className="mt-1 p-2 border rounded w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium">Phone</label>
        <input
          type="text"
          value={user.phone_number || ""}
          onChange={e => setUser({ ...user, phone_number: e.target.value })}
          className="mt-1 p-2 border rounded w-full"
        />
      </div>

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

      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        <Save size={18} />
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}
