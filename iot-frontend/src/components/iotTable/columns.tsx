import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { getTimestampData } from '@/utils';
import Link from 'next/link';
import tagsData from './tagsdata.json'; // Importing the JSON file
import { DynamicMetricData } from '@/types';
import { Button } from '../ui/button';

interface TagsData {
  tags: string[];
}

const typedTagsData: TagsData = tagsData;

let columns: ColumnDef<DynamicMetricData>[] = [];

function createSortingFn<T>(getValueFromRow: (row: T) => number | null | undefined) {
  return (rowA: { original: T }, rowB: { original: T }) => {
    const valueA = getValueFromRow(rowA.original);
    const valueB = getValueFromRow(rowB.original);

    if (valueA === undefined && valueB === undefined) {
      return 0;
    } else if (valueA === undefined) {
      return 1;
    } else if (valueB === undefined) {
      return -1;
    }

    if (valueA !== null && valueB !== null) {
      if (valueA < valueB) return -1;
      if (valueA > valueB) return 1;
      return 0;
    }

    return 0;
  };
}

export const initializeColumns = () => {
  columns = [
    {
      id: 'actions',
      cell: ({ row }) => {
        const rowData = row.original;
        const deviceID = rowData.device_id;
        const createTicket = rowData.device_id;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0"
              >
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
        );
      },
    },
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
        const timestampData = getTimestampData(row.original);
        const timestamp = timestampData ? timestampData.timestamp : undefined;

        // Render the timestamp
        return <span>{timestamp ? new Date(timestamp).toLocaleString() : 'N/A'}</span>;
      },
      sortingFn: (rowA, rowB) => {
        const timestampDataA = getTimestampData(rowA.original);
        const timestampDataB = getTimestampData(rowB.original);

        // Extract timestamps if available
        const timestampA =
          timestampDataA && typeof timestampDataA.timestamp === 'number'
            ? new Date(timestampDataA.timestamp)
            : null;
        const timestampB =
          timestampDataB && typeof timestampDataB.timestamp === 'number'
            ? new Date(timestampDataB.timestamp)
            : null;

        // Sort by actual timestamps if available (newest to oldest)
        if (timestampA && timestampB) {
          return timestampB.getTime() - timestampA.getTime(); // Reverse order for newest first
        } else if (!timestampA && !timestampB) {
          return 0; // Both are missing or N/A, so equal
        } else if (!timestampA || (timestampDataA && timestampDataA.value === 'N/A')) {
          return 1; // rowA missing/N/A, so put it after rowB
        } else {
          return -1; // rowB missing/N/A, so put it after rowA
        }
      },
    },
    {
      accessorKey: 'client_name',
      size: 150, // Adjusting the width
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Client Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },

    {
      accessorKey: 'client_id',
      size: 100, // Adjusting the width
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Client ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: 'device_id',
      size: 100, // Adjusting the width
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Device ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: 'metric_battery_percentage',
      size: 150, // Adjusting the width
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Battery Percentage
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },

      cell: ({ row }) => {
        // Extract battery percentage value and color based on the value
        let battery = null;
        let color = 'inherit';
        const batteryPercentage = row.original.metric_battery_percentage;

        if (batteryPercentage && typeof batteryPercentage !== 'string') {
          // batteryPercentage is an object with a value property
          const batteryValue = batteryPercentage.value;
          battery = typeof batteryValue === 'string' ? parseFloat(batteryValue) : null;

          if (battery !== null) {
            if (battery < 20) {
              color = 'bg-red-500';
            } else if (battery < 50) {
              color = 'bg-orange-500';
            } else {
              color = 'bg-green-500';
            }
          }
        }

        return (
          <div className="flex justify-center">
            <span
              className={`px-2 py-1 rounded-md text-white font-medium ${
                battery !== null ? 'inline-block ' + color : 'hidden'
              }`}
            >
              {battery !== null ? battery.toFixed(2) : 'N/A'}
            </span>
          </div>
        );
      },
      sortingFn: createSortingFn((row) => {
        const batteryPercentage = row.metric_battery_percentage;
        if (typeof batteryPercentage === 'object' && typeof batteryPercentage.value === 'string') {
          return parseFloat(batteryPercentage.value);
        }
        return null;
      }),
    },
    {
      accessorKey: 'tags',
      size: 200, // Adjusting the width
      header: 'Tags',
      cell: ({ row }) => {
        const [selectedTag, setSelectedTag] = React.useState(row.original.tags || '');

        const handleTagChange = (e: any) => {
          const newTag = e.target.value;
          setSelectedTag(newTag);
          row.original.tags = newTag;
        };

        return (
          <div className="relative">
            <select
              value={selectedTag}
              onChange={(e) => {
                handleTagChange(e);
              }}
              className="w-full px-2 py-1 border border-gray-300 rounded-md pr-8"
            >
              <option value="">Select Tag</option>
              {tagsData.tags.map((tag, index) => (
                <option
                  key={index}
                  value={tag}
                >
                  {tag}
                </option>
              ))}
            </select>
          </div>
        );
      },
    },

    {
      accessorKey: 'metric_battery_voltage',
      size: 150, // Adjusting the width
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Battery Voltage
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const batteryVoltage = row.original.metric_battery_voltage;
        let color = 'inherit';

        if (typeof batteryVoltage === 'object' && typeof batteryVoltage.value === 'string') {
          const voltage = parseFloat(batteryVoltage.value);

          if (voltage >= 3.6 && voltage <= 3.7) {
            color = 'bg-green-500';
          } else if (voltage >= 3.5 && voltage <= 3.8) {
            color = 'bg-orange-500';
          } else {
            color = 'bg-red-500';
          }

          return (
            <div className="flex justify-center">
              <span
                className={`px-2 py-1 rounded-md text-white font-medium ${
                  voltage !== null ? 'inline-block ' + color : 'hidden'
                }`}
              >
                {voltage.toFixed(2)}
              </span>
            </div>
          );
        }

        // Don't render anything if the value is 'N/A'
        return null;
      },
      sortingFn: createSortingFn((row) => {
        const batteryVoltage = row.metric_battery_voltage;
        if (typeof batteryVoltage === 'object' && typeof batteryVoltage.value === 'string') {
          return parseFloat(batteryVoltage.value);
        }
        return null;
      }),
    },
  ];
};

initializeColumns();

export { columns };
