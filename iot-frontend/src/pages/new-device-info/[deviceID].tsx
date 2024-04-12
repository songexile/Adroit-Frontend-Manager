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
import SpeedometerChart from '@/components/speedometerChart/SpeedometerChart';
import { Heading1 } from 'lucide-react'

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
                <div className='flex  mx-32  min-h-screen py-6 flex-col '>

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

    const formalMetricName = ['pH Level', 'Temperature', 'Battery Percentage %', 'Solar Voltage', 'Press']

    const fullMetricName = filterMetric.map((key) => prefix + key)

    return (
        <div>Hello world

            <div className='grid grid-cols-3  gap-4'>
                {Object.entries(deviceData).map(([key, value]) => {
                    const index = fullMetricName.indexOf(key)
                    if (index !== -1) {
                        const formalName = formalMetricName[index]
                        if (typeof value === 'string') {
                            return (
                                <div className="flex bg-gray-200 bg- rounded-md flex-col gap-4 text-red-500" key={key}>
                                    <p>
                                        {formalName}: {value}

                                    </p>
                                </div>
                            )
                        } else if (value && typeof value === 'object' && 'value' in value) {
                            return (
                                <div className="flex items-start    border-blue-500 border-b-2 hover:bg-gray-300  transition   bg-blue-200 bg- rounded-md flex-col gap-4 text-black h-16  justify-center" key={key}>
                                    <div className='mx-4 flex flex-col  gap-4'>
                                        <p className='font-bold text-xl'>
                                            {formalName}
                                            <div>
                                                <SpeedometerChart value={parseFloat(value.value)} colors={['#00ff00', '#ff0000']} />
                                            </div>
                                        </p>
                                        <p>
                                            {value.value}

                                        </p>
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
        </div>
    )
}




export default DeviceID



const MetricsCard = ({ deviceData }: { deviceData: DynamicMetricData }): JSX.Element => {


    return (
        <div>
            {deviceData.client_name}
            {deviceData.device_id}

        </div>
    )
}
