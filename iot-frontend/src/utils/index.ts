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
    } else {
      return batteryStatus;
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

/**
 * Determines the type of IoT device based on the available metrics.
 *
 * @param {Object} device - The device object containing metric data.
 * @returns {string} The type of the device.
 *
 * See extractUniqueMetrics function
 *
 * Device types:
 * - Spectrolyser: Determined by the presence of 'metric_scanStatus' and 'metric_insituStatus'.
 * - Vibration Sensor: Determined by the presence of 'metric_din4150_x_mag', 'metric_din4150_y_mag', and 'metric_din4150_z_mag'.
 * - Particulate Matter Sensor: Determined by the presence of 'metric_pm1', 'metric_pm25', and 'metric_pm10'.
 * - Noise Sensor: Determined by the presence of 'metric_sound_125ms' and 'metric_sound_1s'.
 * - Sound Level Meter: Determined by the presence of 'metric_lmax_limit' and 'metric_leq_limit'.
 * - Nitrate Sensor: Determined by the presence of 'metric_NO3N_mgl' and 'metric_NO3N_ugl'.
 * - Vibration Percentage Sensor: Determined by the presence of 'metric_xVIB', 'metric_yVIB', 'metric_zVIB', 'metric_xVIB5', 'metric_yVIB5', and 'metric_zVIB5'.
 * - Weather Station: Determined by the presence of 'metric_windSpeed', 'metric_windDir', 'metric_avgWindSpeed', and 'metric_avgWindDir'.
 * - Annual Particulate Matter Sensor: Determined by the presence of 'metric_pm1_annual', 'metric_pm25_annual', and 'metric_pm10_annual'.
 * - Nutrient Analyzer: Determined by the presence of 'metric_NO3', 'metric_NH3', and 'metric_H4N'.
 * - Soil Moisture and Temperature Sensor: Determined by the presence of 'metric_soil_moisture_ext_1', 'metric_soil_moisture_ext_2', and 'metric_soil_temperature'.
 * - Water Quality Sensor: Determined by the presence of 'metric_ecoli', 'metric_tryptophan', and 'metric_cdom'.
 * - Water Level Sensor: Determined by the presence of 'metric_calc_depth_bc' and 'metric_calc_depth_bgl'.
 * - Unknown: If none of the above conditions are met.
 */
export const getDeviceType = (device: any) => {
  if (device.metric_scanStatus && device.metric_insituStatus) {
    return 'Spectrolyser';
  } else if (device.metric_din4150_x_mag && device.metric_din4150_y_mag && device.metric_din4150_z_mag) {
    return 'Vibration Sensor';
  } else if (device.metric_pm1 && device.metric_pm25 && device.metric_pm10) {
    return 'Particulate Matter Sensor';
  } else if (device.metric_sound_125ms && device.metric_sound_1s) {
    return 'Noise Sensor';
  } else if (device.metric_lmax_limit && device.metric_leq_limit) {
    return 'Sound Level Meter';
  } else if (device.metric_NO3N_mgl && device.metric_NO3N_ugl) {
    return 'Nitrate Sensor';
  } else if (
    device.metric_xVIB &&
    device.metric_yVIB &&
    device.metric_zVIB &&
    device.metric_xVIB5 &&
    device.metric_yVIB5 &&
    device.metric_zVIB5
  ) {
    return 'Vibration Percentage Sensor';
  } else if (
    device.metric_windSpeed &&
    device.metric_windDir &&
    device.metric_avgWindSpeed &&
    device.metric_avgWindDir
  ) {
    return 'Weather Station';
  } else if (device.metric_pm1_annual && device.metric_pm25_annual && device.metric_pm10_annual) {
    return 'Annual Particulate Matter Sensor';
  } else if (device.metric_NO3 && device.metric_NH3 && device.metric_H4N) {
    return 'Nutrient Analyzer';
  } else if (device.metric_soil_moisture_ext_1 && device.metric_soil_moisture_ext_2 && device.metric_soil_temperature) {
    return 'Soil Moisture and Temperature Sensor';
  } else if (device.metric_ecoli && device.metric_tryptophan && device.metric_cdom) {
    return 'Water Quality Sensor';
  } else if (device.metric_calc_depth_bc && device.metric_calc_depth_bgl) {
    return 'Water Level Sensor';
  } else {
    return 'Unknown';
  }
};

/**
 * Get all available metrics, no duplicates. from all devices.
 * @param {data[]} data - The array of fulld device data.
 * @returns {Array} An object containing all available metrics, no duplicates.
 */
export const extractUniqueMetrics = (data: any) => {
  const metricSet = new Set();

  // @ts-ignore
  data.forEach(item => {
    Object.keys(item).forEach(key => {
      if (key.startsWith('metric_')) {
        metricSet.add(key);
      }
    });
  });

  return Array.from(metricSet);
}
