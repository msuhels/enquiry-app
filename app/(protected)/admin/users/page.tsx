"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/lib/types";
import { UserPlusIcon } from "lucide-react";
import Link from "next/link";
import Table from "@/components/table/globalTable";
import Breadcrumbs from "@/components/ui/breadCrumbs";
import { useFetch } from "@/hooks/api/useFetch";
import { usePatch } from "@/hooks/api/usePatch";
import { useModal } from "@/components/ui/modal";
import DeleteUserConfirmationModal from "./components/deleteUserConfirmationModal";

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const { data, error, isLoading } = useFetch("/api/admin/users");
  const { patch } = usePatch();
  const { openModal, closeModal } = useModal();

  useEffect(() => {
    console.log("data", data);
    if (data?.data) {
      if (data.success) {
        setUsers(data?.data);
      } else {
        console.error("Error fetching users:", data.error);
        return;
      }
    }
  }, [data]);

  const handleEdit = (user: User) => {
    router.push(`/admin/users/${user.id}`);
  };

  const handleDelete = async (user: User) => {
    openModal(<DeleteUserConfirmationModal />, {
      size: "half",
      closeOnOverlayClick: true,
      showCloseButton: true,
    });
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
    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id ? { ...u, is_active: !u.is_active } : u
      )
    );
  };

  const handleConfirmDelete = () => {};

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
          {isLoading ? (
            <></>
          ) : (
            <span>{row.is_active ? "Active" : "Inactive"}</span>
          )}
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
      </div>
    </div>
  );
}
