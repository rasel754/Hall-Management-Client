import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal } from "lucide-react";

export interface Column<T> {
  header: string | React.ReactNode;
  accessorKey?: keyof T | string;
  cell?: (row: T) => React.ReactNode;
}

interface FilterOption {
  label: string;
  value: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchKey?: string;
  searchPlaceholder?: string;
  filterKey?: string;
  filterPlaceholder?: string;
  filterOptions?: FilterOption[];
  paginated?: boolean;
  pageSize?: number;
  enableSelection?: boolean;
  onSelectionChange?: (selectedRows: T[]) => void;
  bulkActions?: React.ReactNode;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data = [],
  searchKey,
  searchPlaceholder = "Search...",
  filterKey,
  filterPlaceholder = "Filter by status",
  filterOptions,
  paginated = true,
  pageSize = 10,
  enableSelection = false,
  onSelectionChange,
  bulkActions,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValue, setFilterValue] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Helper to extract nested values
  const getNestedValue = (obj: any, path: string) => {
    return path.split(".").reduce((acc, part) => acc && acc[part], obj);
  };

  // Filter and Search Logic
  const filteredData = useMemo(() => {
    let result = [...data];

    // Status/Category Filter
    if (filterKey && filterValue && filterValue !== "ALL") {
      result = result.filter((item) => {
        const val = getNestedValue(item, filterKey);
        return String(val).toLowerCase() === filterValue.toLowerCase();
      });
    }

    // Text Search Filter
    if (searchKey && searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((item) => {
        const val = getNestedValue(item, searchKey);
        return String(val || "").toLowerCase().includes(query);
      });
    }

    return result;
  }, [data, searchQuery, filterKey, filterValue, searchKey]);

  // Reset page when filter or search changes
  React.useEffect(() => {
    setCurrentPage(1);
    setSelectedIds(new Set());
    if (onSelectionChange) onSelectionChange([]);
  }, [searchQuery, filterValue, onSelectionChange]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = useMemo(() => {
    if (!paginated) return filteredData;
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize, paginated]);

  // Selection Logic
  const rowIdKey = "_id" in (data[0] || {}) ? "_id" : "id";

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const ids = paginatedData.map((row) => row[rowIdKey as string]);
      const newSelected = new Set(ids);
      setSelectedIds(newSelected);
      if (onSelectionChange) {
        onSelectionChange(paginatedData);
      }
    } else {
      setSelectedIds(new Set());
      if (onSelectionChange) {
        onSelectionChange([]);
      }
    }
  };

  const handleSelectRow = (row: T, checked: boolean) => {
    const id = row[rowIdKey as string];
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);

    if (onSelectionChange) {
      const selectedRows = filteredData.filter((item) =>
        newSelected.has(item[rowIdKey as string])
      );
      onSelectionChange(selectedRows);
    }
  };

  const isAllSelected =
    paginatedData.length > 0 &&
    paginatedData.every((row) => selectedIds.has(row[rowIdKey as string]));

  return (
    <div className="space-y-4">
      {/* Search and Filters panel */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex flex-1 flex-col sm:flex-row gap-3 items-center w-full">
          {searchKey && (
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-card border-input rounded-lg h-10 w-full"
              />
            </div>
          )}

          {filterKey && filterOptions && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground hidden sm:block" />
              <Select value={filterValue} onValueChange={setFilterValue}>
                <SelectTrigger className="w-full sm:w-[180px] bg-card rounded-lg h-10">
                  <SelectValue placeholder={filterPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Categories</SelectItem>
                  {filterOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Bulk Actions Button Area */}
        {selectedIds.size > 0 && bulkActions && (
          <div className="flex items-center gap-2 w-full sm:w-auto self-end sm:self-auto bg-primary/10 border border-primary/20 p-1.5 rounded-lg">
            <span className="text-xs text-primary font-semibold px-2">
              {selectedIds.size} selected
            </span>
            {bulkActions}
          </div>
        )}
      </div>

      {/* Table Container */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-md">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              {enableSelection && (
                <TableHead className="w-12 text-center">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={(checked) => handleSelectAll(!!checked)}
                    aria-label="Select all rows"
                  />
                </TableHead>
              )}
              {columns.map((col, idx) => (
                <TableHead key={idx} className="font-semibold text-foreground py-3">
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIdx) => (
                <TableRow
                  key={row[rowIdKey as string] || rowIdx}
                  className="hover:bg-muted/30 transition-colors"
                >
                  {enableSelection && (
                    <TableCell className="text-center">
                      <Checkbox
                        checked={selectedIds.has(row[rowIdKey as string])}
                        onCheckedChange={(checked) => handleSelectRow(row, !!checked)}
                        aria-label="Select row"
                      />
                    </TableCell>
                  )}
                  {columns.map((col, colIdx) => (
                    <TableCell key={colIdx} className="py-3.5 text-sm text-foreground">
                      {col.cell
                        ? col.cell(row)
                        : col.accessorKey
                        ? getNestedValue(row, col.accessorKey as string)
                        : null}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (enableSelection ? 1 : 0)}
                  className="h-32 text-center text-muted-foreground text-sm"
                >
                  No results found matching search and filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {paginated && totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-muted-foreground">
            Page {currentPage} of {totalPages} ({filteredData.length} total rows)
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0 rounded-lg"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0 rounded-lg"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
