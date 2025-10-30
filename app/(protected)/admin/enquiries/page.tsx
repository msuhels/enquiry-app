"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Table from "@/components/table/globalTable";
import Breadcrumbs from "@/components/ui/breadCrumbs";
import { Enquiry } from "@/lib/types";
import { useFetch } from "@/hooks/api/useFetch";
import { useDebounce } from "use-debounce";
import { useModal } from "@/components/ui/modal";
import DeleteConfirmationModal from "./components/DeleteConfirmationModal";
import { useDelete } from "@/hooks/api/useDelete";
import { toast } from "sonner";
import { State, City } from "country-state-city";

export default function EnquiriesPage() {
  const router = useRouter();
  const { openModal, closeModal } = useModal();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [search, setSearch] = useState({
    name: "",
    organisation: "",
    status: "",
    degree_going_for: "",
    city: "",
    state: "",
    from_date: new Date().toISOString().slice(0, 10),
    to_date: new Date().toISOString().slice(0, 10),
  });
  const [debouncedSearch] = useDebounce(search, 400);
  const { del } = useDelete();
  const { data: user } = useFetch("/api/admin/users/getAuthUser");

  const offset = (page - 1) * itemsPerPage;
  const userId = user?.userDetails?.id;
  const queryParams = new URLSearchParams();

  Object.entries(debouncedSearch).forEach(([k, v]) => {
    if (v) queryParams.append(k, v);
  });

  const apiUrl = `/api/admin/enquiries/?${queryParams.toString()}&limit=${itemsPerPage}&offset=${offset}`;

  const { data: enquiriesData, isLoading } = useFetch(apiUrl, {
    enabled: !!userId,
  });

  console.log("enquiriesData", enquiriesData);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    if (enquiriesData?.success) {
      setEnquiries(enquiriesData?.data);
    }
  }, [enquiriesData]);

  const handleDelete = (enquiry: Enquiry) => {
    const modalId = openModal(
      <DeleteConfirmationModal
        onDelete={() => handleConfirmDelete(enquiry, modalId)}
        onClose={() => closeModal(modalId)}
      />,
      { size: "half" }
    );
  };

  const handleConfirmDelete = async (enquiry: Enquiry, modalId: string) => {
    const res = await del(`/api/admin/enquiries?id=${enquiry.id}`);
    if (res.success) {
      toast.success("Enquiry deleted successfully!");
      setEnquiries((prev) => prev.filter((e) => e.id !== enquiry.id));
    } else {
      toast.error(res.error || "Failed to delete enquiry");
    }
    closeModal(modalId);
  };

  const columns = [
    {
      key: "createdby",
      label: "Created By",
      render: (row: Enquiry) => (
        <div>
          <div className="text-sm font-medium text-gray-900">
            {row?.createdby?.full_name}
          </div>
        </div>
      ),
    },
    {
      key:'organisation',
      label: "Organisation",
      render: (row: Enquiry) => (
        <span>{row?.createdby?.organization || "-"}</span>
      ),
    },
    {
      key: "state",
      label: "State",
      render: (row: Enquiry) => (
        <span>{row?.createdby?.state || "-"}</span>
      ),
    },
    {
      key: "city",
      label: "City",
      render: (row: Enquiry) => (
        <span>{row?.createdby?.city || "-"}</span>
      ),
    },
    {
      key: "phone_number",
      label: "Phone",
      render: (row: Enquiry) => (
        <span>{row?.createdby?.phone_number || "-"}</span>
      ),
    },
    { key: "degree_going_for", label: "Program Interest" },
    { key: "previous_or_current_study", label: "Previous/Current Degree" },
    {
      key: "created_at",
      label: "Date",
      render: (row: Enquiry) => new Date(row.created_at).toLocaleDateString(),
    },
  ];


    // Get all states from India (country code: IN)
  const stateOptions = useMemo(() => {
    const indianStates = State.getStatesOfCountry("IN");
    return indianStates.map((state) => ({
      value: state.name,
      label: state.name,
      isoCode: state.isoCode,
    }));
  }, []);

  const cityOptions = useMemo(() => {
    if (!search.state) return [];

    const selectedState = stateOptions.find(
      (state) => state.value === search.state
    );

    if (!selectedState) return [];

    const cities = City.getCitiesOfState("IN", selectedState.isoCode);
    return cities.map((city) => ({
      value: city.name,
      label: city.name,
    }));
  }, [search.state, stateOptions]);

  const handleSelectChange = (name: string, value: string) => {
    setSearch((prev) => {
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

    const searchSelectFilters = [
    {
      key: "state",
      label: "State",
      options: stateOptions,
    },
    {
      key: "city",
      label: "City",
      options: cityOptions,
    },
  ];


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Table
          title="Enquiries"
          columns={columns}
          data={enquiries}
          searchQuery={search}
          onSearchChange={setSearch}
          isLoading={isLoading}
          searchParameters={["name", "organisation"]}
          onPageChange={setPage}
          currentPage={page}
          total={enquiriesData?.pagination?.total || 0}
          itemsPerPage={itemsPerPage}
          addHref="/admin/enquiries/add"
          emptyMessage="No enquiries found."
          searchSelectFilters={searchSelectFilters}
          dateFilters={{ from_date: search.from_date, to_date: search.to_date }}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
