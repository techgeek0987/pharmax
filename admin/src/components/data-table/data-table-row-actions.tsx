import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import type { Row } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  actions?: {
    label: string
    onClick: (row: TData) => void
    icon?: React.ReactNode
    shortcut?: string
    variant?: 'default' | 'destructive'
  }[]
  statusActions?: {
    label: string
    statuses: {
      label: string
      value: string
    }[]
    onStatusChange: (row: TData, status: string) => void
  }
}

export function DataTableRowActions<TData>({
  row,
  actions = [],
  statusActions,
}: DataTableRowActionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        {actions.map((action, index) => (
          <DropdownMenuItem
            key={index}
            onClick={() => action.onClick(row.original)}
            className={action.variant === 'destructive' ? 'text-destructive' : ''}
          >
            {action.icon && <span className="mr-2">{action.icon}</span>}
            {action.label}
            {action.shortcut && (
              <DropdownMenuShortcut>{action.shortcut}</DropdownMenuShortcut>
            )}
          </DropdownMenuItem>
        ))}
        
        {statusActions && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>{statusActions.label}</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup>
                  {statusActions.statuses.map((status) => (
                    <DropdownMenuRadioItem
                      key={status.value}
                      value={status.value}
                      onClick={() => statusActions.onStatusChange(row.original, status.value)}
                    >
                      {status.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}