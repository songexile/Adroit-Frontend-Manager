# Stats Page

`pages/device-info/[DeviceID]`

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


## Functions

### Main rendering function
```js
function DeviceID(data: any) {
  const { isAuthenticated, isLoading } = useAuth();

  const deviceId = fetchDeviceId();

  const filteredData = useMemo(() => flattenNestedData(data, deviceId), [data, deviceId]);
  const deviceData = filteredData[0];

  // console.log(deviceData); // Returns the array of the device.

  const title = `Check Device | ${deviceId} | Adroit Front End Manager`;
  const description = `Device Info Page for Device ID: ${deviceId}`;

  // Breadcrumb items
  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: `Device ${deviceData?.device_id}`, path: `/device-info/${deviceData?.device_id}` }, // Adjusted path to include device_id
  ];

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
```

This function checks if the user is authenticated, it grabs the device ID and then passes in the flattened data for that device.

### renderMetrics
`const renderMetrics = (deviceData: DynamicMetricData | null): JSX.Element | null => {`

This function's primary purpose is to iterate through the data object provided and render out all of the metrics into JSX since each device has metrics we need to render it.

For example, it will render the `key` and the `value`, an example of a key would be **client_name** and the value would be **Spark**

### debugMetrics
`const debugMetrics = (deviceData: DynamicMetricData | null): JSX.Element | null => {`

This prints out the metrics which are more useful than base metrics.


### How to Add More Metrics

To add more metrics to the device stats page, follow these steps:

**Identify the New Metric**: Determine the new metric you want to add and ensure that it is available in the `deviceData` object.
 ```jsx
 const newMetric = deviceData?.humidity;
```

**Update the `filterMetric` Array**: Add the key of the new metric to the `filterMetric` array in the `debugMetrics` function. This array filters out only the metrics you want to display in red for debugging purposes.
 ```jsx

const filterMetric = ['PH', 'TEMP', 'BattP', 'solar volt', 'PRESS', 'battery_voltage', 'humidity'];
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
  'Humidity'
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



