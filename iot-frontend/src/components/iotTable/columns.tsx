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

function createSortingFn<T>(getValueFromRow: (row: T) => number | null | undefined) {
  return (rowA: { original: T }, rowB: { original: T }) => {
    const valueA = getValueFromRow(rowA.original)
    const valueB = getValueFromRow(rowB.original)

    // Handle undefined values
    if (valueA === undefined && valueB === undefined) {
      return 0 // Both are undefined, so they are equal
    } else if (valueA === undefined) {
      return 1 // rowA is undefined, so put it after rowB
    } else if (valueB === undefined) {
      return -1 // rowB is undefined, so put it after rowA
    }

    // Compare the values
    if (valueA !== null && valueB !== null) {
      if (valueA < valueB) return -1
      if (valueA > valueB) return 1
      return 0
    }

    // If we reach this point, it means one or both values are not valid numbers
    return 0 // Consider them equal if we can't compare the values
  }
}

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
          Last Online
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
        const timestampA = timestampDataA ? new Date(timestampDataA.timestamp) : null
        const timestampB = timestampDataB ? new Date(timestampDataB.timestamp) : null

        // Sort by actual timestamps if available (newest to oldest)
        if (timestampA && timestampB) {
          return timestampB.getTime() - timestampA.getTime() // Reverse order for newest first
        } else if (!timestampA && !timestampB) {
          return 0 // Both are missing or N/A, so equal
        } else if (!timestampA || (timestampDataA && timestampDataA.text === 'N/A')) {
          // Check for N/A explicitly
          return 1 // rowA missing/N/A, so put it after rowB
        } else {
          return -1 // rowB missing/N/A, so put it after rowA
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
      accessorKey: 'metric_battery_percentage',

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
      cell: ({ row }) => {
        // Extract battery percentage value and color based on the value
        let battery = null
        let color = 'inherit'
        const batteryPercentage = row.original.metric_battery_percentage

        if (batteryPercentage && typeof batteryPercentage !== 'string') {
          // batteryPercentage is an object with a value property
          const batteryValue = batteryPercentage.value
          battery = typeof batteryValue === 'string' ? parseFloat(batteryValue) : null

          if (battery !== null) {
            if (battery < 20) {
              color = 'red'
            } else if (battery < 50) {
              color = 'orange'
            } else {
              color = 'green'
            }
          }
        }

        return (
          <div className=" ">
            <h1 style={{ color }}>{battery !== null ? battery : 'N/A'}</h1>
          </div>
        )
      },
      sortingFn: createSortingFn((row) => {
        //On click of sorting we can sort by battery percentage
        const batteryPercentage = row.metric_battery_percentage
        if (typeof batteryPercentage === 'object' && typeof batteryPercentage.value === 'string') {
          return parseFloat(batteryPercentage.value)
        }
        return null
      }),
    },
    {
      accessorKey: 'metric_battery_voltage',
      size: 10,

      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Battery Voltage
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },

      cell: ({ row }) => {
        const batteryVoltage = row.original.metric_battery_voltage
        return <span>{typeof batteryVoltage === 'object' ? batteryVoltage.value : 'N/A'}</span>
      },
      sortingFn: createSortingFn((row) => {
        const batteryVoltage = row.metric_battery_voltage
        if (typeof batteryVoltage === 'object' && typeof batteryVoltage.value === 'string') {
          return parseFloat(batteryVoltage.value)
        }
        return null
      }),
    },
  ]
}

// Initialize columns (pass an empty array initially, it will be populated later)
initializeColumns()

export { columns }
