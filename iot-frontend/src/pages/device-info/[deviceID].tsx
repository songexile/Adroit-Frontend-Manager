import React, { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { flattenNestedData, getBatteryStatus, getInsituStatus, getScanStatus } from '@/utils';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import Link from 'next/link';
import LoginScreen from '../login';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { DynamicMetricData } from '@/types';
import SpeedometerChart from '@/components/speedoMeterChart/SpeedoMeterChart';

function fetchDeviceId() {
  // Fetches deviceId from Url
  const pathname = usePathname();
  const parts = pathname ? pathname.split('/') : [];
  const deviceId = parts[parts.length - 1] ? parseInt(parts[parts.length - 1] as string) : 0; // Parse the deviceId as an integer, defaulting to 0 if it is undefined
  return deviceId;
}

function DeviceID(data: any) {
  const { isAuthenticated, isLoading } = useAuth();

  const deviceId = fetchDeviceId();

  const filteredData = useMemo(() => flattenNestedData(data, deviceId), [data, deviceId]);
  const deviceData = filteredData[0];

  console.log(deviceData); // Returns the array of the device.

  // Breadcrumb items
  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: `Device ${deviceData?.device_id}`, path: `/device-info/${deviceData?.device_id}` }, // Adjusted path to include device_id
  ];

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
        <div className="flex mx-8 md:mx-32 min-h-screen py-6 flex-col ">
          {deviceData && debugMetrics(deviceData)}
        </div>
        <Footer />
      </>
    );
  } else {
    return <LoginScreen />;
  }
}

/**
 * Renders metric data from the provided deviceData object.
 * @param {DynamicMetricData | null} deviceData - The object containing metric data or null if no data is available.
 * @returns {JSX.Element | null} JSX representing the rendered metric data, or null if deviceData is null.
 */
const renderMetrics = (deviceData: DynamicMetricData | null): JSX.Element | null => {
  if (!deviceData) return null;

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
          );
        } else if (value && typeof value === 'object' && 'value' in value) {
          return (
            <div key={key}>
              <p>
                {key}: {value.value}
              </p>
            </div>
          );
        } else {
          return null; // handle undefined or unexpected value
        }
      })}
    </div>
  );
};

//**This function will look for specific keys in the deviceData object and display them in red but only for important debugging metrics . */

const debugMetrics = (deviceData: DynamicMetricData | null): JSX.Element | null => {
  if (!deviceData) return null;

  const filterMetric = ['PH', 'TEMP', 'BattP', 'solar volt', 'PRESS', 'battery_voltage'];
  const prefix = 'metric_';

  const formalMetricName = [
    'pH Level',
    'Temperature',
    'Battery Percentage %',
    'Solar Voltage',
    'Press',
    'Battery Voltage',
  ];

  const fullMetricName = filterMetric.map((key) => prefix + key);

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
  const siteEntry = Object.entries(deviceData).find(([key]) => key === 'metric_site');

  let siteValue;
  if (siteEntry) {
    const [, siteData] = siteEntry;
    if (typeof siteData === 'string') {
      siteValue = siteData;
    } else if (typeof siteData === 'object' && 'value' in siteData) {
      siteValue = siteData.value;
    }
  }

  return (
    // Device Info and create Ticket button.
    <div>
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Device Info</h2>
        <Link href={`/create-ticket/${deviceData?.device_id}`}>
          <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300 shadow-md">
            Create Ticket
          </button>
        </Link>
      </div>

      {/* Device Info Card */}
      <div className="bg-white p-6 rounded-lg border bg-card text-card-foreground shadow-sm mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="mb-4">
            <div className="text-sm font-medium text-gray-500">Device ID</div>
            <div className="mt-1 text-lg font-semibold text-gray-900">{deviceData?.device_id}</div>
          </div>
          <div className="mb-4">
            <div className="text-sm font-medium text-gray-500">Device Key</div>
            <div className="mt-1 text-lg font-semibold text-gray-900">{deviceData?.device_key}</div>
          </div>
          <div className="mb-4">
            <div className="text-sm font-medium text-gray-500">Client Name</div>
            <div className="mt-1 text-lg font-semibold text-gray-900">
              {deviceData?.client_name}
            </div>
          </div>
          <div className="mb-4">
            <div className="text-sm font-medium text-gray-500">Last Online</div>
            <div className="mt-1 text-lg font-semibold text-gray-900">
              {typeof deviceData?.last_online === 'string'
                ? deviceData.last_online
                : deviceData?.last_online?.value || 'N/A'}
            </div>
          </div>
          <div className="mb-4">
            <div className="text-sm font-medium text-gray-500">Last Ticket Created</div>
            <div className="mt-1 text-lg font-semibold text-gray-900">Never</div>
          </div>
          <div className="mb-4">
            <div className="text-sm font-medium text-gray-500">Location</div>
            <div className="mt-1 text-lg font-semibold text-gray-900">{siteValue}</div>
          </div>
        </div>
      </div>

      {/* Status Card */}
      <h3 className="text-xl font-bold text-gray-800 mt-4 mb-4">Status</h3>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm mb-4">
        <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col items-center gap-2">
            <div className="bg-gray-100 rounded-full p-3 dark:bg-gray-800">
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
          <div className="flex flex-col items-center gap-2">
            <div className="bg-gray-100 rounded-full p-3 dark:bg-gray-800">
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
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Battery</p>
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
          <div className="flex flex-col items-center gap-2">
            <div className="bg-gray-100 rounded-full p-3 dark:bg-gray-800">
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
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Insitu</p>
              <p
                className={`text-lg font-semibold ${
                  getInsituStatus(deviceData) === 'NORMAL' || getInsituStatus(deviceData) === 'OK'
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

      {/* Chart components */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Object.entries(deviceData).map(([key, value], index) => {
          const metricIndex = fullMetricName.indexOf(key);
          if (metricIndex !== -1) {
            const formalName = formalMetricName[metricIndex];
            if (typeof value === 'string') {
              return (
                <div
                  key={`${key}-${index}`}
                  className="bg-white rounded-lg shadow-xl p-6 flex flex-col items-center justify-center"
                >
                  <p className="text-lg font-semibold text-gray-900">{formalName}</p>
                  <p className="mt-2 text-xl font-bold text-red-500">{value}</p>
                </div>
              );
            } else if (value && typeof value === 'object' && 'value' in value) {
              return (
                <div
                  key={`${key}-${index}`}
                  className="bg-white rounded-lg shadow-xl p-6 flex flex-col items-center justify-center"
                >
                  <p className="text-lg font-semibold text-gray-900">{formalName}</p>
                  <p className="mt-2 text-xl font-bold text-blue-500">{value.value}</p>
                  {/* SpeedoMeter Chart */}
                  <SpeedometerChart
                    value={parseFloat(value.value)}
                    colors={['#38bdf8', '#EF4444']}
                  />
                </div>
              );
            } else {
              return (
                <div
                  key={`${key}-${index}`}
                  className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center"
                >
                  <p className="text-lg font-semibold text-gray-900">{formalName}</p>
                  <p className="mt-2 text-xl text-gray-500">N/A</p>
                </div>
              );
            }
          } else {
            return null;
          }
        })}
      </div>

      <div className="flex flex-col sm:flex-row gap-8 bg-gradient-to-t from-slate-100 to-blue-100 mx-auto bg-white rounded-lg shadow-lg p-8 mt-8 border-2 border-blue-500 border-t-8">
        <div className="w-full sm:w-1/2">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 p-4 bg-gray-200 border-b-4 border-blue-500 rounded-sm">
            Fault Identification:
          </h2>
          <div className="grid grid-cols-1 gap-6">
            {Object.entries(deviceData).map(([key, value], index) => {
              if (errorKeys.includes(key)) {
                if (typeof value === 'string') {
                  return (
                    <div
                      key={`${key}-${index}`}
                      className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center"
                    >
                      <p className="text-lg font-semibold text-gray-900">{key}</p>
                      <p className="mt-2 text-xl font-bold text-red-500">{value}</p>
                    </div>
                  );
                } else if (value && typeof value === 'object' && 'value' in value) {
                  return (
                    <div
                      key={`${key}-${index}`}
                      className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center"
                    >
                      <p className="text-lg font-semibold text-gray-900">{key}</p>
                      <p className="mt-2 text-xl font-bold text-red-500">{value.value}</p>
                    </div>
                  );
                } else {
                  // Handle undefined or unexpected value
                  return (
                    <div
                      key={`${key}-${index}`}
                      className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center"
                    >
                      <p className="text-lg font-semibold text-gray-900">{key}</p>
                      <p className="mt-2 text-xl text-gray-500">N/A</p>
                    </div>
                  );
                }
              } else {
                // Key is not in errorKeys, return null
                return null;
              }
            })}
          </div>
        </div>
        <div className="w-full sm:w-1/2">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 p-4 bg-gray-200 border-b-4 border-blue-500 rounded-sm">
            Metrics:
          </h2>
          {deviceData && renderMetrics(deviceData)}
        </div>
      </div>
    </div>
  );
};

export default DeviceID;
