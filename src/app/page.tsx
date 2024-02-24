"use client";
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { DataTable } from "./iotTable/data-table";
import { Payment, columns } from "./iotTable/columns";

async function fetchData() {
  try {
    const res = await fetch(
      "https://eq1n7rs483.execute-api.ap-southeast-2.amazonaws.com/Prod/hello"
    );

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    return res.json();
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
        const fetchedData = await fetchData();
        setData(fetchedData);
      } catch (error) {
        // Error handling can be done here, e.g., show error message to the user
      }
    };

    fetchDataAndSetData();

    // Cleanup function is not necessary in this case
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      fetchData()
        .then((fetchedData) => {
          setData(fetchedData);
        })
        .catch((error) => {
          // Error handling can be done here
        });
    }, 10000);

    // Cleanup function to clear the interval when component unmounts or when dependencies change
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="">
      <Header />
      <DataTable columns={columns} data={data} />
    </div>
  );
}
