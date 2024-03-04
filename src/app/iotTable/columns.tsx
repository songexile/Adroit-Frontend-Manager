// columns.tsx
import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface FlattenedJson {
  client_name: string;
  client_id: string;
  device_id: string;
  device_key: string;
  [key: string]: string; // Dynamic metrics
}

// Declare an empty array initially
let columns: ColumnDef<FlattenedJson>[] = [];

export const initializeColumns = (metrics: string[]) => {
  // Initialize columns with the static columns
  columns = [
    {
      id: 'actions',
      cell: ({ row }) => {
        const device = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0'>
                <span className='sr-only'>Open menu</span>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => console.log('View details of client')}
              >
                View details of client
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => console.log('Hide client from Dashboard')}
              >
                Hide client from Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log('Create ticket')}>
                Create ticket
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      accessorKey: 'client_name',
      header: 'Client Name',
    },
    {
      accessorKey: 'client_id',
      header: 'Client ID',
    },
    {
      accessorKey: 'device_id',
      header: 'Device ID',
    },
    {
      accessorKey: 'device_key',
      header: 'Device Key',
    },
  ];

  // Dynamic metric columns
  columns.push(
    ...metrics.map((metric, index) => ({
      accessorKey: metric,
      header: metric,
    }))
  );
};

// Initialize columns (pass an empty array initially, it will be populated later)
initializeColumns([]);

export { columns };
