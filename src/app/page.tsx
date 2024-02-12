import Header from "../components/Header";
import { DataTable } from "./iotTable/data-table";
import { Payment, columns } from "./iotTable/columns";

 
async function getData() {
  const res = await fetch('https://newiotdata.s3.ap-southeast-2.amazonaws.com/SensorData.json')
  
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.
 
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }
 
  return res.json()
}
 
export default async function Page() {
  const data = await getData()
  console.log('Fetched data:', data);
 
  return (
    <div className=" ">
      <Header />
      <DataTable columns={columns} data={data} />
    </div>
  );
}