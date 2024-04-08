import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { initializeColumns, columns } from '@/components/iotTable/columns'
import { DynamicMetricData } from '@/types'
import Header from '@/components/Header'
import { DataTable } from '@/components/iotTable/data-table'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import Footer from '@/components/Footer'
import LoginScreen from './login'
import { useAuthenticatedData } from '@/hooks/useAuthenticatedData'
import { getClientsOfflineCount, getTotalDevicesOfflineCount } from '@/utils'

export default function Home() {
  const { data: session } = useSession()
  const { data, loading, fetchDataAndUpdate } = useAuthenticatedData()
  const [filteredData, setFilteredData] = useState<DynamicMetricData[]>([])
  const [searchById, setSearchById] = useState('')
  const [searchByClientName, setSearchByClientName] = useState('')
  const [totalDevicesOfflineCount, setTotalDevicesOfflineCount] = useState(0)
  const [clientsOfflineCount, setClientsOfflineCount] = useState(0)

  useEffect(() => {
    if (data != null) {
      setFilteredData(data)
      setTotalDevicesOfflineCount(getTotalDevicesOfflineCount(data))
      setClientsOfflineCount(getClientsOfflineCount(data))
      initializeColumns()
    }
  }, [data])

  useEffect(() => {
    if (data) {
      const filtered = filterData(data, searchById, searchByClientName)
      setFilteredData(filtered)
    }
  }, [searchById, searchByClientName, data])

  const filterData = (
    data: DynamicMetricData[],
    searchById: string,
    searchByClientName: string
  ) => {
    return data.filter((item) => {
      const deviceIdMatch = (item.device_id + '').toLowerCase().includes(searchById.toLowerCase())
      const clientNameMatch = (item.client_name + '')
        .toLowerCase()
        .includes(searchByClientName.toLowerCase())
      return deviceIdMatch && clientNameMatch
    })
  }

  if (session) {
    return (
      <div className=" w-full flex flex-col">
        <Header
          fetchDataAndUpdate={fetchDataAndUpdate}
          searchById={searchById}
          setSearchById={setSearchById}
          searchByClientName={searchByClientName}
          setSearchByClientName={setSearchByClientName}
          totalDevicesOfflineCount={totalDevicesOfflineCount}
          clientsOfflineCount={clientsOfflineCount}
        />
        {loading && (
          <div className=" h-screen mt-64 gap-2 flex flex-col items-center justify-center">
            <div className="h-5/6 w-full"></div> <LoadingSpinner className={'h-32 w-32'} />
            <h1>Loading the data for you.</h1>
          </div>
        )}
        {!loading && <DataTable columns={columns} data={filteredData || []} />}
        <Footer />
      </div>
    )
  } else {
    return <LoginScreen />
  }
}
