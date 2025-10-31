"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";
import { toast } from "sonner";
import { useModal } from "@/components/ui/modal";
import { useFetch } from "@/hooks/api/useFetch";
import { useDelete } from "@/hooks/api/useDelete";
import { usePatch } from "@/hooks/api/usePatch";
import DeleteUserConfirmationModal from "./components/deleteUserConfirmationModal";
import AdvancedDataTable from "@/components/table/globalTable";
import { User } from "@/lib/types";

export default function UsersPage() {
  const router = useRouter();
  const { openModal, closeModal } = useModal();
  const { del } = useDelete();
  const { patch } = usePatch();

  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortKey, setSortKey] = useState("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [debouncedSearch] = useDebounce(search, 400);

  const offset = (page - 1) * itemsPerPage;

  const apiUrl = `/api/admin/users?search=${encodeURIComponent(
    debouncedSearch
  )}&filter=${filter}&sort=${sortKey}:${sortDir}&limit=${itemsPerPage}&offset=${offset}`;

  const { data, isLoading } = useFetch(apiUrl);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  // Populate users when API returns
  useEffect(() => {
    if (data?.success) {
      setUsers(data.data);
    }
  }, [data]);

  const handleEdit = (user: User) => {
    router.push(`/admin/b2b/${user.id}`);
  };

  const handleDelete = (user: User) => {
    const modalId = openModal(
      <DeleteUserConfirmationModal
        user={user}
        onDelete={() => handleConfirmDelete(user, modalId)}
        onClose={() => closeModal(modalId)}
      />,
      { size: "half" }
    );
  };

  const handleConfirmDelete = async (user: User, modalId: string) => {
    try {
      const res = await del(`/api/admin/users/${user.id}`);
      if (res.success) {
        toast.success("User deleted successfully!");
        setUsers((prev) => prev.filter((u) => u.id !== user.id));
      } else {
        toast.error(res.error || "Failed to delete user");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting user");
    } finally {
      closeModal(modalId);
    }
  };

  const handleToggleActive = async (user: User) => {
    const newStatus = !user.is_active;
    try {
      const response = await patch(`/api/admin/users/toggle`, {
        userId: user.id,
        status: newStatus,
      });
      if (response?.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === user.id ? { ...u, is_active: newStatus } : u
          )
        );
        toast.success(
          `User ${newStatus ? "activated" : "deactivated"} successfully!`
        );
      } else {
        toast.error("Failed to update user status");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating user status");
    }
  };

  // Define table columns
  const columns = [
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (row: User) => (
        <div>
          <div className="text-sm font-medium text-gray-900">
            {row.full_name}
          </div>
          <div className="text-sm text-gray-500">{row.email}</div>
        </div>
      ),
    },
    { key: "phone_number", label: "Phone" },
    { key: "organization", label: "Organization" },
    { key: "city", label: "City" },
    { key: "state", label: "State" },
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
      sortable: true,
      render: (row: User) => new Date(row.created_at).toLocaleDateString(),
    },
  ];

  // Filters for tabs
  const filterTabs = [
    { key: "all", label: "All" },
    // { key: "active", label: "Active" },
    // { key: "inactive", label: "Inactive" },
    // { key: "admin", label: "Admins" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        <AdvancedDataTable
          title="B2B Partners"
          columns={columns}
          data={users}
          searchQuery={search}
          searchPlaceholder="Search users by name, email, or role..."
          filterTabs={filterTabs}
          activeFilter={filter}
          sortKey={sortKey}
          sortDir={sortDir}
          onSearchChange={setSearch}
          onFilterChange={setFilter}
          onSortChange={(key, dir) => {}}
          onPageChange={setPage}
          currentPage={page}
          total={data?.pagination?.total || 0}
          itemsPerPage={itemsPerPage}
          onEdit={handleEdit}
          onDelete={handleDelete}
          addHref="/admin/b2b/addUser"
          addBulkHref="/admin/b2b/bulkUpload"
          isLoading={isLoading}
          emptyMessage="No users found."
        />
      </div>
    </div>
  );
}
