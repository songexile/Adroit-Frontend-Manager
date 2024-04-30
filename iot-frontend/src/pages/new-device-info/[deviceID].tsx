import React from 'react'
import { usePathname } from 'next/navigation'
import { flattenNestedData } from '@/utils'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import Link from 'next/link'
import LoginScreen from '../login'
import { useSession } from 'next-auth/react'
import { DynamicMetricData } from '@/types'
import SpeedometerChart from '@/components/speedometerChart/SpeedometerChart'
import { Heading1, Ticket } from 'lucide-react'
const scan = "OFFLINE";

//import SpeedometerChart from '../components/speedometerChart/SpeedometerChart';

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
                <div className="flex  mx-32  min-h-screen py-6 flex-col ">
                    {deviceData && debugMetrics(deviceData)}
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

//**This function will look for specific keys in the deviceData object and display them in red but only for important debugging metrics . */

const debugMetrics = (deviceData: DynamicMetricData | null): JSX.Element | null => {
    if (!deviceData) return null

    const filterMetric = ['PH', 'TEMP', 'BattP', 'solar volt', 'PRESS']
    const prefix = 'metric_'

    const formalMetricName = [
        'pH Level',
        'Temperature',
        'Battery Percentage %',
        'Solar Voltage',
        'Press',
    ]

    const fullMetricName = filterMetric.map((key) => prefix + key)

    const relevantKeys = [
        'signal quality',
        'MESSAGE',
        'scanStatus',
        'insituStatus',
        'solar volt',
        'batt status',
        'DIAGNOSTICS',
    ]
    const errorKeys = relevantKeys.map((key) => prefix + key) // Concatenate prefix to each key

    return (
        // Device Info and create Ticket button.
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Device Info</h2>
                <Link href={`/create-ticket/${deviceData?.device_id}`}>
                    <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300 shadow-md">
                        Create Ticket
                    </button>
                </Link>
            </div>
            {/* Device Info Card */}
            <div className="bg-gray-200 p-4 rounded-lg">
                <div className="flex flex-wrap">
                    <div className="w-full md:w-1/5 mb-4">
                        <span className="font-bold text-gray-600">Device ID:</span>
                        <div className="text-right md:text-left md:pl-1">{deviceData?.device_id}</div>
                    </div>
                    <div className="w-full md:w-1/5 mb-4">
                        <span className="font-bold text-gray-600">Device Key:</span>
                        <div className="text-right md:text-left md:pl-1">{deviceData?.device_key}</div>
                    </div>
                    <div className="w-full md:w-1/5 mb-4">
                        <span className="font-bold text-gray-600">Client Name:</span>
                        <div className="text-right md:text-left md:pl-1">{deviceData?.client_name}</div>
                    </div>
                    <div className="w-full md:w-1/5 mb-4">
                        <span className="font-bold text-gray-600">Last Online:</span>
                        <div className="text-right md:text-left md:pl-1">
                            {typeof deviceData?.last_online === 'string'
                                ? deviceData.last_online
                                : deviceData?.last_online?.value || 'N/A'}
                        </div>
                    </div>
                    <div className="w-full md:w-1/5 mb-4">
                        <span className="font-bold text-gray-600">Last Ticket Created:</span>
                        <div className="text-right md:text-left md:pl-1">Never</div>
                    </div>
                </div>
            </div>

            {/*  Status Card */}
            <h3 className="text-xl font-bold mr-16 text-gray-800">Status</h3>
            <div className="bg-gray-200 p-4 rounded-lg flex flex-col items-center justify-center mt-4 mb-4">
                <div className="flex flex-col md:flex-row items-center justify-center">
                    <div className="flex items-center">
                        <span className="font-bold text-gray-600 mr-2">Scan:</span>
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold">
                            {scan}
                        </span>
                    </div>
                    <div className="flex items-center">
                        <span className="font-bold text-gray-600 ml-16 mr-2">Battery:</span>
                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full font-semibold">
                            OFFLINE
                        </span>
                    </div>
                    <div className="flex items-center">
                        <span className="font-bold text-gray-600 ml-16 mr-2">Insitu:</span>
                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full font-semibold">
                            ERROR
                        </span>
                    </div>
                </div>
            </div>

            {/* Chart components */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-4">
                {Object.entries(deviceData).map(([key, value]) => {
                    const index = fullMetricName.indexOf(key)
                    if (index !== -1) {
                        const formalName = formalMetricName[index]
                        if (typeof value === 'string') {
                            return (
                                <div
                                    className="flex flex-wrap bg-gray-200 bg- rounded-md flex-col gap-4 text-red-500"
                                    key={key}
                                >
                                    <p>
                                        {formalName}: {value}
                                    </p>
                                </div>
                            )
                        } else if (value && typeof value === 'object' && 'value' in value) {
                            return (
                                <div
                                    className="flex flex-wrap items-start border-blue-500 border-b-2 hover:bg-gray-300 transition bg-blue-200 rounded-md flex-col gap-4 text-black min-h-[16rem] justify-center"
                                    key={key}
                                >
                                    <div className="mx-4 flex flex-col gap-4">
                                        <p className="font-bold text-xl">{formalName}</p>
                                        <p>{value.value}</p>
                                    </div>

                                    {/* SpeedoMeeter Chart */}
                                    <div>

                                        <SpeedometerChart
                                            value={parseFloat(value.value)}
                                            colors={['#00ff00', '#ff0000']}
                                        />
                                    </div>

                                </div>
                            )
                        } else {
                            return (
                                <div className="" key={key}>
                                    <p>{formalName}: N/A</p>
                                </div>
                            )
                        }
                    } else {
                        return <></>
                    }
                })}
            </div>

            <div className="flex flex-wrap max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 mt-8 border-2 border-blue-500">
                <div>
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Metrics:</h2>
                    {deviceData && renderMetrics(deviceData)}
                </div>

                <div className="flex flex-col gap-4 text-red-500">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Attentus:</h2>

                    {Object.entries(deviceData).map(([key, value]) => {
                        if (errorKeys.includes(key)) {
                            if (typeof value === 'string') {
                                return (
                                    <div className="" key={key}>
                                        <p>

                                            {key}: {value}
                                        </p>
                                    </div>
                                )
                            } else if (value && typeof value === 'object' && 'value' in value) {
                                return (
                                    <div className="" key={key}>
                                        <p>
                                            {key}: {value.value}
                                        </p>
                                    </div>
                                )
                            } else {
                                // Handle undefined or unexpected value
                                return (
                                    <div className="" key={key}>
                                        <p>{key}: N/A</p>
                                    </div>
                                )
                            }
                        } else {
                            // Key is not in errorKeys, return an empty fragment
                            return <></>
                        }
                    })}

                </div>
            </div>

        </div>
    )
}

export default DeviceID


