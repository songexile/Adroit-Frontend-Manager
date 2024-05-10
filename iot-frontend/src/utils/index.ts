import { showToast } from '@/components/Toast'
import { DynamicMetricData } from '@/types'

/**
 * Flattens nested data into an array of DynamicMetricData objects.
 * @param {any} data - The nested data object containing device and metric information.
 * @param {number | undefined} targetDeviceId - (Optional) The ID of the target device data to retrieve.
 * @param {number | undefined} targetClientId - (Optional) The ID of the target cleint data to retrieve.
 * @returns {DynamicMetricData[]} An array of flattened DynamicMetricData objects.
 */
export function flattenNestedData(
  data: any,
  targetDeviceId?: number,
  targetClientId?: number,
  hideDeviceWithoutData?: boolean
): DynamicMetricData[] {
  const flattenedData: DynamicMetricData[] = []

  // Check if targetClientId is provided (e.g. client page)
  if (targetClientId !== undefined) {
    // Assuming "data" is an array of device objects
    const devices = data.data;

    // Filter the devices based on the target client ID
    const targetClientDevices = devices.filter((device: any) => device.client_id === targetClientId);

    // Iterate over the target client's devices
    for (const device of targetClientDevices) {
      const flattenedDevice: DynamicMetricData = {
        client_name: device.client_name,
        client_id: device.client_id.toString(),
        device_id: device.device_id.toString(),
        device_key: device.device_key,
      };

      // Copy over metrics properties
      for (const key in device) {
        if (key.startsWith('metric_')) {
          flattenedDevice[key] = device[key];
        }
      }

      // Extract the timestamp from the very first metric of the device
      const metricKeys = Object.keys(device);
      const firstMetricKey = metricKeys.find((key) => key.startsWith('metric_'));
      const firstMetric = firstMetricKey ? device[firstMetricKey] : undefined;
      let extractedTimestamp: number | undefined;
      if (firstMetric && 'timestamp' in firstMetric) {
        extractedTimestamp = firstMetric.timestamp;
        flattenedDevice.last_online = extractedTimestamp
          ? new Date(extractedTimestamp).toLocaleString()
          : '';
      }

      // Add the flattened device to the array
      flattenedData.push(flattenedDevice);
    }

    return flattenedData;

    // Check if targetDeviceId is provided (e.g. device stat page)
  } else if (targetDeviceId !== undefined) {
    // Assuming "data" is the top-level object containing the devices array
    const devices = data.data

    // Access the devices array
    for (const device of devices) {
      // Check if device_id matches the target ID
      if (device.device_id === targetDeviceId) {
        // Create a new object with required properties
        const flattenedDevice: DynamicMetricData = {
          client_name: device.client_name,
          client_id: device.client_id.toString(), // Assuming client_id is a string
          device_id: device.device_id.toString(), // Assuming device_id is a string
          device_key: device.device_key,
        }

        // Copy over metrics properties
        for (const key in device) {
          if (key.startsWith('metric_')) {
            flattenedDevice[key] = device[key]
          }
        }

        // Extract the timestamp from the very first metric of the device
        const metricKeys = Object.keys(device)
        const firstMetricKey = metricKeys.find((key) => key.startsWith('metric_'))
        const firstMetric = firstMetricKey ? device[firstMetricKey] : undefined

        let extractedTimestamp: number | undefined
        if (firstMetric && 'timestamp' in firstMetric) {
          extractedTimestamp = firstMetric.timestamp
          flattenedDevice.last_online = extractedTimestamp
            ? new Date(extractedTimestamp).toLocaleString()
            : ''
        }

        // Add the flattened device to the array
        flattenedData.push(flattenedDevice)

        // Exit loop after finding the first matching device
        break
      }
    }

    return flattenedData
  } else {
    // If targetDeviceId is not provided (e.g. Homepage)
    for (const clientKey in data) {
      const client = data[clientKey]
      for (const device of client.devices) {
        const flattenedDevice: DynamicMetricData = {
          client_name: client.client_name,
          client_id: client.client_id,
          device_id: device.device_id,
          device_key: device.device_key,
        }

        // Copy over battery metric properties
        const batteryMetrics: { [key: string]: string } = {
          BATP: 'battery_percentage',
          BattP: 'battery_percentage',
          BATV: 'battery_voltage',
          BattV: 'battery_voltage',
          BAT: 'battery_voltage',
        }

        for (const metricName in device.metrics) {
          const metricValue = device.metrics[metricName]
          if (metricName in batteryMetrics) {
            const batteryMetricName = batteryMetrics[metricName]
            flattenedDevice[`metric_${batteryMetricName}`] = metricValue
          } else {
            flattenedDevice[`metric_${metricName}`] = metricValue
          }
        }

        // Check if the device has the required data or if hideDeviceWithoutData is false
        const hasTimestamp = flattenedDevice.last_online !== ''
        const hasBatteryPercentage = !!flattenedDevice['metric_battery_percentage']
        const hasBatteryVoltage = !!flattenedDevice['metric_battery_voltage']

        if (
          !hideDeviceWithoutData ||
          (hasTimestamp && (hasBatteryPercentage || hasBatteryVoltage))
        ) {
          flattenedData.push(flattenedDevice)
        }
      }
    }
  }

  return flattenedData
}

/**
 * Fetches data from an AWS API endpoint.
 * @returns {Promise<any>} A promise that resolves to the fetched data.
 */
async function fetchData(): Promise<any> {
  try {
    const res = await fetch(
      'https://eq1n7rs483.execute-api.ap-southeast-2.amazonaws.com/Prod/hello'
    )

    if (!res.ok) {
      throw new Error('Failed to fetch data')
    }

    const jsonData = await res.json()
    const parsedData = JSON.parse(jsonData.body)

    return parsedData
  } catch (error) {
    showToast({ message: 'Failed to fetch data: ', type: 'error' })
    throw error
  }
}

/**
 * Fetches data and sets it, then flattens the data.
 * @returns {Promise<DynamicMetricData[]>} A promise that resolves to the flattened data.
 */
export const fetchDataAndSetData = async (): Promise<DynamicMetricData[]> => {
  try {
    const fetchedData = await fetchData() // Call the fetchData function to get data from API
    const flattenedData = flattenNestedData(fetchedData)
    return flattenedData
  } catch (error) {
    showToast({ message: 'Failed to fetch data: ', type: 'error' })
    throw error
  }
}

/**
 * Extracts the timestamp from the provided device object.
 * @param {DynamicMetricData} device - The device object containing metric data.
 * @returns {string} The timestamp in a human-readable format, or 'N/A' if no timestamp is available.
 */
export const extractTimestampFromJson = (device: DynamicMetricData): string => {
  const firstMetricKey = Object.keys(device).find((key) => key.startsWith('metric_'))
  const timestampData =
    firstMetricKey !== undefined
      ? (device[firstMetricKey] as { timestamp: number; value: string })
      : undefined
  const timestamp = timestampData ? timestampData.timestamp : undefined
  return timestamp ? new Date(timestamp).toLocaleString() : 'N/A'
}

/**
 * Retrieves timestamp data from the provided device object.
 * @param {DynamicMetricData} device - The device object containing metric data.
 * @returns {{ timestamp: number; value: string } | undefined} The timestamp data if available, otherwise undefined.
 */
export const getTimestampData = (device: any): { timestamp: number; value: string } | undefined => {
  const firstMetricKey = Object.keys(device).find((key) => key.startsWith('metric_'))
  return firstMetricKey !== undefined
    ? (device[firstMetricKey] as { timestamp: number; value: string })
    : undefined
}

/**
 * Calculates the total number of devices offline based on the provided data.
 * @param {any} data - The data object containing client and device information.
 * @returns {number} The total number of devices offline.
 */
export const getTotalDevicesOfflineCount = (flattenedData: DynamicMetricData[]): number => {
  return flattenedData.length
}

/**
 * Calculates the number of clients with offline devices based on the provided data.
 * @param {any} data - The data object containing client and device information.
 * @returns {number} The number of clients with offline devices.
 */
export const getClientsOfflineCount = (flattenedData: DynamicMetricData[]): number => {
  const uniqueClients = new Set()
  for (const device of flattenedData) {
    uniqueClients.add(device.client_id)
  }
  return uniqueClients.size
}

export function capitalizeWords(str: string | undefined): string {
  if (typeof str === 'undefined' || str === null) {
    return '';
  }
  return str.replace(/\b\w/g, char => char.toUpperCase());
}

/**
 * Retrieves the scan status from the provided device data.
 * @param {DynamicMetricData | null} deviceData - The device data object.
 * @returns {string} The scan status string.
 */
export const getScanStatus = (deviceData: DynamicMetricData | null): string => {
  if (!deviceData) return 'N/A';

  const scanStatusEntry = Object.entries(deviceData).find(
    ([key]) => key === 'metric_scanStatus'
  );

  if (!scanStatusEntry) return 'N/A';

  const [, value] = scanStatusEntry;

  if (typeof value === 'object' && 'value' in value) {
    const { value: scanStatus } = value;

    if (scanStatus === 'OK') {
      return 'ONLINE';
    } else if (scanStatus === 'Modbus error') {
      return 'ERROR';
    }
  }

  return 'N/A';
};

/**
 * Retrieves the battery status from the provided device data.
 * @param {DynamicMetricData | null} deviceData - The device data object.
 * @returns {string} The battery status string.
 */
export const getBatteryStatus = (deviceData: DynamicMetricData | null): string => {
  if (!deviceData) return 'N/A';

  const batteryStatusEntry = Object.entries(deviceData).find(
    ([key]) => key === 'metric_batt status'
  );

  if (!batteryStatusEntry) return 'N/A';

  const [, value] = batteryStatusEntry;

  if (typeof value === 'object' && 'value' in value) {
    const { value: batteryStatus } = value;

    if (batteryStatus === 'On') {
      return 'ONLINE';
    } else if (batteryStatus === 'Off') {
      return 'OFFLINE';
    }
  }

  return 'N/A';
};

/**
 * Retrieves the Insitu status from the provided device data.
 * @param {DynamicMetricData | null} deviceData - The device data object.
 * @returns {string} The Insitu status string.
 */
export const getInsituStatus = (deviceData: DynamicMetricData | null): string => {
  if (!deviceData) return 'N/A';

  const insituStatusEntry = Object.entries(deviceData).find(
    ([key]) => key === 'metric_insituStatus'
  );

  if (!insituStatusEntry) return 'N/A';

  const [, value] = insituStatusEntry;

  if (typeof value === 'object' && 'value' in value) {
    const { value: insituStatus } = value;

    if (insituStatus === 'Normal' || insituStatus === 'OK') {
      return 'NORMAL';
    } else if (insituStatus === 'COMS_ERROR') {
      return 'ERROR';
    } else {
      return insituStatus;
    }
  }

  return 'N/A';
};

/**
 * Calculates the count of each status for all devices.
 * @param {DynamicMetricData[]} clientData - The array of client data.
 * @returns {Object} An object containing the counts of each status.
 */
export const getStatusCounts = (clientData: DynamicMetricData[]): {
  scanOnline: number;
  scanError: number;
  batteryOnline: number;
  batteryOffline: number;
  insituNormal: number;
  insituError: number;
  [key: string]: number;
} => {
  const statusCounts: {
    scanOnline: number;
    scanError: number;
    batteryOnline: number;
    batteryOffline: number;
    insituNormal: number;
    insituError: number;
    [key: string]: number;
  } = {
    scanOnline: 0,
    scanError: 0,
    batteryOnline: 0,
    batteryOffline: 0,
    insituNormal: 0,
    insituError: 0,
  };

  clientData.forEach((deviceData) => {
    const scanStatus = getScanStatus(deviceData);
    const batteryStatus = getBatteryStatus(deviceData);
    const insituStatus = getInsituStatus(deviceData);

    if (scanStatus === 'ONLINE') {
      statusCounts.scanOnline++;
    } else if (scanStatus === 'ERROR') {
      statusCounts.scanError++;
    } else {
      statusCounts[scanStatus] = (statusCounts[scanStatus] || 0) + 1;
    }

    if (batteryStatus === 'ONLINE') {
      statusCounts.batteryOnline++;
    } else if (batteryStatus === 'OFFLINE') {
      statusCounts.batteryOffline++;
    } else {
      statusCounts[batteryStatus] = (statusCounts[batteryStatus] || 0) + 1;
    }

    if (insituStatus === 'NORMAL') {
      statusCounts.insituNormal++;
    } else if (insituStatus === 'ERROR') {
      statusCounts.insituError++;
    } else {
      statusCounts[insituStatus] = (statusCounts[insituStatus] || 0) + 1;
    }
  });

  return statusCounts;
};
