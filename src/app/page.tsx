"use client";
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { DataTable } from "./iotTable/data-table";
import { Payment, columns } from "./iotTable/columns";
import localData from "../adroit_data.json";

async function fetchData() {
  try {
    const res = await fetch(
      "https://eq1n7rs483.execute-api.ap-southeast-2.amazonaws.com/Prod/hello"
    );

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    const jsonData = await res.json();
    const parsedData = JSON.parse(jsonData.body); //Have to parse data twice because it is stringified twice I think

    return parsedData;
  } catch (error) {
    console.error("Failed to fetch data:", error);
    throw error; // Re-throwing error to handle it in the component
  }
}

export default function Page() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchDataAndSetData = async () => {
      try {
        // const fetchedData = await fetchData();
        const fetchedData = require("../adroit_data.json");
        const parsedData = JSON.parse(fetchedData.body);
        setData(parsedData);

        console.log(parsedData);
      } catch (error) {
        // Error handling can be done here, e.g., show error message to the user
      }
    };

    fetchDataAndSetData();

    // Cleanup function is not necessary in this case
  }, []);

  return (
    <div className="">
      <Header />
      <DataTable columns={columns} data={data} />
    </div>
  );
}
