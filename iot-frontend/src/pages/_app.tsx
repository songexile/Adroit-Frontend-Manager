import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useState, useEffect } from 'react'
import { initializeColumns } from '@/components/iotTable/columns'
import { fetchDataAndSetData } from '@/utils'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function MyApp({ Component, pageProps }: AppProps) {
  const [data, setData] = useState<DynamicMetricData[]>([])
  const [loading, setLoading] = useState(true)
  const [hasFetchedData, setHasFetchedData] = useState(false)

  useEffect(() => {
    const fetchedDataFromStorage = localStorage.getItem('fetchedData')
    const hasDataFetched = localStorage.getItem('hasDataFetched') === 'true'

    if (!hasDataFetched) {
      fetchDataAndUpdate()
    } else if (fetchedDataFromStorage) {
      setData(JSON.parse(fetchedDataFromStorage))
      setLoading(false)
    }
  }, [])

  const fetchDataAndUpdate = async () => {
    try {
      setLoading(true)
      const fetchedData = await fetchDataAndSetData()
      setData(fetchedData)
      setLoading(false)

      // Save the fetched data and set the flag in localStorage
      localStorage.setItem('fetchedData', JSON.stringify(fetchedData))
      localStorage.setItem('hasDataFetched', 'true')

      // Initialize columns with dynamic metrics
      initializeColumns()

      if (!hasFetchedData) {
        console.log('fetching data for the first time')
        setHasFetchedData(true)
      } else {
        console.log('fetching data for the second time')
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
    }
  }

  return (
    <div>
      {loading ? (
        // Show a loading indicator while data is being fetched

        <div className="mt-64 gap-2 flex flex-col items-center justify-center">
          {' '}
          <LoadingSpinner className={'h-32 w-32'} />
          <h1>Loading the data for you.</h1>
        </div>
      ) : (
        // Data has been fetched, pass it as a prop to the child component
        <Component data={data} {...pageProps} fetchDataAndUpdate={fetchDataAndUpdate} />
      )}
    </div>
  )
}
