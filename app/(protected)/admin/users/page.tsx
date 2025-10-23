"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/lib/types";
import { UserPlusIcon } from "lucide-react";
import Link from "next/link";
import Table from "@/components/table/globalTable";
import Breadcrumbs from "@/components/ui/breadCrumbs";
import { useApi } from "@/hooks/auth-modules/useFetch";

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false)
  const {data, error, isLoading}= useApi("/api/admin/users")

  useEffect(() => {
    console.log("data" , data)
    if(data?.data){
      if(data.success){
        setUsers(data?.data);
      }else{
        console.error("Error fetching users:", data.error);
        return;
      }
    }
  }, [data]);


  const handleEdit = (user: User) => {
    router.push(`/admin/users/${user.id}`);
  };

  const handleDelete = async (user: User) => {
    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
      try {
        console.log("Deleting user:", user.id);
        setUsers((prev) => prev.filter((u) => u.id !== user.id));
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleToggleActive = (user: User) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id ? { ...u, is_active: !u.is_active } : u
      )
    );
  };

  const columns = [
    {
      key: "name",
      label: "Name",
      render: (row: User) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{row.name}</div>
          <div className="text-sm text-gray-500">{row.email}</div>
        </div>
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (row: User) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            row.role === "admin"
              ? "bg-red-100 text-red-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {row.role}
        </span>
      ),
    },
    { key: "phone", label: "Phone" },
    {
      key: "is_active",
      label: "Status",
      render: (row: User) => (
        <button
          onClick={() => handleToggleActive(row)}
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            row.is_active
              ? "bg-green-100 text-green-800 hover:bg-green-200"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          }`}
        >
          {row.is_active ? "Active" : "Inactive"}
        </button>
      ),
    },
    {
      key: "created_at",
      label: "Created",
      render: (row: User) => new Date(row.created_at).toLocaleDateString(),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Table
          title="Users"
          columns={columns}
          data={users}
          searchKeys={["name", "email", "role"]}
          searchPlaceholder="Search users by name, email, or role..."
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyMessage="No users found."
          addBulkHeref="/admin/users/bulkUpload"
          addHref="/admin/users/addUser"
          filterTabs={[
            {
              key: "all",
              label: "All",
              count: users.length,
              filter: () => true,
            },
            {
              key: "active",
              label: "Active",
              count: users.filter((u) => u.is_active).length,
              filter: (u) => u.is_active,
            },
            {
              key: "inactive",
              label: "Inactive",
              count: users.filter((u) => !u.is_active).length,
              filter: (u) => !u.is_active,
            },
            {
              key: "admin",
              label: "Admins",
              count: users.filter((u) => u.role === "admin").length,
              filter: (u) => u.role === "admin",
            },
          ]}
        />
        {/* {showAddForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New User</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                    Role *
                  </label>
                  <select
                    id="role"
                    name="role"
                    required
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="user">Counselor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Create User
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )} */}
      </div>
    </div>
  );
}
