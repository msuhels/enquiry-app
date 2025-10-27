"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Table from "@/components/table/globalTable";
import Breadcrumbs from "@/components/ui/breadCrumbs";
import { Enquiry } from "@/lib/types"; 
import { FileTextIcon, MessageSquareIcon } from "lucide-react";
import { useFetch } from "@/hooks/api/useFetch";

export default function EnquiriesPage() {
  const router = useRouter();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      // Mock data (replace with actual fetch)
      const mockEnquiries: Enquiry[] = [
        {
          id: "1",
          student_name: "John Doe",
          email: "john@example.com",
          phone: "+1-555-0100",
          program_interest: "Computer Science",
          status: "in_progress",
          message: "Looking for scholarship options in Canada.",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "2",
          student_name: "Priya Sharma",
          email: "priya@example.com",
          phone: "+91-9876543210",
          program_interest: "MBA",
          status: "pending",
          message: "Need help choosing between universities in the UK.",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "3",
          student_name: "Liam Brown",
          email: "liam@example.com",
          phone: "+44-7890-111222",
          program_interest: "Data Analytics",
          status: "completed",
          message: "Applied already, just confirming details.",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

      setEnquiries(mockEnquiries);
    } catch (error) {
      console.error("Error fetching enquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (enquiry: Enquiry) => {
    router.push(`/admin/enquiries/${enquiry.id}`);
  };

  const handleDelete = (enquiry: Enquiry) => {
    if (confirm(`Are you sure you want to delete enquiry from ${enquiry.student_name}?`)) {
      setEnquiries((prev) => prev.filter((e) => e.id !== enquiry.id));
    }
  };

  const handleStatusChange = (enquiry: Enquiry) => {
    // cycle status: pending → in_progress → completed → rejected
    const nextStatus =
      enquiry.status === "pending"
        ? "in_progress"
        : enquiry.status === "in_progress"
        ? "completed"
        : enquiry.status === "completed"
        ? "rejected"
        : "pending";

    setEnquiries((prev) =>
      prev.map((e) =>
        e.id === enquiry.id ? { ...e, status: nextStatus } : e
      )
    );
  };

  const columns = [
    {
      key: "student",
      label: "Student",
      render: (row: Enquiry) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{row.student_name}</div>
          <div className="text-sm text-gray-500">{row.email}</div>
        </div>
      ),
    },
    { key: "phone", label: "Phone" },
    { key: "program_interest", label: "Program Interest" },
    {
      key: "status",
      label: "Status",
      render: (row: Enquiry) => (
        <button
          onClick={() => handleStatusChange(row)}
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full transition ${
            row.status === "pending"
              ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
              : row.status === "in_progress"
              ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
              : row.status === "completed"
              ? "bg-green-100 text-green-800 hover:bg-green-200"
              : "bg-red-100 text-red-800 hover:bg-red-200"
          }`}
        >
          {row.status.replace("_", " ")}
        </button>
      ),
    },
    {
      key: "created_at",
      label: "Date",
      render: (row: Enquiry) => new Date(row.created_at).toLocaleDateString(),
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
          title="Enquiries"
          columns={columns}
          data={enquiries}
          searchKeys={["student_name", "email", "program_interest", "status"]}
          searchPlaceholder="Search by name, email, or program..."
          onEdit={handleView}
          onDelete={handleDelete}
          addHref="/admin/enquiries/addEnquiry"
          emptyMessage="No enquiries found."
          filterTabs={[
            {
              key: "all",
              label: "All",
              count: enquiries.length,
              filter: () => true,
            },
            {
              key: "pending",
              label: "Pending",
              count: enquiries.filter((e) => e.status === "pending").length,
              filter: (e) => e.status === "pending",
            },
            {
              key: "in_progress",
              label: "In Progress",
              count: enquiries.filter((e) => e.status === "in_progress").length,
              filter: (e) => e.status === "in_progress",
            },
            {
              key: "completed",
              label: "Completed",
              count: enquiries.filter((e) => e.status === "completed").length,
              filter: (e) => e.status === "completed",
            },
            {
              key: "rejected",
              label: "Rejected",
              count: enquiries.filter((e) => e.status === "rejected").length,
              filter: (e) => e.status === "rejected",
            },
          ]}
        />
      </div>
    </div>
  );
}
