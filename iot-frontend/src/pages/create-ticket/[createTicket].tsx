import React, { useState } from 'react'
import { usePathname } from 'next/navigation'
import { flattenNestedData } from '@/utils'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

function fetchDeviceId() {
  //Fetches deviceId from Url
  const pathname = usePathname()
  const parts = pathname ? pathname.split('/') : []
  const deviceId = parts[parts.length - 1] ? parseInt(parts[parts.length - 1] as string) : 0 // Parse the deviceId as an integer, defaulting to 0 if it is undefined
  return deviceId
}

const Devices = (data: any) => {
  const [to, setTo] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState(`Hi team there is something wrong with...`)
  const deviceId = fetchDeviceId()
  const filteredData = flattenNestedData(data, deviceId)
  const deviceData = filteredData[0]

  //const handleMessageChange = (e) => {
  //setMessage(e.target.textContent);
  //};

  const handleSendMessage = async () => {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to, subject, message, deviceData }),
      })

      if (response.ok) {
        console.log('Email sent successfully')
      } else {
        console.error('Error sending email')
      }
    } catch (error) {
      console.error('Error sending email:', error)
    }
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto">
          <p className="text-black-600 text-center mt-2 flex justify-center">
            Email will be sent to support@adroit.co.nz
          </p>

          <div className="mx-auto py-8">
            <div className="flex justify-center mb-4 bg-white text-black px-3 py-1 rounded-lg items-center">
              <span className="text-4xl font-semibold mr-2">
                Subject: Device Issue Insitu Error
              </span>
            </div>

            <p className="mt-2 font-semibold">Device Information:</p>
            <div className="mx-auto">
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
                <span className="font-semibold">Last Online: </span>
                {typeof deviceData?.last_online === 'string'
                  ? deviceData.last_online
                  : deviceData?.last_online?.value || 'N/A'}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Last ticket created:</span>{' '}
                {/* {deviceData?.last_ticket_created} */}
              </div>
            </div>

            <div className="mx-auto py-8">
              <div className="flex justify-center mb-4 bg-white text-black px-3 py-1 rounded-lg items-center">
                <span className="text-4xl font-semibold mr-2">Email</span>
              </div>
              <div className="mb-4">
                <label htmlFor="from" className="font-semibold">
                  From:
                </label>
                <input
                  id="from"
                  type="text"
                  value="support@adroit.co.nz"
                  readOnly
                  disabled
                  className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                  focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                  disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                  invalid:border-pink-500 invalid:text-pink-600
                  focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="to" className="font-semibold">
                  To:
                </label>
                <input
                  id="to"
                  type="text"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="border border-gray-300 p-2 rounded-md bg-white w-full"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="subject" className="font-semibold">
                  Subject:
                </label>
                <input
                  id="subject"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="border border-gray-300 p-2 rounded-md bg-white w-full"
                />
              </div>
              <p className="mt-4 font-semibold">Message:</p>
              <textarea
                className="border border-gray-300 p-2 rounded-md bg-white w-full h-40"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
              <div className="mt-6 flex justify-center">
                <button
                  className="bg-green-500 text-white font-bold py-2 px-4 rounded"
                  onClick={handleSendMessage}
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Devices
