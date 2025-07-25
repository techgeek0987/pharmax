import { Cross2Icon } from "@radix-ui/react-icons"
import type { Table } from "@tanstack/react-table"
import { IconSearch, IconDownload, IconX } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./data-table-view-options"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"

interface DataTableToolbarProps<TData> {
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
  toolbar?: {
    enableSearch?: boolean
    enableFilters?: boolean
    enableViewOptions?: boolean
    enableExport?: boolean
    customActions?: React.ReactNode
  }
  onExport?: (data: TData[]) => void
}

export function DataTableToolbar<TData>({
  table,
  searchKey,
  searchPlaceholder = "Search...",
  filterableColumns = [],
  toolbar = {},
  onExport,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  const handleExport = () => {
    if (onExport) {
      const filteredData = table.getFilteredRowModel().rows.map(row => row.original)
      onExport(filteredData)
    }
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {toolbar.enableSearch && searchKey && (
          <div className="relative">
            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={searchPlaceholder}
              value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn(searchKey)?.setFilterValue(event.target.value)
              }
              className="pl-10 h-8 w-[150px] lg:w-[250px]"
            />
          </div>
        )}
        
        {toolbar.enableFilters && filterableColumns.map((column) =>
          table.getColumn(column.id) ? (
            <DataTableFacetedFilter
              key={column.id}
              column={table.getColumn(column.id)}
              title={column.title}
              options={column.options}
            />
          ) : null
        )}
        
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
      
      <div className="flex items-center space-x-2">
        {toolbar.customActions}
        
        {toolbar.enableExport && onExport && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="h-8"
          >
            <IconDownload className="mr-2 h-4 w-4" />
            Export
          </Button>
        )}
        
        {toolbar.enableViewOptions && (
          <DataTableViewOptions table={table} />
        )}
      </div>
    </div>
  )
}