'use client';

// Page.tsx
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { DataTable } from './iotTable/data-table';
import { initializeColumns, columns } from './iotTable/columns'; // Import initializeColumns and columns

interface DynamicMetricData {
  [key: string]: string | number;
}

async function fetchData() {
  try {
    const res = await fetch(
      'https://eq1n7rs483.execute-api.ap-southeast-2.amazonaws.com/Prod/hello'
    );

    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }

    const jsonData = await res.json();
    const parsedData = JSON.parse(jsonData.body);

    return parsedData;
  } catch (error) {
    console.error('Failed to fetch data:', error);
    throw error;
  }
}

function flattenNestedData(data: any): DynamicMetricData[] {
  const flattenedData: DynamicMetricData[] = [];

  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const client = data[key];
      const devices = client.devices;

      for (const device of devices) {
        const flattenedDevice: DynamicMetricData = {
          client_name: client.client_name,
          client_id: client.client_id,
          device_id: device.device_id,
          device_key: device.device_key,
        };

        const metrics = device.metrics;

        let metricIndex = 0;
        for (const metricKey in metrics) {
          if (metrics.hasOwnProperty(metricKey)) {
            flattenedDevice[`metric_${metricIndex}_${metricKey}`] =
              metrics[metricKey].value;
            metricIndex++;
          }
        }

        flattenedData.push(flattenedDevice);
      }
    }
  }

  return flattenedData;
}

export default function Page() {
  const [data, setData] = useState<DynamicMetricData[]>([]);

  useEffect(() => {
    const fetchDataAndSetData = async () => {
      try {
        // Replace with the path to your test.json file
        const fetchedData = require('../test.json');

        const flattenedData = flattenNestedData(fetchedData);
        setData(flattenedData);

        // Get the dynamic metric names
        const dynamicMetricColumns = Object.keys(flattenedData[0] || {}).filter(
          (key) => key.startsWith('metric_')
        );

        // Initialize columns with dynamic metrics
        initializeColumns(dynamicMetricColumns);

        console.log(flattenedData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchDataAndSetData();
  }, []);

  return (
    <div className=''>
      <Header />
      <DataTable columns={columns} data={data} />
    </div>
  );
}
