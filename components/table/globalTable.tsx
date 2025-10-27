import React, { useState, useMemo } from "react";
import { Edit, Trash2, Search, PlusIcon, Folder } from "lucide-react";
import Breadcrumbs from "../ui/breadCrumbs";
import Link from "next/link";

interface TableColumn<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
}

interface FilterTab {
  key: string;
  label: string;
  count?: number;
  filter?: (row: any) => boolean;
}

interface TableProps<T> {
  title?: string;
  columns: TableColumn<T>[];
  data: T[];
  searchKeys?: string[];
  searchPlaceholder?: string;
  filterTabs?: FilterTab[];
  // onAdd?:(row : T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  emptyMessage?: string;
  className?: string;
  addHref?: string;
  addBulkHeref?: string;
}

export default function AdvancedDataTable<T extends Record<string, any>>({
  title = "All Records",
  columns,
  data,
  searchKeys = [],
  searchPlaceholder = "Search...",
  filterTabs = [],
  onEdit,
  onDelete,
  emptyMessage = "No data available.",
  className = "",
  // onAdd
  addHref = "",
  addBulkHeref = "",
}: TableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState(filterTabs[0]?.key || "all");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  // Filter data based on active filter tab
  const filteredByTab = useMemo(() => {
    const activeTab = filterTabs.find((tab) => tab.key === activeFilter);
    if (!activeTab || !activeTab.filter) return data;
    return data.filter(activeTab.filter);
  }, [data, activeFilter, filterTabs]);

  // Search functionality
  const searchedData = useMemo(() => {
    if (!searchQuery.trim()) return filteredByTab;

    return filteredByTab.filter((row) => {
      const searchLower = searchQuery.toLowerCase();

      if (searchKeys.length > 0) {
        return searchKeys.some((key) => {
          const value = key.split(".").reduce((obj, k) => obj?.[k], row);
          return String(value || "")
            .toLowerCase()
            .includes(searchLower);
        });
      }

      return Object.values(row).some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(searchLower)
      );
    });
  }, [filteredByTab, searchQuery, searchKeys]);

  // Sorting functionality
  const sortedData = useMemo(() => {
    if (!sortConfig) return searchedData;

    const sorted = [...searchedData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal === bVal) return 0;

      const comparison = aVal < bVal ? -1 : 1;
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });

    return sorted;
  }, [searchedData, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig((current) => {
      if (!current || current.key !== key) {
        return { key, direction: "asc" };
      }
      if (current.direction === "asc") {
        return { key, direction: "desc" };
      }
      return null;
    });
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="mb-8">
        <Breadcrumbs />

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          </div>
          <div className="flex gap-2">
            <Link
              href={addHref}
              className="inline-flex items-center p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add {title.split(" ")[0]}
            </Link>
            {addBulkHeref.trim() != "" && <Link
              href={addBulkHeref}
              className="inline-flex items-center p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              <Folder className="h-4 w-4 mr-2" />
              Bulk Add
            </Link>}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      {filterTabs.length > 0 && (
        <div className="mb-4 border-b border-gray-200">
          <div className="flex space-x-8">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeFilter === tab.key
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span
                    className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                      activeFilter === tab.key
                        ? "bg-indigo-100 text-indigo-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => col.sortable && handleSort(col.key)}
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap ${
                      col.sortable ? "cursor-pointer hover:bg-gray-100" : ""
                    }`}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{col.label}</span>
                      {col.sortable && sortConfig?.key === col.key && (
                        <span className="text-indigo-600">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
                {(onEdit || onDelete) && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap sticky right-0 bg-gray-50 shadow-[-4px_0_6px_-1px_rgba(0,0,0,0.1)]">
                    Actions
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {sortedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                sortedData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      >
                        {col.render ? col.render(row) : row[col.key]}
                      </td>
                    ))}

                    {(onEdit || onDelete) && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium sticky right-0 bg-white shadow-[-4px_0_6px_-1px_rgba(0,0,0,0.1)]">
                        <div className="flex space-x-3 justify-end">
                          {onEdit && (
                            <button
                              onClick={() => onEdit(row)}
                              className="text-indigo-600 hover:text-indigo-900 transition-colors"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => onDelete(row)}
                              className="text-red-600 hover:text-red-900 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results count */}
      {sortedData.length > 0 && (
        <div className="mt-4 text-sm text-gray-500">
          Showing {sortedData.length} of {data.length} records
        </div>
      )}
    </div>
  );
}
