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
import Link from 'next/link'
import { getTimestampData } from '@/utils'

// Declare an empty array initially
let columns: ColumnDef<DynamicMetricData>[] = []

export const initializeColumns = () => {
  // Initialize columns with the static columns
  columns = [
    {
      id: 'actions',
      cell: ({ row }) => {
        const rowData = row.original
        const deviceID = rowData.device_id
        const createTicket = rowData.device_id

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
              <DropdownMenuItem>
                <Link href={`/device-info/${deviceID}`}>View device stats</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => console.log('Hide client from Dashboard')}>
                Hide client from Dashboard
              </DropdownMenuItem>

              <DropdownMenuItem>
                <Link href={`/create-ticket/${createTicket}`}>Create Ticket</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
    // Timestamp column with sorting function
    {
      accessorKey: 'Timestamp',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Timestamp
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const timestampData = getTimestampData(row.original)
        const timestamp = timestampData ? timestampData.timestamp : undefined

        // Render the timestamp
        return <span>{timestamp ? new Date(timestamp).toLocaleString() : 'N/A'}</span>
      },
      /**
       * Sorts rows based on the timestamp data of their original data.
       * Accessing the timestamp value using the same logic as in the cell renderer.
       * We're finding the first key that starts with metric_ and retrieving the timestamp value from the corresponding object.
       * @param {Row} rowA - The first row to compare.
       * @param {Row} rowB - The second row to compare.
       * @returns {number} A negative number if rowA's timestamp is earlier than rowB's, 0 if they are equal,
       * or a positive number if rowA's timestamp is later than rowB's.
       */
      sortingFn: (rowA, rowB) => {
        const timestampDataA = getTimestampData(rowA.original)
        const timestampDataB = getTimestampData(rowB.original)

        // Extract timestamps if available
        const timestampA = timestampDataA ? timestampDataA.timestamp : undefined
        const timestampB = timestampDataB ? timestampDataB.timestamp : undefined

        // Handle cases where one or both timestamps are undefined
        if (timestampA === undefined && timestampB === undefined) {
          return 0
        } else if (timestampA === undefined) {
          return 1
        } else if (timestampB === undefined) {
          return -1
        } else {
          return timestampA - timestampB
        }
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
      accessorKey: 'battery_percentage.value',
      size: 10,

      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Battery Percentage
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
