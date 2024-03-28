// Home Page
import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Header from '@/components/Header'
import { DataTable } from '@/components/iotTable/data-table'
import { initializeColumns, columns } from '@/components/iotTable/columns'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import Footer from '@/components/Footer'
import LoginScreen from './login'

export default function Page({
  data,
  fetchDataAndUpdate,
}: {
  data?: DynamicMetricData[]
  fetchDataAndUpdate: () => Promise<void>
}) {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(true)
  const [filteredData, setFilteredData] = useState<DynamicMetricData[]>([])

  const [searchById, setSearchById] = useState('')
  const [searchByClientName, setSearchByClientName] = useState('')

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

  // useEffect(() => {
  //   if (data != null) {
  //     initializeColumns()
  //     setFilteredData(data)
  //     setLoading(false)
  //     console.log(data)
  //   }
  // }, [data])

  useEffect(() => {
    if (data) {
      const filtered = filterData(data, searchById, searchByClientName)
      setFilteredData(filtered)
    }
  }, [searchById, searchByClientName, data])

  if (session) {
    return (
      <div className="">
        <Header
          fetchDataAndUpdate={fetchDataAndUpdate}
          searchById={searchById}
          setSearchById={setSearchById}
          searchByClientName={searchByClientName}
          setSearchByClientName={setSearchByClientName}
        />

        {loading && (
          <div className="mt-64 gap-2 flex flex-col items-center justify-center">
            {' '}
            <LoadingSpinner className={'h-32 w-32'} />
            <h1>Loading the data for you.</h1>
          </div>
        )}

        {/* provide a default value for data when it's undefined */}
        {!loading && <DataTable columns={columns} data={data || []} />}
        <Footer />
      </div>
    )
  } else {
    return <LoginScreen />
  }
}
