import { Payment, columns } from "../app/payments/columns";
import { DataTable } from "../app/payments/data-table";
import Header from "./components/Header";

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id: "420",
      status: "online",
      location: "South Auckland",
      timeoffline: new Date(2023, 1, 1, 12, 0, 0),
    },
    {
      id: "200",
      status: "offline",
      location: "Onehunga",
      timeoffline: new Date(2024, 1, 1, 12, 0, 0),
    },
    // ...
  ];
}

export default async function DemoPage() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <Header />
      <DataTable columns={columns} data={data} />
    </div>
  );
}
