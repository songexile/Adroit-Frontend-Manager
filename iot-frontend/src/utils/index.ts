/**
 * Flattens nested data into an array of DynamicMetricData objects.
 * @param {any} data - The nested data object containing device and metric information.
 * @param {number | undefined} targetDeviceId - (Optional) The ID of the target device to retrieve.
 * @returns {DynamicMetricData[]} An array of flattened DynamicMetricData objects.
 */
export function flattenNestedData(data: any, targetDeviceId?: number): DynamicMetricData[] {
  const flattenedData: DynamicMetricData[] = []

  // Check if targetDeviceId is provided (e.g. device stat page)
  if (targetDeviceId !== undefined) {
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

        // TEST - Log extracted timestamp and flattened device
        // console.log("Extracted Timestamp:", extractedTimestamp);
        // console.log("Flattened Device:", flattenedDevice);

        // Push the flattened device to the array
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
          'BATV ': 'battery_voltage',
          BattV: 'battery_voltage',
          'BAT ': 'battery_voltage',
        }

        for (const metricName in device.metrics) {
          const metricValue = device.metrics[metricName];
          if (metricName in batteryMetrics) {
            const batteryMetricName = batteryMetrics[metricName];
            flattenedDevice[`metric_${batteryMetricName}`] = metricValue;
          } else {
            flattenedDevice[`metric_${metricName}`] = metricValue;
          }
        }

        // Push the flattened device to the array
        flattenedData.push(flattenedDevice)
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
    console.error('Failed to fetch data:', error)
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
    console.error('Failed to fetch data:', error)
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
