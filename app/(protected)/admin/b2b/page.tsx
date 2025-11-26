"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "use-debounce";
import { toast } from "sonner";
import { useModal } from "@/components/ui/modal";
import { useFetch } from "@/hooks/api/useFetch";
import { useDelete } from "@/hooks/api/useDelete";
import { usePatch } from "@/hooks/api/usePatch";
import DeleteUserConfirmationModal from "./components/deleteUserConfirmationModal";
import AdvancedDataTable from "@/components/table/globalTable";
import { User } from "@/lib/types";
import * as XLSX from "xlsx";

const STORAGE_KEY = "b2b_listing_state";

export default function UsersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { openModal, closeModal } = useModal();
  const { del } = useDelete();
  const { patch } = usePatch();
  const hasLoadedFromStorage = useRef(false);
  const previousSearchRef = useRef("");

  const [users, setUsers] = useState<User[]>([]);

  // Function to get saved state from sessionStorage
  const getSavedState = () => {
    if (typeof window === "undefined") return null;
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
      return null;
    } catch (error) {
      console.error("Error loading saved state:", error);
      return null;
    }
  };

  // Get saved state
  const savedState = getSavedState();

  // Initialize with saved state or defaults
  const [search, setSearch] = useState(
    savedState?.search || { name: "", organization: "" }
  );
  const [filter, setFilter] = useState(savedState?.filter || "all");
  const [sortKey, setSortKey] = useState(savedState?.sortKey || "created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">(
    savedState?.sortDir || "desc"
  );
  const [page, setPage] = useState(savedState?.page || 1);
  const [itemsPerPage, setItemsPerPage] = useState(
    savedState?.itemsPerPage || 10
  );

  const [debouncedSearch] = useDebounce(search, 400);
  const queryParams = new URLSearchParams();

  Object.entries(debouncedSearch).forEach(([k, v]) => {
    if (v) queryParams.append(k, v.trim());
  });

  const offset = (page - 1) * itemsPerPage;

  const apiUrl = `/api/admin/users?${queryParams.toString()}&filter=${filter}&sort=${sortKey}:${sortDir}&limit=${itemsPerPage}&offset=${offset}`;

  const { data, isLoading } = useFetch(apiUrl);

  // Mark as initialized after first render
  useEffect(() => {
    hasLoadedFromStorage.current = true;
    // Store initial search string
    previousSearchRef.current = JSON.stringify(search);
  }, []);

  // Save state to sessionStorage whenever it changes (after initial load)
  useEffect(() => {
    if (hasLoadedFromStorage.current) {
      const stateToSave = {
        search,
        filter,
        sortKey,
        sortDir,
        page,
        itemsPerPage,
      };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    }
  }, [search, filter, sortKey, sortDir, page, itemsPerPage]);

  // Reset page to 1 only when search actually changes (not on mount)
  useEffect(() => {
    const currentSearch = JSON.stringify(debouncedSearch);

    // Only reset page if search has actually changed and component is initialized
    if (
      hasLoadedFromStorage.current &&
      currentSearch !== previousSearchRef.current
    ) {
      setPage(1);
    }

    // Update the previous search reference
    previousSearchRef.current = currentSearch;
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
          <div className="text-xl font-medium text-gray-900">
            {row.full_name}
          </div>
          <div className="text-xl text-gray-500">{row.email}</div>
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
          className={`inline-flex px-2 py-1 text-lg font-semibold rounded-full ${
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
    // { key: "all", label: "All" },
    // { key: "active", label: "Active" },
    // { key: "inactive", label: "Inactive" },
    // { key: "admin", label: "Admins" },
  ];

  const handleExportToExcel = async () => {
    const exportUrl = `/api/admin/users?${queryParams.toString()}&export=true`;
    const res = await fetch(exportUrl);
    const { data } = await res.json();

    try {
      const B2bData = data.map((user) => ({
        name: user.full_name,
        phone: user.phone_number,
        email: user.email,
        organization: user.organization,
        state: user.state,
        city: user.city,
      }));

      const worksheet = XLSX.utils.json_to_sheet(B2bData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Enquiries");

      const maxWidth = 30;
      worksheet["!cols"] = [
        { wch: 20 },
        { wch: 25 },
        { wch: 20 },
        { wch: 20 },
        { wch: 15 },
        { wch: 25 },
        { wch: 30 },
        { wch: 15 },
      ];

      const timestamp = new Date().toISOString();
      const filename = `b2b_partners_${timestamp}.xlsx`;

      XLSX.writeFile(workbook, filename);

      toast.success("Excel file exported successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export Excel file");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto p-8">
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
          searchParameters={["name", "organization"]}
          onFilterChange={setFilter}
          onSortChange={(key, dir) => {}}
          onPageChange={setPage}
          currentPage={page}
          total={data?.pagination?.total || 0}
          itemsPerPage={itemsPerPage}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onExport={handleExportToExcel}
          addHref="/admin/b2b/addUser"
          addBulkHref="/admin/b2b/bulkUpload"
          isLoading={isLoading}
          emptyMessage="No users found."
        />
      </div>
    </div>
  );
}
