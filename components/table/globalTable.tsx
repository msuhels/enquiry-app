"use client";

import React from "react";
import { Edit, Trash2, Search, PlusIcon, Folder, Loader2 } from "lucide-react";
import Breadcrumbs from "../ui/breadCrumbs";
import Link from "next/link";
import Pagination from "../ui/pagination";
import SearchSelect from "../form/FormSearchSelect";

export interface TableColumn<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
}

export interface FilterTab {
  key: string;
  label: string;
  count?: number;
}

interface TableProps<T> {
  title?: string;
  columns: TableColumn<T>[];
  data: T[];
  searchQuery?: Record<string, string>;
  searchPlaceholder?: string;
  searchParameters?: string[];
  searchSelectFilters?: {
    name: string;
    label: string;
    options: { value: string; label: string };
  }[];
  filterTabs?: FilterTab[];
  activeFilter?: string;
  sortKey?: string;
  sortDir?: "asc" | "desc";
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
  addHref?: string;
  addBulkHref?: string;
  total?: number;
  itemsPerPage?: number;
  currentPage?: number;

  // Event Handlers
  onSearchChange?: (val: Record<string, string>) => void;
  onFilterChange?: (filterKey: string) => void;
  onSortChange?: (key: string, direction: "asc" | "desc") => void;
  onPageChange?: (page: number) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  dateFilters?: { from_date: string; to_date: string };
  locationFilters?: { state: string; city: string };
  onDateFilterChange?: (val: { fromDate: string; toDate: string }) => void;
  onLocationFilterChange?: (val: { state: string; city: string }) => void;
}

export default function AdvancedDataTable<T extends Record<string, any>>({
  title = "All Records",
  columns,
  data,
  searchQuery,
  searchPlaceholder = "Search...",
  searchParameters = [],
  filterTabs = [],
  searchSelectFilters = [],
  dateFilters,
  activeFilter = "all",
  sortKey,
  sortDir,
  isLoading = false,
  emptyMessage = "No data available.",
  className = "",
  addHref,
  addBulkHref,
  total = 0,
  itemsPerPage = 10,
  currentPage = 1,

  onSearchChange,
  onFilterChange,
  onSortChange,
  onPageChange,
  onEdit,
  onDelete,
}: TableProps<T>) {
  const totalPages = Math.ceil(total / itemsPerPage);

  console.log("totalPages", total, itemsPerPage, totalPages);

  const handleSortClick = (key: string, sortable?: boolean) => {
    if (!sortable || !onSortChange) return;
    const nextDir = sortKey === key && sortDir === "asc" ? "desc" : "asc";
    onSortChange(key, nextDir);
  };

  // if (isLoading) {
  //   return (
  // <div className="flex items-center justify-center h-64">
  //   <Loader2 className="h-10 w-10 mr-2 animate-spin inline text-indigo-600" />
  // </div>
  //   );
  // }

  return (
    <div className={`w-full ${className}`}>
      <div className="mb-8">
        <Breadcrumbs />
        <div className="flex justify-between items-center">
          <div className="flex items-center justify-between w-full">
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          </div>
          <div className="flex gap-2">
            {addHref && (
              <Link
                href={addHref}
                className="inline-flex items-center p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                <p className="w-full text-nowrap">Add {title.split(" ")[0]}</p>
              </Link>
            )}
            {addBulkHref && (
              <Link
                href={addBulkHref}
                className="inline-flex items-center p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                <Folder className="h-4 w-4 mr-2" />
                Bulk Add
              </Link>
            )}
          </div>
        </div>
      </div>
      <div className="flex w-full gap-4 items-center">
        {onSearchChange &&
          searchParameters.map((param) => (
            <div key={param} className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder={`Search by ${param}`}
                value={searchQuery?.[param] || ""}
                onChange={(e) =>
                  onSearchChange({
                    ...searchQuery,
                    [param]: e.target.value,
                  })
                }
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          ))}

        {searchSelectFilters.length > 0 &&
          searchSelectFilters.map((filter: any, index) => (
            <div key={index} className="flex-1">
              <SearchSelect
                placeholder={`Filter by ${filter.label}`}
                name={filter.key}
                value={searchQuery?.[filter.key] ?? ""}
                options={filter.options}
                allowCreate={false}
                onChange={(val) =>
                  onSearchChange?.({
                    ...searchQuery,
                    [filter.key]: val,
                  })
                }
                width="w-full"
              />
            </div>
          ))}
      </div>

      <div className="flex w-full justify-end items-center mt-2 gap-2">
        {Object.keys(dateFilters || {}).length > 0 &&
          Object.keys(dateFilters).map((key: any, index) => (
            <div key={index}>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  {key == "from_date" ? "From Date" : "To Date"}
                </label>
                <input
                  key={index}
                  type="date"
                  value={searchQuery?.[key] ?? ""}
                  onChange={(e) =>
                    onSearchChange?.({
                      ...searchQuery,
                      [key]: e.target.value,
                    })
                  }
                  className="flex pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          ))}
      </div>

      <div className="mb-4 border-gray-200">
        <div className="flex space-x-8">
          {filterTabs.length > 0 &&
            filterTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => onFilterChange?.(tab.key)}
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

      <div className="bg-white shadow rounded-lg mt-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSortClick(col.key, col.sortable)}
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      col.sortable ? "cursor-pointer hover:bg-gray-100" : ""
                    }`}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{col.label}</span>
                      {sortKey === col.key && (
                        <span className="text-indigo-600">
                          {sortDir === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
                {(onEdit || onDelete) && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider sticky right-0 bg-gray-50">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <div className="flex items-center justify-center h-64">
                      <Loader2 className="h-10 w-10 mr-2 animate-spin inline text-indigo-600" />
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                data.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className="px-6 py-4 text-sm text-gray-900"
                      >
                        {col.render ? col.render(row) : row[col.key]}
                      </td>
                    ))}
                    {(onEdit || onDelete) && (
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <div className="flex space-x-3 justify-end">
                          {onEdit && (
                            <button
                              onClick={() => onEdit(row)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => onDelete(row)}
                              className="text-red-600 hover:text-red-900"
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

      {total > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalItems={total}
          itemsPerPage={itemsPerPage}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
