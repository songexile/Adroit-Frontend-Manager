import React, { useState } from 'react';
import { showToast } from '@/components/Toast';
import { usePathname } from 'next/navigation';
import { flattenNestedData, getBatteryStatus, getInsituStatus, getScanStatus } from '@/utils';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoginScreen from '../login';
import Breadcrumb from '@/components/Breadcrumb';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import SEO from '@/components/SEO';
import Modal from '@/components/Modal';

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
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const deviceId = fetchDeviceId();
  const filteredData = flattenNestedData(data, deviceId);
  const deviceData = filteredData[0];

  if (!deviceData) return null;

  const prefix = 'metric_';

  const relevantKeys = [
    'signal quality',
    'MESSAGE',
    'scanStatus',
    'insituStatus',
    'solar volt',
    'batt status',
    'DIAGNOSTICS',
  ];

  const errorKeys = relevantKeys.map((key) => prefix + key); // Concatenate prefix to each key

  const title = `Create Ticket | ${deviceId} | Adroit Front End Manager`;
  const description = `Create Ticket Page for Device ID: ${deviceId}`;

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

    setIsSubmitLoading(true);

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
        // Show success modal
        setShowModal(true);
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

    setIsSubmitLoading(false);
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
        <SEO
          title={title}
          description={description}
        />
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
              {/* Device Info */}
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
              {/* Fault Identification */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Fault Identification</h2>
                <p className="text-sm text-gray-600">
                  {Object.entries(deviceData).map(([key, value], index) => {
                    if (errorKeys.includes(key)) {
                      if (typeof value === 'string') {
                        return (
                          <React.Fragment key={`${key}-${index}`}>
                            <strong>{key}:</strong> {value}
                            <br />
                          </React.Fragment>
                        );
                      } else if (value && typeof value === 'object' && 'value' in value) {
                        return (
                          <React.Fragment key={`${key}-${index}`}>
                            <strong>{key}:</strong> {value.value}
                            <br />
                          </React.Fragment>
                        );
                      } else {
                        // Handle undefined or unexpected value
                        return (
                          <React.Fragment key={`${key}-${index}`}>
                            <strong>{key}:</strong> N/A
                            <br />
                          </React.Fragment>
                        );
                      }
                    } else {
                      // Key is not in errorKeys, return null
                      return null;
                    }
                  })}
                </p>
              </div>
              {/* Status Card */}
              <div className="md:col-span-2">
                <h3 className="text-xl font-bold text-gray-800 mt-4 mb-4">Status</h3>
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm mb-4">
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col items-center gap-4">
                      <div className="bg-gray-100 rounded-full p-4 dark:bg-gray-800">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-6 h-6 text-gray-500 dark:text-gray-400"
                        >
                          <path d="M3 7V5a2 2 0 0 1 2-2h2"></path>
                          <path d="M17 3h2a2 2 0 0 1 2 2v2"></path>
                          <path d="M21 17v2a2 2 0 0 1-2 2h-2"></path>
                          <path d="M7 21H5a2 2 0 0 1-2-2v-2"></path>
                        </svg>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Scan</p>
                        <p
                          className={`text-lg font-semibold ${
                            getScanStatus(deviceData) === 'ONLINE'
                              ? 'text-green-500'
                              : getScanStatus(deviceData) === 'ERROR'
                              ? 'text-red-500'
                              : 'text-gray-500'
                          }`}
                        >
                          {getScanStatus(deviceData)}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-4">
                      <div className="bg-gray-100 rounded-full p-4 dark:bg-gray-800">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-6 h-6 text-gray-500 dark:text-gray-400"
                        >
                          <rect
                            width="16"
                            height="10"
                            x="2"
                            y="7"
                            rx="2"
                            ry="2"
                          ></rect>
                          <line
                            x1="22"
                            x2="22"
                            y1="11"
                            y2="13"
                          ></line>
                        </svg>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Battery
                        </p>
                        <p
                          className={`text-lg font-semibold ${
                            getBatteryStatus(deviceData) === 'ONLINE'
                              ? 'text-green-500'
                              : getBatteryStatus(deviceData) === 'OFFLINE'
                              ? 'text-red-500'
                              : 'text-gray-500'
                          }`}
                        >
                          {getBatteryStatus(deviceData)}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-4">
                      <div className="bg-gray-100 rounded-full p-4 dark:bg-gray-800">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-6 h-6 text-gray-500 dark:text-gray-400"
                        >
                          <line
                            x1="2"
                            x2="5"
                            y1="12"
                            y2="12"
                          ></line>
                          <line
                            x1="19"
                            x2="22"
                            y1="12"
                            y2="12"
                          ></line>
                          <line
                            x1="12"
                            x2="12"
                            y1="2"
                            y2="5"
                          ></line>
                          <line
                            x1="12"
                            x2="12"
                            y1="19"
                            y2="22"
                          ></line>
                          <circle
                            cx="12"
                            cy="12"
                            r="7"
                          ></circle>
                        </svg>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Insitu
                        </p>
                        <p
                          className={`text-lg font-semibold ${
                            getInsituStatus(deviceData) === 'NORMAL' ||
                            getInsituStatus(deviceData) === 'OK'
                              ? 'text-green-500'
                              : getInsituStatus(deviceData) === 'ERROR'
                              ? 'text-red-500'
                              : getInsituStatus(deviceData) === 'POWER_CYCLED' ||
                                getInsituStatus(deviceData) === 'STARTUP' ||
                                getInsituStatus(deviceData) === 'AQUATROLL 500'
                              ? 'text-yellow-500'
                              : 'text-gray-500'
                          }`}
                        >
                          {getInsituStatus(deviceData)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Create Ticket */}
              <div className="md:col-span-2">
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
                  disabled={isSubmitLoading}
                >
                  {isSubmitLoading ? (
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : null}
                  {isSubmitLoading ? 'Submitting...' : 'Submit Ticket'}
                </button>
              </div>
            </div>
          </div>
          {/* Modal */}
          <Modal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            title="Ticket Created Successfully"
            description="Your ticket has been created and sent successfully."
            buttonText="Close"
            linkUrl="/"
            icon={
              <svg
                className="h-6 w-6 text-green-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            }
          />
        </div>
        <Footer />
      </>
    );
  } else {
    return <LoginScreen />;
  }
};

export default CreateTicket;
