// columns.tsx
import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface FlattenedJson {
  client_name: string
  client_id: string
  device_id: string
  device_key: string
  [key: string]: string | { timestamp: number; value: string }
}

// Declare an empty array initially
let columns: ColumnDef<FlattenedJson>[] = []

export const initializeColumns = () => {
  // Extract timestamp from the first metric
  // const firstMetric = metrics.length > 0 ? metrics[0] : null

  // Sorting state for timestamp column
  // let timestampSorting: 'asc' | 'desc' | undefined = undefined

  // Initialize columns with the static columns
  columns = [
    {
      id: 'actions',
      cell: ({}) => {
        // const device = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => console.log('View details of client')}>
                View details of client
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => console.log('Hide client from Dashboard')}>
                Hide client from Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log('Create ticket')}>
                Create ticket
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
    // Temp solution
    {
      accessorKey: 'Timestamp',

      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Timestamp
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const device = row.original
        const firstMetricKey = Object.keys(device).find((key) => key.startsWith('metric_'))
        const timestampData =
          firstMetricKey !== undefined
            ? (device[firstMetricKey] as { timestamp: number; value: string })
            : undefined
        const timestamp = timestampData ? timestampData.timestamp : undefined

        // Render the timestamp
        return <span>{timestamp ? new Date(timestamp).toLocaleString() : ''}</span>
      },
    },
    {
      accessorKey: 'client_name',

      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Client Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },

    {
      accessorKey: 'client_id',

      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Client ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: 'device_id',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Device ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },

    {
      accessorKey: 'device_key',
      size: 10,

      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Device Key
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
  ]

  // // Dynamic metric columns
  // columns.push(
  //   ...metrics.map((metric, index) => ({
  //     accessorKey: metric,
  //     header: metric,
  //   }))
  // );
}

// Initialize columns (pass an empty array initially, it will be populated later)
initializeColumns()

export { columns }
