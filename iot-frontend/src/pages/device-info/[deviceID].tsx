import React from 'react'
import { usePathname } from 'next/navigation'
import { flattenNestedData } from '@/utils'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

function fetchDeviceId() {
  //Fetches deviceId from Url
  const pathname = usePathname()
  const parts = pathname ? pathname.split('/') : []
  const deviceId = parts[parts.length - 1] ? parseInt(parts[parts.length - 1] as string) : 0 // Parse the deviceId as an integer, defaulting to 0 if it is undefined
  return deviceId
}

function Page(data: any) {
  const deviceId = fetchDeviceId()
  const filteredData = flattenNestedData(data, deviceId)
  const deviceData = filteredData[0]
  console.log(deviceData) //Returns the array of the device.

  return (
    <>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Header />

        <div className="flex-grow flex flex-col container mx-auto p-6 py-5">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden animate-slide-in border-2 border-blue-500">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Device Info</h2>
                <Link href={`/create-ticket/${deviceData?.device_id}`}>
                  <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300 shadow-md">
                    Create Ticket
                  </button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md border-2 border-blue-500">
                  <div className="mb-4">
                    <span className="font-semibold text-gray-600">Device ID:</span>{' '}
                    {deviceData?.device_id}
                  </div>
                  <div className="mb-4">
                    <span className="font-semibold text-gray-600">Device Key:</span>{' '}
                    {deviceData?.device_key}
                  </div>
                  <div className="mb-4">
                    <span className="font-semibold text-gray-600">Client Name:</span>{' '}
                    {deviceData?.client_name}
                  </div>
                  <div className="mb-4">
                    <span className="font-semibold text-gray-600">Last Online:</span>{' '}
                    {typeof deviceData?.last_online === 'string'
                      ? deviceData.last_online
                      : deviceData?.last_online?.value || 'N/A'}
                  </div>
                  <div className="mb-4">
                    <span className="font-semibold text-gray-600">Last ticket created:</span> Never
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border-2 border-blue-500">
                  <h3 className="text-xl font-bold mb-4 text-gray-800">Status</h3>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center">
                      <span className="font-semibold text-gray-600 mr-2">Scan:</span>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold">
                        ONLINE
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-semibold text-gray-600 mr-2">Battery:</span>
                      <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full font-semibold">
                        OFFLINE
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-semibold text-gray-600 mr-2">Insitu:</span>
                      <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full font-semibold">
                        ERROR
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 mt-8 border-2 border-blue-500">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Metrics:</h2>
            {deviceData && renderMetrics(deviceData)}
          </div>
        </div>

        <Footer />
      </div>
    </>
  )
}

/**
 * Renders metric data from the provided deviceData object.
 * @param {DynamicMetricData | null} deviceData - The object containing metric data or null if no data is available.
 * @returns {JSX.Element | null} JSX representing the rendered metric data, or null if deviceData is null.
 */
const renderMetrics = (deviceData: DynamicMetricData | null): JSX.Element | null => {
  if (!deviceData) return null

  return (
    <div>
      {/* Uses Object.entries() to iterate over the entries (key-value pairs) of the deviceData object.
      For each entry, it checks the type of the value (typeof value) to determine whether it's a string or an object.
      If the value is a string, it displays the string value directly.
      If the value is an object and has a 'value' property, it accesses and displays the 'value' property.
      Otherwise, it returns null to handle undefined or unexpected values. */}
      {Object.entries(deviceData).map(([key, value]) => {
        if (typeof value === 'string') {
          return (
            <div key={key}>
              <p>
                {key}: {value}
              </p>
            </div>
          )
        } else if (value && typeof value === 'object' && 'value' in value) {
          return (
            <div key={key}>
              <p>
                {key}: {value.value}
              </p>
            </div>
          )
        } else {
          return null // handle undefined or unexpected value
        }
      })}
    </div>
  )
}

export default Page
