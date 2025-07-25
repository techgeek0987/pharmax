# Advanced Data Table System

A comprehensive, reusable data table system built with React, TypeScript, and TanStack Table. This system provides enterprise-grade features for data management and visualization.

## Features

### Core Features
- ✅ **Sorting** - Multi-column sorting with visual indicators
- ✅ **Filtering** - Global search and column-specific filters
- ✅ **Pagination** - Configurable page sizes and navigation
- ✅ **Column Management** - Show/hide columns dynamically
- ✅ **Row Selection** - Single and multi-row selection
- ✅ **Export** - CSV export functionality
- ✅ **Responsive Design** - Mobile-friendly layout
- ✅ **Loading States** - Skeleton loading components
- ✅ **Empty States** - Graceful handling of no data

### Advanced Features
- ✅ **Faceted Filters** - Multi-select dropdown filters with counts
- ✅ **Date Range Filters** - Calendar-based date filtering
- ✅ **Row Actions** - Contextual action menus
- ✅ **Status Management** - Quick status updates
- ✅ **Bulk Operations** - Multi-row actions
- ✅ **Advanced Toolbar** - Comprehensive control panel
- ✅ **Custom Actions** - Extensible action system

## Components

### Core Components

#### `DataTable`
The main data table component with all features integrated.

```tsx
import { DataTable } from "@/components/data-table/data-table"

<DataTable
  columns={columns}
  data={data}
  searchKey="name"
  searchPlaceholder="Search items..."
  filterableColumns={filterableColumns}
  viewOptions={{
    enableHiding: true,
    enableSelection: true,
  }}
  toolbar={{
    enableSearch: true,
    enableFilters: true,
    enableViewOptions: true,
    enableExport: true,
  }}
  onExport={handleExport}
/>
```

#### `DataTableColumnHeader`
Sortable column headers with dropdown menus.

```tsx
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"

{
  accessorKey: "name",
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Name" />
  ),
}
```

#### `DataTableRowActions`
Contextual action menus for table rows.

```tsx
import { DataTableRowActions } from "@/components/data-table/data-table-row-actions"

const actions = [
  {
    label: "Edit",
    onClick: (row) => handleEdit(row),
    icon: <IconEdit className="h-4 w-4" />,
  },
  {
    label: "Delete",
    onClick: (row) => handleDelete(row),
    icon: <IconTrash className="h-4 w-4" />,
    variant: 'destructive',
  },
]

<DataTableRowActions row={row} actions={actions} />
```

### Filter Components

#### `DataTableFacetedFilter`
Multi-select dropdown filters with option counts.

```tsx
const filterableColumns = [
  {
    id: "status",
    title: "Status",
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
    ],
  },
]
```

#### `DataTableDateFilter`
Calendar-based date range filtering.

```tsx
import { DataTableDateFilter } from "@/components/data-table/data-table-date-filter"

<DataTableDateFilter
  column={table.getColumn("createdAt")}
  title="Created Date"
  placeholder="Select date range"
/>
```

### Utility Components

#### `DataTableSkeleton`
Loading skeleton for the data table.

```tsx
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"

<DataTableSkeleton
  columnCount={5}
  rowCount={10}
  searchableColumnCount={1}
  filterableColumnCount={2}
/>
```

#### `DataTablePagination`
Pagination controls with page size selection.

#### `DataTableViewOptions`
Column visibility toggle dropdown.

#### `DataTableToolbar`
Basic toolbar with search and filters.

#### `DataTableAdvancedToolbar`
Enhanced toolbar with bulk actions and custom controls.

## Usage Examples

### Basic Implementation

```tsx
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"

interface User {
  id: string
  name: string
  email: string
  status: 'active' | 'inactive'
}

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <Badge variant={row.getValue("status") === 'active' ? 'default' : 'secondary'}>
        {row.getValue("status")}
      </Badge>
    ),
  },
]

export function UsersTable({ users }: { users: User[] }) {
  return (
    <DataTable
      columns={columns}
      data={users}
      searchKey="name"
      searchPlaceholder="Search users..."
    />
  )
}
```

### Advanced Implementation with Filters

```tsx
const filterableColumns = [
  {
    id: "status",
    title: "Status",
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
    ],
  },
]

export function AdvancedUsersTable({ users }: { users: User[] }) {
  const handleExport = (data: User[]) => {
    // Export logic
    console.log('Exporting', data.length, 'users')
  }

  return (
    <DataTable
      columns={columns}
      data={users}
      searchKey="name"
      searchPlaceholder="Search users by name or email..."
      filterableColumns={filterableColumns}
      viewOptions={{
        enableHiding: true,
        enableSelection: true,
      }}
      toolbar={{
        enableSearch: true,
        enableFilters: true,
        enableViewOptions: true,
        enableExport: true,
      }}
      onExport={handleExport}
    />
  )
}
```

### With Row Actions

```tsx
const columns: ColumnDef<User>[] = [
  // ... other columns
  {
    id: "actions",
    cell: ({ row }) => {
      const actions = [
        {
          label: "View",
          onClick: (user: User) => console.log('View', user),
          icon: <IconEye className="h-4 w-4" />,
        },
        {
          label: "Edit",
          onClick: (user: User) => console.log('Edit', user),
          icon: <IconEdit className="h-4 w-4" />,
        },
        {
          label: "Delete",
          onClick: (user: User) => console.log('Delete', user),
          icon: <IconTrash className="h-4 w-4" />,
          variant: 'destructive' as const,
        },
      ]

      return <DataTableRowActions row={row} actions={actions} />
    },
  },
]
```

## Styling

The data table system uses Tailwind CSS and shadcn/ui components for consistent styling. All components support:

- **Dark/Light Mode** - Automatic theme switching
- **Responsive Design** - Mobile-first approach
- **Custom Styling** - Easy to override with Tailwind classes
- **Consistent Spacing** - Following design system guidelines

## Performance

- **Virtualization** - Large datasets handled efficiently
- **Memoization** - Optimized re-renders
- **Lazy Loading** - Components loaded on demand
- **Debounced Search** - Smooth search experience

## Accessibility

- **Keyboard Navigation** - Full keyboard support
- **Screen Reader Support** - ARIA labels and descriptions
- **Focus Management** - Proper focus handling
- **High Contrast** - Accessible color schemes

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Dependencies

- `@tanstack/react-table` - Table functionality
- `@radix-ui/react-*` - UI primitives
- `@tabler/icons-react` - Icons
- `tailwindcss` - Styling
- `class-variance-authority` - Component variants
- `clsx` - Conditional classes

## Contributing

When adding new features:

1. Follow the existing component structure
2. Add TypeScript types for all props
3. Include proper documentation
4. Test with different data sets
5. Ensure accessibility compliance

## Examples in Codebase

- **Orders Table** - `src/components/orders/OrdersTable.tsx`
- **Products Table** - `src/components/products/ProductsTable.tsx`
- **Drivers Table** - `src/components/drivers/DriversTable.tsx`