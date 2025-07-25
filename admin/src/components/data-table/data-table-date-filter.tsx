import * as React from "react"
import { CalendarIcon } from "@radix-ui/react-icons"
import { addDays, format } from "date-fns"
import type { DateRange } from "react-day-picker"
import type { Column } from "@tanstack/react-table"

import { cn } from "@/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DataTableDateFilterProps<TData, TValue> {
  column?: Column<TData, TValue>
  title?: string
  placeholder?: string
}

export function DataTableDateFilter<TData, TValue>({
  column,
  title = "Date",
  placeholder = "Pick a date range",
}: DataTableDateFilterProps<TData, TValue>) {
  const [date, setDate] = React.useState<DateRange | undefined>()

  React.useEffect(() => {
    if (date?.from && date?.to) {
      column?.setFilterValue([date.from, date.to])
    } else {
      column?.setFilterValue(undefined)
    }
  }, [date, column])

  const presets = [
    {
      label: "Today",
      value: () => ({
        from: new Date(),
        to: new Date(),
      }),
    },
    {
      label: "Yesterday",
      value: () => ({
        from: addDays(new Date(), -1),
        to: addDays(new Date(), -1),
      }),
    },
    {
      label: "Last 7 days",
      value: () => ({
        from: addDays(new Date(), -7),
        to: new Date(),
      }),
    },
    {
      label: "Last 30 days",
      value: () => ({
        from: addDays(new Date(), -30),
        to: new Date(),
      }),
    },
    {
      label: "This month",
      value: () => {
        const now = new Date()
        const start = new Date(now.getFullYear(), now.getMonth(), 1)
        return {
          from: start,
          to: new Date(),
        }
      },
    },
    {
      label: "Last month",
      value: () => {
        const now = new Date()
        const start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        const end = new Date(now.getFullYear(), now.getMonth(), 0)
        return {
          from: start,
          to: end,
        }
      },
    },
  ]

  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            size="sm"
            className={cn(
              "h-8 border-dashed",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex">
            <div className="flex flex-col gap-2 p-3 border-r">
              <div className="text-sm font-medium">Presets</div>
              {presets.map((preset) => (
                <Button
                  key={preset.label}
                  variant="ghost"
                  size="sm"
                  className="justify-start font-normal"
                  onClick={() => setDate(preset.value())}
                >
                  {preset.label}
                </Button>
              ))}
              {date && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start font-normal text-destructive"
                  onClick={() => setDate(undefined)}
                >
                  Clear
                </Button>
              )}
            </div>
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}