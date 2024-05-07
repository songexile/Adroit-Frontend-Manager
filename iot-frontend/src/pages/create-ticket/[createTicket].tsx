import React, { useState } from 'react';
import { showToast } from '@/components/Toast';
import { usePathname } from 'next/navigation';
import { flattenNestedData } from '@/utils';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoginScreen from '../login';
import Breadcrumb from '@/components/Breadcrumb';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

function fetchDeviceId() {
  // Fetches deviceId from URL
  const pathname = usePathname();
  const parts = pathname ? pathname.split('/') : [];
  const deviceId = parts[parts.length - 1] ? parseInt(parts[parts.length - 1] as string) : 0; // Parse the deviceId as an integer, defaulting to 0 if it is undefined
  return deviceId;
}

const isEmail = (email: string) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
const isValidEmails = (emails: string) => {
  const emailArray = emails.split(',').map((email) => email.trim());
  return emailArray.every(isEmail);
};

const CreateTicket = (data: any) => {
  const { isAuthenticated, isLoading } = useAuth();

  const [to, setTo] = useState('');
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('Hi team, There is something wrong with...');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const deviceId = fetchDeviceId();
  const filteredData = flattenNestedData(data, deviceId);
  const deviceData = filteredData[0];

  // Breadcrumb items
  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: `Device ${deviceData?.device_id}`, path: `/device-info/${deviceData?.device_id}` },
    {
      name: `Create Ticket ${deviceData?.device_id}`,
      path: `/create-ticket/${deviceData?.device_id}`,
    },
  ];

  const handleCreateTicket = async () => {
    // Reset errors
    setErrors({});

    // Validate fields
    const validationErrors: { [key: string]: string } = {};
    if (!to) validationErrors.to = 'To field is required';
    if (!subject.trim()) validationErrors.subject = 'Subject field is required';
    if (!message.trim()) validationErrors.message = 'Message field is required';
    if (!isEmail(to)) validationErrors.to = 'Invalid email format';
    if (cc && !isValidEmails(cc)) validationErrors.cc = 'Invalid email format for CC field';
    if (bcc && !isValidEmails(bcc)) validationErrors.bcc = 'Invalid email format for BCC field';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to, cc, bcc, subject, message, deviceData }),
      });

      if (response.ok) {
        showToast({ message: 'Ticket created successfully!', type: 'success' });
      } else {
        const data = await response.json();
        if (data.message === 'Invalid API key') {
          showToast({ message: 'Invalid API key', type: 'error' });
        } else {
          showToast({ message: `Error creating ticket: ${data.message}`, type: 'error' });
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        showToast({ message: `Error creating ticket: ${error.message}`, type: 'error' });
      } else {
        showToast({ message: 'Unknown error occurred while creating ticket', type: 'error' });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen mt-64 gap-2 flex flex-col items-center justify-center">
        <div className="h-5/6 w-full"></div>
        <LoadingSpinner className={'h-32 w-32'} />
        <h1>Loading...</h1>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <>
        <Header />
        <Breadcrumb breadcrumbs={breadcrumbs} />
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="border text-card-foreground w-full max-w-6xl p-8 bg-white shadow-xl rounded-lg divide-y divide-gray-200">
            <div className="pb-8">
              <h1 className="text-2xl font-bold text-gray-800">Create Ticket</h1>
              <p className="text-sm text-gray-500">
                Ticket will be sent to{' '}
                <a
                  href="#"
                  className="text-blue-500 hover:text-blue-600"
                >
                  support@adroit.co.nz
                </a>
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Device Information</h2>
                <p className="text-sm text-gray-600">
                  <strong>Device ID:</strong> {deviceData?.device_id}
                  <br />
                  <strong>Device Key:</strong> {deviceData?.device_key}
                  <br />
                  <strong>Client Name:</strong> {deviceData?.client_name}
                  <br />
                  <strong>Last Online:</strong>{' '}
                  {typeof deviceData?.last_online === 'string'
                    ? deviceData.last_online
                    : deviceData?.last_online?.value || 'N/A'}
                  <br />
                  <strong>Last ticket created:</strong> Never
                </p>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Ticket Details</h2>

                <div className="space-y-4 mb-4">
                  <div>
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="to"
                    >
                      To:
                    </label>
                    <input
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                      id="to"
                      placeholder="support@adroit.co.nz"
                      type="email"
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                    />
                    {errors.to && <p className="text-red-500 mt-1">{errors.to}</p>}
                  </div>
                  <div>
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="cc"
                    >
                      CC (optional / separate multiple emails with commas):
                    </label>
                    <input
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                      id="cc"
                      placeholder="example1@mail.com, example2@mail.com"
                      type="text"
                      value={cc}
                      onChange={(e) => setCc(e.target.value)}
                    />
                    {errors.cc && <p className="text-red-500 mt-1">{errors.cc}</p>}
                  </div>
                  <div>
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="bcc"
                    >
                      BCC (optional / separate multiple emails with commas):
                    </label>
                    <input
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                      id="bcc"
                      placeholder="example1@mail.com, example2@mail.com"
                      type="text"
                      value={bcc}
                      onChange={(e) => setBcc(e.target.value)}
                    />
                    {errors.bcc && <p className="text-red-500 mt-1">{errors.bcc}</p>}
                  </div>
                  <div>
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="subject"
                    >
                      Subject:
                    </label>
                    <input
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                      id="subject"
                      placeholder="Ticket Subject"
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                    {errors.subject && <p className="text-red-500 mt-1">{errors.subject}</p>}
                  </div>
                  <div>
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="message"
                    >
                      Message:
                    </label>
                    <textarea
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1 min-h-[100px]"
                      id="message"
                      placeholder="Describe your issue"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    ></textarea>
                    {errors.message && <p className="text-red-500 mt-1">{errors.message}</p>}
                  </div>
                </div>
                <button
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-500 text-primary-foreground hover:bg-blue-600 h-10 px-4 py-2 w-full"
                  onClick={handleCreateTicket}
                >
                  Submit Ticket
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  } else {
    return <LoginScreen />;
  }
};

export default CreateTicket;
