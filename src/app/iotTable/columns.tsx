'use client';

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

export type Payment = {
  _id: string;
  title: string;
  authors: string;
  journal: string;
  year: string;
  volume: string;
  pages: string;
  doi: string;
  claim: string;
  method: string;
  agreeDisagree: string;
  __v: number;
};

export const columns: ColumnDef<Payment>[] = [
  {
    id: 'actions',
    cell: ({ row }) => {
      const payment = row.original;
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
              onClick={() => navigator.clipboard.writeText(payment.authors)}
            >
              View details of client
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Hide client from Dashboard</DropdownMenuItem>
            <DropdownMenuItem>Create ticket</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  {
    accessorKey: '_id', // Assuming _id is the unique identifier for the payment
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Payment ID
        </Button>
      );
    },
  },
  {
    accessorKey: 'title',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Title
        </Button>
      );
    },
  },
  {
    accessorKey: 'authors',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Authors
        </Button>
      );
    },
  },
  // Add more columns as needed based on your JSON structure
];
