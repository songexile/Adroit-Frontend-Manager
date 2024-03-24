import Header from '@/components/Header'
import { useRouter } from 'next/router'
import { useEffect } from 'react';
import emailjs from 'emailjs-com';


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

  useEffect(() => {
    // SMTPJS script
    const script = document.createElement('script');
    script.src = 'https://smtpjs.com/v3/smtp.js';
    script.async = true;
    document.body.appendChild(script);

   

    // Example of calling the sendEmail function
    //sendEmail();

    // Clean up function
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100">

        <div className="container mx-auto">
          <p className="text-black-600 text-center mt-2 flex justify-center">Email will be sent to support@adroit.co.nz</p>

          <div className="mx-auto py-8">
            <div className="flex justify-center mb-4 bg-white text-black px-3 py-1 rounded-lg items-center">
              <span className="text-4xl font-semibold mr-2">Subject: Device Issue:</span>
              <span className="px-4">XXRU2</span>
            </div>

            <p className="mt-2 font-semibold"> Message:</p>

            <div
              className="border border-gray-300 p-2 rounded-md bg-white"
              contentEditable="true"
              style={{ outline: 'none', width: '500px', height: '100px', minWidth: '100px', minHeight: '50px' }}
            >
            </div>

            <div className="mt-6 flex justify-center">
              <button className="bg-green-500 text-white font-bold py-2 px-4 rounded">
                Send Message
              </button>
            </div>

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
          return null
        }
      })}
    </div>
  )
}

export default Devices
