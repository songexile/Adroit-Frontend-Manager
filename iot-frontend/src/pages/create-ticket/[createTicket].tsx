import React, { useState } from 'react'
import { showToast } from '@/components/Toast'
import { usePathname } from 'next/navigation'
import { flattenNestedData } from '@/utils'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LoginScreen from '../login'
import { useSession } from 'next-auth/react'
import Breadcrumb from '@/components/Breadcrumb'

function fetchDeviceId() {
  // Fetches deviceId from URL
  const pathname = usePathname()
  const parts = pathname ? pathname.split('/') : []
  const deviceId = parts[parts.length - 1] ? parseInt(parts[parts.length - 1] as string) : 0 // Parse the deviceId as an integer, defaulting to 0 if it is undefined
  return deviceId
}

const isEmailValid = (email: string) =>
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email.trim())

const validateEmails = (emails: string) => {
  return emails.split(',').every(isEmailValid)
}

const CreateTicket = (data: any) => {
  const { data: session } = useSession()
  const [to, setTo] = useState('')
  const [cc, setCC] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('Hi team, There is something wrong with...')
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [ticketCreated] = useState(false) // State to track if ticket is successfully created
  const deviceId = fetchDeviceId()
  const filteredData = flattenNestedData(data, deviceId)
  const deviceData = filteredData[0]

  // Breadcrumb items
  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: `Device ${deviceData?.device_id}`, path: `/device-info/${deviceData?.device_id}` },
    {
      name: `Create Ticket ${deviceData?.device_id}`,
      path: `/create-ticket/${deviceData?.device_id}`,
    },
  ]

  const handleCreateTicket = async () => {
    // Reset errors
    setErrors({})

    // Validate fields
    const validationErrors: { [key: string]: string } = {}
    if (!to) validationErrors.to = 'To field is required'
    if (!cc) validationErrors.cc = 'CC field is required'
    if (!subject.trim()) validationErrors.subject = 'Subject field is required'
    if (!message.trim()) validationErrors.message = 'Message field is required'
    if (!isEmailValid(to)) validationErrors.to = 'Invalid email format'
    if (!validateEmails(cc) && !validateEmails(cc))
      validationErrors.cc = 'One or more CC email formats are invalid'

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    try {
      const response = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to, cc, subject, message, deviceData }),
      })

      if (response.ok) {
        showToast({ message: 'Ticket created successfully!', type: 'success' })
      } else {
        const data = await response.json()
        showToast({ message: `Error creating ticket: ${data.message}`, type: 'error' })
      }
    } catch (error) {
      if (error instanceof Error) {
        showToast({ message: `Error creating ticket: ${error.message}`, type: 'error' })
      } else {
        showToast({ message: 'Unknown error occurred while creating ticket', type: 'error' })
      }
    }
  }

  if (session) {
    return (
      <>
        <Header />
        <Breadcrumb breadcrumbs={breadcrumbs} />
        <div className="flex-grow flex flex-col container mx-auto p-6 py-5">
          <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden border-2 border-blue-500">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Create Ticket</h2>
              </div>

              <div className="mb-8">
                <p className="text-black-600 text-center mb-4">
                  Tickets will be sent to support@adroit.co.nz
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">Device Information</h3>
                    <div className="mb-2">
                      <span className="font-semibold text-gray-600">Device ID:</span>{' '}
                      {deviceData?.device_id}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold text-gray-600">Device Key:</span>{' '}
                      {deviceData?.device_key}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold text-gray-600">Client Name:</span>{' '}
                      {deviceData?.client_name}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold text-gray-600">Last Online:</span>{' '}
                      {typeof deviceData?.last_online === 'string'
                        ? deviceData.last_online
                        : deviceData?.last_online?.value || 'N/A'}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold text-gray-600">Last ticket created:</span>{' '}
                      Never
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">Ticket Details</h3>
                    {ticketCreated && (
                      <p className="text-green-600 mb-4">
                        Thank You, the Ticket has been successfully submitted!
                      </p>
                    )}
                    <div className="mb-4">
                      <label htmlFor="to" className="font-semibold text-gray-600">
                        To:
                      </label>
                      <input
                        id="to"
                        type="text"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        required
                        className="border border-gray-300 p-2 rounded-md bg-white w-full"
                      />
                      {errors.to && <p className="text-red-500 mt-1">{errors.to}</p>}
                    </div>
                    <div className="mb-4">
                      <label htmlFor="cc" className="font-semibold text-gray-600">
                        CC (separate multiple emails with commas):
                      </label>
                      <input
                        id="cc"
                        type="text"
                        value={cc}
                        onChange={(e) => setCC(e.target.value)}
                        className="border border-gray-300 p-2 rounded-md bg-white w-full"
                        placeholder="example1@mail.com, example2@mail.com"
                      />
                      {errors.cc && <p className="text-red-500 mt-1">{errors.cc}</p>}
                    </div>
                    <div className="mb-4">
                      <label htmlFor="subject" className="font-semibold text-gray-600">
                        Subject:
                      </label>
                      <input
                        id="subject"
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                        className="border border-gray-300 p-2 rounded-md bg-white w-full"
                      />
                      {errors.subject && <p className="text-red-500 mt-1">{errors.subject}</p>}
                    </div>
                    <div className="mb-4">
                      <label htmlFor="message" className="font-semibold text-gray-600">
                        Message:
                      </label>
                      <textarea
                        id="message"
                        className="border border-gray-300 p-2 rounded-md bg-white w-full h-40"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                      ></textarea>
                      {errors.message && <p className="text-red-500 mt-1">{errors.message}</p>}
                    </div>
                    <div className="mt-6 flex justify-center">
                      <button
                        className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition duration-300 shadow-md"
                        onClick={handleCreateTicket}
                      >
                        Submit Ticket
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  } else {
    return <LoginScreen />
  }
}

export default CreateTicket
