import React, { useEffect } from "react";
import Header from "../components/Header";
import { DataTable } from "./iotTable/data-table";
import { Payment, columns } from "./iotTable/columns";

let data = null;

async function getData() {
  const res = await fetch('https://eq1n7rs483.execute-api.ap-southeast-2.amazonaws.com/Prod/hello');

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
}

export default function Page() {
  
  async function fetchData() {
    try {
      data = await getData();
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('Fetched data:', data);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="">
      <Header />
      <DataTable columns={columns} data={data} />
    </div>
  );
}
