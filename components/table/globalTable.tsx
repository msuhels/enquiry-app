"use client";

import React from "react";
import { Edit, Trash2, Search, PlusIcon, Folder, Loader2 } from "lucide-react";
import Breadcrumbs from "../ui/breadCrumbs";
import Link from "next/link";
import Pagination from "../ui/pagination";
import SearchSelect from "../form/FormSearchSelect";
import * as Switch from "@radix-ui/react-switch";

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
  fieldsSwitches?: { key: string; value: boolean }[];
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
  handleToggleActive?: (key: string, value: boolean) => void;
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
  fieldsSwitches = [],
  onSearchChange,
  onFilterChange,
  onSortChange,
  onPageChange,
  onEdit,
  onDelete,
  handleToggleActive,
}: TableProps<T>) {
  const totalPages = Math.ceil(total / itemsPerPage);

  console.log("totalPages", total, itemsPerPage, totalPages);

  const handleSortClick = (key: string, sortable?: boolean) => {
    if (!sortable || !onSortChange) return;
    const nextDir = sortKey === key && sortDir === "asc" ? "desc" : "asc";
    onSortChange(key, nextDir);
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Header Section */}
      <div className="mb-8">
        <Breadcrumbs />
        <div className="flex justify-between items-center mt-4">
          <h1 className="text-4xl font-bold text-[#3a3886]">{title}</h1>
          <div className="flex gap-3">
            {addHref && (
              <Link
                href={addHref}
                className="inline-flex text-xl items-center px-4 py-2.5 bg-[#F97316] text-white rounded-lg hover:bg-[#ea6a0f] transition-all duration-200 shadow-sm hover:shadow-md font-medium"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                <p className="whitespace-nowrap">Add {title.split(" ")[0]}</p>
              </Link>
            )}
            {addBulkHref && (
              <Link
                href={addBulkHref}
                className="inline-flex text-xl items-center px-4 py-2.5 bg-[#3a3886] text-white rounded-lg hover:bg-[#2d2b6b] transition-all duration-200 shadow-sm hover:shadow-md font-medium"
              >
                <Folder className="h-4 w-4 mr-2" />
                Bulk Add
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Field Switches */}
      {fieldsSwitches?.length > 0 && (
        <div className="mb-6 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col items-start gap-4">
            {fieldsSwitches.map((item, index) => (
              <div key={index} className="flex items-center justify-between w-full gap-4">
                <label className="text-xl font-medium text-[#3a3886] capitalize">
                  {item.key.replace(/_/g, " ")}
                </label>

                <Switch.Root
                  checked={item.value}
                  onClick={(e) => e.stopPropagation()}
                  onCheckedChange={(value) =>
                    handleToggleActive?.(item.key, value)
                  }
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    item.value ? "bg-[#F97316]" : "bg-gray-300"
                  }`}
                >
                  <Switch.Thumb
                    className={`block w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                      item.value ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </Switch.Root>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search and Select Filters */}
      <div className="flex w-full gap-4 items-center mb-4">
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
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent transition-all"
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

      {/* Date Filters */}
      {Object.keys(dateFilters || {}).length > 0 && (
        <div className="flex w-full justify-end items-center mb-4 gap-3">
          {Object.keys(dateFilters).map((key: any, index) => (
            <div key={index} className="flex flex-col">
              <label className="text-sm font-medium text-[#3a3886] mb-1.5">
                {key == "from_date" ? "From Date" : "To Date"}
              </label>
              <input
                type="date"
                value={searchQuery?.[key] ?? ""}
                onChange={(e) =>
                  onSearchChange?.({
                    ...searchQuery,
                    [key]: e.target.value,
                  })
                }
                className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent transition-all"
              />
            </div>
          ))}
        </div>
      )}

      {/* Filter Tabs */}
      {filterTabs.length > 0 && (
        <div className="mb-6 border-b border-gray-200">
          <div className="flex space-x-8">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => onFilterChange?.(tab.key)}
                className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeFilter === tab.key
                    ? "border-[#F97316] text-[#F97316]"
                    : "border-transparent text-gray-500 hover:text-[#3a3886] hover:border-gray-300"
                }`}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span
                    className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      activeFilter === tab.key
                        ? "bg-[#F97316]/10 text-[#F97316]"
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
      <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-[#3a3886] to-[#2d2b6b]">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSortClick(col.key, col.sortable)}
                    className={`px-6 py-4 text-left text-lg font-semibold text-white uppercase tracking-wider ${
                      col.sortable ? "cursor-pointer hover:bg-[#2d2b6b]/50" : ""
                    }`}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{col.label}</span>
                      {sortKey === col.key && (
                        <span className="text-[#F97316] font-bold">
                          {sortDir === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
                {(onEdit || onDelete) && (
                  <th className="px-6 py-4 text-right text-lg font-semibold text-white uppercase tracking-wider sticky right-0 bg-[#3a3886]">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <div className="flex items-center justify-center h-64">
                      <Loader2 className="h-10 w-10 mr-2 animate-spin text-[#F97316]" />
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Search className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="font-medium text-gray-600">{emptyMessage}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className="px-6 py-4 text-lg text-gray-900"
                      >
                        {col.render ? col.render(row) : row[col.key]}
                      </td>
                    ))}
                    {(onEdit || onDelete) && (
                      <td className="px-6 py-4 text-right text-sm font-medium sticky right-0 bg-white">
                        <div className="flex space-x-3 justify-end">
                          {onEdit && (
                            <button
                              onClick={() => onEdit(row)}
                              className="text-[#3a3886] hover:text-[#2d2b6b] transition-colors p-1.5 hover:bg-[#3a3886]/10 rounded-lg"
                              title="Edit"
                            >
                              <Edit className="h-6 w-6" />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => onDelete(row)}
                              className="text-[#F97316] hover:text-[#ea6a0f] transition-colors p-1.5 hover:bg-[#F97316]/10 rounded-lg"
                              title="Delete"
                            >
                              <Trash2 className="h-6 w-6" />
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

      {/* Pagination */}
      {total > itemsPerPage && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalItems={total}
            itemsPerPage={itemsPerPage}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}