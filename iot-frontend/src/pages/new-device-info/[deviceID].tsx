import React, { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { flattenNestedData, getBatteryStatus, getInsituStatus, getScanStatus } from '@/utils';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import Link from 'next/link';
import LoginScreen from '../login';
import { DynamicMetricData } from '@/types';
import SpeedometerChart from '@/components/speedoMeterChart/SpeedoMeterChart';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

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
    { name: `Device ${deviceData?.device_id}`, path: `/new-device-info/${deviceData?.device_id}` }, // Adjusted path to include device_id
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
        <div className="flex mx-32 min-h-screen py-6 flex-col ">
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

/**
 * Renders metric data from the provided deviceData object, highlighting specific keys in red for important debugging metrics.
 * @param {DynamicMetricData | null} deviceData - The object containing metric data or null if no data is available.
 * @returns {JSX.Element | null} JSX representing the rendered metric data with highlighted debugging metrics, or null if deviceData is null.
 */
const debugMetrics = (deviceData: DynamicMetricData | null): JSX.Element | null => {
  if (!deviceData) return null;

  const filterMetric = ['PH', 'TEMP', 'BattP', 'solar volt', 'PRESS'];
  const prefix = 'metric_';

  const formalMetricName = [
    'pH Level',
    'Temperature',
    'Battery Percentage %',
    'Solar Voltage',
    'Press',
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
            <span
              className={`px-3 py-1 rounded-full font-semibold ${
                getScanStatus(deviceData) === 'ONLINE'
                  ? 'bg-green-100 text-green-800'
                  : getScanStatus(deviceData) === 'ERROR'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-300 text-gray-800'
              }`}
            >
              {getScanStatus(deviceData)}
            </span>
          </div>

          <div className="flex items-center">
            <span className="font-bold text-gray-600 ml-16 mr-2">Battery:</span>
            <span
              className={`px-3 py-1 rounded-full font-semibold ${
                getBatteryStatus(deviceData) === 'ONLINE'
                  ? 'bg-green-100 text-green-800'
                  : getBatteryStatus(deviceData) === 'OFFLINE'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-300 text-gray-800'
              }`}
            >
              {getBatteryStatus(deviceData)}
            </span>
          </div>

          <div className="flex items-center">
            <span className="font-bold text-gray-600 ml-16 mr-2">Insitu:</span>
            <span
              className={`px-3 py-1 rounded-full font-semibold ${
                getInsituStatus(deviceData) === 'NORMAL' || getInsituStatus(deviceData) === 'OK'
                  ? 'bg-green-100 text-green-800'
                  : getInsituStatus(deviceData) === 'ERROR'
                  ? 'bg-red-100 text-red-800'
                  : getInsituStatus(deviceData) === 'POWER_CYCLED' ||
                    getInsituStatus(deviceData) === 'STARTUP' ||
                    getInsituStatus(deviceData) === 'AQUATROLL 500'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-300 text-gray-800'
              }`}
            >
              {getInsituStatus(deviceData)}
            </span>
          </div>
        </div>
      </div>

      {/* Chart components */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Object.entries(deviceData).map(([key, value], index) => {
          const metricIndex = fullMetricName.indexOf(key);
          if (metricIndex !== -1) {
            const formalName = formalMetricName[metricIndex];
            if (typeof value === 'string') {
              return (
                <div
                  className="flex flex-wrap bg-gray-200 bg- rounded-md flex-col gap-4 text-red-500"
                  key={`${key}-${index}`}
                >
                  <p>
                    {formalName}: {value}
                  </p>
                </div>
              );
            } else if (value && typeof value === 'object' && 'value' in value) {
              return (
                <div
                  className="flex flex-wrap items-start border-blue-500 border-b-2 hover:bg-gray-300 transition bg-blue-200 rounded-md flex-col gap-4 text-black min-h-[16rem] justify-center"
                  key={`${key}-${index}`}
                >
                  <div className="mx-4 flex flex-col gap-4">
                    <p className="font-bold text-xl">{formalName}</p>
                    <p>{value.value}</p>
                  </div>
                  {/* SpeedoMeeter Chart */}
                  <div>
                    <SpeedometerChart
                      value={parseFloat(value.value)}
                      colors={['#38bdf8', '#EF4444']}
                    />
                  </div>
                </div>
              );
            } else {
              return (
                <div key={`${key}-${index}`}>
                  <p>{formalName}: N/A</p>
                </div>
              );
            }
          } else {
            return null;
          }
        })}
      </div>

      <div className="flex flex-wrap max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 mt-8 border-2 border-blue-500">
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Metrics:</h2>
          {deviceData && renderMetrics(deviceData)}
        </div>

        <div className="flex flex-col gap-4 text-red-500">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Fault Identification:</h2>
          {Object.entries(deviceData).map(([key, value], index) => {
            if (errorKeys.includes(key)) {
              if (typeof value === 'string') {
                return (
                  <div key={`${key}-${index}`}>
                    <p>
                      {key}: {value}
                    </p>
                  </div>
                );
              } else if (value && typeof value === 'object' && 'value' in value) {
                return (
                  <div key={`${key}-${index}`}>
                    <p>
                      {key}: {value.value}
                    </p>
                  </div>
                );
              } else {
                // Handle undefined or unexpected value
                return (
                  <div key={`${key}-${index}`}>
                    <p>{key}: N/A</p>
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
    </div>
  );
};

export default DeviceID;
