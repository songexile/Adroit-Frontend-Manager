export function flattenNestedData(data: any, targetDeviceId?: number): DynamicMetricData[] {
  const flattenedData: DynamicMetricData[] = [];

  // Check if targetDeviceId is provided
  if (targetDeviceId !== undefined) {
    // Assuming "data" is the top-level object containing the devices array
    const devices = data.data;

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
        };

        // Copy over metrics properties
        for (const key in device) {
          if (key.startsWith('metric_')) {
            flattenedDevice[key] = device[key];
          }
        }

        // Extract the timestamp from the very first metric of the device
        const metricKeys = Object.keys(device);
        const firstMetricKey = metricKeys.find(key => key.startsWith('metric_'));
        const firstMetric = firstMetricKey ? device[firstMetricKey] : undefined;

        let extractedTimestamp: number | undefined;

        if (firstMetric && 'timestamp' in firstMetric) {
          extractedTimestamp = firstMetric.timestamp;
          flattenedDevice.last_online = extractedTimestamp ? new Date(extractedTimestamp).toLocaleString() : '';
        }


        console.log("Extracted Timestamp:", extractedTimestamp);
        console.log("Flattened Device:", flattenedDevice);

        flattenedData.push(flattenedDevice);

        // Exit after finding the first matching device
        break;
      }
    }

    return flattenedData;
  } else {
    // If targetDeviceId is not provided
    for (const clientKey in data) {
      const client = data[clientKey];
      for (const device of client.devices) {
        const flattenedDevice: DynamicMetricData = {
          client_name: client.client_name,
          client_id: client.client_id,
          device_id: device.device_id,
          device_key: device.device_key,
        };

        // Copy over metric properties
        for (const metricName in device.metrics) {
          flattenedDevice[`metric_${metricName}`] = device.metrics[metricName];
        }

        flattenedData.push(flattenedDevice);
      }
    }
  }

  return flattenedData;
}





// Function to fetch data from AWS API
async function fetchData() {
  try {
    const res = await fetch('https://eq1n7rs483.execute-api.ap-southeast-2.amazonaws.com/Prod/hello');

    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }

    const jsonData = await res.json();
    const parsedData = JSON.parse(jsonData.body);

    return parsedData;
  } catch (error) {
    console.error('Failed to fetch data:', error);
    throw error;
  }
}

// Modified function to fetch data and set it
export const fetchDataAndSetData = async () => {
  try {
    // const fetchedData = require('@/public/full_device_stats.json');
    const fetchedData = await fetchData(); // Call the fetchData function instead of loading local data
    const flattenedData = flattenNestedData(fetchedData);
    return flattenedData;
  } catch (error) {
    console.error('Failed to fetch data:', error);
    throw error;
  }
};

export const extractTimestampFromJson = (device: DynamicMetricData) => {
  const firstMetricKey = Object.keys(device).find((key) => key.startsWith('metric_'))
  const timestampData =
    firstMetricKey !== undefined
      ? (device[firstMetricKey] as { timestamp: number; value: string })
      : undefined
  const timestamp = timestampData ? timestampData.timestamp : undefined
  return timestamp ? new Date(timestamp).toLocaleString() : ''
}
