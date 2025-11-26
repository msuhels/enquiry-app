"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";
import { toast } from "sonner";
import { useModal } from "@/components/ui/modal";
import { useFetch } from "@/hooks/api/useFetch";
import { useDelete } from "@/hooks/api/useDelete";
import AdvancedDataTable from "@/components/table/globalTable";
import { IDocument } from "@/lib/types";
import { Download } from "lucide-react";
import DeleteDocConfirmationModal from "./components/deleteDocConfirmationModal";

interface DocumentData {
  id: string;
  title: string;
  file_type: string;
}

const DocumentsPage = () => {
  const router = useRouter();
  const { openModal, closeModal } = useModal();
  const { del } = useDelete();

  const [docs, setDocs] = useState<IDocument[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortKey, setSortKey] = useState("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [debouncedSearch] = useDebounce(search, 400);

  console.log("debouncedSearch 🚀🚀", debouncedSearch);

  const offset = (page - 1) * itemsPerPage;

  const apiUrl = `/api/admin/documents?search=${encodeURIComponent(
    debouncedSearch["title and description"]
      ? debouncedSearch["title and description"]
      : ""
  )}&limit=${itemsPerPage}&offset=${offset}`;

  const { data, isLoading } = useFetch(apiUrl);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    if (data?.success) {
      setDocs(data.data);
    }
  }, [data]);

  const handleEdit = (doc: IDocument) => {
    router.push(`/admin/documents/update/${doc.id}`);
  };

  const handleDelete = (doc: IDocument) => {
    const modalId = openModal(
      <DeleteDocConfirmationModal
        doc={doc}
        onDelete={() => handleConfirmDelete(doc, modalId)}
        onClose={() => closeModal(modalId)}
      />,
      { size: "half" }
    );
  };

  const handleConfirmDelete = async (doc: IDocument, modalId: string) => {
    try {
      const res = await del(`/api/admin/documents?id=${doc.id}`);
      if (res.success) {
        toast.success("Document deleted successfully!");
        setDocs((prev) => prev.filter((d) => d.id !== doc.id));
      } else {
        toast.error(res.error || "Failed to delete document");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting document");
    } finally {
      closeModal(modalId);
    }
  };

  const downloadDocument = async (document: DocumentData): Promise<void> => {
    // Check if running in browser
    if (typeof window === "undefined") {
      toast.error("Download not available during server render");
      return;
    }

    try {
      const loadingToast = toast.loading("Preparing download...");

      const response = await fetch(
        `/api/admin/documents/download?id=${document.id}`
      );

      const result = await response.json();

      if (!result.success || !result.downloadUrl) {
        toast.dismiss(loadingToast);
        toast.error(result.error || "Failed to generate download link");
        return;
      }

      // Get file extension from file_type or title
      let fileExtension = "";
      if (document.file_type) {
        const mimeToExt: Record<string, string> = {
          "application/pdf": ".pdf",
          "application/msword": ".doc",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            ".docx",
          "application/vnd.ms-excel": ".xls",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
            ".xlsx",
          "text/csv": ".csv",
        };
        fileExtension = mimeToExt[document.file_type] || "";
      }

      // If no extension from MIME type, try to get from title
      if (!fileExtension && document.title) {
        const titleParts = document.title.split(".");
        if (titleParts.length > 1) {
          fileExtension = "." + titleParts[titleParts.length - 1];
        }
      }

      // Create filename
      const fileName = document.title.endsWith(fileExtension)
        ? document.title
        : `${document.title}${fileExtension}`;

      // Fetch the file
      const fileResponse = await fetch(result.downloadUrl);
      if (!fileResponse.ok) {
        toast.dismiss(loadingToast);
        toast.error("Failed to download file");
        return;
      }

      // Convert to blob
      const blob = await fileResponse.blob();

      // Create download link (with browser check)
      const url = window.URL.createObjectURL(blob);
      const link = window.document.createElement("a");
      link.href = url;
      link.download = fileName;
      window.document.body.appendChild(link);
      link.click();

      // Cleanup
      window.document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.dismiss(loadingToast);
      toast.success("Download started successfully!");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("An error occurred while downloading");
    }
  };

  const handleDownload = (document: IDocument) => {
    downloadDocument({
      id: document.id,
      title: document.title,
      file_type: document.file_type,
    });
  };

  const mimeToType: Record<string, string> = {
    "application/pdf": "pdf",
    "application/msword": "doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "docx",
    "application/vnd.ms-excel": "xls",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
    "text/csv": "csv",
  };

  // Define table columns
  const columns = [
    {
      key: "title",
      label: "Title",
      render: (row: IDocument) => (
        <div>
          <div className="text-xl font-medium text-gray-900">{row.title}</div>
        </div>
      ),
    },
    {
      key: "description",
      label: "Description",
      render: (row: IDocument) => (
        <div>
          <div
            title={row?.description as string}
            className="text-xl text-gray-500 w-72 truncate"
          >
            {row.description}
          </div>
        </div>
      ),
    },
    // {
    //   key: "file_type",
    //   label: "File Type",
    //   render: (row: IDocument) => (
    //     <div>
    //       <div className="text-xl font-medium text-gray-900">
    //         {
    //           //@ts-ignore
    //           mimeToType[row.file_type]
    //         }
    //       </div>
    //     </div>
    //   ),
    // },
    {
      key: "download",
      label: "Download",
      render: (row: IDocument) => (
        <div className="text-xl font-medium text-start text-gray-900">
          <button onClick={() => handleDownload(row)} className="px-5">
            <Download />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto p-8">
        <AdvancedDataTable
          title="Downloads"
          columns={columns}
          data={docs}
          activeFilter={filter}
          sortKey={sortKey}
          sortDir={sortDir}
          searchQuery={search}
          onSearchChange={setSearch}
          searchParameters={["title and description"]}
          onFilterChange={setFilter}
          onSortChange={(key, dir) => {}}
          onPageChange={setPage}
          currentPage={page}
          total={data?.pagination?.total || 0}
          itemsPerPage={itemsPerPage}
          onEdit={handleEdit}
          onDelete={handleDelete}
          addHref="/admin/documents/upload"
          isLoading={isLoading}
          emptyMessage="No downloads found."
        />
      </div>
    </div>
  );
};

export default DocumentsPage;
