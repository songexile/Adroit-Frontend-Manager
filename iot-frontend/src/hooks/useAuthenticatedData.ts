import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { fetchDataAndSetData } from '@/utils'
import { showToast } from '@/components/Toast'
import { DynamicMetricData } from '@/types'

export const useAuthenticatedData = () => {
  const { data: session } = useSession()
  const [data, setData] = useState<DynamicMetricData[]>([])
  const [loading, setLoading] = useState(true)
  const [hasFetchedData, setHasFetchedData] = useState(false)

  useEffect(() => {
    const fetchedDataFromStorage = localStorage.getItem('fetchedData')
    const hasDataFetched = localStorage.getItem('hasDataFetched') === 'true'

    if (session && !hasDataFetched) {
      fetchDataAndUpdate()
    } else if (fetchedDataFromStorage) {
      setData(JSON.parse(fetchedDataFromStorage))
      setLoading(false)
    }
  }, [session])

  const fetchDataAndUpdate = async () => {
    try {
      setLoading(true)
      const fetchedData = await fetchDataAndSetData()
      setData(fetchedData)
      setLoading(false)

      // Save the fetched data and set the flag in localStorage
      localStorage.setItem('fetchedData', JSON.stringify(fetchedData))
      localStorage.setItem('hasDataFetched', 'true')

      if (!hasFetchedData) {
        setHasFetchedData(true)
      }

      console.log('fetching data for the ' + (hasFetchedData ? 'second' : 'first') + ' time')
      showToast({ message: 'Data Fetched!', type: 'success' })
    } catch (error) {
      showToast({
        message: 'Failed to fetch data: ' + error,
        type: 'error',
      })
    }
  }

  return { data, loading, hasFetchedData, fetchDataAndUpdate }
}
