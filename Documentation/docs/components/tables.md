# Tables

Adroit Manager Frontend utilises a headless implementation of the Tanstack table component, known as shad-cn, specifically designed for handling tables on the application's dashboard

All table components are inside of `components/iotTable` and consists of two files `columns.tsx` and `data-table.tsx`

`data-table.tsx` is used in the `pages/index.tsx` file, here we pass in our applications data into the component. This results in the rendering of the table.

## columns.tsx

This file defines the column configurations for a data table component that displays device metrics and information. 

It can be used to add new columns, modify existing columns, adding sorting and filtering and adding additional functionality like buttons

To add a new column, you need to create a column definition object with properties like `accessorKey`, `header`, and `cell`. Here's an example:

```jsx
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
    );
  },
}
```

The `accessorKey` property specifies the key or property name in the data object that corresponds to the column's data. It is used to access and retrieve the relevant data for each cell in the column.


To summarise, the `columns.tsx` file is designed to be extensible, allowing you to easily add new columns or modify the functionality of existing columns in the data table component.

## data-table.tsx

The `data-table.tsx` file contains a React component called `DataTable` that renders a table using the `@tanstack/react-table` library. This component is designed to be reusable and accepts two props: `columns` and `data`.

This component is responsible for table rendering
the table can be stylised here by adding additional CSS.

