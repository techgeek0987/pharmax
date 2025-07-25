import * as React from "react"
import { Cross2Icon } from "@radix-ui/react-icons"
import type { Table } from "@tanstack/react-table"
import { 
  IconSearch, 
  IconDownload, 
  IconFilter, 
  IconRefresh,
  IconPlus,
  IconSettings
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTableViewOptions } from "./data-table-view-options"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"

interface DataTableAdvancedToolbarProps<TData> {
  table: Table<TData>
  searchKey?: string
  searchPlaceholder?: string
  filterableColumns?: {
    id: string
    title: string
    options: {
      label: string
      value: string
      icon?: React.ComponentType<{ className?: string }>
    }[]
  }[]
  newRowLink?: string
  deleteRowsAction?: React.MouseEventHandler<HTMLButtonElement>
  onExport?: (data: TData[]) => void
  onRefresh?: () => void
  customActions?: React.ReactNode
}

export function DataTableAdvancedToolbar<TData>({
  table,
  searchKey,
  searchPlaceholder = "Search...",
  filterableColumns = [],
  newRowLink,
  deleteRowsAction,
  onExport,
  onRefresh,
  customActions,
}: DataTableAdvancedToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleExport = () => {
    if (onExport) {
      const filteredData = table.getFilteredRowModel().rows.map(row => row.original)
      onExport(filteredData)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          {/* Search */}
          {searchKey && (
            <div className="relative">
              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder={searchPlaceholder}
                value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                  table.getColumn(searchKey)?.setFilterValue(event.target.value)
                }
                className="pl-10 h-8 w-[150px] lg:w-[300px]"
              />
            </div>
          )}
          
          {/* Filters */}
          {filterableColumns.map((column) =>
            table.getColumn(column.id) ? (
              <DataTableFacetedFilter
                key={column.id}
                column={table.getColumn(column.id)}
                title={column.title}
                options={column.options}
              />
            ) : null
          )}
          
          {/* Clear filters */}
          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => table.resetColumnFilters()}
              className="h-8 px-2 lg:px-3"
            >
              Reset
              <Cross2Icon className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex items-center space-x-2">
          {customActions}
          
          {/* Refresh */}
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              className="h-8"
            >
              <IconRefresh className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          )}
          
          {/* Export */}
          {onExport && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="h-8"
            >
              <IconDownload className="mr-2 h-4 w-4" />
              Export ({table.getFilteredRowModel().rows.length})
            </Button>
          )}
          
          {/* Add new */}
          {newRowLink && (
            <Button size="sm" className="h-8">
              <IconPlus className="mr-2 h-4 w-4" />
              Add New
            </Button>
          )}
          
          {/* View options */}
          <DataTableViewOptions table={table} />
        </div>
      </div>
      
      {/* Selection actions */}
      {selectedRows.length > 0 && (
        <div className="flex items-center justify-between rounded-lg border bg-muted/50 px-4 py-2">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">
              {selectedRows.length} row(s) selected
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {deleteRowsAction && (
              <Button
                variant="destructive"
                size="sm"
                onClick={deleteRowsAction}
              >
                Delete Selected
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.resetRowSelection()}
            >
              Clear Selection
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}