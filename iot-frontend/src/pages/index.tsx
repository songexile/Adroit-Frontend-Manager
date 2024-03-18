// Home Page
import React, { useState, useEffect } from 'react'
import Header from '@/components/Header'
import { DataTable } from '@/components/iotTable/data-table'
import { initializeColumns, columns } from '@/components/iotTable/columns'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

// async function fetchData() {
//   try {
//     const res = await fetch(
//       'https://eq1n7rs483.execute-api.ap-southeast-2.amazonaws.com/Prod/hello'
//     )

//     if (!res.ok) {
//       throw new Error('Failed to fetch data')
//     }

//     const jsonData = await res.json()
//     const parsedData = JSON.parse(jsonData.body)

//     return parsedData
//   } catch (error) {
//     console.error('Failed to fetch data:', error)
//     throw error
//   }
// }

function flattenNestedData(data: any): DynamicMetricData[] {
  const flattenedData: DynamicMetricData[] = []

  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const client = data[key]
      const devices = client.devices

      for (const device of devices) {
        const flattenedDevice: DynamicMetricData = {
          client_name: client.client_name,
          client_id: client.client_id,
          device_id: device.device_id,
          device_key: device.device_key,
        }

        for (const metricName in device.metrics) {
          flattenedDevice[`metric_${metricName}`] = device.metrics[metricName]
        }

        flattenedData.push(flattenedDevice)
      }
    }
  }

  return flattenedData
}

export default function Page() {
  const [data, setData] = useState<DynamicMetricData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDataAndSetData = async () => {
      try {
        // Replace with the path to your test.json file
        const fetchedData = require('@/public/full_device_stats.json')
        // const fetchedData = await fetchData();

        const flattenedData = flattenNestedData(fetchedData)
        setData(flattenedData)
        setLoading(false)

        // // Get the dynamic metric names
        // const dynamicMetricColumns = Object.keys(flattenedData[0] || {}).filter((key) =>
        //   key.startsWith('metric_')
        // )

        // Initialize columns with dynamic metrics
        initializeColumns()

        console.log(flattenedData)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      }
    }

    fetchDataAndSetData()
  }, [])

  return (
    <div className="">
      <Header />

      {loading && (
        <div className="mt-64 gap-2 flex flex-col items-center justify-center">
          {' '}
          <LoadingSpinner className={'h-32 w-32'} />
          <h1>Loading the data for you.</h1>
        </div>
      )}

      {!loading && <DataTable columns={columns} data={data} />}
    </div>
  )
}
