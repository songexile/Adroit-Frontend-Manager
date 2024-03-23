// columns.tsx
import { useRouter } from 'next/router';

import React from 'react'
import { ColumnDef, Row } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { ArrowUpDown, MoreHorizontal, Ticket } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { useRouter } from 'next/router'

interface FlattenedJson {
  client_name: string
  client_id: string
  device_id: string
  device_key: string
  [key: string]: string | { timestamp: number; value: string }
}

// Declare an empty array initially
let columns: ColumnDef<DynamicMetricData>[] = []

const extractTimestampFromJson = (device: DynamicMetricData) => {
  const firstMetricKey = Object.keys(device).find((key) => key.startsWith('metric_'))
  const timestampData =
    firstMetricKey !== undefined
      ? (device[firstMetricKey] as { timestamp: number; value: string })
      : undefined
  const timestamp = timestampData ? timestampData.timestamp : undefined
  return timestamp ? new Date(timestamp).toLocaleString() : ''
}

export const initializeColumns = () => {
  // Initialize columns with the static columns
  columns = [
    {
      id: 'actions',
      cell: ({ row }) => {
        const rowData = row.original
        const deviceID = rowData.device_id

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
              <DropdownMenuItem>
                <Link href={`/device-info/${deviceID}`}>View device stats</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => console.log('Hide client from Dashboard')}>
                Hide client from Dashboard
              </DropdownMenuItem>

              <DropdownMenuItem>Create ticket</DropdownMenuItem>
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
        const timestamp = extractTimestampFromJson(device)
        return <span>{timestamp}</span>
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
}

const ActionsCell = ({ row }: { row: Row<DynamicMetricData> }) => {
  const router = useRouter()
  const deviceID = row.original.device_id

  const handleViewDeviceStats = () => {
    const { client_name, device_key } = row.original
    const timestamp = extractTimestampFromJson(row.original)
    router.push({
      pathname: `/device-info/${deviceID}`,
      query: {
        clientName: client_name,
        lastOnline: timestamp,
        deviceKey: device_key,
        data: JSON.stringify(row.original), // Pass the entire row data as a stringified JSON
      },
    })
  }

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
        <DropdownMenuItem onClick={handleViewDeviceStats}>View device stats</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => console.log('Hide client from Dashboard')}>
          Hide client from Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem>Create ticket</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Initialize columns (pass an empty array initially, it will be populated later)
initializeColumns()

export { columns }
