# Device Info Page

The Device Info page displays detailed information about a specific device. It is located at `iot-frontend/src/pages/device-info/[deviceID].tsx`.

The Stats Page displays detailed information about a specific device, including device information, current status, important metrics, and the ability to create a ticket for the device.

This page can be accessed through the dashboard (root link) by clicking on the three dots on the left side and then clicking `View device stats`. This will then open up page.

<h3>Device Information:</h3>
The Device Information section provides key details about the device, including its ID, key, client name, last online status, and location.

<h3>Create Ticket:</h3>
The Create Ticket button allows users to create a ticket for the device, redirecting them to the Create Ticket page where they can fill out the necessary details.

<h3>Current Status:</h3>
The Current Status section displays the current status of the device, including its scan status, battery status, and insitu status. Each status is represented by a corresponding icon and color for easy identification.

<h3>Gauge Chart:</h3>
The Gauge Chart provides a visual representation of some important metrics for the device. These metrics are crucial for monitoring the device's performance and health.

<h3>Fault Identification:</h3>
The Fault Identification section lists important metrics that can help identify potential issues with the device. These metrics are highlighted in red for easy identification.

<h3>All Metrics:</h3>
The All Metrics section displays all available metrics for the device. Each metric is listed with its corresponding value.

## Fetching Device ID

The `fetchDeviceId` function is used to fetch the device ID from the URL.

```tsx
function fetchDeviceId() {
  const pathname = usePathname();
  const parts = pathname ? pathname.split('/') : [];
  const deviceId = parts[parts.length - 1]
    ? parseInt(parts[parts.length - 1] as string)
    : 0;
  return deviceId;
}
```

The device ID is extracted from the URL and parsed as an integer. If the device ID is undefined, it defaults to 0.

## Authentication and Loading

The `DeviceID` component uses the `useAuth` hook to check the authentication status and display the appropriate content.

```tsx
function DeviceID(data: any) {
  const { isAuthenticated, isLoading } = useAuth();

  // ...

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (isAuthenticated) {
    return (
      <>
        <SEO title={title} description={description} />
        <Header />
        <Breadcrumb breadcrumbs={breadcrumbs} />
        <div className='flex mx-8 md:mx-32 min-h-screen py-6 flex-col'>
          {deviceData && debugMetrics(deviceData)}
        </div>
        <Footer />
      </>
    );
  } else {
    return <LoginScreen />;
  }
}
```

If `isLoading` is `true`, a loading indicator is displayed. If `isAuthenticated` is `true`, the device info content is rendered, including the `SEO`, `Header`, `Breadcrumb`, and the main content with debug metrics. If `isAuthenticated` is `false`, the login screen is displayed.

## Rendering Metrics

The `renderMetrics` function is responsible for rendering the metric data from the provided `deviceData` object.

```tsx
const renderMetrics = (
  deviceData: DynamicMetricData | null
): JSX.Element | null => {
  if (!deviceData) return null;

  return (
    <div>
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
          return null;
        }
      })}
    </div>
  );
};
```

The function iterates over the entries of the `deviceData` object using `Object.entries()`. For each entry, it checks the type of the value to determine whether it's a string or an object with a 'value' property. It then renders the appropriate JSX based on the value type.

## Debugging Metrics

The `debugMetrics` function is responsible for displaying specific keys from the `deviceData` object in red for important debugging metrics.

```tsx
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

  const errorKeys = relevantKeys.map((key) => prefix + key);
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
    // JSX content
    // ...
  );
};
```

The function filters the `deviceData` object based on specific keys and displays them in different sections of the UI. It also handles the site value and renders charts and fault identification information.

### How to Add More Metrics

To add more metrics to the device stats page, follow these steps:

**Identify the New Metric**: Determine the new metric you want to add and ensure that it is available in the `deviceData` object.

```jsx
const newMetric = deviceData?.humidity;
```

**Update the `filterMetric` Array**: Add the key of the new metric to the `filterMetric` array in the `debugMetrics` function. This array filters out only the metrics you want to display in red for debugging purposes.

```jsx
const filterMetric = [
  'PH',
  'TEMP',
  'BattP',
  'solar volt',
  'PRESS',
  'battery_voltage',
  'humidity',
];
```

**Update the `formalMetricName` Array**: Add the formal name of the new metric to the `formalMetricName` array. This array provides human-readable names for the metrics.

```jsx
const formalMetricName = [
  'pH Level',
  'Temperature',
  'Battery Percentage %',
  'Solar Voltage',
  'Press',
  'Battery Voltage',
  'Humidity',
];
```

**Update the `fullMetricName` Array**: Add the new metric's key prefixed with `metric_` to the `fullMetricName` array. This array is used to check if a key belongs to a metric that should be displayed in the chart components.

```jsx
const fullMetricName = filterMetric.map((key) => prefix + key);
```

**Update the Chart Components**: If the new metric should be displayed using a chart component, ensure that the chart component is capable of displaying the new metric. Update the `SpeedometerChart` component or add a new chart component as needed.

### How Chart Components Work

The stats page uses various chart components to display metric data. Here's how the chart components work:

**Speedometer Chart**: The `SpeedometerChart` component is used to display numeric values as a gauge on the page. It takes the `value` prop, which should be a numeric value, and the `colors` prop, which is an array of two colors representing the range of the gauge. For example:

```jsx
<SpeedometerChart value={50} colors={['#38bdf8', '#EF4444']} />
```

This will display a gauge with a value of 50, where values between 0 and 50 are in the first color (`#38bdf8`) and values between 50 and 100 are in the second color (`#EF4444`).

## Conclusion

The Device Info page provides a comprehensive view of a specific device's information, including its status, metrics, and fault identification. It utilizes authentication and loading states to ensure secure access and a smooth user experience.
