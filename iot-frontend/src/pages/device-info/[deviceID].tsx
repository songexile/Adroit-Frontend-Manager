import React from 'react'
import { usePathname } from 'next/navigation'
import { flattenNestedData } from '@/utils'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import Link from 'next/link'
import LoginScreen from '../login'
import { useSession } from 'next-auth/react'

function fetchDeviceId() {
  // Fetches deviceId from Url
  const pathname = usePathname()
  const parts = pathname ? pathname.split('/') : []
  const deviceId = parts[parts.length - 1] ? parseInt(parts[parts.length - 1] as string) : 0 // Parse the deviceId as an integer, defaulting to 0 if it is undefined
  return deviceId
}

function DeviceID(data: any) {
  const { data: session } = useSession()
  const deviceId = fetchDeviceId()
  const filteredData = flattenNestedData(data, deviceId)
  const deviceData = filteredData[0]
  console.log(deviceData) // Returns the array of the device.

  // Breadcrumb items
  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: `Device ${deviceData?.device_id}`, path: `/device-info/${deviceData?.device_id}` }, // Adjusted path to include device_id
  ]

  if (session) {
    return (
      <>
        <Header />
        <Breadcrumb breadcrumbs={breadcrumbs} />

        <div className="container min-h-screen max-w-3xl mx-auto p-6 py-5 mb-5 border rounded-lg mt-8 shadow-md">
          {/* Device Info */}
          <div className="mx-auto">
            <div className="text-xl font-bold mb-2">Device Info</div>
            <div className="mb-2">
              <span className="font-semibold">Device ID:</span> {deviceData?.device_id}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Device Key:</span> {deviceData?.device_key}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Client Name:</span> {deviceData?.client_name}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Last Online:</span>{' '}
              {typeof deviceData?.last_online === 'string'
                ? deviceData.last_online
                : deviceData?.last_online?.value || 'N/A'}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Last ticket created:</span> Never
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center py-5">
            <div className="text-xl font-bold mr-4">
              Scan:
              <button className="bg-green-500 text-white font-bold py-2 px-4 rounded ml-1">
                ONLINE
              </button>
            </div>
            <div className="text-xl font-bold mr-4">
              Battery:
              <button className="bg-red-500 text-white font-bold py-2 px-4 rounded ml-1">
                OFFLINE
              </button>
            </div>
            <div className="text-xl font-bold mr-4">
              Insitu:
              <button className="bg-red-500 text-white font-bold py-2 px-4 rounded ml-1">
                ERROR
              </button>
            </div>
          </div>

          {/* Create Ticket */}
          <div className="flex flex-col py-5">
            <div className="flex justify-center">
              <Link href={`/create-ticket/${deviceData?.device_id}`}>
                <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 mb-4 text-xl">
                  Create Ticket
                </button>
              </Link>
            </div>
            <p className="text-center">No ticket currently active.</p>
          </div>

          {/* Metrics */}
          <div className="mb-4">
            <p className="text-xl font-semibold">Metrics:</p>
            {deviceData && renderMetrics(deviceData)}
          </div>
        </div>
        <Footer />
      </>
    )
  } else {
    return <LoginScreen />
  }
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

export default DeviceID
