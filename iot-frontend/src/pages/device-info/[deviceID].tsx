import Header from '@/components/Header'
import { useRouter } from 'next/router'

const Devices = () => {
  const router = useRouter()
  const { deviceID, clientName, deviceKey, lastOnline, data } = router.query
  const deviceData = data ? JSON.parse(data as string) : null

  console.log(deviceData)

  // Temp Data
  const statusData = [
    { type: 'Scan', status: 'ONLINE' },
    { type: 'Battery', status: 'OFFLINE' },
    { type: 'Insitu', status: 'ERROR' },
  ]

  return (
    <>
      <Header />
      <div className="container min-h-screen">
        <div className="mx-auto py-8">
          <div className="flex justify-center mb-4">
            <span className=" text-5xl font-semibold mr-2">Device:</span>
            <span className="bg-blue-500 text-white px-3 py-1 rounded-lg">XXRU2</span>
          </div>

          <div className="mb-4">
            <p className="text-xl font-semibold">Device Info:</p>
            <p>Device ID: {deviceID}</p>
            <p>Client Name: {clientName}</p>
            <p>Device Key: {deviceKey}</p>
            <p>Last Online: {lastOnline}</p>
            <p>Last Ticket Created: Never</p>
          </div>

          <div className="mb-4">
            <p className="text-xl font-semibold">Status:</p>
            <div className="flex justify-evenly mt-5">
              {statusData.map((status, index) => (
                <p key={index} className="mx-2">
                  {status.type}:{' '}
                  <span className={status.status === 'ONLINE' ? 'text-green-500' : 'text-red-500'}>
                    {status.status}
                  </span>
                </p>
              ))}
            </div>
          </div>

          {/* <div className="grid grid-cols-3 gap-4 mt-6">
          <button className="bg-green-500 text-white font-bold py-2 px-4 rounded">Scan</button>
          <button className="bg-red-500 text-white font-bold py-2 px-4 rounded">Battery</button>
          <button className="bg-red-500 text-white font-bold py-2 px-4 rounded">Insitu</button>
        </div> */}

          <div className="mt-6">
            <button className="bg-green-500 text-white font-bold py-2 px-4 rounded w-full">
              Create Ticket
            </button>
            <p className="text-gray-600 text-center mt-2">No ticket currently active.</p>
          </div>

          <div className="mb-4">
            <p className="text-xl font-semibold">Metrics:</p>
            {deviceData && renderMetrics(deviceData)}
          </div>
        </div>
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

export default Devices
