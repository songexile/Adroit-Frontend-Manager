import React, { useMemo } from 'react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import LoginScreen from '../login';
import { useAuth } from '@/hooks/useAuth';
import SEO from '@/components/SEO';
import { usePathname } from 'next/navigation';
import {
  flattenNestedData,
  getBatteryStatus,
  getInsituStatus,
  getScanStatus,
  getStatusCounts,
} from '@/utils';

function fetchIdAndType() {
  // Fetches ID from URL
  const pathname = usePathname();
  const parts = pathname ? pathname.split('/') : [];
  const id = parts[parts.length - 1] ? parseInt(parts[parts.length - 1] as string) : 0; // Parse the ID as an integer, defaulting to 0 if it is undefined

  // Determine the ID type based on the URL path
  const isClientId = parts.includes('client-page');
  const isDeviceId = parts.includes('device-info');
  const idType = isClientId ? 'client' : isDeviceId ? 'device' : '';

  return { id, type: idType };
}

const ClientPage = (data: any) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { id, type } = fetchIdAndType();

  const getDeviceIdsByMetric = (metricName: string) => {
    return clientData
      .filter((device) => {
        return device[`metric_${metricName}`] !== undefined;
      })
      .map((device) => device.device_id);
  };

  const getDeviceIdsBySite = (siteName: string) => {
    const filteredDevices = clientData.filter((device) => {
      const siteValue = device.metric_site;

      if (typeof siteValue === 'string') {
        return siteValue === siteName;
      } else if (typeof siteValue === 'object' && 'value' in siteValue) {
        return siteValue.value === siteName;
      }
      return false;
    });

    const deviceIds = filteredDevices.map((device) => device.device_id);

    return deviceIds;
  };
  const getDeviceIdsByStatus = (status: string) => {
    return clientData
      .filter((device) => {
        const scanStatus = getScanStatus(device);
        const batteryStatus = getBatteryStatus(device);
        const insituStatus = getInsituStatus(device);

        if (status === 'scanOnline' && scanStatus === 'ONLINE') {
          return true;
        } else if (status === 'scanError' && scanStatus === 'ERROR') {
          return true;
        } else if (status === 'batteryOnline' && batteryStatus === 'ONLINE') {
          return true;
        } else if (status === 'batteryOffline' && batteryStatus === 'OFFLINE') {
          return true;
        } else if (status === 'insituNormal' && insituStatus === 'NORMAL') {
          return true;
        } else if (status === 'insituError' && insituStatus === 'ERROR') {
          return true;
        } else if (
          status === 'N/A' &&
          scanStatus !== 'ONLINE' &&
          scanStatus !== 'ERROR' &&
          batteryStatus !== 'ONLINE' &&
          batteryStatus !== 'OFFLINE' &&
          insituStatus !== 'NORMAL' &&
          insituStatus !== 'ERROR' &&
          insituStatus !== status
        ) {
          return true;
        } else if (insituStatus === status) {
          return true;
        }

        return false;
      })
      .map((device) => device.device_id);
  };

  const filteredData = useMemo(() => {
    if (type === 'client') {
      return flattenNestedData(data, undefined, id);
    } else if (type === 'device') {
      return flattenNestedData(data, id);
    } else {
      // Handle the case when neither client ID nor device ID is provided
      return [];
    }
  }, [data, id, type]);

  const clientData = filteredData;

  // console.log(clientData);

  if (!clientData) return null;

  // Get client name, ID, and total devices
  const clientName = clientData.length > 0 ? clientData[0]?.client_name || '' : '';
  const clientId = clientData.length > 0 ? clientData[0]?.client_id || '' : '';
  const totalDevices = clientData.length;
  const title = `Client Info | ${clientId} | Adroit Front End Manager`;
  const description = `Client Info Page for Device ID: ${clientId}`;

  // Get all metrics and their counts
  const metricCounts = clientData.reduce((counts: { [key: string]: number }, device: any) => {
    for (const key in device) {
      if (key.startsWith('metric_')) {
        const metricName = key.replace('metric_', '');
        counts[metricName] = (counts[metricName] || 0) + 1;
      }
    }
    return counts;
  }, {});

  // Convert metric counts to an array of objects
  const metricCountsArray = Object.entries(metricCounts).map(([metricName, count]) => ({
    metricName,
    count,
  }));

  // Get unique sites and their counts
  const siteCounts = clientData.reduce((counts: { [key: string]: number }, device: any) => {
    for (const key in device) {
      if (key.startsWith('metric_site')) {
        const siteName = device[key].value;
        counts[siteName] = (counts[siteName] || 0) + 1;
      }
    }
    return counts;
  }, {});

  // Convert site counts to an array of objects
  const siteCountsArray = Object.entries(siteCounts).map(([siteName, count]) => ({
    siteName,
    count,
  }));

  // Get Device Types
  const getDeviceType = (device: any) => {
    if (device.metric_scanStatus && device.metric_insituStatus) {
      return 'Spectrolyser';
    } else if (
      device.metric_din4150_x_mag &&
      device.metric_din4150_y_mag &&
      device.metric_din4150_z_mag
    ) {
      return 'Vibration Sensor';
    } else if (device.metric_pm1 && device.metric_pm25 && device.metric_pm10) {
      return 'Particulate Matter Sensor';
    } else if (device.metric_sound_125ms && device.metric_sound_1s) {
      return 'Noise Sensor';
    } else if (device.metric_lmax_limit && device.metric_leq_limit) {
      return 'Sound Level Meter';
    } else if (device.metric_NO3N_mgl && device.metric_NO3N_ugl) {
      return 'Nitrate Sensor';
    } else {
      return 'Unknown';
    }
  };

  // Iterate over the devices and determine their types
  const deviceTypeCounts: { [key: string]: number } = {};

  clientData.forEach((device) => {
    const deviceType = getDeviceType(device);
    deviceTypeCounts[deviceType] = (deviceTypeCounts[deviceType] || 0) + 1;
  });

  // console.log('Device Type Counts:', deviceTypeCounts);

  // Get status counts
  const statusCounts = getStatusCounts(clientData);

  if (isLoading) {
    return (
      <>
        <LoadingIndicator />
      </>
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
        <div className="bg-gray-50">
          <div className="container mx-auto p-4">
            <h1 className="mb-4 text-4xl font-bold">Client Details</h1>

            <div className="rounded-lg bg-white p-6 shadow-md">
              {/* Client Normal Detail */}
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">Client Name: {clientName}</h2>
                  <p className="text-gray-500">Client ID: {clientId}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">Total Devices: {totalDevices}</p>
                </div>
              </div>

              {/* Device Type Counts */}
              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-2">Device Type Counts:</h3>
                <ul className="list-disc list-inside">
                  {Object.entries(deviceTypeCounts).map(([deviceType, count]) => (
                    <li
                      key={deviceType}
                      className="text-gray-600"
                    >
                      {deviceType}: {count}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Metrics */}
                <div className="rounded-lg bg-white shadow-md p-6">
                  <h3 className="mb-4 text-2xl font-bold text-gray-800">Metrics</h3>
                  {metricCountsArray.map(({ metricName, count }) => (
                    <div
                      key={metricName}
                      className="mb-4"
                    >
                      <button
                        type="button"
                        className="w-full px-6 py-3 flex justify-between items-center bg-gray-100 rounded-lg border border-gray-300 focus:ring-4 focus:ring-blue-200 text-gray-700 hover:bg-gray-200 transition duration-300"
                        onClick={() => {
                          const collapse = document.getElementById(`metric-${metricName}-collapse`);
                          if (collapse) {
                            collapse.classList.toggle('hidden');
                          }
                        }}
                      >
                        <span className="text-lg font-semibold">
                          {metricName} ({count})
                        </span>
                        <svg
                          className="w-5 h-5 transform transition-transform"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      <div
                        id={`metric-${metricName}-collapse`}
                        className="hidden"
                      >
                        <p className="px-6 py-3 border-t border-gray-300 text-gray-600">
                          Devices with {metricName}: {getDeviceIdsByMetric(metricName).join(', ')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Sites */}
                <div className="rounded-lg bg-white shadow-md p-6">
                  <h3 className="mb-4 text-2xl font-bold text-gray-800">Sites</h3>
                  {siteCountsArray.map(({ siteName, count }) => {
                    const deviceIds = getDeviceIdsBySite(siteName);

                    return (
                      <div
                        key={siteName}
                        className="mb-4"
                      >
                        <button
                          type="button"
                          className="w-full px-6 py-3 flex justify-between items-center bg-gray-100 rounded-lg border border-gray-300 focus:ring-4 focus:ring-blue-200 text-gray-700 hover:bg-gray-200 transition duration-300"
                          onClick={() => {
                            const collapse = document.getElementById(`site-${siteName}-collapse`);
                            if (collapse) {
                              collapse.classList.toggle('hidden');
                            }
                          }}
                        >
                          <span className="text-lg font-semibold">
                            {siteName} ({count})
                          </span>
                          <svg
                            className="w-5 h-5 transform transition-transform"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                        <div
                          id={`site-${siteName}-collapse`}
                          className="hidden"
                        >
                          <p className="px-6 py-3 border-t border-gray-300 text-gray-600">
                            Devices at {siteName}: {deviceIds.join(', ')}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Statuses */}
              <div>
                <h3 className="mb-4 text-xl font-bold">Status</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {/* Scan Status */}
                  <div className="rounded-lg bg-white shadow-md p-6">
                    <h3 className="mb-4 text-2xl font-bold text-gray-800">Status</h3>
                    {/* Scan Status */}
                    <div>
                      <h4 className="text-lg font-semibold mb-2">Scan:</h4>
                      {statusCounts && (
                        <>
                          {statusCounts.scanOnline > 0 && (
                            <div className="mb-4">
                              <button
                                type="button"
                                className="w-full px-6 py-3 flex justify-between items-center bg-green-100 rounded-lg border border-green-300 focus:ring-4 focus:ring-green-200 text-green-800 hover:bg-green-200 transition duration-300"
                                onClick={() => {
                                  const collapse = document.getElementById('scan-online-collapse');
                                  if (collapse) {
                                    collapse.classList.toggle('hidden');
                                  }
                                }}
                              >
                                <span className="text-lg font-semibold">
                                  ONLINE ({statusCounts.scanOnline})
                                </span>
                                <svg
                                  className="w-5 h-5 transform transition-transform"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                  />
                                </svg>
                              </button>
                              <div
                                id="scan-online-collapse"
                                className="hidden"
                              >
                                <p className="px-6 py-3 border-t border-gray-300 text-gray-600">
                                  Device IDs for Scan Online:{' '}
                                  {getDeviceIdsByStatus('scanOnline').join(', ')}
                                </p>
                              </div>
                            </div>
                          )}
                          {statusCounts.scanError > 0 && (
                            <div className="mb-4">
                              <button
                                type="button"
                                className="w-full px-6 py-3 flex justify-between items-center bg-red-100 rounded-lg border border-red-300 focus:ring-4 focus:ring-red-200 text-red-800 hover:bg-red-200 transition duration-300"
                                onClick={() => {
                                  const collapse = document.getElementById('scan-error-collapse');
                                  if (collapse) {
                                    collapse.classList.toggle('hidden');
                                  }
                                }}
                              >
                                <span className="text-lg font-semibold">
                                  ERROR ({statusCounts.scanError})
                                </span>
                                <svg
                                  className="w-5 h-5 transform transition-transform"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                  />
                                </svg>
                              </button>
                              <div
                                id="scan-error-collapse"
                                className="hidden"
                              >
                                <p className="px-6 py-3 border-t border-gray-300 text-gray-600">
                                  Device IDs for Scan Error:{' '}
                                  {getDeviceIdsByStatus('scanError').join(', ')}
                                </p>
                              </div>
                            </div>
                          )}
                          {getDeviceIdsByStatus('N/A').length > 0 && (
                            <div className="mb-4">
                              <button
                                type="button"
                                className="w-full px-6 py-3 flex justify-between items-center bg-gray-100 rounded-lg border border-gray-300 focus:ring-4 focus:ring-gray-200 text-gray-800 hover:bg-gray-200 transition duration-300"
                                onClick={() => {
                                  const collapse = document.getElementById('scan-na-collapse');
                                  if (collapse) {
                                    collapse.classList.toggle('hidden');
                                  }
                                }}
                              >
                                <span className="text-lg font-semibold">
                                  N/A ({getDeviceIdsByStatus('N/A').length})
                                </span>
                                <svg
                                  className="w-5 h-5 transform transition-transform"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                  />
                                </svg>
                              </button>
                              <div
                                id="scan-na-collapse"
                                className="hidden"
                              >
                                <p className="px-6 py-3 border-t border-gray-300 text-gray-600">
                                  Device IDs for Scan N/A: {getDeviceIdsByStatus('N/A').join(', ')}
                                </p>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Battery Status */}
                  <div className="rounded-lg bg-white shadow-md p-6">
                    <h3 className="mb-4 text-2xl font-bold text-gray-800">Status</h3>
                    <div>
                      <h4 className="text-lg font-semibold mb-2">Battery:</h4>
                      {statusCounts && (
                        <>
                          {getDeviceIdsByStatus('batteryOnline').length > 0 && (
                            <div className="mb-4">
                              <button
                                type="button"
                                className="w-full px-6 py-3 flex justify-between items-center bg-green-100 rounded-lg border border-green-300 focus:ring-4 focus:ring-green-200 text-green-800 hover:bg-green-200 transition duration-300"
                                onClick={() => {
                                  const collapse =
                                    document.getElementById('battery-online-collapse');
                                  if (collapse) {
                                    collapse.classList.toggle('hidden');
                                  }
                                }}
                              >
                                <span className="text-lg font-semibold">
                                  ONLINE ({getDeviceIdsByStatus('batteryOnline').length})
                                </span>
                                <svg
                                  className="w-5 h-5 transform transition-transform"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                  />
                                </svg>
                              </button>
                              <div
                                id="battery-online-collapse"
                                className="hidden"
                              >
                                <p className="px-6 py-3 border-t border-gray-300 text-gray-600">
                                  Device IDs for Battery Online:{' '}
                                  {getDeviceIdsByStatus('batteryOnline').join(', ')}
                                </p>
                              </div>
                            </div>
                          )}
                          {getDeviceIdsByStatus('batteryOffline').length > 0 && (
                            <div className="mb-4">
                              <button
                                type="button"
                                className="w-full px-6 py-3 flex justify-between items-center bg-red-100 rounded-lg border border-red-300 focus:ring-4 focus:ring-red-200 text-red-800 hover:bg-red-200 transition duration-300"
                                onClick={() => {
                                  const collapse = document.getElementById(
                                    'battery-offline-collapse'
                                  );
                                  if (collapse) {
                                    collapse.classList.toggle('hidden');
                                  }
                                }}
                              >
                                <span className="text-lg font-semibold">
                                  OFFLINE ({getDeviceIdsByStatus('batteryOffline').length})
                                </span>
                                <svg
                                  className="w-5 h-5 transform transition-transform"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                  />
                                </svg>
                              </button>
                              <div
                                id="battery-offline-collapse"
                                className="hidden"
                              >
                                <p className="px-6 py-3 border-t border-gray-300 text-gray-600">
                                  Device IDs for Battery Offline:{' '}
                                  {getDeviceIdsByStatus('batteryOffline').join(', ')}
                                </p>
                              </div>
                            </div>
                          )}
                          {Object.entries(statusCounts)
                            .filter(
                              ([status]) =>
                                status.startsWith('metric_batt status') &&
                                status !== 'batteryOnline' &&
                                status !== 'batteryOffline'
                            )
                            .map(([status, count]) => (
                              <div
                                key={status}
                                className="mb-4"
                              >
                                <button
                                  type="button"
                                  className="w-full px-6 py-3 flex justify-between items-center bg-yellow-100 rounded-lg border border-yellow-300 focus:ring-4 focus:ring-yellow-200 text-yellow-800 hover:bg-yellow-200 transition duration-300"
                                  onClick={() => {
                                    const collapse = document.getElementById(
                                      `battery-${status.toLowerCase()}-collapse`
                                    );
                                    if (collapse) {
                                      collapse.classList.toggle('hidden');
                                    }
                                  }}
                                >
                                  <span className="text-lg font-semibold">
                                    {status.replace('battery', '')} ({count})
                                  </span>
                                  <svg
                                    className="w-5 h-5 transform transition-transform"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 9l-7 7-7-7"
                                    />
                                  </svg>
                                </button>
                                <div
                                  id={`battery-${status.toLowerCase()}-collapse`}
                                  className="hidden"
                                >
                                  <p className="px-6 py-3 border-t border-gray-300 text-gray-600">
                                    Device IDs for {status.replace('battery', '')}:{' '}
                                    {getDeviceIdsByStatus(status).join(', ')}
                                  </p>
                                </div>
                              </div>
                            ))}
                          <div className="mb-4">
                            <button
                              type="button"
                              className="w-full px-6 py-3 flex justify-between items-center bg-gray-100 rounded-lg border border-gray-300 focus:ring-4 focus:ring-gray-200 text-gray-800 hover:bg-gray-200 transition duration-300"
                              onClick={() => {
                                const collapse = document.getElementById('battery-na-collapse');
                                if (collapse) {
                                  collapse.classList.toggle('hidden');
                                }
                              }}
                            >
                              <span className="text-lg font-semibold">
                                N/A ({getDeviceIdsByStatus('N/A').length})
                              </span>
                              <svg
                                className="w-5 h-5 transform transition-transform"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </button>
                            <div
                              id="battery-na-collapse"
                              className="hidden"
                            >
                              <p className="px-6 py-3 border-t border-gray-300 text-gray-600">
                                Device IDs for N/A: {getDeviceIdsByStatus('N/A').join(', ')}
                              </p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Insitu Status */}
                  <div className="rounded-lg bg-white shadow-md p-6">
                    <h3 className="mb-4 text-2xl font-bold text-gray-800">Status</h3>
                    <div>
                      <h4 className="text-lg font-semibold mb-2">Insitu:</h4>
                      {statusCounts && (
                        <>
                          {statusCounts.insituNormal > 0 && (
                            <div className="mb-4">
                              <button
                                type="button"
                                className="w-full px-6 py-3 flex justify-between items-center bg-green-100 rounded-lg border border-green-300 focus:ring-4 focus:ring-green-200 text-green-800 hover:bg-green-200 transition duration-300"
                                onClick={() => {
                                  const collapse =
                                    document.getElementById('insitu-normal-collapse');
                                  if (collapse) {
                                    collapse.classList.toggle('hidden');
                                  }
                                }}
                              >
                                <span className="text-lg font-semibold">
                                  NORMAL ({statusCounts.insituNormal})
                                </span>
                                <svg
                                  className="w-5 h-5 transform transition-transform"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                  />
                                </svg>
                              </button>
                              <div
                                id="insitu-normal-collapse"
                                className="hidden"
                              >
                                <p className="px-6 py-3 border-t border-gray-300 text-gray-600">
                                  Device IDs for Insitu Normal:{' '}
                                  {getDeviceIdsByStatus('insituNormal').join(', ')}
                                </p>
                              </div>
                            </div>
                          )}
                          {statusCounts.insituError > 0 && (
                            <div className="mb-4">
                              <button
                                type="button"
                                className="w-full px-6 py-3 flex justify-between items-center bg-red-100 rounded-lg border border-red-300 focus:ring-4 focus:ring-red-200 text-red-800 hover:bg-red-200 transition duration-300"
                                onClick={() => {
                                  const collapse = document.getElementById('insitu-error-collapse');
                                  if (collapse) {
                                    collapse.classList.toggle('hidden');
                                  }
                                }}
                              >
                                <span className="text-lg font-semibold">
                                  ERROR ({statusCounts.insituError})
                                </span>
                                <svg
                                  className="w-5 h-5 transform transition-transform"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                  />
                                </svg>
                              </button>
                              <div
                                id="insitu-error-collapse"
                                className="hidden"
                              >
                                <p className="px-6 py-3 border-t border-gray-300 text-gray-600">
                                  Device IDs for Insitu Error:{' '}
                                  {getDeviceIdsByStatus('insituError').join(', ')}
                                </p>
                              </div>
                            </div>
                          )}
                          {Object.entries(statusCounts)
                            .filter(
                              ([status]) =>
                                status !== 'scanOnline' &&
                                status !== 'scanError' &&
                                status !== 'batteryOnline' &&
                                status !== 'batteryOffline' &&
                                status !== 'insituNormal' &&
                                status !== 'insituError' &&
                                status !== 'N/A'
                            )
                            .map(([status, count]) => (
                              <div
                                key={status}
                                className="mb-4"
                              >
                                <button
                                  type="button"
                                  className="w-full px-6 py-3 flex justify-between items-center bg-yellow-100 rounded-lg border border-yellow-300 focus:ring-4 focus:ring-yellow-200 text-yellow-800 hover:bg-yellow-200 transition duration-300"
                                  onClick={() => {
                                    const collapse = document.getElementById(
                                      `insitu-${status.toLowerCase()}-collapse`
                                    );
                                    if (collapse) {
                                      collapse.classList.toggle('hidden');
                                    }
                                  }}
                                >
                                  <span className="text-lg font-semibold">
                                    {status} ({count})
                                  </span>
                                  <svg
                                    className="w-5 h-5 transform transition-transform"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 9l-7 7-7-7"
                                    />
                                  </svg>
                                </button>
                                <div
                                  id={`insitu-${status.toLowerCase()}-collapse`}
                                  className="hidden"
                                >
                                  <p className="px-6 py-3 border-t border-gray-300 text-gray-600">
                                    Device IDs for {status}:{' '}
                                    {getDeviceIdsByStatus(status).join(', ')}
                                  </p>
                                </div>
                              </div>
                            ))}
                          <div className="mb-4">
                            <button
                              type="button"
                              className="w-full px-6 py-3 flex justify-between items-center bg-gray-100 rounded-lg border border-gray-300 focus:ring-4 focus:ring-gray-200 text-gray-800 hover:bg-gray-200 transition duration-300"
                              onClick={() => {
                                const collapse = document.getElementById('insitu-na-collapse');
                                if (collapse) {
                                  collapse.classList.toggle('hidden');
                                }
                              }}
                            >
                              <span className="text-lg font-semibold">
                                N/A ({getDeviceIdsByStatus('N/A').length})
                              </span>
                              <svg
                                className="w-5 h-5 transform transition-transform"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </button>
                            <div
                              id="insitu-na-collapse"
                              className="hidden"
                            >
                              <p className="px-6 py-3 border-t border-gray-300 text-gray-600">
                                Device IDs for N/A: {getDeviceIdsByStatus('N/A').join(', ')}
                              </p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="my-3">
                <h3 className="mb-4 text-xl font-semibold">Map View</h3>
                {/* Add map component or placeholder here */}
                <div className="flex h-64 items-center justify-center rounded-lg bg-gray-200 p-4">
                  <p className="text-gray-500">Map View Placeholder</p>
                </div>
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
export default ClientPage;
