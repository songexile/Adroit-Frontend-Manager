import '@/styles/globals.css'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import { useState, useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { DynamicMetricData } from '@/types'
import { fetchDataAndSetData } from '@/utils'
import { initializeColumns } from '@/components/iotTable/columns'
import { showToast } from '@/components/Toast'
import { useSession } from 'next-auth/react'
import LoadingIndicator from '@/components/LoadingIndicator'

function AuthCheckAndAction({
  children,
  setData,
  loading,
  setLoading,
  hasFetchedData,
  setHasFetchedData,
}: {
  children: React.ReactNode
  data: DynamicMetricData[]
  setData: (data: DynamicMetricData[]) => void
  loading: boolean
  setLoading: (loading: boolean) => void
  hasFetchedData: boolean
  setHasFetchedData: (hasFetchedData: boolean) => void
}) {
  const { status } = useSession()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const fetchedDataFromStorage = localStorage.getItem('fetchedData')
      const hasDataFetched = localStorage.getItem('hasDataFetched') === 'true'

      // Only proceed if the user is authenticated and data hasn't been fetched yet
      if (status === 'authenticated') {
        if (!hasDataFetched) {
          fetchDataAndUpdate()
        } else if (fetchedDataFromStorage) {
          setData(JSON.parse(fetchedDataFromStorage))
          setLoading(false)
        }
      } else {
        setData([])
        setLoading(false)
      }
    }
  }, [status, hasFetchedData, setData, setLoading])

  const fetchDataAndUpdate = async () => {
    try {
      setLoading(true)
      const fetchedData = await fetchDataAndSetData()
      setData(fetchedData)
      setLoading(false)

      // Save the fetched data and set the flag in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('fetchedData', JSON.stringify(fetchedData))
        localStorage.setItem('hasDataFetched', 'true')
      }

      // Initialize columns with dynamic metrics
      initializeColumns()

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

  return (
    <>
      {loading ? (
        // Render loading animation when loading is true
        <LoadingIndicator size={50} color="blue" message="Loading data..." />
      ) : (
        // Render children when loading is false
        children
      )}
    </>
  )
}

export default function MyApp({ Component, pageProps }: AppProps) {
  const [data, setData] = useState<DynamicMetricData[]>(() => {
    if (typeof window !== 'undefined') {
      // Load data from local storage on initial load
      const storedData = localStorage.getItem('fetchedData')
      return storedData ? JSON.parse(storedData) : []
    }
    return []
  })

  const [loading, setLoading] = useState(false)
  const [hasFetchedData, setHasFetchedData] = useState(() => {
    if (typeof window !== 'undefined') {
      // Load flag from local storage on initial load
      const storedHasFetchedData = localStorage.getItem('hasDataFetched')
      return storedHasFetchedData === 'true'
    }
    return false
  })

  // Define fetchDataAndUpdate in MyApp and pass it as a prop to the child components
  const fetchDataAndUpdate = async () => {
    try {
      setLoading(true)
      const fetchedData = await fetchDataAndSetData()
      setData(fetchedData)
      setLoading(false)

      // Save the fetched data and set the flag in local storage
      if (typeof window !== 'undefined') {
        localStorage.setItem('fetchedData', JSON.stringify(fetchedData))
        localStorage.setItem('hasDataFetched', 'true')
      }

      // Initialize columns with dynamic metrics
      initializeColumns()

      if (!hasFetchedData) {
        setHasFetchedData(true)
      }

      console.log('Fetching data for the ' + (hasFetchedData ? 'second' : 'first') + ' time')
      showToast({ message: 'Data Fetched!', type: 'success' })
    } catch (error) {
      showToast({
        message: 'Failed to fetch data: ' + error,
        type: 'error',
      })
    }
  }

  return (
    <>
      <SessionProvider session={pageProps.session}>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        <AuthCheckAndAction
          data={data}
          setData={setData}
          loading={loading}
          setLoading={setLoading}
          hasFetchedData={hasFetchedData}
          setHasFetchedData={setHasFetchedData}
        >
          <Component data={data} {...pageProps} fetchDataAndUpdate={fetchDataAndUpdate} />
        </AuthCheckAndAction>
      </SessionProvider>
    </>
  )
}
