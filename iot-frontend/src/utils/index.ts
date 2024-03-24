export function flattenNestedData(data: any, targetDeviceId?: number): DynamicMetricData[] {
  const flattenedData: DynamicMetricData[] = []

  // Check if targetDeviceId is provided
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

        flattenedData.push(flattenedDevice)

        // Exit after finding the first matching device
        break
      }
    }

    return flattenedData
  } else {
    // If targetDeviceId is not provided
    for (const clientKey in data) {
      const client = data[clientKey]
      for (const device of client.devices) {
        const flattenedDevice: DynamicMetricData = {
          client_name: client.client_name,
          client_id: client.client_id,
          device_id: device.device_id,
          device_key: device.device_key,
        }

        // Copy over metric properties
        for (const metricName in device.metrics) {
          flattenedDevice[`metric_${metricName}`] = device.metrics[metricName]
        }

        flattenedData.push(flattenedDevice)
      }
    }
  }

  return flattenedData
}

export const fetchDataAndSetData = async () => {
  try {
    const fetchedData = require('@/public/full_device_stats.json');
    const flattenedData = flattenNestedData(fetchedData);
    return flattenedData;
  } catch (error) {
    console.error('Failed to fetch data:', error);
    throw error;
  }
};
