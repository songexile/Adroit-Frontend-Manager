import React, { useState } from 'react'
import { usePathname } from 'next/navigation'
import { flattenNestedData } from '@/utils'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Resend } from 'resend'

function fetchDeviceId() {
  //Fetches deviceId from Url
  const pathname = usePathname()
  const parts = pathname ? pathname.split('/') : []
  const deviceId = parts[parts.length - 1] ? parseInt(parts[parts.length - 1] as string) : 0 // Parse the deviceId as an integer, defaulting to 0 if it is undefined
  return deviceId
}

const Devices = (data: any) => {
  const [message, setMessage] = useState('')
  const deviceId = fetchDeviceId()
  const filteredData = flattenNestedData(data, deviceId)
  const deviceData = filteredData[0]

  const resend = new Resend(process.env.RESEND_API_KEY)

  const sendEmail = async () => {
    try {
      const emaildata = await resend.emails.send({
        from: 'next@zenorocha.com',
        to: 'munishk686@gmail.com',
        subject: 'Hello from Next.js',
        html: `<h1>${message}</h1>`,
      })
      console.log('Email sent successfully:', emaildata)
    } catch (error) {
      console.error('Error sending email:', error)
    }
  }

  //const handleMessageChange = (e) => {
  //setMessage(e.target.textContent);
  //};

  const handleSendMessage = () => {
    sendEmail()
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

            <p className="mt-4 font-semibold">Message:</p>

            <textarea
              className="border border-gray-300 p-2 rounded-md bg-white w-full h-40"
              placeholder="Enter your message here..."
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
      <Footer />
    </>
  )
}

export default Devices
