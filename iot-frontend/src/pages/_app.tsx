import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useState, useEffect } from 'react'
import { initializeColumns } from '@/components/iotTable/columns'

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

export default function MyApp({ Component, pageProps }: AppProps) {
  const [data, setData] = useState<DynamicMetricData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDataAndSetData = async () => {
      try {
        console.log('fetching data')
        // Replace with the path to your test.json file
        const fetchedData = require('@/public/full_device_stats.json')
        // const fetchedData = await fetchData();

        const flattenedData = flattenNestedData(fetchedData)
        setData(flattenedData)
        setLoading(false)

        // Initialize columns with dynamic metrics
        initializeColumns()
      } catch (error) {
        console.error('Failed to fetch data:', error)
      }
    }

    fetchDataAndSetData()
  }, [])
  return (
    <div>
      {loading ? (
        // Show a loading indicator while data is being fetched
        <p>Loading data...</p>
      ) : (
        // Data has been fetched, pass it as a prop to the child component
        <Component data={data} {...pageProps} />
      )}
    </div>
  )
}
