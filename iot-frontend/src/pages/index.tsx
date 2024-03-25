// Home Page
import React, { useState, useEffect } from 'react'
import Header from '@/components/Header'
import { DataTable } from '@/components/iotTable/data-table'
import { initializeColumns, columns } from '@/components/iotTable/columns'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import Footer from '@/components/Footer'

export default function Page({
  data,
  fetchDataAndUpdate,
}: {
  data?: DynamicMetricData[]
  fetchDataAndUpdate: () => Promise<void>
}) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (data != null) {
      initializeColumns()
      setLoading(false)
      console.log(data)
    }
  }, [data])

  return (
    <div className="">
      <Header fetchDataAndUpdate={fetchDataAndUpdate} />

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
}
