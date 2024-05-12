# Device Info Page

The Device Info page displays detailed information about a specific device. It is located at `iot-frontend/src/pages/device-info/[deviceID].tsx`.

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

## Conclusion

The Device Info page provides a comprehensive view of a specific device's information, including its status, metrics, and fault identification. It utilizes authentication and loading states to ensure secure access and a smooth user experience.
